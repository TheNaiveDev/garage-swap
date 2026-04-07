import {
  RiCamera2Fill,
  RiLeafFill,
  RiMessageFill,
  RiShakeHandsFill,
  RiSparkling2Fill,
  RiTeamFill,
} from "@remixicon/react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function HowItWorks() {
  const navigate = useNavigate();
  return (
    <main className="flex-1 font-[Poppins] mt-20 max-lg:mt-10">
      {/* Hero Section */}
      <section className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 py-12 md:py-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        <div className="w-full lg:w-1/2 mt-6 lg:mt-12 text-center lg:text-left">
          <h1 className="text-slate-900 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4 md:mb-6">
            Giving local items a{" "}
            <span className="text-(--primary)">second life.</span>
          </h1>
          <p className="text-(--text-shade) text-base sm:text-lg md:text-xl font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
            GarageSwap is your neighborhood's digital garage sale. Swap, sell,
            or give away items to people living right next door
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
            <button
              className="bg-(--primary) text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-lg hover:bg-(--primary/10) transition-all"
              onClick={() => navigate("/market")}
            >
              Start Browsing
            </button>
            <button
              className="bg-(--primary/10) text-(--primary) px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-(--primary) hover:text-white transition-all border border-(--primary/10)"
              onClick={() => navigate("/market/listings")}
            >
              List an item
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 aspect-video rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800">
          <img
            src="/children-book-set.jpg"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/**next section */}
      <section className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 py-16 md:py-20 bg-white">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">
            Three easy steps to swap
          </h2>
          <div className="bg-(--primary) w-16 md:w-20 h-1.5 mx-auto mt-4 md:mt-5 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative">
          <div className="hidden md:block absolute top-[10%] left-[22%] right-[22%] h-0.5 border-t-2 border-dashed border-(--primary) z-0"></div>
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="bg-(--primary-shaded) text-(--primary) rounded-2xl size-16 md:size-20 flex items-center justify-center mb-4 md:mb-6 transition-all duration-300">
              {/**camera svg goes in here */}
              <RiCamera2Fill className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <span className="text-(--primary) uppercase font-bold text-xs tracking-widest">
              step 1
            </span>
            <h3 className="text-lg md:text-xl font-bold mt-1 text-slate-900">
              List Your Item
            </h3>
            <p className="text-(--text-shade) tracking-wide text-sm sm:text-base leading-relaxed">
              Take a few clear photos, add a description, and choose if you want
              to sell, start a bid, or give it away for free.
            </p>
          </div>

          <div className="flex flex-col items-center text-center relative z-10">
            <div className="bg-(--primary-shaded) text-(--primary) rounded-2xl size-16 md:size-20 flex items-center justify-center mb-4 md:mb-6 transition-all duration-300">
              {/**camera svg goes in here */}
              <RiMessageFill className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <span className="text-(--primary) uppercase font-bold text-xs tracking-widest">
              step 2
            </span>
            <h3 className="text-lg md:text-xl font-bold mt-1 text-slate-900">
              Connect Locally
            </h3>
            <p className="text-(--text-shade) tracking-wide text-sm sm:text-base leading-relaxed">
              Chat securely with interested neighbors. Arrange a convenient time
              and safe public place for the hand-off.
            </p>
          </div>

          <div className="flex flex-col items-center text-center relative z-10">
            <div className="bg-(--primary-shaded) text-(--primary) rounded-2xl size-16 md:size-20 flex items-center justify-center mb-4 md:mb-6 transition-all duration-300">
              {/**camera svg goes in here */}
              <RiShakeHandsFill className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <span className="text-(--primary) uppercase font-bold text-xs tracking-widest">
              step 3
            </span>
            <h3 className="text-lg md:text-xl font-bold mt-1 text-slate-900">
              Complete the swap
            </h3>
            <p className="text-(--text-shade) tracking-wide text-sm sm:text-base leading-relaxed">
              Meet up, exchange items, and enjoy your new find! Leave a review
              to help keep the community safe and friendly.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <h2 className="leading-tight text-3xl sm:text-4xl font-bold mb-6 md:mb-8 text-center lg:text-left">
              Why chose
              <br />
              <span className="text-(--primary) text-3xl sm:text-4xl">
                GarageSwap?
              </span>
            </h2>
            <div className="space-y-6 md:space-y-8">
              <div className="flex gap-4 md:gap-6">
                <div className="flex shrink-0 size-10 md:size-12 bg-(--primary-shaded) text-(--primary) rounded-full items-center justify-center">
                  <RiTeamFill className="h-5 w-5 md:h-auto md:w-auto" />
                </div>
                <div>
                  <h4 className="text-slate-900 text-base md:text-lg font-bold">
                    Community Focused
                  </h4>
                  <p className="text-(--text-shade) text-sm sm:text-base leading-relaxed">
                    Build stronger bonds by trading with people right in your
                    neighborhood. It's safer and more personal.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex shrink-0 size-10 md:size-12 bg-(--primary-shaded) text-(--primary) rounded-full items-center justify-center">
                  <RiLeafFill className="h-5 w-5 md:h-auto md:w-auto" />
                </div>
                <div>
                  <h4 className="text-slate-900 text-base md:text-lg font-bold">
                    Sustainable Living
                  </h4>
                  <p className="text-(--text-shade) text-sm sm:text-base leading-relaxed">
                    Reduce landfill waste and lower carbon footprints by giving
                    quality items a second life locally.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:gap-6">
                <div className="flex shrink-0 size-10 md:size-12 bg-(--primary-shaded) text-(--primary) rounded-full items-center justify-center">
                  <RiSparkling2Fill className="h-5 w-5 md:h-auto md:w-auto" />
                </div>
                <div>
                  <h4 className="text-slate-900 text-base md:text-lg font-bold">
                    Pure Simplicity
                  </h4>
                  <p className="text-(--text-shade) text-sm sm:text-base leading-relaxed">
                    Our platform is designed to be intuitive and fast, making
                    decluttering or treasure hunting effortless.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-3 md:space-y-4 pt-6 md:pt-8">
              <div className="rounded-xl md:rounded-2xl overflow-hidden aspect-4/5 shadow-lg bg-slate-300">
                <img
                  src="children-book-set.jpg"
                  className="w-full object-cover h-full"
                />
              </div>

              <div className="rounded-xl md:rounded-2xl overflow-hidden aspect-square shadow-lg bg-slate-300">
                <img
                  src="mid-century-lamp.jpg"
                  className="w-full object-cover h-full"
                />
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="rounded-xl md:rounded-2xl overflow-hidden aspect-square shadow-lg bg-slate-300">
                <img
                  src="mid-century-lamp.jpg"
                  className="w-full object-cover h-full"
                />
              </div>

              <div className="rounded-xl md:rounded-2xl overflow-hidden aspect-4/5 shadow-lg bg-slate-300">
                <img
                  src="children-book-set.jpg"
                  className="w-full object-cover h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 py-16 md:py-20">
        <div className="bg-(--primary) rounded-3xl md:rounded-4xl p-8 sm:p-12 md:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-(--primary-shaded)">
          <div className="absolute inset-0 opacity-10 pointer-events-none"></div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white relative z-10 mb-4 md:mb-6">
            Ready to swap in your hood?
          </h2>
          <p className="text-white text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 md:mb-10 relative z-10">
            Join thousands of neighbors already making their communities more
            sustainable and connected.
          </p>
          <button className="bg-white text-(--primary) px-8 sm:px-10 py-4 sm:py-5 rounded-xl z-10 relative font-bold shadow-xl hover:bg-slate-100 text-lg sm:text-xl transition-all">
            Get started for free
          </button>
        </div>
      </section>
      <Footer />
    </main>
  );
}
