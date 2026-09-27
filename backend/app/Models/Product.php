<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'base_sku', 'slug', 'name', 'eyebrow', 'description', 'status', 'category',
    'needs', 'skin_types', 'preferences', 'textures', 'reasons', 'tone',
    'tone_soft', 'shape', 'featured', 'ai_status', 'ai_goals', 'ai_restrictions',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory, SoftDeletes;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_BLOCKED = 'blocked';

    public const STATUS_ARCHIVED = 'archived';

    /** @return HasMany<ProductVariant, $this> */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('position')->orderBy('id');
    }

    /** @return HasMany<ProductIngredient, $this> */
    public function ingredients(): HasMany
    {
        return $this->hasMany(ProductIngredient::class)->orderBy('id');
    }

    protected function casts(): array
    {
        return [
            'needs' => 'array',
            'skin_types' => 'array',
            'preferences' => 'array',
            'textures' => 'array',
            'reasons' => 'array',
            'featured' => 'boolean',
        ];
    }

    protected function baseSku(): Attribute
    {
        return Attribute::make(set: fn (string $value): string => mb_strtoupper(trim($value)));
    }
}
