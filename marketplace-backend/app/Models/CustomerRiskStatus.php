<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerRiskStatus extends Model
{
    protected $table = 'customer_risk_statuses';

    protected $fillable = [
        'user_id',
        'nb_incidents_total',
        'risk_level',
        'risk_score',
        'total_returns_count',
        'return_rate_percent',
        'reliability_tier',
        'active_payment_restriction',
        'restriction_reason',
        'last_incident_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
