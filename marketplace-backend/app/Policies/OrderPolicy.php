<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isCustomer() && $user->id === $order->user_id) {
            return true;
        }

        if ($user->isSupplier() && $user->supplier && $user->supplier->id === $order->supplier_id) {
            return true;
        }

        return false;
    }

    public function update(User $user, Order $order): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isSupplier() && $user->supplier && $user->supplier->id === $order->supplier_id) {
            return true;
        }

        return false;
    }
}
