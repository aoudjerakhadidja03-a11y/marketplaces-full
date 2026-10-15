<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('return_tickets')) {
            Schema::create('return_tickets', function (Blueprint $table) {
                $table->id();
                $table->string('ticket_number')->unique();
                $table->unsignedBigInteger('order_id');
                $table->unsignedBigInteger('customer_id');
                $table->unsignedBigInteger('supplier_id');
                $table->unsignedBigInteger('product_id')->nullable();
                $table->string('reason_category'); // size_issue, defective, not_as_described, wrong_item, mind_changed, delivery_delay
                $table->text('reason_details');
                $table->string('status')->default('pending_approval'); // pending_approval, approved, in_transit, received, refunded, rejected
                $table->decimal('refund_amount', 10, 2)->default(0.00);
                $table->boolean('penalty_applied')->default(false);
                $table->string('payment_restriction_triggered')->nullable(); // deposit_required, cod_disabled, warning
                $table->integer('ai_risk_score')->default(15);
                $table->text('supplier_notes')->nullable();
                $table->text('ai_prevention_advice')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('return_tickets');
    }
};
