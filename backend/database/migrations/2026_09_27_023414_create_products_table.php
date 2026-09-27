<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('base_sku')->unique();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('eyebrow')->nullable();
            $table->text('description');
            $table->string('status', 20)->default('draft')->index();
            $table->string('category')->index();
            $table->json('needs')->nullable();
            $table->json('skin_types')->nullable();
            $table->json('preferences')->nullable();
            $table->json('textures')->nullable();
            $table->json('reasons')->nullable();
            $table->string('tone', 20)->default('#8f3a66');
            $table->string('tone_soft', 20)->default('#ead0dc');
            $table->string('shape', 20)->default('pump');
            $table->boolean('featured')->default(false)->index();
            $table->string('ai_status', 20)->default('review')->index();
            $table->text('ai_goals')->nullable();
            $table->text('ai_restrictions')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'category']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
