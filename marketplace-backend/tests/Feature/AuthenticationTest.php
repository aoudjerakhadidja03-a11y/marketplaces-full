<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_register_login_and_fetch_their_profile(): void
    {
        $this->postJson('/api/v1/register', [
            'name' => 'Test Customer',
            'email' => 'customer@example.test',
            'phone' => '0550000001',
            'password' => 'secure-password',
            'role' => 'customer',
        ])->assertCreated()
            ->assertJsonPath('user.email', 'customer@example.test')
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email']]);

        $login = $this->postJson('/api/v1/login', [
            'email' => 'customer@example.test',
            'password' => 'secure-password',
        ])->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email']]);

        $this->withToken($login->json('token'))
            ->getJson('/api/v1/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'customer@example.test');
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        $this->postJson('/api/v1/login', [
            'email' => 'missing@example.test',
            'password' => 'wrong-password',
        ])->assertUnauthorized();
    }

    public function test_unintegrated_online_payments_are_rejected_without_creating_orders(): void
    {
        $customer = User::create([
            'name' => 'Test Customer',
            'email' => 'checkout@example.test',
            'phone' => '0550000002',
            'password_hash' => Hash::make('secure-password'),
            'role' => 'customer',
            'account_status' => 'active',
            'risk_level' => 'reliable',
        ]);

        $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/orders', [
                'items' => [['product_id' => 999, 'quantity' => 1]],
                'payment_method' => 'online',
                'shipping_address' => 'Alger',
                'phone' => '0550000002',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('payment_method');

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_supplier_can_only_manage_their_own_products(): void
    {
        $owner = $this->createVerifiedSupplier('owner@example.test', 'Owner Shop');
        $otherSupplier = $this->createVerifiedSupplier('other@example.test', 'Other Shop');
        $category = Category::create(['name' => 'Test Category']);
        $product = Product::create([
            'supplier_id' => $owner->supplier->id,
            'category_id' => $category->id,
            'name' => 'Owner Product',
            'description' => 'Product used to test ownership.',
            'price' => 100,
            'stock' => 3,
            'status' => 'active',
        ]);

        $this->actingAs($otherSupplier, 'sanctum')
            ->putJson("/api/v1/supplier/products/{$product->id}", ['name' => 'Tampered Product'])
            ->assertForbidden();

        $this->actingAs($otherSupplier, 'sanctum')
            ->deleteJson("/api/v1/supplier/products/{$product->id}")
            ->assertForbidden();

        $this->actingAs($otherSupplier, 'sanctum')
            ->getJson('/api/v1/supplier/products')
            ->assertOk()
            ->assertJsonCount(0, 'data');

        $this->assertSame('Owner Product', $product->fresh()->name);
    }

    private function createVerifiedSupplier(string $email, string $shopName): User
    {
        $user = User::create([
            'name' => $shopName,
            'email' => $email,
            'phone' => '05' . random_int(10000000, 99999999),
            'password_hash' => Hash::make('secure-password'),
            'role' => 'supplier',
            'account_status' => 'active',
            'risk_level' => 'reliable',
        ]);

        Supplier::create([
            'user_id' => $user->id,
            'shop_name' => $shopName,
            'verification_status' => 'verified',
        ]);

        return $user->load('supplier');
    }
}