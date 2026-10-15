<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'supplier_id',
        'total_amount',
        'status',
        'payment_method',
        'payment_status',
        'risk_level_at_order',
        'shipping_address',
        'phone',
        'return_reason',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function shipment()
    {
        return $this->hasOne(Shipment::class, 'order_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'order_id');
    }

    public function conversation()
    {
        return $this->hasOne(Conversation::class, 'order_id');
    }

    public function suspiciousIncidents()
    {
        return $this->hasMany(SuspiciousIncident::class, 'order_id');
    }
}
