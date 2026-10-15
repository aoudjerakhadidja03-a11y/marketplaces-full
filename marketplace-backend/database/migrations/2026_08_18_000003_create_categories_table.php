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
            if (!Schema::hasTable('categories')) {
                Schema::create('categories', function (Blueprint $table) {
                    $table->id();
                    $table->string('name', 100)->unique();
                    $table->text('description')->nullable();
                    $table->string('icon')->nullable();
                    $table->timestamps();
                });
            } else {
                Schema::table('categories', function (Blueprint $table) {
                    if (!Schema::hasColumn('categories', 'description')) {
                        $table->text('description')->nullable();
                    }
                    if (!Schema::hasColumn('categories', 'icon')) {
                        $table->string('icon')->nullable();
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
