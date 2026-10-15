<?php

namespace Tests\Feature;

use Database\Seeders\InitialCategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InitialCategorySeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_initial_categories_can_be_seeded_repeatedly_without_duplicates(): void
    {
        $seeder = new InitialCategorySeeder();
        $seeder->run();
        $seeder->run();

        $this->assertDatabaseCount('categories', 5);
    }
}