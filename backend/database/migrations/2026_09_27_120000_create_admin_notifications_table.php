<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_notifications', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
            $table->string('type', 64);
            $table->string('title', 160);
            $table->text('summary');
            $table->string('target_url', 2048);
            $table->string('subject_type', 100)->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->json('data')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['admin_id', 'read_at', 'created_at']);
            $table->index(['subject_type', 'subject_id', 'resolved_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_notifications');
    }
};
