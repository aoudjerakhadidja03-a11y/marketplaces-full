<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\SuspiciousIncidentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\ReturnAnalyticsController;
use App\Http\Controllers\AiRecommendationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReviewController;

use App\Http\Controllers\ContactController;
use App\Http\Controllers\ReturnTicketController;
use App\Http\Controllers\N8nWebhookController;

/*
|--------------------------------------------------------------------------
| API Routes - Version 1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Public Routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/contact', [ContactController::class, 'store']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);

    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::get('/suppliers/{id}', [SupplierController::class, 'show']);

    // Public Return Tracking Lookup & Real-time Platform Counter
    Route::get('/returns/track/{query}', [ReturnTicketController::class, 'track']);
    Route::get('/returns/counter', [ReturnTicketController::class, 'getCounter']);

    // Authenticated Private Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // Return Tickets & Real-time Return Counter
        Route::get('/returns', [ReturnTicketController::class, 'index']);
        Route::post('/returns', [ReturnTicketController::class, 'store']);
        Route::put('/returns/{id}/status', [ReturnTicketController::class, 'updateStatus']);

        // N8N Webhook Triggers
        Route::post('/n8n/webhook/return-created', [N8nWebhookController::class, 'handleReturnCreated']);
        Route::post('/n8n/webhook/customer-alert', [N8nWebhookController::class, 'handleCustomerAlert']);

        // Orders (Customer & Supplier Access with Policy scoping)
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        // Shipment & Customer Confirmation
        Route::post('/shipments/{id}/confirm', [ShipmentController::class, 'confirm']);

        // Order-Linked Conversations (Chat)
        Route::get('/conversations', [ConversationController::class, 'index']);
        Route::get('/conversations/order/{orderId}', [ConversationController::class, 'showByOrder']);
        Route::post('/conversations/{id}/messages', [ConversationController::class, 'sendMessage']);
        Route::post('/conversations/{id}/read', [ConversationController::class, 'markAsRead']);

        // Verified Product Reviews
        Route::post('/reviews', [ReviewController::class, 'store']);

        // Customer Specific Dashboard
        Route::get('/dashboard/customer', [DashboardController::class, 'customer']);

        // Supplier Specific Portal & Return Prevention Intelligence
        Route::prefix('supplier')->group(function () {
            Route::put('/profile', [SupplierController::class, 'update']);

            Route::get('/products', [ProductController::class, 'supplierIndex']);
            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{id}', [ProductController::class, 'update']);
            Route::delete('/products/{id}', [ProductController::class, 'destroy']);

            Route::get('/dashboard', [DashboardController::class, 'supplier']);

            // Return Prevention Intelligence Endpoints
            Route::get('/analytics/returns', [ReturnAnalyticsController::class, 'supplierAnalytics']);
            Route::get('/alerts', [ReturnAnalyticsController::class, 'supplierAlerts']);
            Route::get('/orders/{id}/risk', [ReturnAnalyticsController::class, 'orderRiskAssessment']);
            Route::get('/ai/recommendations', [AiRecommendationController::class, 'getRecommendations']);

            // Incidents
            Route::post('/incidents', [SuspiciousIncidentController::class, 'store']);
            Route::get('/customers/{userId}/risk', [SuspiciousIncidentController::class, 'riskStatus']);
        });

        // Admin Dedicated Endpoints
        Route::prefix('admin')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'admin']);
            Route::get('/suppliers/pending', [AdminController::class, 'pendingSuppliers']);
            Route::post('/suppliers/{id}/verify', [AdminController::class, 'verifySupplier']);
            Route::get('/users', [AdminController::class, 'users']);
            Route::put('/users/{id}/status', [AdminController::class, 'updateUserStatus']);
            Route::get('/audit-logs', [AdminController::class, 'auditLogs']);

            Route::post('/categories', [CategoryController::class, 'store']);
            Route::put('/categories/{id}', [CategoryController::class, 'update']);
            Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
        });
    });
});