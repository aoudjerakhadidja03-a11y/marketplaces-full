<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::with('user:id,name,email,phone')
            ->where('verification_status', 'verified');

        if ($request->filled('sector')) {
            $query->where('sector', $request->sector);
        }

        if ($request->filled('q')) {
            $search = $request->q;
            $query->where('shop_name', 'like', "%{$search}%");
        }

        $suppliers = $query->paginate(12);

        return response()->json($suppliers);
    }

    public function show($id)
    {
        $supplier = Supplier::with(['user:id,name,email,phone', 'products' => function ($q) {
            $q->where('status', 'active');
        }])->find($id);

        if (!$supplier) {
            return response()->json(['message' => 'Fournisseur introuvable'], 404);
        }

        return response()->json($supplier);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        if (!$user->isSupplier() || !$user->supplier) {
            return response()->json(['message' => 'Réservé aux fournisseurs'], 403);
        }

        $supplier = $user->supplier;

        $validator = Validator::make($request->all(), [
            'shop_name' => 'sometimes|required|string|max:255',
            'sector' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string|max:255',
            'website_url' => 'nullable|string|max:255',
            'business_category' => 'nullable|string|max:255',
            'company_description' => 'nullable|string',
            'max_allowed_return_rate' => 'nullable|integer|min:1|max:100',
            'require_prepayment_for_risky' => 'nullable|boolean',
            'disable_cod_for_risky' => 'nullable|boolean',
            'deposit_percent_for_risky' => 'nullable|integer|min:0|max:100',
            'technical_support_contact' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $supplier->update($request->only([
            'shop_name',
            'sector',
            'address',
            'website_url',
            'business_category',
            'company_description',
            'max_allowed_return_rate',
            'require_prepayment_for_risky',
            'disable_cod_for_risky',
            'deposit_percent_for_risky',
            'technical_support_contact'
        ]));

        return response()->json(['message' => 'Profil de la boutique mis à jour avec succès', 'supplier' => $supplier]);
    }
}
