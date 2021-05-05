<?php

namespace Database\Seeders;

use App\Models\Plans;
use Illuminate\Database\Seeder;

class PlansV2Seeder extends Seeder
{    
    public function run()
    {
        $plans = [
            [
                'id' => 1,
                'period' => '1'            
            ],
    
            [
                'id' => 2,
                'period' => '6'
            ],
    
            [
                'id' => 3,
                'period' => '12'
            ]
        ];

        foreach($plans as $item) {
            $plan = Plans::find($item['id']);                
            
            if ($plan->id) {
                $plan->period = $item['period'];

                $plan->save();
            }            
        }
    }
}
