<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
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
            'sku' => 'DA-VAR-'.fake()->unique()->numerify('#####'),
            'name' => fake()->randomElement(['30 ml', '50 ml', '100 ml']),
            'price_cents' => fake()->numberBetween(5000, 25000),
            'active' => true,
            'position' => 0,
        ];
    }
}
