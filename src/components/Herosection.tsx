export default function Hero() {
  return (
    <section className="bg-[#f5f2ec] pt-25 px-8 py-20">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-5">
          <span className="text-xs font-bold tracking-widest uppercase text-orange-500 border border-orange-300 rounded-full px-3 py-1">
            Community First Marketplace
          </span>
          <h1 className="text-5xl font-black text-gray-900 leading-tight">
            Your Neighborhood <br /> Garage Sale,{" "}
            <span className="text-orange-500">Online.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-sm">
            Sell, bid, or give away items you no longer need. Connect with neighbors
            and find hidden gems right next door.
          </p>
          <div className="flex gap-4 pt-2">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3 rounded-lg transition-colors">
              Start Selling
            </button>
            <button className="border-2 border-orange-300 text-gray-900 hover:bg-orange-400 hover:text-white font-bold px-7 py-3 rounded-lg transition-colors">
              Browse Items
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="w-72 h-80 rounded-3xl bg-amber-950 flex items-end justify-center overflow-hidden shadow-xl">
            <span className="text-[9rem] leading-none"></span>
          </div>
        </div>
      </div>
    </section>
  );
}
