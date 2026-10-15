<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $cleanEmail = strtolower(trim($request->email));
        $cleanPhone = trim($request->phone);

        // Check if a user with this email or phone already exists
        $existingUser = User::where('email', $cleanEmail)
            ->orWhere('phone', $cleanPhone)
            ->first();

        if ($existingUser) {
            // Check if password matches
            if ($existingUser->verifyPassword($request->password)) {
                // If account is supplier and requesting supplier, ensure supplier profile exists
                if ($request->role === 'supplier' && !$existingUser->supplier) {
                    Supplier::create([
                        'user_id' => $existingUser->id,
                        'shop_name' => $request->shop_name ?? 'Boutique ' . $existingUser->name,
                        'sector' => $request->sector ?? 'Général',
                        'address' => $request->address ?? 'Algérie',
                        'website_url' => $request->website_url ?? null,
                        'verification_status' => 'pending',
                    ]);
                    $existingUser->update(['role' => 'supplier']);
                }

                $token = $existingUser->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'message' => 'Ce compte existe déjà. Vous avez été connecté avec succès.',
                    'user' => $existingUser->fresh('supplier'),
                    'token' => $token,
                    'auto_logged_in' => true,
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Un compte existe déjà avec cette adresse email ou ce numéro de téléphone. Veuillez vous connecter avec votre mot de passe.',
                    'existing_account' => true,
                    'existing_email' => $cleanEmail,
                ], 409);
            }
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|min:6',
            'role' => 'required|in:customer,supplier',
            'shop_name' => 'required_if:role,supplier|string|nullable',
            'sector' => 'required_if:role,supplier|string|nullable',
            'address' => 'required_if:role,supplier|string|nullable',
            'website_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => trim($request->name),
            'email' => $cleanEmail,
            'phone' => $cleanPhone,
            'password_hash' => Hash::make($request->password),
            'role' => $request->role,
            'account_status' => 'active',
            'risk_level' => 'reliable',
        ]);

        if ($request->role === 'supplier') {
            Supplier::create([
                'user_id' => $user->id,
                'shop_name' => $request->shop_name,
                'sector' => $request->sector,
                'address' => $request->address,
                'website_url' => $request->website_url,
                'verification_status' => 'pending',
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'user' => $user->load('supplier'),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cleanEmail = strtolower(trim($request->email));
        $user = User::where('email', $cleanEmail)->first();

        if (!$user || !$user->verifyPassword($request->password)) {
            return response()->json(['message' => 'Identifiants incorrects (Email ou mot de passe invalide).'], 401);
        }

        if ($user->account_status === 'blocked') {
            return response()->json(['message' => 'Votre compte est suspendu ou bloqué.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user->load('supplier'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('supplier'),
        ]);
    }
}