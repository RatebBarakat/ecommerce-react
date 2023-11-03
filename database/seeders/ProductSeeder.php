<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 100; $i++) {
            $product = Product::create([
                "name" => "test" . $i,
                "slug" => "" . $i,
                "small_description" => "small_description description description" . $i,
                "description" => "description description description description" . $i,
                "price" => $i,
                "quantity" => $i,
                "category_id" => random_int(1,100),
            ]);

            $product->tags()->sync([rand(1,10),rand(11,21)]);
        }
    }
}
