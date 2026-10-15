<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class DeliveryCompany extends Model
{
    protected $table = 'delivery_companies';
    public $timestamps = false;

    public function shipments() { return $this->hasMany(Shipment::class, 'delivery_company_id'); }
}