<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            if (!Schema::hasColumn('suppliers', 'website_url')) {
                $table->string('website_url')->nullable();
            }
            if (!Schema::hasColumn('suppliers', 'business_category')) {
                $table->string('business_category')->default('Grossiste & Distributeur');
            }
            if (!Schema::hasColumn('suppliers', 'company_description')) {
                $table->text('company_description')->nullable();
            }
            if (!Schema::hasColumn('suppliers', 'max_allowed_return_rate')) {
                $table->integer('max_allowed_return_rate')->default(15);
            }
            if (!Schema::hasColumn('suppliers', 'require_prepayment_for_risky')) {
                $table->boolean('require_prepayment_for_risky')->default(true);
            }
            if (!Schema::hasColumn('suppliers', 'disable_cod_for_risky')) {
                $table->boolean('disable_cod_for_risky')->default(true);
            }
            if (!Schema::hasColumn('suppliers', 'deposit_percent_for_risky')) {
                $table->integer('deposit_percent_for_risky')->default(30);
            }
            if (!Schema::hasColumn('suppliers', 'technical_support_contact')) {
                $table->text('technical_support_contact')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            //
        });
    }
};
