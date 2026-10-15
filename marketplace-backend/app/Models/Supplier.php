<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $fillable = [
        'user_id',
        'shop_name',
        'sector',
        'address',
        'website_url',
        'business_category',
        'company_description',
        'max_allowed_return_rate',
        'require_prepayment_for_risky',
        'disable_cod_for_risky',
        'deposit_percent_for_risky',
        'technical_support_contact',
        'verification_status',
        'return_rate',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'supplier_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'supplier_id');
    }

    public function returnTickets()
    {
        return $this->hasMany(ReturnTicket::class, 'supplier_id');
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class, 'supplier_id');
    }
}
