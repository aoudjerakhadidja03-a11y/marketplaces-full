<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReturnTicket;
use App\Models\Order;
use App\Models\Supplier;

class N8nWebhookController extends Controller
{
    /**
     * Endpoint d'intégration N8N pour la notification automatique des retours par SMS/WhatsApp/Email
     */
    public function handleReturnCreated(Request $request)
    {
        $ticketId = $request->input('ticket_id');
        $ticket = ReturnTicket::with(['order', 'customer', 'supplier', 'product'])->find($ticketId);

        if (!$ticket) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ticket de retour non trouvé',
            ], 404);
        }

        // Structure payload préparée pour N8N (SMS Twilio/Ozenei, Notification WhatsApp, Qualification IA)
        $n8nPayload = [
            'event' => 'return.created',
            'timestamp' => now()->toIso8601String(),
            'data' => [
                'ticket_number' => $ticket->ticket_number,
                'customer' => [
                    'id' => $ticket->customer->id ?? null,
                    'name' => $ticket->customer->name ?? 'Client',
                    'email' => $ticket->customer->email ?? '',
                    'phone' => $ticket->order->phone ?? '',
                ],
                'supplier' => [
                    'id' => $ticket->supplier->id ?? null,
                    'shop_name' => $ticket->supplier->shop_name ?? '',
                ],
                'product' => [
                    'id' => $ticket->product->id ?? null,
                    'title' => $ticket->product->title ?? 'Produit',
                ],
                'reason' => $ticket->reason_category,
                'details' => $ticket->reason_details,
                'status' => $ticket->status,
                'ai_prevention_advice' => $ticket->ai_prevention_advice,
            ],
            'n8n_suggested_workflow' => [
                'step_1' => 'Envoyer SMS de confirmation au client avec code de retour ' . $ticket->ticket_number,
                'step_2' => 'Notifier le fournisseur via Webhook / WhatsApp Pro',
                'step_3' => 'Mettre à jour le score de fiabilité du client si taux > 20%',
            ]
        ];

        return response()->json([
            'status' => 'success',
            'n8n_payload' => $n8nPayload,
        ]);
    }

    /**
     * Webhook N8N pour l'envoi d'alertes clients à risque
     */
    public function handleCustomerAlert(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Workflow d\'alerte N8N prêt pour exécution automatique.',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
