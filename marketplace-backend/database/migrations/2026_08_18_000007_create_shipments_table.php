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
            if (!Schema::hasTable('shipments')) {
                Schema::create('shipments', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('order_id');
                    $table->string('tracking_number')->nullable();
                    $table->string('delivery_company')->nullable();
                    $table->enum('status', ['pending', 'shipped', 'delivered', 'failed', 'returned'])->default('pending');
                    $table->timestamp('shipped_at')->nullable();
                    $table->timestamp('delivered_at')->nullable();
                    $table->enum('customer_confirmation', ['pending', 'confirmed', 'not_received'])->default('pending');
                    $table->text('notes')->nullable();
                    $table->timestamps();
                });
            } else {
                Schema::table('shipments', function (Blueprint $table) {
                    if (!Schema::hasColumn('shipments', 'customer_confirmation')) {
                        $table->enum('customer_confirmation', ['pending', 'confirmed', 'not_received'])->default('pending');
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
