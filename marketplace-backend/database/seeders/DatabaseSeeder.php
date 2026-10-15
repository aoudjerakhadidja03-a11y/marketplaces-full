<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Supplier;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Shipment;
use App\Models\Payment;
use App\Models\ReturnTicket;
use App\Models\Review;
use App\Models\Conversation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->isProduction()) {
            throw new \RuntimeException('Demo data seeding is disabled in production.');
        }

        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Review::query()->delete();
        ReturnTicket::query()->delete();
        Shipment::query()->delete();
        Payment::query()->delete();
        OrderItem::query()->delete();
        Conversation::query()->delete();
        Order::query()->delete();
        Product::query()->delete();
        Category::query()->delete();
        Supplier::query()->delete();
        User::query()->delete();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // 1. Admin User
        $admin = User::create([
            'name' => 'Super Admin Marketplace',
            'email' => 'admin@marketplace.dz',
            'phone' => '0550000000',
            'password_hash' => Hash::make('password123'),
            'role' => 'admin',
            'account_status' => 'active',
            'risk_level' => 'reliable',
        ]);

        // 2. Verified Suppliers
        $userSupp1 = User::create([
            'name' => 'Karim Tech Pro',
            'email' => 'karim@techdz.com',
            'phone' => '0555112233',
            'password_hash' => Hash::make('password123'),
            'role' => 'supplier',
            'account_status' => 'active',
            'risk_level' => 'reliable',
        ]);

        $supp1 = Supplier::create([
            'user_id' => $userSupp1->id,
            'shop_name' => 'Tech DZ Pro (Grossiste High-Tech)',
            'business_category' => 'Grossiste & Distributeur Exclusif',
            'sector' => 'Électronique & High-Tech',
            'address' => 'Boulevard Mohamed V, Alger Centre',
            'website_url' => 'https://techdz-pro.com',
            'company_description' => 'Importateur direct et grossiste certifié d\'équipements électroniques, gadgets high-tech et accessoires informatiques avec garantie constructeur 12 à 24 mois.',
            'max_allowed_return_rate' => 12.00,
            'deposit_percent_for_risky' => 30,
            'verification_status' => 'verified',
            'return_rate' => 2.10,
        ]);

        $userSupp2 = User::create([
            'name' => 'Amel Fashion Atelier',
            'email' => 'contact@amelfashion.dz',
            'phone' => '0666223344',
            'password_hash' => Hash::make('password123'),
            'role' => 'supplier',
            'account_status' => 'active',
            'risk_level' => 'reliable',
        ]);

        $supp2 = Supplier::create([
            'user_id' => $userSupp2->id,
            'shop_name' => 'Amel Fashion & House',
            'business_category' => 'Fabricant Textile Officiel',
            'sector' => 'Vêtements & Accessoires',
            'address' => 'Zone Industrielle Es-Sénia, Oran',
            'website_url' => 'https://amelfashion.dz',
            'company_description' => 'Atelier de confection et création de mode élégante, textile professionnel et maroquinerie haut de gamme.',
            'max_allowed_return_rate' => 15.00,
            'deposit_percent_for_risky' => 25,
            'verification_status' => 'verified',
            'return_rate' => 1.80,
        ]);

        $userSupp3 = User::create([
            'name' => 'Farid Électro Maison',
            'email' => 'farid@maisondz.com',
            'phone' => '0777889900',
            'password_hash' => Hash::make('password123'),
            'role' => 'supplier',
            'account_status' => 'active',
            'risk_level' => 'reliable',
        ]);

        $supp3 = Supplier::create([
            'user_id' => $userSupp3->id,
            'shop_name' => 'Maison DZ Direct',
            'business_category' => 'Distributeur Agréé',
            'sector' => 'Maison & Électroménager',
            'address' => 'Zone Commerciale, Sétif',
            'website_url' => 'https://maisondz-direct.com',
            'company_description' => 'Spécialiste de l\'électroménager moderne, petit ménager et articles de décoration avec service après-vente sur 58 Wilayas.',
            'max_allowed_return_rate' => 10.00,
            'deposit_percent_for_risky' => 35,
            'verification_status' => 'verified',
            'return_rate' => 3.20,
        ]);

        // Pending Supplier for Admin Approval Testing
        $userSuppPending = User::create([
            'name' => 'Oussama Outillage',
            'email' => 'oussama@protools.dz',
            'phone' => '0559998877',
            'password_hash' => Hash::make('password123'),
            'role' => 'supplier',
            'account_status' => 'pending',
            'risk_level' => 'reliable',
        ]);

        Supplier::create([
            'user_id' => $userSuppPending->id,
            'shop_name' => 'Pro Tools Algérie',
            'business_category' => 'Importateur Outillage Pro',
            'sector' => 'Outillage & BTP',
            'address' => 'Blida, Algérie',
            'website_url' => 'https://protools-dz.com',
            'company_description' => 'Fournisseur d\'outillage professionnel et équipements industriels.',
            'max_allowed_return_rate' => 12.00,
            'deposit_percent_for_risky' => 30,
            'verification_status' => 'pending',
            'return_rate' => 0.00,
        ]);

        // 3. Test Customers
        $customer1 = User::create([
            'name' => 'Yacine Client Vérifié',
            'email' => 'yacine@gmail.com',
            'phone' => '0540123456',
            'password_hash' => Hash::make('password123'),
            'role' => 'customer',
            'account_status' => 'active',
            'risk_level' => 'reliable',
        ]);

        $customer2 = User::create([
            'name' => 'Meriem Acheteuse',
            'email' => 'meriem@yahoo.fr',
            'phone' => '0551987654',
            'password_hash' => Hash::make('password123'),
            'role' => 'customer',
            'account_status' => 'active',
            'risk_level' => 'watch',
        ]);

        // 4. Categories
        $catElec = Category::create(['name' => 'Électronique & High-Tech', 'description' => 'Smartphones, Audio, Informatique & Accessoires', 'icon' => 'Cpu']);
        $catFashion = Category::create(['name' => 'Vêtements & Accessoires', 'description' => 'Mode Homme, Femme, Sacs & Chaussures', 'icon' => 'ShoppingBag']);
        $catHome = Category::create(['name' => 'Maison & Électroménager', 'description' => 'Robot Cuisine, Climatisation & Confort', 'icon' => 'Home']);
        $catBeauty = Category::create(['name' => 'Beauté & Cosmétiques', 'description' => 'Soins du Visage, Parfums & Hygiène', 'icon' => 'Sparkles']);
        $catTools = Category::create(['name' => 'Outillage & Matériel Pro', 'description' => 'Outillage Électroportatif & Équipements', 'icon' => 'Wrench']);

        // 5. Products with Rich Technical Datasheets (specifications)
        $p1 = Product::create([
            'supplier_id' => $supp1->id,
            'category_id' => $catElec->id,
            'name' => 'Écouteurs Sans Fil Bluetooth Pro 5 - Réduction Active du Bruit',
            'description' => 'Écouteurs intra-auriculaires Bluetooth 5.3 avec système hybride ANC (Active Noise Cancellation). Autonomie exceptionnelle de 28h avec le boîtier de charge rapide USB-C. Certifiés étanches IPX5.',
            'price' => 4800.00,
            'stock' => 45,
            'image_url' => 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&q=80',
            'status' => 'active',
            'return_risk_score' => 'low',
            'specifications' => [
                'Marque' => 'SoundPro DZ',
                'Connectivité' => 'Bluetooth 5.3',
                'Autonomie' => '28 heures (avec boîtier)',
                'Garantie' => '12 Mois pièces et main d\'œuvre',
                'Origine' => 'Importation officielle certifiée CE',
                'Contenu du coffret' => '2 Écouteurs, 1 Boîtier de charge, 3 Tailles d\'embouts silicone (S/M/L), 1 Câble Type-C',
                'Guide Anti-Retour' => 'Vérifiez la compatibilité Bluetooth de votre appareil. Embouts ajustables fournis pour éviter le risque d\'incompatibilité auriculaire.',
            ],
        ]);

        $p2 = Product::create([
            'supplier_id' => $supp1->id,
            'category_id' => $catElec->id,
            'name' => 'Montre Connectée Sport Waterproof AMOLED 1.43"',
            'description' => 'Cadran en alu brossé, suivi cardiaque continu, mesure SpO2, GPS intégré ultra précis et plus de 100 modes sportifs. Écran tactile HD lisible en plein soleil.',
            'price' => 9500.00,
            'stock' => 22,
            'image_url' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80',
            'status' => 'active',
            'return_risk_score' => 'low',
            'specifications' => [
                'Marque' => 'FitTech Pro',
                'Écran' => 'AMOLED 1.43 pouces (466x466 px)',
                'Résistance à l\'eau' => '5 ATM (50 mètres)',
                'Compatibilité' => 'Android 6.0+ et iOS 11.0+',
                'Autonomie' => '14 jours en usage normal',
                'Garantie' => '12 Mois',
                'Guide Anti-Retour' => 'Téléchargez l\'application FitTech officielle sur le Play Store / App Store avant la première synchronisation.',
            ],
        ]);

        $p3 = Product::create([
            'supplier_id' => $supp1->id,
            'category_id' => $catElec->id,
            'name' => 'Chargeur Ultra Rapide GaN 65W Triple Port (2x USB-C + 1x USB-A)',
            'description' => 'Technologie au Gallium (GaN III) réduisant l\'échauffement de 40%. Permet de recharger simultanément un PC portable (MacBook/Windows) et 2 smartphones.',
            'price' => 3600.00,
            'stock' => 60,
            'image_url' => 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=700&q=80',
            'status' => 'active',
            'return_risk_score' => 'low',
            'specifications' => [
                'Marque' => 'PowerVolt',
                'Puissance Max' => '65 Watts',
                'Protocole Supported' => 'Power Delivery 3.0, Quick Charge 4.0+',
                'Protection' => 'Anti-surchauffe, anti-court-circuit et surtension',
                'Garantie' => '24 Mois',
            ],
        ]);

        $p4 = Product::create([
            'supplier_id' => $supp2->id,
            'category_id' => $catFashion->id,
            'name' => 'Sac à Main Cuir Véritable Artisanat de Luxe',
            'description' => 'Confectionné en cuir de veau pleine fleur par des artisans maroquiniers. Bandoulière ajustable en cuir, fermoir métallique doré et doublure satinée avec poche zippée.',
            'price' => 7200.00,
            'stock' => 15,
            'image_url' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700&q=80',
            'status' => 'active',
            'return_risk_score' => 'low',
            'specifications' => [
                'Marque' => 'Amel Leather House',
                'Matière' => '100% Cuir Véritable Première Qualité',
                'Dimensions' => '28 cm x 20 cm x 10 cm',
                'Couleur' => 'Camel Naturel / Noir Élégant',
                'Fermeture' => 'Fermoir Tourniquet Laiton Doré',
                'Origine' => 'Fabriqué en Algérie',
                'Entretien' => 'Nettoyer avec un baume spécial cuir une fois par mois.',
            ],
        ]);

        $p5 = Product::create([
            'supplier_id' => $supp2->id,
            'category_id' => $catFashion->id,
            'name' => 'Veste Blazer Tailleur Élégante Femme',
            'description' => 'Blazer structuré avec épaulettes légères, col à revers et poches passepoilées. Tissu extensible haut de gamme infroissable idéal pour tenue professionnelle ou soirée.',
            'price' => 7900.00,
            'stock' => 18,
            'image_url' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&q=80',
            'status' => 'active',
            'return_risk_score' => 'medium',
            'specifications' => [
                'Marque' => 'Amel Collection',
                'Tailles Disponibles' => 'S (36), M (38), L (40), XL (42)',
                'Composition' => '65% Polyester, 30% Viscose, 5% Élasthanne',
                'Guide des Tailles' => 'Coupe ajustée. Si vous préférez un porter fluide ou avez une carrure large, choisissez une taille au-dessus.',
                'Guide Anti-Retour' => 'Vérifiez le tableau des mensurations en cm disponible dans la fiche produit avant de valider votre panier.',
            ],
        ]);

        $p6 = Product::create([
            'supplier_id' => $supp3->id,
            'category_id' => $catHome->id,
            'name' => 'Robot Blender Multifonction 1200W Bol Verre Incassable 1.8L',
            'description' => 'Moteur en cuivre pur 1200W, 6 lames en acier inox forgé à 3 niveaux. Idéal pour smoothies, pilage de glace, soupes chaudes et mouture d\'épices.',
            'price' => 11500.00,
            'stock' => 12,
            'image_url' => 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=700&q=80',
            'status' => 'active',
            'return_risk_score' => 'low',
            'specifications' => [
                'Marque' => 'Maison Tech',
                'Puissance' => '1200 Watts (220V - 50Hz)',
                'Capacité du Bol' => '1.8 Litre en verre borosilicaté thermorésistant',
                'Vitesses' => '5 Vitesses variable + Mode Impulsion (Pulse)',
                'Garantie' => '2 Ans pièces de rechange disponibles chez le fournisseur',
            ],
        ]);

        $p7 = Product::create([
            'supplier_id' => $supp3->id,
            'category_id' => $catHome->id,
            'name' => 'Humidificateur d\'Air & Diffuseur d\'Huiles Essentielles Ultra-Silencieux',
            'description' => 'Réservoir 500ml avec autonomie de 12 heures en continu. Éclairage d\'ambiance LED 7 couleurs modifiables, arrêt automatique en cas de bac vide.',
            'price' => 4200.00,
            'stock' => 30,
            'image_url' => 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=700&q=80',
            'status' => 'active',
            'return_risk_score' => 'low',
            'specifications' => [
                'Capacité' => '500 ml',
                'Niveau Sonore' => '< 25 dB (Hyper silencieux pour chambre)',
                'Alimentation' => 'Adaptateur secteur 24V inclus',
                'Télécommande' => 'Fournie avec pile intégrée',
            ],
        ]);

        // 6. Orders & Shipments & Payments
        $o1 = Order::create([
            'user_id' => $customer1->id,
            'supplier_id' => $supp1->id,
            'total_amount' => 14300.00,
            'status' => 'delivered',
            'payment_method' => 'cod',
            'payment_status' => 'paid',
            'risk_level_at_order' => 'reliable',
            'shipping_address' => '14 Rue Larbi Ben M\'hidi, Alger Centre, Alger',
            'phone' => '0540123456',
        ]);

        OrderItem::create(['order_id' => $o1->id, 'product_id' => $p1->id, 'quantity' => 1, 'unit_price' => 4800.00, 'total_price' => 4800.00]);
        OrderItem::create(['order_id' => $o1->id, 'product_id' => $p2->id, 'quantity' => 1, 'unit_price' => 9500.00, 'total_price' => 9500.00]);
        Shipment::create(['order_id' => $o1->id, 'status' => 'delivered', 'customer_confirmation' => 'confirmed']);
        Payment::create(['order_id' => $o1->id, 'payment_method' => 'cod', 'amount' => 14300.00, 'status' => 'completed', 'transaction_reference' => 'TXN-ALG-88912']);

        $o2 = Order::create([
            'user_id' => $customer1->id,
            'supplier_id' => $supp2->id,
            'total_amount' => 7200.00,
            'status' => 'shipped',
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
            'risk_level_at_order' => 'reliable',
            'shipping_address' => '14 Rue Larbi Ben M\'hidi, Alger Centre, Alger',
            'phone' => '0540123456',
        ]);

        OrderItem::create(['order_id' => $o2->id, 'product_id' => $p4->id, 'quantity' => 1, 'unit_price' => 7200.00, 'total_price' => 7200.00]);
        Shipment::create(['order_id' => $o2->id, 'status' => 'shipped', 'customer_confirmation' => 'pending']);

        $o3 = Order::create([
            'user_id' => $customer2->id,
            'supplier_id' => $supp2->id,
            'total_amount' => 7900.00,
            'status' => 'returned',
            'payment_method' => 'cod',
            'payment_status' => 'refunded',
            'risk_level_at_order' => 'watch',
            'shipping_address' => 'Cité les Émirs, Oran Ville, Oran',
            'phone' => '0551987654',
            'return_reason' => 'size_issue: La veste blazer était trop ajustée au niveau de la carrure.',
        ]);

        OrderItem::create(['order_id' => $o3->id, 'product_id' => $p5->id, 'quantity' => 1, 'unit_price' => 7900.00, 'total_price' => 7900.00]);
        Shipment::create(['order_id' => $o3->id, 'status' => 'returned', 'customer_confirmation' => 'pending']);

        ReturnTicket::create([
            'ticket_number' => 'RET-774812-20260901',
            'order_id' => $o3->id,
            'customer_id' => $customer2->id,
            'supplier_id' => $supp2->id,
            'product_id' => $p5->id,
            'reason_category' => 'size_issue',
            'reason_details' => 'La veste blazer était trop ajustée au niveau de la carrure.',
            'status' => 'approved',
            'refund_amount' => 7900.00,
            'ai_risk_score' => 18,
            'ai_prevention_advice' => 'Conseil IA : Mettez en avant le guide des mensurations en cm sur cette fiche produit et activez la confirmation interactive de la taille avant la validation du panier.',
        ]);

        Review::create(['order_id' => $o1->id, 'product_id' => $p1->id, 'customer_id' => $customer1->id, 'rating' => 5, 'comment' => 'Excellente qualité sonore, la réduction de bruit active fonctionne très bien même dans le bus. Livré en 48h à Alger !']);
        Review::create(['order_id' => $o1->id, 'product_id' => $p2->id, 'customer_id' => $customer1->id, 'rating' => 5, 'comment' => 'Montre très classe, l\'écran AMOLED est magnifique et la batterie tient 12 jours sans problème.']);

        Conversation::create(['order_id' => $o1->id, 'customer_id' => $customer1->id, 'supplier_id' => $supp1->id]);
        Conversation::create(['order_id' => $o2->id, 'customer_id' => $customer1->id, 'supplier_id' => $supp2->id]);
    }
}
