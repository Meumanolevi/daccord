<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductIngredient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductIngredient>
 */
class ProductIngredientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'name' => fake()->unique()->word(),
            'concentration' => null,
            'source' => 'Ficha técnica',
            'review_status' => 'verified',
            'is_allergen' => false,
        ];
    }
}
