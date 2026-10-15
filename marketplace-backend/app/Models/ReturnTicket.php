<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'order_id',
        'customer_id',
        'supplier_id',
        'product_id',
        'reason_category',
        'reason_details',
        'status',
        'refund_amount',
        'penalty_applied',
        'payment_restriction_triggered',
        'ai_risk_score',
        'supplier_notes',
        'ai_prevention_advice',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
