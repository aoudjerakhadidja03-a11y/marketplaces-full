<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();

        // Anti-Fake Review check: verify customer owns a delivered order with this product
        $order = Order::with('items')->find($request->order_id);

        if ($order->user_id !== $user->id) {
            return response()->json(['message' => 'Cette commande ne vous appartient pas'], 403);
        }

        if (!in_array($order->status, ['delivered', 'confirmed_by_customer'])) {
            return response()->json(['message' => 'Vous ne pouvez déposer un avis qu\'après la livraison confirmée de votre commande.'], 422);
        }

        $containsProduct = $order->items->contains('product_id', $request->product_id);
        if (!$containsProduct) {
            return response()->json(['message' => 'Ce produit ne fait pas partie de cette commande.'], 422);
        }

        $review = Review::updateOrCreate(
            [
                'order_id' => $request->order_id,
                'product_id' => $request->product_id,
                'customer_id' => $user->id,
            ],
            [
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]
        );

        return response()->json([
            'message' => 'Merci pour votre avis !',
            'review' => $review->load('customer:id,name'),
        ], 201);
    }

    public function index($productId)
    {
        $reviews = Review::with('customer:id,name')
            ->where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->get();

        $avgRating = $reviews->avg('rating');

        return response()->json([
            'average_rating' => round($avgRating ?? 0, 1),
            'total_reviews' => $reviews->count(),
            'reviews' => $reviews,
        ]);
    }
}
