<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
        Schema::create('master_role', function (Blueprint $table) {
            $table->id();
            $table->string('role')->unique();
        });

        // Insert predefined roles
        DB::table('master_role')->insert([
            ['role' => 'investor'],
            ['role' => 'business owner'],
            ['role' => 'komisaris'],
            ['role' => 'direktur'],
            ['role' => 'manager'],
            ['role' => 'supervisor'],
            ['role' => 'staff']
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('master_role');
    }
};
