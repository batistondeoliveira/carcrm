<?php

use App\Http\Controllers\api\uploads\VehicleUploadController;
use App\Http\Controllers\api\VehiclesController;
use App\Http\Controllers\webservice\WebServiceController;
use Illuminate\Support\Facades\Route;

Route::apiResources([
    'vehicles' => VehiclesController::class
]);

Route::prefix('upload')->group(function () {
    Route::resource('vehicle', VehicleUploadController::class)->only(['create', 'update', 'destroy']);
});

Route::get('vehicles/{vehicle_type}/brand', [VehiclesController::class, 'brand']);
Route::get('vehicles/{vehicle_type}/{vehicle_brand}/model', [VehiclesController::class, 'model']);
Route::get('vehicles/{vehicle_brand}/{vehicle_model}/version', [VehiclesController::class, 'version']);

Route::group(['prefix' => 'webservice'], function() {
    Route::post('cep', [WebServiceController::class, 'cep']);
});
