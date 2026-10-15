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
            if (!Schema::hasTable('users')) {
                Schema::create('users', function (Blueprint $table) {
                    $table->id();
                    $table->string('name', 100);
                    $table->string('email')->unique();
                    $table->string('phone')->nullable()->unique();
                    $table->string('password_hash');
                    $table->enum('role', ['customer', 'supplier', 'admin'])->default('customer');
                    $table->enum('account_status', ['active', 'pending', 'blocked'])->default('active');
                    $table->enum('risk_level', ['reliable', 'watch', 'high_risk'])->default('reliable');
                    $table->rememberToken();
                    $table->timestamps();
                });
            } else {
                Schema::table('users', function (Blueprint $table) {
                    if (!Schema::hasColumn('users', 'password_hash') && Schema::hasColumn('users', 'password')) {
                        $table->renameColumn('password', 'password_hash');
                    } elseif (!Schema::hasColumn('users', 'password_hash')) {
                        $table->string('password_hash')->nullable();
                    }

                    if (!Schema::hasColumn('users', 'phone')) {
                        $table->string('phone')->nullable();
                    }

                    if (!Schema::hasColumn('users', 'role')) {
                        $table->enum('role', ['customer', 'supplier', 'admin'])->default('customer');
                    }

                    if (!Schema::hasColumn('users', 'account_status')) {
                        $table->enum('account_status', ['active', 'pending', 'blocked'])->default('active');
                    }

                    if (!Schema::hasColumn('users', 'risk_level')) {
                        $table->enum('risk_level', ['reliable', 'watch', 'high_risk'])->default('reliable');
                    }
                });
            }
        } catch (\Throwable $e) {
            // Suppress column add errors if already configured in phpMyAdmin
        } finally {
            Schema::enableForeignKeyConstraints();
        }
    }

    public function down(): void {}
};
