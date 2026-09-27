<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['product_variant_id', 'quantity_available', 'low_stock_threshold', 'updated_by'])]
class Inventory extends Model
{
    /** @return BelongsTo<ProductVariant, $this> */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    /** @return BelongsTo<User, $this> */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /** @return HasMany<InventoryMovement, $this> */
    public function movements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class)->latest();
    }

    protected function casts(): array
    {
        return ['quantity_available' => 'integer', 'low_stock_threshold' => 'integer'];
    }
}
