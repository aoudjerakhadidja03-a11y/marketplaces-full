<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\SuspiciousIncident;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReturnAnalyticsController extends Controller
{
    public function supplierAnalytics(Request $request)
    {
        $user = $request->user();
        if (!$user->isSupplier() || !$user->supplier) {
            return response()->json(['message' => 'Réservé aux fournisseurs'], 403);
        }

        $supplierId = $user->supplier->id;

        // Total orders & return counts
        $totalOrders = Order::where('supplier_id', $supplierId)->count();
        $refusedOrders = Order::where('supplier_id', $supplierId)->where('status', 'refused')->count();
        $returnedOrders = Order::where('supplier_id', $supplierId)->where('status', 'returned')->count();
        $totalFailures = $refusedOrders + $returnedOrders;

        $overallReturnRate = $totalOrders > 0 ? round(($totalFailures / $totalOrders) * 100, 2) : 0.0;

        // Return rate by Product
        $productStats = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.supplier_id', $supplierId)
            ->select(
                'products.id',
                'products.name',
                'products.image_url',
                'products.stock',
                DB::raw('COUNT(orders.id) as total_orders'),
                DB::raw("SUM(CASE WHEN orders.status IN ('refused', 'returned') THEN 1 ELSE 0 END) as returned_count")
            )
            ->groupBy('products.id', 'products.name', 'products.image_url', 'products.stock')
            ->get()
            ->map(function ($item) {
                $item->return_rate = $item->total_orders > 0 ? round(($item->returned_count / $item->total_orders) * 100, 2) : 0.0;
                $item->risk_level = $item->return_rate > 20 ? 'high' : ($item->return_rate > 10 ? 'medium' : 'low');
                return $item;
            });

        // Incident count associated with this supplier's orders
        $incidentsCount = SuspiciousIncident::where('supplier_id', $supplierId)->count();

        return response()->json([
            'summary' => [
                'total_orders' => $totalOrders,
                'refused_count' => $refusedOrders,
                'returned_count' => $returnedOrders,
                'overall_return_rate_pct' => $overallReturnRate,
                'incidents_logged' => $incidentsCount,
            ],
            'product_analytics' => $productStats,
        ]);
    }

    public function supplierAlerts(Request $request)
    {
        $user = $request->user();
        if (!$user->isSupplier() || !$user->supplier) {
            return response()->json(['message' => 'Réservé aux fournisseurs'], 403);
        }

        $supplierId = $user->supplier->id;

        $alerts = [];

        // Alert 1: Unconfirmed orders from watch/high_risk customers
        $atRiskOrders = Order::with('customer:id,name,phone,risk_level')
            ->where('supplier_id', $supplierId)
            ->where('status', 'pending')
            ->where('risk_level_at_order', '!=', 'reliable')
            ->get();

        foreach ($atRiskOrders as $order) {
            $alerts[] = [
                'type' => 'high_risk_order',
                'severity' => $order->risk_level_at_order === 'high_risk' ? 'danger' : 'warning',
                'order_id' => $order->id,
                'title' => "Commande #{$order->id} à confirmer avant expédition",
                'message' => "Le client {$order->customer->name} présente un statut '{$order->risk_level_at_order}'. Il est recommandé de le contacter par messagerie avant d'expédier.",
                'action_suggested' => 'contact_customer',
            ];
        }

        // Alert 2: Low stock products
        $lowStockProducts = Product::where('supplier_id', $supplierId)->where('status', 'active')->where('stock', '<=', 5)->get();
        foreach ($lowStockProducts as $prod) {
            $alerts[] = [
                'type' => 'low_stock',
                'severity' => 'info',
                'product_id' => $prod->id,
                'title' => "Stock faible pour '{$prod->name}'",
                'message' => "Reste seulement {$prod->stock} unités en stock.",
                'action_suggested' => 'restock',
            ];
        }

        // Alert 3: Products with high return rate (>15%)
        $highReturnProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.supplier_id', $supplierId)
            ->select('products.id', 'products.name', DB::raw('COUNT(orders.id) as total'), DB::raw("SUM(CASE WHEN orders.status IN ('refused', 'returned') THEN 1 ELSE 0 END) as returned"))
            ->groupBy('products.id', 'products.name')
            ->having('returned', '>=', 2)
            ->get();

        foreach ($highReturnProducts as $hrp) {
            $rate = round(($hrp->returned / $hrp->total) * 100, 1);
            if ($rate >= 15) {
                $alerts[] = [
                    'type' => 'high_return_product',
                    'severity' => 'danger',
                    'product_id' => $hrp->id,
                    'title' => "Taux de retour élevé ({$rate}%) sur '{$hrp->name}'",
                    'message' => "{$hrp->returned} retours enregistrés sur {$hrp->total} commandes. Pensez à enrichir la description ou vérifier les dimensions.",
                    'action_suggested' => 'edit_description',
                ];
            }
        }

        return response()->json(['alerts' => $alerts]);
    }

    public function orderRiskAssessment(Request $request, $orderId)
    {
        $order = Order::with('customer')->find($orderId);
        if (!$order) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        $user = $request->user();
        if (!$user->isSupplier() || !$user->supplier || $user->supplier->id !== $order->supplier_id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $customer = $order->customer;
        $supplierId = $user->supplier->id;

        // Calculate risk indicators restricted ONLY to this supplier-customer relationship
        $incidentsWithThisSupplier = SuspiciousIncident::where('supplier_id', $supplierId)
            ->where('user_id', $customer->id)
            ->count();

        $previousRefusedOrders = Order::where('supplier_id', $supplierId)
            ->where('user_id', $customer->id)
            ->whereIn('status', ['refused', 'returned'])
            ->count();

        $riskScore = 'low';
        $reasons = [];

        if ($incidentsWithThisSupplier >= 2 || $previousRefusedOrders >= 2 || $customer->risk_level === 'high_risk') {
            $riskScore = 'high';
            $reasons[] = 'Historique d\'incidents ou refus de colis détecté pour ce client.';
        } elseif ($incidentsWithThisSupplier === 1 || $previousRefusedOrders === 1 || $customer->risk_level === 'watch') {
            $riskScore = 'medium';
            $reasons[] = '1 refus ou incident précédent enregistré sur des commandes passées.';
        } else {
            $reasons[] = 'Aucun problème signalé sur les commandes précédentes de ce client.';
        }

        return response()->json([
            'order_id' => $order->id,
            'risk_score' => $riskScore,
            'incidents_with_supplier' => $incidentsWithThisSupplier,
            'previous_refusals' => $previousRefusedOrders,
            'explanations' => $reasons,
            'recommended_payment' => $riskScore === 'high' ? 'advance' : 'cod_or_advance',
        ]);
    }
}
