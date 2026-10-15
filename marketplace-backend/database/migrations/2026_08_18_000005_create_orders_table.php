<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        try {
            if (!Schema::hasTable('orders')) {
                Schema::create('orders', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('user_id');
                    $table->unsignedBigInteger('supplier_id');
                    $table->decimal('total_amount', 10, 2);
                    $table->enum('status', [
                        'pending',
                        'confirmed',
                        'preparing',
                        'shipped',
                        'delivered',
                        'confirmed_by_customer',
                        'refused',
                        'returned',
                        'cancelled'
                    ])->default('pending');
                    $table->enum('payment_method', ['cod', 'advance', 'online'])->default('cod');
                    $table->enum('payment_status', ['unpaid', 'advance_paid', 'paid', 'refund_pending', 'refunded'])->default('unpaid');
                    $table->enum('risk_level_at_order', ['reliable', 'watch', 'high_risk'])->default('reliable');
                    $table->text('shipping_address');
                    $table->string('phone');
                    $table->text('return_reason')->nullable();
                    $table->timestamps();
                });
            } else {
                Schema::table('orders', function (Blueprint $table) {
                    if (!Schema::hasColumn('orders', 'payment_method')) {
                        $table->enum('payment_method', ['cod', 'advance', 'online'])->default('cod');
                    }
                    if (!Schema::hasColumn('orders', 'payment_status')) {
                        $table->enum('payment_status', ['unpaid', 'advance_paid', 'paid', 'refund_pending', 'refunded'])->default('unpaid');
                    }
                    if (!Schema::hasColumn('orders', 'risk_level_at_order')) {
                        $table->enum('risk_level_at_order', ['reliable', 'watch', 'high_risk'])->default('reliable');
                    }
                    if (!Schema::hasColumn('orders', 'return_reason')) {
                        $table->text('return_reason')->nullable();
                    }
                });
            }
        } catch (\Throwable $e) {
            // Ignore
        } finally {
            Schema::enableForeignKeyConstraints();
        }
    }

    public function down(): void {}
};
