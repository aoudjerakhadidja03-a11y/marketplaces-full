<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Order;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Conversation::with(['order:id,status,total_amount', 'customer:id,name,email,phone', 'supplier:id,shop_name', 'latestMessage']);

        if ($user->isCustomer()) {
            $query->where('customer_id', $user->id);
        } elseif ($user->isSupplier() && $user->supplier) {
            $query->where('supplier_id', $user->supplier->id);
        } elseif (!$user->isAdmin()) {
            return response()->json([]);
        }

        $conversations = $query->orderBy('updated_at', 'desc')->get();

        return response()->json($conversations);
    }

    public function showByOrder(Request $request, $orderId)
    {
        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        $user = $request->user();

        // Security / Ownership Check
        if (!$user->isAdmin()) {
            if ($user->isCustomer() && $user->id !== $order->user_id) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }
            if ($user->isSupplier() && (!$user->supplier || $user->supplier->id !== $order->supplier_id)) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }
        }

        $conversation = Conversation::firstOrCreate(
            ['order_id' => $order->id],
            [
                'customer_id' => $order->user_id,
                'supplier_id' => $order->supplier_id,
            ]
        );

        $conversation->load(['messages.sender:id,name,role', 'customer:id,name', 'supplier:id,shop_name', 'order:id,status,total_amount']);

        return response()->json($conversation);
    }

    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $conversation = Conversation::find($id);
        if (!$conversation) {
            return response()->json(['message' => 'Discussion introuvable'], 404);
        }

        $user = $request->user();

        // Security / Ownership Check
        if (!$user->isAdmin()) {
            if ($user->isCustomer() && $user->id !== $conversation->customer_id) {
                return response()->json(['message' => 'Accès non autorisé à cette discussion'], 403);
            }
            if ($user->isSupplier() && (!$user->supplier || $user->supplier->id !== $conversation->supplier_id)) {
                return response()->json(['message' => 'Accès non autorisé à cette discussion'], 403);
            }
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => $request->body,
        ]);

        $conversation->touch(); // update updated_at timestamp

        return response()->json([
            'message' => 'Message envoyé',
            'data' => $message->load('sender:id,name,role'),
        ], 201);
    }

    public function markAsRead(Request $request, $id)
    {
        $conversation = Conversation::find($id);
        if (!$conversation) {
            return response()->json(['message' => 'Discussion introuvable'], 404);
        }

        $user = $request->user();

        if (!$user->isAdmin()) {
            $isCustomer = $user->isCustomer() && $user->id === $conversation->customer_id;
            $isSupplier = $user->isSupplier() && $user->supplier && $user->supplier->id === $conversation->supplier_id;

            if (!$isCustomer && !$isSupplier) {
                return response()->json(['message' => 'Accès non autorisé à cette discussion'], 403);
            }
        }

        Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Messages marqués comme lus']);
    }
}
