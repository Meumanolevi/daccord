<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            foreach ($this->products() as $item) {
                $variantPayload = $item['variant'];
                unset($item['variant']);

                $product = Product::query()->updateOrCreate(['base_sku' => $item['base_sku']], $item);
                $product->ingredients()->delete();
                $product->ingredients()->createMany([
                    ['name' => 'Fórmula cosmética verificada', 'source' => 'Ficha técnica do fabricante', 'review_status' => 'verified'],
                ]);

                $variant = $product->variants()->updateOrCreate(
                    ['sku' => $variantPayload['sku']],
                    [
                        'name' => $variantPayload['name'],
                        'price_cents' => $variantPayload['price_cents'],
                        'active' => true,
                        'position' => 0,
                    ],
                );
                $variant->inventory()->updateOrCreate(
                    ['product_variant_id' => $variant->id],
                    [
                        'quantity_available' => $variantPayload['quantity_available'],
                        'low_stock_threshold' => 10,
                    ],
                );
            }
        });
    }

    /** @return array<int, array<string, mixed>> */
    private function products(): array
    {
        return [
            $this->product('DA-SER-001', 'iris-01', 'Íris 01', 'Sérum reparador', 'Sérum calmante para uma barreira sensibilizada, com textura leve e acabamento confortável.', 'serum', ['sensibilidade', 'hidratacao', 'barreira'], ['seca', 'mista', 'sensivel'], ['sem-fragrancia', 'vegano'], ['leve'], ['Sem fragrância', 'Barreira + hidratação', 'Textura leve'], '#8f3a66', '#ead0dc', 'dropper', 12990, 28, true),
            $this->product('DA-SER-002', 'calma-02', 'Calma 02', 'Gel-sérum', 'Hidratação aquosa para rotinas que pedem poucas camadas e sensação de frescor.', 'serum', ['sensibilidade', 'hidratacao'], ['oleosa', 'mista', 'sensivel'], ['sem-fragrancia', 'vegano'], ['leve', 'gel'], ['Gel aquoso', 'Sem fragrância', 'Pele sensível'], '#9c6b7b', '#eadde1', 'pump', 14990, 42),
            $this->product('DA-HID-004', 'barreira-04', 'Barreira 04', 'Creme de tratamento', 'Creme nutritivo para reduzir o desconforto de peles secas sem complicar o ritual.', 'hidratante', ['barreira', 'hidratacao', 'sensibilidade'], ['seca', 'sensivel'], ['sem-fragrancia'], ['rica'], ['Nutrição prolongada', 'Barreira fragilizada', 'Sem fragrância'], '#71505f', '#e5d8dd', 'jar', 15990, 8),
            $this->product('DA-LIM-003', 'neutra-03', 'Neutra 03', 'Limpeza facial', 'Gel de limpeza gentil, pensado para remover resíduos sem deixar sensação de repuxamento.', 'limpeza', ['oleosidade', 'sensibilidade'], ['oleosa', 'mista', 'sensivel'], ['sem-fragrancia', 'vegano'], ['gel', 'leve'], ['Limpeza gentil', 'Gel leve', 'Uso diário'], '#8c6571', '#efe0e4', 'pump', 8990, 64),
            $this->product('DA-PRO-005', 'solar-05', 'Solar 05', 'Proteção diária', 'Protetor facial de toque seco e fácil reaplicação para acompanhar todos os dias.', 'protecao-solar', ['protecao', 'oleosidade'], ['seca', 'oleosa', 'mista', 'sensivel'], ['sem-fragrancia'], ['leve'], ['Toque seco', 'Sem fragrância', 'Amplo espectro'], '#b77579', '#f0dcdb', 'tube', 11990, 35),
            $this->product('DA-BRU-006', 'bruma-06', 'Bruma 06', 'Bruma hidratante', 'Uma camada fina de conforto para complementar a rotina sem pesar sobre outros produtos.', 'bruma', ['hidratacao', 'sensibilidade'], ['seca', 'oleosa', 'mista', 'sensivel'], ['vegano'], ['leve'], ['Camada ultraleve', 'Fácil reaplicação', 'Vegano'], '#986778', '#ead9df', 'mist', 7990, 0),
        ];
    }

    /** @return array<string, mixed> */
    private function product(
        string $sku,
        string $slug,
        string $name,
        string $eyebrow,
        string $description,
        string $category,
        array $needs,
        array $skinTypes,
        array $preferences,
        array $textures,
        array $reasons,
        string $tone,
        string $toneSoft,
        string $shape,
        int $priceCents,
        int $quantity,
        bool $featured = false,
    ): array {
        return [
            'base_sku' => $sku,
            'slug' => $slug,
            'name' => $name,
            'eyebrow' => $eyebrow,
            'description' => $description,
            'status' => Product::STATUS_ACTIVE,
            'category' => $category,
            'needs' => $needs,
            'skin_types' => $skinTypes,
            'preferences' => $preferences,
            'textures' => $textures,
            'reasons' => $reasons,
            'tone' => $tone,
            'tone_soft' => $toneSoft,
            'shape' => $shape,
            'featured' => $featured,
            'ai_status' => 'eligible',
            'ai_goals' => implode('; ', $needs),
            'ai_restrictions' => 'Não recomendar em caso de alergia conhecida a qualquer componente.',
            'variant' => [
                'sku' => $sku.'-'.strtoupper(str_replace([' ml', ' g'], '', $shape === 'jar' ? '50 g' : '50 ml')),
                'name' => $shape === 'jar' ? '50 g' : '50 ml',
                'price_cents' => $priceCents,
                'quantity_available' => $quantity,
            ],
        ];
    }
}
