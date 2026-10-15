<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuspiciousIncident extends Model
{
    protected $fillable = [
        'user_id',
        'supplier_id',
        'order_id',
        'incident_type',
        'incident_date',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
