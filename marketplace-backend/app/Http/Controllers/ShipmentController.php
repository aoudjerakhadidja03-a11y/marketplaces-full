<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use App\Models\Order;
use App\Models\SuspiciousIncident;
use App\Models\CustomerRiskStatus;
use App\Models\User;
use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    public function confirm(Request $request, $id)
    {
        $request->validate([
            'confirmation' => 'required|in:confirmed,not_received',
            'notes' => 'nullable|string',
        ]);

        $order = Order::with('shipment')->find($id);
        if (!$order) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        $user = $request->user();
        if ($user->id !== $order->user_id && !$user->isAdmin()) {
            return response()->json(['message' => 'Accès non autorisé à cette livraison'], 403);
        }

        $shipment = $order->shipment;
        if (!$shipment) {
            $shipment = Shipment::create(['order_id' => $order->id, 'status' => 'delivered']);
        }

        $confirmation = $request->confirmation;
        $shipment->customer_confirmation = $confirmation;
        $shipment->notes = $request->notes;
        $shipment->save();

        if ($confirmation === 'confirmed') {
            $order->update(['status' => 'confirmed_by_customer']);
            return response()->json(['message' => 'Merci pour votre confirmation ! La livraison est validée.']);
        } else {
            // Customer flags non-reception / failed delivery
            $order->update(['status' => 'refused', 'return_reason' => 'Colis non reçu ou refusé par le client']);

            // Create suspicious incident automatically
            $incident = SuspiciousIncident::create([
                'user_id' => $order->user_id,
                'supplier_id' => $order->supplier_id,
                'order_id' => $order->id,
                'incident_type' => 'package_not_collected',
                'incident_date' => now(),
                'notes' => $request->notes ?? 'Signalé par le client lors du suivi de livraison',
            ]);

            // Update incident count & risk level
            $count = SuspiciousIncident::where('user_id', $order->user_id)->count();
            $level = $count >= 2 ? 'high_risk' : ($count === 1 ? 'watch' : 'reliable');

            CustomerRiskStatus::updateOrCreate(
                ['user_id' => $order->user_id],
                [
                    'nb_incidents_total' => $count,
                    'risk_level' => $level,
                    'last_incident_at' => now(),
                ]
            );

            User::where('id', $order->user_id)->update(['risk_level' => $level]);

            return response()->json([
                'message' => 'Incident enregistré. Le support et le fournisseur ont été informés.',
                'risk_level' => $level,
            ]);
        }
    }
}
