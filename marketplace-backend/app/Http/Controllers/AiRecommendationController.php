<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\SuspiciousIncident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AiRecommendationController extends Controller
{
    public function getRecommendations(Request $request)
    {
        $user = $request->user();
        if (!$user->isSupplier() || !$user->supplier) {
            return response()->json(['message' => 'Réservé aux fournisseurs'], 403);
        }

        $supplierId = $user->supplier->id;
        $recommendations = [];

        // 1. High Risk Orders Confirmation Recommendation
        $pendingHighRisk = Order::where('supplier_id', $supplierId)
            ->where('status', 'pending')
            ->where('risk_level_at_order', '!=', 'reliable')
            ->count();

        if ($pendingHighRisk > 0) {
            $recommendations[] = [
                'id' => 'rec_confirm_risk_orders',
                'category' => 'prevention_retours',
                'priority' => 'high',
                'title' => 'Confirmez les adresses avant d\'expédier',
                'explanation' => "Vous avez {$pendingHighRisk} commande(s) en attente provenant de clients identifiés 'à risque' ou 'sous surveillance'.",
                'action_suggested' => 'Envoyez un message de confirmation de disponibilité et d\'adresse via la messagerie interne avant l\'envoi du colis.',
                'impact_expected' => 'Aucun impact chiffré disponible; suivre les refus après cette action.',
            ];
        }

        // 2. Product Description & Image Enrichment Recommendation
        $returnedProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.supplier_id', $supplierId)
            ->whereIn('orders.status', ['refused', 'returned'])
            ->select('products.id', 'products.name')
            ->groupBy('products.id', 'products.name')
            ->having(DB::raw('COUNT(orders.id)'), '>=', 2)
            ->get();

        if ($returnedProducts->count() > 0) {
            $productNames = $returnedProducts->pluck('name')->implode(', ');
            $recommendations[] = [
                'id' => 'rec_enrich_product_details',
                'category' => 'qualite_produit',
                'priority' => 'high',
                'title' => 'Enrichissez la fiche technique et les photos réelles',
                'explanation' => "Les articles suivants connaissent des retours récurrents : {$productNames}.",
                'action_suggested' => 'Ajoutez des photos sous plusieurs angles, indiquez les dimensions exactes, la matière et les instructions d\'utilisation pour clarifier l\'attente client.',
                'impact_expected' => 'Diminution des erreurs de commande et amélioration de la note client.',
            ];
        }

        // 3. Payment Method Optimization Recommendation
        $codIncidents = SuspiciousIncident::where('supplier_id', $supplierId)
            ->where('incident_type', 'package_not_collected')
            ->count();

        if ($codIncidents >= 1) {
            $recommendations[] = [
                'id' => 'rec_require_advance_payment',
                'category' => 'strategie_paiement',
                'priority' => 'medium',
                'title' => 'Analysez les commandes non récupérées',
                'explanation' => "{$codIncidents} colis non récupérés ont été constatés en paiement à la livraison (COD).",
                'action_suggested' => 'Examinez les motifs consignés et confirmez les coordonnées du client avant la prochaine expédition.',
                'impact_expected' => 'Aucun impact chiffré disponible; suivre les refus après cette action.',
            ];
        }

        // 4. Default Marketing Recommendation
        if (count($recommendations) === 0) {
            $recommendations[] = [
                'id' => 'rec_general_performance',
                'category' => 'marketing',
                'priority' => 'low',
                'title' => 'Aucune alerte prioritaire détectée',
                'explanation' => 'Les données enregistrées ne font apparaître aucune alerte selon les règles actuelles.',
                'action_suggested' => 'Maintenez la rapidité d\'expédition et pensez à publier de nouveaux produits dans votre catalogue.',
                'impact_expected' => 'Impact non mesuré.',
            ];
        }

        return response()->json([
            'disclaimer' => 'Conseils basés sur des règles et données enregistrées. Ils ne sont pas générés par un modèle d’intelligence artificielle.',
            'recommendations' => $recommendations,
        ]);
    }
}
