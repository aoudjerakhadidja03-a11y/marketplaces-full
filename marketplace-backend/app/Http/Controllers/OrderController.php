<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Payment;
use App\Models\Conversation;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->isCustomer()) {
            return response()->json(['message' => 'Seuls les clients peuvent passer une commande.'], 403);
        }

        if ($user->account_status === 'blocked') {
            return response()->json(['message' => 'Votre compte est suspendu.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:cod',
            'shipping_address' => 'required|string',
            'phone' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Return Prevention Rule: High risk customers cannot use Cash on Delivery (COD)
        if ($user->risk_level === 'high_risk' && $request->payment_method === 'cod') {
            return response()->json([
                'message' => 'Compte soumis à paiement préalable. En raison d\'incidents passés, les commandes doivent être réglées à l\'avance ou en ligne.'
            ], 422);
        }

        $itemsInput = $request->items;
        $productIds = array_column($itemsInput, 'product_id');

        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        // Check stock and status
        $itemsBySupplier = [];

        foreach ($itemsInput as $item) {
            $product = $products->get($item['product_id']);
            if (!$product || $product->status !== 'active') {
                return response()->json(['message' => "Le produit #{$item['product_id']} n'est plus disponible."], 422);
            }

            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'message' => "Stock insuffisant pour le produit '{$product->name}'. Disponible: {$product->stock}, Demandé: {$item['quantity']}"
                ], 422);
            }

            $supplierId = $product->supplier_id;
            if (!isset($itemsBySupplier[$supplierId])) {
                $itemsBySupplier[$supplierId] = [];
            }

            $itemsBySupplier[$supplierId][] = [
                'product' => $product,
                'quantity' => $item['quantity'],
                'unit_price' => $product->price,
                'total_price' => $product->price * $item['quantity'],
            ];
        }

        $createdOrders = [];

        DB::transaction(function () use ($itemsBySupplier, $user, $request, &$createdOrders) {
            foreach ($itemsBySupplier as $supplierId => $items) {
                $orderTotal = array_sum(array_column($items, 'total_price'));

               $order = Order::create([
                'user_id' => $user->id,
                'supplier_id' => $supplierId,
                'total_amount' => $orderTotal,
                'subtotal' => $orderTotal,
                'total' => $orderTotal,
                'status' => 'pending',
                'payment_method' => $request->payment_method,
                'payment_status' => 'unpaid',
                'risk_level_at_order' => $user->risk_level,
                'shipping_address' => $request->shipping_address,
                'phone' => $request->phone,
               ]);
               
                foreach ($items as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product']->id,
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total_price' => $item['total_price'],
                    ]);

                    // Decrement stock in DB transaction
                    $item['product']->decrement('stock', $item['quantity']);
                }

                // Create initial payment record
                Payment::create([
                    'order_id' => $order->id,
                    'payment_method' => $request->payment_method,
                    'amount' => $orderTotal,
                    'status' => 'pending',
                ]);

                // Create initial shipment record
                Shipment::create([
                    'order_id' => $order->id,
                    'status' => 'pending',
                    'customer_confirmation' => 'pending',
                ]);

                // Auto-create order conversation between customer and supplier
                Conversation::create([
                    'order_id' => $order->id,
                    'customer_id' => $user->id,
                    'supplier_id' => $supplierId,
                ]);

                $createdOrders[] = $order->load(['items.product', 'supplier', 'shipment']);
            }
        });

        return response()->json([
            'message' => count($createdOrders) > 1
                ? 'Votre panier a été divisé en ' . count($createdOrders) . ' commandes distinctes selon les fournisseurs.'
                : 'Commande créée avec succès',
            'orders' => $createdOrders,
        ], 201);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Order::with(['items.product', 'supplier', 'customer:id,name,email,phone,risk_level', 'shipment']);

        if ($user->isCustomer()) {
            $query->where('user_id', $user->id);
        } elseif ($user->isSupplier() && $user->supplier) {
            $query->where('supplier_id', $user->supplier->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($orders);
    }

    public function show(Request $request, $id)
    {
        $order = Order::with(['items.product', 'supplier.user', 'customer:id,name,email,phone,risk_level', 'shipment', 'payment', 'conversation'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        $user = $request->user();

        // Security / Object-Level Authorization Check
        if (!$user->isAdmin()) {
            if ($user->isCustomer() && $user->id !== $order->user_id) {
                return response()->json(['message' => 'Accès non autorisé à cette commande'], 403);
            }

            if ($user->isSupplier() && (!$user->supplier || $user->supplier->id !== $order->supplier_id)) {
                return response()->json(['message' => 'Accès non autorisé à cette commande'], 403);
            }
        }

        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        $user = $request->user();
        if (!$user->isAdmin() && (!$user->isSupplier() || !$user->supplier || $user->supplier->id !== $order->supplier_id)) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,shipped,delivered,refused,returned,cancelled',
            'return_reason' => 'required_if:status,refused,returned|nullable|string',
        ]);

        $order->status = $request->status;
        if ($request->filled('return_reason')) {
            $order->return_reason = $request->return_reason;
        }

        $order->save();

        if ($order->shipment) {
            if ($request->status === 'shipped') {
                $order->shipment->update(['status' => 'shipped', 'shipped_at' => now()]);
            } elseif ($request->status === 'delivered') {
                $order->shipment->update(['status' => 'delivered', 'delivered_at' => now()]);
            } elseif (in_array($request->status, ['refused', 'returned'])) {
                $order->shipment->update(['status' => 'returned']);
            }
        }

        return response()->json(['message' => 'Statut de la commande mis à jour avec succès', 'order' => $order]);
    }
}
