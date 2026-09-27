<?php

namespace App\Models;

use Database\Factories\ProductIngredientFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['product_id', 'name', 'concentration', 'source', 'review_status', 'is_allergen'])]
class ProductIngredient extends Model
{
    /** @use HasFactory<ProductIngredientFactory> */
    use HasFactory;

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    protected function casts(): array
    {
        return ['is_allergen' => 'boolean'];
    }
}
