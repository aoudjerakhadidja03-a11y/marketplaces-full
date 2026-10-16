<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    protected $fillable = [
    'order_id',
    'tracking_number',
    'delivery_company_id',
    'delivery_status',
    'shipped_at',
    'delivered_at',
    'customer_confirmation',
    'notes',
];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
