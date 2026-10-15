<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function supplierIndex(Request $request)
    {
        $user = $request->user();
        if (!$user->isSupplier() || !$user->supplier) {
            return response()->json(['message' => 'Réservé aux fournisseurs'], 403);
        }

        return response()->json(
            $user->supplier->products()
                ->with('category')
                ->orderBy('created_at', 'desc')
                ->paginate(12)
        );
    }

    public function index(Request $request)
    {
        $query = Product::with(['supplier.user', 'category'])
            ->where('status', 'active');

        if ($request->filled('q')) {
            $search = $request->input('q');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->filled('in_stock') && $request->in_stock == '1') {
            $query->where('stock', '>', 0);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(12);

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with(['supplier.user', 'category', 'reviews.customer'])->find($id);

        if (!$product) {
            return response()->json(['message' => 'Produit introuvable'], 404);
        }

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->isSupplier() || !$user->supplier) {
            return response()->json(['message' => 'Réservé aux fournisseurs'], 403);
        }

        if ($user->supplier->verification_status !== 'verified') {
            return response()->json(['message' => 'Votre compte fournisseur doit être vérifié par un administrateur avant d\'ajouter des produits.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imageUrl = $request->input('image_url');
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = Storage::url($path);
        }

        $product = Product::create([
            'supplier_id' => $user->supplier->id,
            'category_id' => $request->category_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'image_url' => $imageUrl ?? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
            'status' => 'active',
            'return_risk_score' => $request->input('return_risk_score', 'low'),
            'specifications' => $request->input('specifications'),
        ]);

        return response()->json(['message' => 'Produit ajouté avec succès', 'product' => $product->load('category')], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Produit introuvable'], 404);
        }

        $authorizationError = $this->authorizeSupplierProduct($request, $product);
        if ($authorizationError) {
            return $authorizationError;
        }

        $validator = Validator::make($request->all(), [
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'status' => 'sometimes|in:active,inactive',
            'return_risk_score' => 'sometimes|in:low,medium,high',
            'image' => 'nullable|image|max:2048',
            'image_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['category_id', 'name', 'description', 'price', 'stock', 'status', 'return_risk_score', 'specifications']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $data['image_url'] = Storage::url($path);
        } elseif ($request->filled('image_url')) {
            $data['image_url'] = $request->image_url;
        }

        $product->update($data);

        return response()->json(['message' => 'Produit mis à jour avec succès', 'product' => $product]);
    }

    public function destroy(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Produit introuvable'], 404);
        }

        $authorizationError = $this->authorizeSupplierProduct($request, $product);
        if ($authorizationError) {
            return $authorizationError;
        }

        $product->update(['status' => 'inactive']);

        return response()->json(['message' => 'Produit désactivé avec succès', 'id' => $product->id]);
    }

    private function authorizeSupplierProduct(Request $request, Product $product)
    {
        $user = $request->user();
        $supplier = $user->supplier;

        if (!$user->isSupplier() || !$supplier || $supplier->id !== $product->supplier_id) {
            return response()->json(['message' => 'Accès non autorisé à ce produit'], 403);
        }

        if ($supplier->verification_status !== 'verified') {
            return response()->json(['message' => 'Votre compte fournisseur doit être vérifié par un administrateur.'], 403);
        }

        return null;
    }
}