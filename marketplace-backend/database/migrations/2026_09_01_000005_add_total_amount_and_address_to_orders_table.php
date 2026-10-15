<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'total_amount')) {
                $table->decimal('total_amount', 10, 2)->default(0.00)->after('supplier_id');
            }
            if (!Schema::hasColumn('orders', 'shipping_address')) {
                $table->text('shipping_address')->nullable()->after('risk_level_at_order');
            }
            if (!Schema::hasColumn('orders', 'phone')) {
                $table->string('phone')->nullable()->after('shipping_address');
            }
        });

        // Copy existing values from 'total' to 'total_amount' if 'total' column exists
        if (Schema::hasColumn('orders', 'total') && Schema::hasColumn('orders', 'total_amount')) {
            DB::statement('UPDATE orders SET total_amount = total WHERE total_amount = 0 AND total IS NOT NULL AND total > 0');
        }
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            //
        });
    }
};
