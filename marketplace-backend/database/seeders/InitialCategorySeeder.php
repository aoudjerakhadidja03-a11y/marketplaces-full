<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class InitialCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Électronique & High-Tech', 'description' => 'Informatique, téléphones et accessoires', 'icon' => 'Cpu'],
            ['name' => 'Vêtements & Accessoires', 'description' => 'Vêtements, chaussures et accessoires', 'icon' => 'ShoppingBag'],
            ['name' => 'Maison & Électroménager', 'description' => 'Équipement et articles pour la maison', 'icon' => 'Home'],
            ['name' => 'Beauté & Cosmétiques', 'description' => 'Soins, beauté et hygiène', 'icon' => 'Sparkles'],
            ['name' => 'Outillage & Matériel Pro', 'description' => 'Outillage et équipements professionnels', 'icon' => 'Wrench'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['name' => $category['name']],
                [
                    'description' => $category['description'],
                    'icon' => $category['icon'],
                ]
            );
        }
    }
}