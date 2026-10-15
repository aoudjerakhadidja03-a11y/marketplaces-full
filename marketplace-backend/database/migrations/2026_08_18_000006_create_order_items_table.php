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
            if (!Schema::hasTable('order_items')) {
                Schema::create('order_items', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('order_id');
                    $table->unsignedBigInteger('product_id');
                    $table->integer('quantity');
                    $table->decimal('unit_price', 10, 2);
                    $table->decimal('total_price', 10, 2);
                    $table->timestamps();
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
