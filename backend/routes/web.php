<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MercadoPagoNotificationController;
use Illuminate\Support\Facades\Route;

Route::get('/thumb/{path}/{img}', [ImageController::class, 'thumb']);
Route::post('/register', [AuthController::class, 'store']);
Route::post('/mercadopago/notification', [MercadoPagoNotificationController::class, 'Notification']);
