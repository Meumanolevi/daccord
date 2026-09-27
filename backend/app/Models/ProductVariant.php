<?php

namespace App\Models;

use Database\Factories\ProductVariantFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['product_id', 'sku', 'name', 'price_cents', 'active', 'position'])]
class ProductVariant extends Model
{
    /** @use HasFactory<ProductVariantFactory> */
    use HasFactory, SoftDeletes;

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return HasOne<Inventory, $this> */
    public function inventory(): HasOne
    {
        return $this->hasOne(Inventory::class);
    }

    protected function casts(): array
    {
        return ['active' => 'boolean', 'price_cents' => 'integer', 'position' => 'integer'];
    }

    protected function sku(): Attribute
    {
        return Attribute::make(set: fn (string $value): string => mb_strtoupper(trim($value)));
    }
}
