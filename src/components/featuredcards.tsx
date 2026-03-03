// src/components/featuredcards.tsx

import type { Item} from "../Types/info";
import ItemCard from "./itemcards";

// Sample data — replace with fetch("/api/items/") when your Django API is ready
const featuredItems: Item[] = [
  { id: 1, title: "Vintage Record Player", price: 120.00, is_free: false, status: "available", badge: "FIXED PRICE", category: { id: 1, name: "Electronics" }, owner: { id: 1, username: "jake99" } },
  { id: 2, title: "Mountain Bike",         price: 250.00, is_free: false, status: "available", badge: "BIDDING",      category: { id: 2, name: "Sports" },      owner: { id: 2, username: "sara_m" } },
  { id: 3, title: "Mid-Century Lamp",      price: 0,      is_free: true,  status: "available", badge: "FREE",         category: { id: 3, name: "Furniture" },   owner: { id: 3, username: "tomk" } },
  { id: 4, title: "Children's Book Set",   price: 15.00,  is_free: false, status: "available", badge: "FIXED PRICE", category: { id: 4, name: "Books" },        owner: { id: 4, username: "mia_r" } },
];

export default function FeaturedCards() {
  return (
    <section className="bg-white px-8 py-16">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Featured Finds</h2>
            <p className="text-gray-400 text-sm mt-1">Handpicked items trending in your local area.</p>
          </div>
          <button className="text-orange-500 font-semibold text-sm hover:underline">View all →</button>
        </div>

        {/* Renders one ItemCard per item */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featuredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
}