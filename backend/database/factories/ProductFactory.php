<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'base_sku' => 'DA-'.fake()->unique()->numerify('#####'),
            'slug' => Str::slug($name).'-'.fake()->unique()->numerify('###'),
            'name' => Str::title($name),
            'eyebrow' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'status' => Product::STATUS_ACTIVE,
            'category' => fake()->randomElement(['serum', 'hidratante', 'limpeza', 'protecao-solar', 'bruma']),
            'needs' => ['hidratacao'],
            'skin_types' => ['mista'],
            'preferences' => ['sem-fragrancia'],
            'textures' => ['leve'],
            'reasons' => [fake()->sentence(3)],
            'tone' => '#8f3a66',
            'tone_soft' => '#ead0dc',
            'shape' => 'pump',
            'featured' => false,
            'ai_status' => 'review',
            'ai_goals' => null,
            'ai_restrictions' => null,
        ];
    }
}
