<?php

use App\Http\Controllers\api\VehiclesController;
use App\Http\Controllers\webservice\WebServiceController;
use Illuminate\Support\Facades\Route;

Route::apiResources([
    'vehicles' => VehiclesController::class
]);

Route::group(['prefix' => 'webservice'], function() {
    Route::post('cep', [WebServiceController::class, 'cep']);
});