<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupplierController;

/*
|--------------------------------------------------------------------------
| Web Routes & Web Aliases
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return response()->json([
        'status' => 'online',
        'application' => 'CloudMarket DZ Backend API',
        'version' => '1.0.0',
        'message' => 'Backend Laravel 11 fonctionnel.',
        'endpoints' => [
            'products' => url('/api/v1/products'),
            'categories' => url('/api/v1/categories'),
            'suppliers' => url('/api/v1/suppliers'),
        ]
    ]);
});

// Friendly Web aliases to prevent 404 when tested directly in browser address bar
Route::get('/products', [ProductController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/suppliers', [SupplierController::class, 'index']);

Route::get('/test-db', function () {
    try {
        $usersCount = \App\Models\User::count();
        $productsCount = \App\Models\Product::count();
        return response()->json([
            'status' => 'success',
            'message' => 'Connexion à la base de données réussie',
            'users_count' => $usersCount,
            'products_count' => $productsCount,
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});