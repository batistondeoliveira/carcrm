<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Transactions;
use Illuminate\Http\Request;

class TransactionsController extends Controller
{
    public function index()
    {
        $transactions = Transactions::where('user_id', $this->user->id)
            ->orderBy('id', 'DESC')
            ->paginate(env('APP_PAGINATE'));

        return compact('transactions');
    }

    public function show($id)
    {
        $transaction = Transactions::where('user_id', $this->user->id)
            ->where('transaction_id', $id)
            ->first();

        return compact('transaction');
    }
}
