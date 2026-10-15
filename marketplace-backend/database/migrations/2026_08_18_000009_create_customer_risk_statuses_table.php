<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        try {
            if (!Schema::hasTable('customer_risk_statuses')) {
                Schema::create('customer_risk_statuses', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('user_id')->unique();
                    $table->integer('nb_incidents_total')->default(0);
                    $table->enum('risk_level', ['reliable', 'watch', 'high_risk'])->default('reliable');
                    $table->timestamp('last_incident_at')->nullable();
                    $table->timestamps();
                });
            } else {
                Schema::table('customer_risk_statuses', function (Blueprint $table) {
                    if (Schema::hasColumn('customer_risk_statuses', 'niveau_risque') && !Schema::hasColumn('customer_risk_statuses', 'risk_level')) {
                        $table->renameColumn('niveau_risque', 'risk_level');
                    } elseif (!Schema::hasColumn('customer_risk_statuses', 'risk_level')) {
                        $table->enum('risk_level', ['reliable', 'watch', 'high_risk'])->default('reliable');
                    }

                    if (!Schema::hasColumn('customer_risk_statuses', 'last_incident_at')) {
                        $table->timestamp('last_incident_at')->nullable();
                    }
                });
            }
        } catch (\Throwable $e) {
            // Ignore
        } finally {
            Schema::enableForeignKeyConstraints();
        }
    }

    public function down(): void {}
};
