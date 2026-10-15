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
            if (!Schema::hasTable('messages')) {
                Schema::create('messages', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('conversation_id');
                    $table->unsignedBigInteger('sender_id');
                    $table->text('body');
                    $table->timestamp('read_at')->nullable();
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
