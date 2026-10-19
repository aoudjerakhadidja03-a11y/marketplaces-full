<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use App\Models\SuspiciousIncident;
use App\Models\ReturnTicket;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function customer(Request $request)
    {
        $user = $request->user();

        $totalOrders = Order::where('user_id', $user->id)->count();
        $pendingOrders = Order::where('user_id', $user->id)->whereIn('status', ['pending', 'confirmed', 'preparing', 'shipped'])->count();
        $deliveredOrders = Order::where('user_id', $user->id)->whereIn('status', ['delivered', 'confirmed_by_customer'])->count();
        $totalSpent = Order::where('user_id', $user->id)->whereNotIn('status', ['cancelled', 'refused'])->sum('total_amount');

        $totalReturns = ReturnTicket::where('customer_id', $user->id)->count();
        $pendingReturns = ReturnTicket::where('customer_id', $user->id)->where('status', 'pending_approval')->count();
        $refundedAmount = ReturnTicket::where('customer_id', $user->id)->where('status', 'refunded')->sum('refund_amount');

        $recentOrders = Order::with(['items.product', 'supplier', 'shipment'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'metrics' => [
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'delivered_orders' => $deliveredOrders,
                'total_spent' => round($totalSpent, 2),
                'total_returns' => $totalReturns,
                'pending_returns' => $pendingReturns,
                'refunded_amount' => round($refundedAmount, 2),
                'user_risk_level' => $user->risk_level,
            ],
            'recent_orders' => $recentOrders,
        ]);
    }

    public function supplier(Request $request)
    {
        $user = $request->user();
        if (!$user->isSupplier() || !$user->supplier) {
            return response()->json(['message' => 'Réservé aux fournisseurs'], 403);
        }

        $supplierId = $user->supplier->id;

        $totalProducts = Product::where('supplier_id', $supplierId)->where('status', 'active')->count();
        $lowStockProducts = Product::where('supplier_id', $supplierId)->where('status', 'active')->where('stock', '<=', 5)->count();

        $totalOrders = Order::where('supplier_id', $supplierId)->count();
        $newOrders = Order::where('supplier_id', $supplierId)->where('status', 'pending')->count();
        $shippedOrders = Order::where('supplier_id', $supplierId)->where('status', 'shipped')->count();

        $returnedOrders = Order::where('supplier_id', $supplierId)->whereIn('status', ['refused', 'returned'])->count();
        $totalDelivered = Order::where('supplier_id', $supplierId)->whereIn('status', ['delivered', 'confirmed_by_customer', 'refused', 'returned'])->count();

        $returnRate = $totalDelivered > 0 ? round(($returnedOrders / $totalDelivered) * 100, 2) : 0.0;

        $revenue = Order::where('supplier_id', $supplierId)->whereIn('status', ['delivered', 'confirmed_by_customer'])->sum('total_amount');

        $recentOrders = Order::with(['items.product', 'customer:id,name,email,phone,risk_level', 'shipment'])
            ->where('supplier_id', $supplierId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'metrics' => [
                'total_products' => $totalProducts,
                'low_stock_products' => $lowStockProducts,
                'total_orders' => $totalOrders,
                'new_orders' => $newOrders,
                'shipped_orders' => $shippedOrders,
                'returned_orders' => $returnedOrders,
                'return_rate_percentage' => $returnRate,
                'total_revenue' => round($revenue, 2),
                'shop_verification_status' => $user->supplier->verification_status,
            ],
            'recent_orders' => $recentOrders,
        ]);
    }

    public function admin(Request $request)
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Réservé aux administrateurs'], 403);
        }

        $totalUsers = User::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $totalSuppliers = Supplier::where('verification_status', 'verified')->count();
        $pendingSuppliers = Supplier::where('verification_status', 'pending')->count();

        $totalOrders = Order::count();
        $totalIncidents = SuspiciousIncident::count();
        $highRiskCustomers = User::where('risk_level', 'high_risk')->count();
        $totalSalesVolume = Order::whereIn('status', ['delivered', 'confirmed_by_customer'])->sum('total_amount');

        return response()->json([
            'metrics' => [
                'total_users' => $totalUsers,
                'total_customers' => $totalCustomers,
                'verified_suppliers' => $totalSuppliers,
                'pending_suppliers' => $pendingSuppliers,
                'total_orders' => $totalOrders,
                'total_incidents' => $totalIncidents,
                'high_risk_customers' => $highRiskCustomers,
                'total_sales_volume' => round($totalSalesVolume, 2),
            ],
        ]);
    }
}
