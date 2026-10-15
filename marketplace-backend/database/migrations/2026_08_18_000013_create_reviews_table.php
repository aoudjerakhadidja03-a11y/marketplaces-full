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
            if (!Schema::hasTable('reviews')) {
                Schema::create('reviews', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('order_id');
                    $table->unsignedBigInteger('product_id');
                    $table->unsignedBigInteger('customer_id');
                    $table->unsignedTinyInteger('rating');
                    $table->text('comment')->nullable();
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
