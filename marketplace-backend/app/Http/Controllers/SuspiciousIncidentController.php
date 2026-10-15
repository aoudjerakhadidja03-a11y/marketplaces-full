<?php

namespace App\Http\Controllers;

use App\Models\SuspiciousIncident;
use App\Models\CustomerRiskStatus;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;

class SuspiciousIncidentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'user_id' => 'required|exists:users,id',
            'incident_type' => 'required|in:package_not_collected,order_refused,suspected_fraud',
            'notes' => 'nullable|string',
        ]);

        $user = $request->user();
        if (!$user->isSupplier() || !$user->supplier) {
            return response()->json(['message' => 'Réservé aux fournisseurs'], 403);
        }

        // Verify order belongs to this supplier
        $order = Order::find($validated['order_id']);
        if ($order->supplier_id !== $user->supplier->id) {
            return response()->json(['message' => 'Cette commande ne vous appartient pas'], 403);
        }

        $incident = SuspiciousIncident::create([
            'user_id' => $validated['user_id'],
            'supplier_id' => $user->supplier->id,
            'order_id' => $validated['order_id'],
            'incident_type' => $validated['incident_type'],
            'incident_date' => now(),
            'notes' => $validated['notes'] ?? null,
        ]);

        $count = SuspiciousIncident::where('user_id', $validated['user_id'])->count();
        $level = $count >= 2 ? 'high_risk' : ($count === 1 ? 'watch' : 'reliable');

        CustomerRiskStatus::updateOrCreate(
            ['user_id' => $validated['user_id']],
            [
                'nb_incidents_total' => $count,
                'risk_level' => $level,
                'last_incident_at' => now(),
            ]
        );

        User::where('id', $validated['user_id'])->update(['risk_level' => $level]);

        return response()->json([
            'message' => 'Incident d\'impayé / refus enregistré',
            'incident' => $incident,
            'new_risk_level' => $level,
        ], 201);
    }

    public function riskStatus($userId)
    {
        $status = CustomerRiskStatus::where('user_id', $userId)->first();

        return response()->json([
            'user_id' => (int) $userId,
            'risk_level' => $status ? $status->risk_level : 'reliable',
            'nb_incidents_total' => $status ? $status->nb_incidents_total : 0,
            'last_incident_at' => $status ? $status->last_incident_at : null,
        ]);
    }
}