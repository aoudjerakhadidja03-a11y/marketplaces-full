<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\ReturnTicket;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ReturnTicketAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_the_order_customer_can_request_a_return(): void
    {
        $customer = $this->createUser('customer', 'customer@example.test');
        $otherCustomer = $this->createUser('customer', 'other@example.test');
        $supplierUser = $this->createUser('supplier', 'supplier@example.test');
        $supplier = Supplier::create([
            'user_id' => $supplierUser->id,
            'shop_name' => 'Test Shop',
            'verification_status' => 'verified',
        ]);
        $order = Order::create([
            'user_id' => $customer->id,
            'supplier_id' => $supplier->id,
            'total_amount' => 1200,
            'status' => 'delivered',
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'risk_level_at_order' => 'reliable',
            'shipping_address' => 'Alger',
            'phone' => '0550000001',
        ]);

        $this->actingAs($otherCustomer, 'sanctum')
            ->postJson('/api/v1/returns', [
                'order_id' => $order->id,
                'reason_category' => 'defective',
                'reason_details' => 'Test access control',
            ])
            ->assertForbidden();
    }

    public function test_only_the_related_supplier_or_admin_can_update_a_return_ticket(): void
    {
        $customer = $this->createUser('customer', 'customer@example.test');
        $supplierUser = $this->createUser('supplier', 'supplier@example.test');
        $otherSupplierUser = $this->createUser('supplier', 'other-supplier@example.test');
        $supplier = Supplier::create([
            'user_id' => $supplierUser->id,
            'shop_name' => 'Test Shop',
            'verification_status' => 'verified',
        ]);
        $otherSupplier = Supplier::create([
            'user_id' => $otherSupplierUser->id,
            'shop_name' => 'Other Shop',
            'verification_status' => 'verified',
        ]);
        $order = Order::create([
            'user_id' => $customer->id,
            'supplier_id' => $supplier->id,
            'total_amount' => 1200,
            'status' => 'returned',
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'risk_level_at_order' => 'reliable',
            'shipping_address' => 'Alger',
            'phone' => '0550000001',
        ]);
        $ticket = ReturnTicket::create([
            'ticket_number' => 'RET-TEST-20261013',
            'order_id' => $order->id,
            'customer_id' => $customer->id,
            'supplier_id' => $supplier->id,
            'reason_category' => 'defective',
            'reason_details' => 'Test access control',
            'status' => 'pending_approval',
            'refund_amount' => 1200,
        ]);

        $this->actingAs($customer, 'sanctum')
            ->putJson("/api/v1/returns/{$ticket->id}/status", ['status' => 'approved'])
            ->assertForbidden();

        $this->actingAs($otherSupplierUser, 'sanctum')
            ->putJson("/api/v1/returns/{$ticket->id}/status", ['status' => 'approved'])
            ->assertForbidden();

        $this->actingAs($supplierUser, 'sanctum')
            ->putJson("/api/v1/returns/{$ticket->id}/status", ['status' => 'approved'])
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $this->assertSame('Other Shop', $otherSupplier->shop_name);
    }

    private function createUser(string $role, string $email): User
    {
        return User::create([
            'name' => ucfirst($role),
            'email' => $email,
            'phone' => '05' . random_int(10000000, 99999999),
            'password_hash' => Hash::make('secure-password'),
            'role' => $role,
            'account_status' => 'active',
            'risk_level' => 'reliable',
        ]);
    }
}