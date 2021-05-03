<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Plans;
use Illuminate\Http\Request;

class PayController extends Controller
{
    public function plans()
    {
        $plans = Plans::all();

        return compact('plans');
    }
}
