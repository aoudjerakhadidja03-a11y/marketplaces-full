<?php

namespace App\Policies;

use App\Models\Conversation;
use App\Models\User;

class ConversationPolicy
{
    public function view(User $user, Conversation $conversation): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isCustomer() && $user->id === $conversation->customer_id) {
            return true;
        }

        if ($user->isSupplier() && $user->supplier && $user->supplier->id === $conversation->supplier_id) {
            return true;
        }

        return false;
    }

    public function sendMessage(User $user, Conversation $conversation): bool
    {
        return $this->view($user, $conversation);
    }
}
