<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'users';
    public $timestamps = true;
    protected $hidden = ['password_hash', 'remember_token'];

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password_hash',
        'role',
        'account_status',
        'risk_level',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function setPasswordHashAttribute($value)
    {
        if (!empty($value) && !preg_match('/^\$2[ayb]\$/', $value)) {
            $this->attributes['password_hash'] = \Illuminate\Support\Facades\Hash::make($value);
        } else {
            $this->attributes['password_hash'] = $value;
        }
    }

    public function setPasswordAttribute($value)
    {
        $this->setPasswordHashAttribute($value);
    }

    public function verifyPassword(string $plainPassword): bool
    {
        $hash = $this->password_hash;
        if (empty($hash)) {
            return false;
        }

        // If it's a valid Bcrypt hash
        if (preg_match('/^\$2[ayb]\$/', $hash)) {
            try {
                return \Illuminate\Support\Facades\Hash::check($plainPassword, $hash);
            } catch (\Throwable $e) {
                return false;
            }
        }

        // Fallback for plain-text or legacy hashes: check direct equality and auto-upgrade to Bcrypt
        if ($plainPassword === $hash) {
            $this->password_hash = \Illuminate\Support\Facades\Hash::make($plainPassword);
            $this->save();
            return true;
        }

        return false;
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function isSupplier(): bool
    {
        return $this->role === 'supplier';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function supplier()
    {
        return $this->hasOne(Supplier::class, 'user_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    public function suspiciousIncidents()
    {
        return $this->hasMany(SuspiciousIncident::class, 'user_id');
    }

    public function riskStatus()
    {
        return $this->hasOne(CustomerRiskStatus::class, 'user_id');
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class, 'customer_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'customer_id');
    }
}