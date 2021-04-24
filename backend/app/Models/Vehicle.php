<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;    

    protected $guarded = ['id'];
    
    public function vehicle_photos() 
    {
        return $this->hasMany('App\Models\Vehicle_photos', 'vehicle_id', 'id')->orderBy('order', 'ASC');
    }
}
