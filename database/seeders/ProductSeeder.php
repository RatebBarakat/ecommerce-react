<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $tags = [];
        for ($i=0; $i < rand(1,10); $i++) { 
            $tags[] = random_int(1,90);
        }
        for ($i = 0; $i < 1000; $i++) {
            $product = Product::create([
                "name" => "test" . $i,
                "slug" => "" . $i,
                "small_description" => $faker->sentence(10),
                "description" => $faker->sentence(50),
                "price" => $i,
                "quantity" => $i,
                "category_id" => random_int(1,99),
            ]);

            $product->tags()->sync($tags);
        }
    }
}
