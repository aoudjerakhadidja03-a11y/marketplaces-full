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
            if (!Schema::hasTable('products')) {
                Schema::create('products', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('supplier_id');
                    $table->unsignedBigInteger('category_id');
                    $table->string('name');
                    $table->text('description')->nullable();
                    $table->decimal('price', 10, 2);
                    $table->integer('stock')->default(0);
                    $table->string('image_url')->nullable();
                    $table->enum('status', ['active', 'inactive'])->default('active');
                    $table->enum('return_risk_score', ['low', 'medium', 'high'])->default('low');
                    $table->json('specifications')->nullable();
                    $table->timestamps();
                });
            } else {
                Schema::table('products', function (Blueprint $table) {
                    if (!Schema::hasColumn('products', 'image_url')) {
                        $table->string('image_url')->nullable();
                    }
                    if (!Schema::hasColumn('products', 'status')) {
                        $table->enum('status', ['active', 'inactive'])->default('active');
                    }
                    if (!Schema::hasColumn('products', 'return_risk_score')) {
                        $table->enum('return_risk_score', ['low', 'medium', 'high'])->default('low');
                    }
                    if (!Schema::hasColumn('products', 'specifications')) {
                        $table->json('specifications')->nullable();
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
