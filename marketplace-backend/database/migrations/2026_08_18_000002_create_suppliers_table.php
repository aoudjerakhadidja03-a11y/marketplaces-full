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
            if (!Schema::hasTable('suppliers')) {
                Schema::create('suppliers', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('user_id');
                    $table->string('shop_name');
                    $table->string('sector')->nullable();
                    $table->string('address')->nullable();
                    $table->string('website_url')->nullable();
                    $table->enum('verification_status', ['pending', 'verified', 'rejected'])->default('pending');
                    $table->decimal('return_rate', 5, 2)->default(0.00);
                    $table->timestamps();
                });
            } else {
                Schema::table('suppliers', function (Blueprint $table) {
                    if (!Schema::hasColumn('suppliers', 'website_url')) {
                        $table->string('website_url')->nullable();
                    }
                    if (!Schema::hasColumn('suppliers', 'verification_status')) {
                        $table->enum('verification_status', ['pending', 'verified', 'rejected'])->default('pending');
                    }
                    if (!Schema::hasColumn('suppliers', 'return_rate')) {
                        $table->decimal('return_rate', 5, 2)->default(0.00);
                    }
                });
            }
        } catch (\Throwable $e) {
            // Ignore alter table issues
        } finally {
            Schema::enableForeignKeyConstraints();
        }
    }

    public function down(): void {}
};
