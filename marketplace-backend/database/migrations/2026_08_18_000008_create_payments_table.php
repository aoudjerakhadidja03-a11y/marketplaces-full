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
            if (!Schema::hasTable('payments')) {
                Schema::create('payments', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('order_id');
                    $table->enum('payment_method', ['cod', 'advance', 'online']);
                    $table->decimal('amount', 10, 2);
                    $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
                    $table->string('transaction_reference')->nullable();
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
