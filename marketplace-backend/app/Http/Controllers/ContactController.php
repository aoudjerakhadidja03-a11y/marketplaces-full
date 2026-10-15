<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'user_type' => 'nullable|string|in:guest,customer,supplier',
            'message' => 'required|string|min:10',
        ]);

        $contact = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'user_type' => $validated['user_type'] ?? 'guest',
            'message' => $validated['message'],
            'status' => 'unread',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre message a été bien enregistré. Notre équipe vous répondra sous 24h.',
            'data' => $contact,
        ], 201);
    }
}
