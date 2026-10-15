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
            if (!Schema::hasTable('conversations')) {
                Schema::create('conversations', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('order_id');
                    $table->unsignedBigInteger('customer_id');
                    $table->unsignedBigInteger('supplier_id');
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
