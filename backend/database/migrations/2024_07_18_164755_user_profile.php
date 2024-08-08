<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_profile', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_user');
            $table->string('username')->nullable(); 
            $table->string('nama')->nullable();
            $table->string('no_hp',20);
            $table->string('email')->unique();
            $table->string('alamat')->nullable();
            $table->string('tanggal_lahir')->nullable();
            $table->enum('gender', ['laki-laki', 'perempuan'])->nullable();
            $table->timestamps();

            $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
