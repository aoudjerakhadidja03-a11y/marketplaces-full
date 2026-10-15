<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReturnTicket;
use App\Models\Order;
use App\Models\Supplier;
use App\Models\CustomerRiskStatus;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ReturnTicketController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = ReturnTicket::with(['order', 'customer', 'supplier', 'product']);

        if ($user->role === 'customer') {
            $query->where('customer_id', $user->id);
        } elseif ($user->role === 'supplier') {
            $supplier = Supplier::where('user_id', $user->id)->first();
            if ($supplier) {
                $query->where('supplier_id', $supplier->id);
            } else {
                return response()->json(['data' => []]);
            }
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        $tickets = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $tickets,
        ]);
    }

    public function track($query)
    {
        $clean = trim($query);
        $clean = ltrim($clean, '#');

        $ticket = ReturnTicket::with(['order.items.product', 'order.shipment', 'customer', 'supplier', 'product'])
            ->where('ticket_number', 'LIKE', "%{$clean}%")
            ->orWhere('order_id', $clean)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => "Aucun dossier de retour trouvé pour la référence '{$query}'.",
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $ticket,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'nullable|exists:products,id',
            'reason_category' => 'required|string',
            'reason_details' => 'required|string',
        ]);

        $order = Order::findOrFail($validated['order_id']);
        $user = Auth::user();

        if (!$user->isCustomer() || $order->user_id !== $user->id) {
            return response()->json(['message' => 'Vous ne pouvez demander un retour que pour votre propre commande.'], 403);
        }

        if (!empty($validated['product_id']) && !$order->items()->where('product_id', $validated['product_id'])->exists()) {
            return response()->json(['message' => 'Ce produit ne fait pas partie de cette commande.'], 422);
        }

        // Generate Ticket Number
        $ticketNumber = 'RET-' . strtoupper(Str::random(6)) . '-' . date('Ymd');

        // AI Prevention advice based on reason
        $preventionAdvice = $this->generatePreventionAdvice($validated['reason_category']);

        $ticket = ReturnTicket::create([
            'ticket_number' => $ticketNumber,
            'order_id' => $order->id,
            'customer_id' => $order->user_id,
            'supplier_id' => $order->supplier_id,
            'product_id' => $validated['product_id'] ?? null,
            'reason_category' => $validated['reason_category'],
            'reason_details' => $validated['reason_details'],
            'status' => 'pending_approval',
            'refund_amount' => $order->total_amount,
            'ai_prevention_advice' => $preventionAdvice,
        ]);

        // Update Order status
        $order->update([
            'status' => 'returned',
            'return_reason' => $validated['reason_category'] . ': ' . $validated['reason_details'],
        ]);

        // Recalculate Risk & Penalty Status for Customer
        $this->updateCustomerRiskAndPenalty($order->user_id, $order->supplier_id);

        return response()->json([
            'success' => true,
            'message' => 'Demande de retour enregistrée et synchronisée avec le fournisseur.',
            'data' => $ticket->load(['order', 'customer', 'supplier', 'product']),
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $ticket = ReturnTicket::findOrFail($id);
        $user = $request->user();
        $supplier = $user->supplier;

        if (!$user->isAdmin() && (!$user->isSupplier() || !$supplier || $supplier->id !== $ticket->supplier_id)) {
            return response()->json(['message' => 'Accès non autorisé à ce ticket de retour.'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:pending_approval,approved,in_transit,received,refunded,rejected',
            'supplier_notes' => 'nullable|string',
        ]);

        $ticket->status = $validated['status'];
        if (isset($validated['supplier_notes'])) {
            $ticket->supplier_notes = $validated['supplier_notes'];
        }
        $ticket->save();

        return response()->json([
            'success' => true,
            'message' => 'Statut du retour mis à jour avec succès.',
            'data' => $ticket,
        ]);
    }

    public function getCounter(Request $request)
    {
        $user = Auth::user();
        $totalReturns = 0;
        $pendingReturns = 0;
        $approvedReturns = 0;
        $completedReturns = 0;
        $returnRate = 0.00;
        $reliabilityTier = 'standard';
        $paymentRestriction = 'none';

        if ($user->role === 'customer') {
            $totalOrders = Order::where('user_id', $user->id)->count();
            $totalReturns = ReturnTicket::where('customer_id', $user->id)->count();
            $pendingReturns = ReturnTicket::where('customer_id', $user->id)->where('status', 'pending_approval')->count();
            $approvedReturns = ReturnTicket::where('customer_id', $user->id)->whereIn('status', ['approved', 'in_transit'])->count();
            $completedReturns = ReturnTicket::where('customer_id', $user->id)->whereIn('status', ['received', 'refunded'])->count();

            if ($totalOrders > 0) {
                $returnRate = round(($totalReturns / $totalOrders) * 100, 1);
            }

            $riskStatus = CustomerRiskStatus::where('user_id', $user->id)->first();
            if ($riskStatus) {
                $reliabilityTier = $riskStatus->reliability_tier ?? 'standard';
                $paymentRestriction = $riskStatus->active_payment_restriction ?? 'none';
            }
        } elseif ($user->role === 'supplier') {
            $supplier = Supplier::where('user_id', $user->id)->first();
            if ($supplier) {
                $totalOrders = Order::where('supplier_id', $supplier->id)->count();
                $totalReturns = ReturnTicket::where('supplier_id', $supplier->id)->count();
                $pendingReturns = ReturnTicket::where('supplier_id', $supplier->id)->where('status', 'pending_approval')->count();
                $approvedReturns = ReturnTicket::where('supplier_id', $supplier->id)->whereIn('status', ['approved', 'in_transit'])->count();
                $completedReturns = ReturnTicket::where('supplier_id', $supplier->id)->whereIn('status', ['received', 'refunded'])->count();

                if ($totalOrders > 0) {
                    $returnRate = round(($totalReturns / $totalOrders) * 100, 1);
                }
            }
        } elseif ($user->role === 'admin') {
            $totalOrders = Order::count();
            $totalReturns = ReturnTicket::count();
            $pendingReturns = ReturnTicket::where('status', 'pending_approval')->count();
            $approvedReturns = ReturnTicket::whereIn('status', ['approved', 'in_transit'])->count();
            $completedReturns = ReturnTicket::whereIn('status', ['received', 'refunded'])->count();

            if ($totalOrders > 0) {
                $returnRate = round(($totalReturns / $totalOrders) * 100, 1);
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total_returns' => $totalReturns,
                'pending_returns' => $pendingReturns,
                'approved_returns' => $approvedReturns,
                'completed_returns' => $completedReturns,
                'return_rate_percent' => $returnRate,
                'reliability_tier' => $reliabilityTier,
                'payment_restriction' => $paymentRestriction,
            ],
        ]);
    }

    private function generatePreventionAdvice($reason)
    {
        switch ($reason) {
            case 'size_issue':
                return "Conseil : vérifiez que les dimensions du produit sont précisées et contactez le client en cas de doute.";
            case 'defective':
                return "Conseil : documentez le défaut constaté et vérifiez les contrôles qualité du produit concerné.";
            case 'not_as_described':
                return "Conseil : comparez la fiche descriptive aux caractéristiques du produit livré et corrigez toute information inexacte.";
            case 'delivery_delay':
                return "Conseil : vérifiez le statut d'expédition et communiquez au client un délai confirmé par le transporteur.";
            default:
                return "Conseil : contactez le client via la messagerie de la commande pour convenir de la suite.";
        }
    }

    private function updateCustomerRiskAndPenalty($userId, $supplierId)
    {
        $totalOrders = Order::where('user_id', $userId)->count();
        $totalReturns = ReturnTicket::where('customer_id', $userId)->count();

        $returnRate = 0.00;
        if ($totalOrders > 0) {
            $returnRate = round(($totalReturns / $totalOrders) * 100, 1);
        }

        $supplier = Supplier::find($supplierId);
        $maxRateThreshold = $supplier ? $supplier->max_allowed_return_rate : 15;

        $tier = 'trusted';
        $restriction = 'none';

        if ($returnRate > $maxRateThreshold && $totalReturns >= 2) {
            $tier = 'restricted';
            $restriction = 'deposit_required_30'; // Acompte de 30% ou prépaiement
        } elseif ($returnRate > ($maxRateThreshold / 2) && $totalReturns >= 1) {
            $tier = 'warning';
            $restriction = 'cod_disabled'; // Paiement à la livraison désactivé
        }

        CustomerRiskStatus::updateOrCreate(
            ['user_id' => $userId],
            [
                'total_returns_count' => $totalReturns,
                'return_rate_percent' => $returnRate,
                'reliability_tier' => $tier,
                'active_payment_restriction' => $restriction,
                'restriction_reason' => "Taux de retour de {$returnRate}% dépassant le seuil de tolérance de {$maxRateThreshold}%.",
                'last_incident_at' => now(),
            ]
        );
    }
}
