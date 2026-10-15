<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customer_risk_statuses', function (Blueprint $table) {
            if (!Schema::hasColumn('customer_risk_statuses', 'total_returns_count')) {
                $table->integer('total_returns_count')->default(0);
            }
            if (!Schema::hasColumn('customer_risk_statuses', 'return_rate_percent')) {
                $table->decimal('return_rate_percent', 5, 2)->default(0.00);
            }
            if (!Schema::hasColumn('customer_risk_statuses', 'reliability_tier')) {
                $table->string('reliability_tier')->default('standard');
            }
            if (!Schema::hasColumn('customer_risk_statuses', 'active_payment_restriction')) {
                $table->string('active_payment_restriction')->default('none');
            }
            if (!Schema::hasColumn('customer_risk_statuses', 'restriction_reason')) {
                $table->text('restriction_reason')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('customer_risk_statuses', function (Blueprint $table) {
            //
        });
    }
};
