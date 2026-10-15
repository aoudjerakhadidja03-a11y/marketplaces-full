<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function pendingSuppliers(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Réservé aux administrateurs'], 403);
        }

        $suppliers = Supplier::with('user:id,name,email,phone,created_at')
            ->where('verification_status', 'pending')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($suppliers);
    }

    public function verifySupplier(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Réservé aux administrateurs'], 403);
        }

        $request->validate([
            'status' => 'required|in:verified,rejected',
        ]);

        $supplier = Supplier::with('user')->find($id);
        if (!$supplier) {
            return response()->json(['message' => 'Fournisseur introuvable'], 404);
        }

        $supplier->update(['verification_status' => $request->status]);

        // Audit Log entry
        AuditLog::log(
            'supplier_verification_' . $request->status,
            'Supplier',
            $supplier->id,
            [
                'admin_id' => $request->user()->id,
                'supplier_shop' => $supplier->shop_name,
                'user_email' => $supplier->user->email,
                'new_status' => $request->status,
            ]
        );

        return response()->json([
            'message' => $request->status === 'verified' ? 'Boutique fournisseur approuvée avec succès !' : 'Demande fournisseur refusée.',
            'supplier' => $supplier,
        ]);
    }

    public function auditLogs(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Réservé aux administrateurs'], 403);
        }

        $logs = AuditLog::with('user:id,name,email,role')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($logs);
    }

    public function users(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Réservé aux administrateurs'], 403);
        }

        $query = User::with('supplier');

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($users);
    }

    public function updateUserStatus(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Réservé aux administrateurs'], 403);
        }

        $request->validate([
            'account_status' => 'required|in:active,pending,blocked',
            'risk_level' => 'sometimes|in:reliable,watch,high_risk',
        ]);

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        $data = ['account_status' => $request->account_status];
        if ($request->filled('risk_level')) {
            $data['risk_level'] = $request->risk_level;
        }

        $user->update($data);

        AuditLog::log('user_status_update', 'User', $user->id, [
            'admin_id' => $request->user()->id,
            'target_user' => $user->email,
            'status' => $request->account_status,
        ]);

        return response()->json(['message' => 'Statut utilisateur mis à jour', 'user' => $user]);
    }
}
