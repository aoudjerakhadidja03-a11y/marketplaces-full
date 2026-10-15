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
            if (!Schema::hasTable('audit_logs')) {
                Schema::create('audit_logs', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('user_id')->nullable();
                    $table->string('action');
                    $table->string('target_type')->nullable();
                    $table->unsignedBigInteger('target_id')->nullable();
                    $table->json('details')->nullable();
                    $table->string('ip_address', 45)->nullable();
                    $table->timestamp('created_at')->useCurrent();
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
