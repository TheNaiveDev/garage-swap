import { RiCamera2Fill, RiCamera3Fill, RiCamera4Fill, RiCamera4Line, RiCameraAi2Fill, RiCameraLensAiFill, RiCameraLine, RiCameraSwitchFill, RiCommunityFill, RiHand, RiLeafFill, RiMessage2Fill, RiMessage3Fill, RiMessageAi3Fill, RiMessageFill, RiPhoneCameraFill, RiProfileFill, RiShakeHandsFill, RiSparkling2Fill, RiTeamFill, RiText } from "@remixicon/react";

export default function HowItWorks(){
return(
    <main className="flex-1">
        <section className="px-6 md:px-20 lg:px-40 py-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl mt-12">
                <h1 className="text-slate-900 text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6">
                    Giving local items a <span className="text-(--primary)">second life.</span>
                </h1>
                <p className="text-(--text-shade) text-lg md:text-xl font-normal max-w-xl leading-relaxed">
                    GarageSwap is your neighborhood's digital garage sale. Swap, sell, or give away items to people living right next door
                </p>
                <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
                    <button className="bg-(--primary) text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:bg-(--primary/10) transition-all">Start Browsing</button>
                    <button className="bg-(--primary/10) text-(--primary) px-8 py-4 rounded-xl font-bold text-lg hover:bg-(--primary) hover:text-white transition-all border border-(--primary/10)">List an item</button>
                </div>
            </div>
            <div className="w-full lg:w-1/2 aspect-video rounded-3xl overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800">
                <img src="/children-book-set.jpg"/>
            </div>
        </section>

        {/**next section */}
        <section className="px-6 md:px-20 lg:px-40 py-20 bg-white">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                    Three easy steps to swap
                </h2>
                <div className="bg-(--primary) w-20 h-1.5 mx-auto mt-5 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                <div className="absolute top-1/6 md:block left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-(--primary) z-0"></div>
                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="bg-(--primary-shaded) text-(--primary) rounded-2xl size-20 flex items-center justify-center mb-6 group-hover:bg-(--primary) group-hover:text-white transition-all duration-300">
                        {/**camera svg goes in here */}
                        <RiCamera2Fill className="h-10 w-10"/>
                    </div>
                    <span className="text-(--primary) uppercase font-bold text-sm tracking-widest">step 1</span>
                    <h3 className="text-xl font-bold mt-1 text-slate-900">List Your Item</h3>
                    <p className="text-(--text-shade) tracking-wide">Take a few clear photos, add a description, and choose if you want to sell, start a bid, or give it away for free.</p>
                </div>
            

            <div className="flex flex-col items-center text-center relative z-10">
                    <div className="bg-(--primary-shaded) text-(--primary) rounded-2xl size-20 flex items-center justify-center mb-6 group-hover:bg-(--primary) group-hover:text-white transition-all duration-300">
                        {/**camera svg goes in here */}
                        <RiMessageFill className="h-10 w-10"/>
                    </div>
                    <span className="text-(--primary) uppercase font-bold text-sm tracking-widest">step 2</span>
                    <h3 className="text-xl font-bold mt-1 text-slate-900">Connect Locally</h3>
                    <p className="text-(--text-shade) tracking-wide">Chat securely with interested neighbors. Arrange a convenient time and safe public place for the hand-off.</p>
                </div>

                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="bg-(--primary-shaded) text-(--primary) rounded-2xl size-20 flex items-center justify-center mb-6 group-hover:bg-(--primary) group-hover:text-white transition-all duration-300">
                        {/**camera svg goes in here */}
                        <RiShakeHandsFill className="h-10 w-10"/>
                    </div>
                    <span className="text-(--primary) uppercase font-bold text-sm tracking-widest">step 3</span>
                    <h3 className="text-xl font-bold mt-1 text-slate-900">Complete the swap</h3>
                    <p className="text-(--text-shade) tracking-wide">Meet up, exchange items, and enjoy your new find! Leave a review to help keep the community safe and friendly.</p>
                </div>

                </div>
        </section>
        <section className="px-6 md:px-20 lg:px-40 py-24">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                <h2 className="leading-tight text-4xl font-bold mb-8">Why chose<br/><span className="text-(--primary) text-4xl">GarageSwap?</span></h2>
                <div className="space-y-8">
                    <div className="flex gap-6">
                        <div className="flex shrink-0 size-12 bg-(--primary-shaded) text-(--primary) rounded-full items-center justify-center">
                            <RiTeamFill/>
                        </div>
                        <div>
                            <h4 className="text-slate-900 text-lg font-bold">Community Focused</h4>
                            <p className="text-(--text-shade)">Build stronger bonds by trading with people right in your neighborhood. It's safer and more personal.</p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex shrink-0 size-12 bg-(--primary-shaded) text-(--primary) rounded-full items-center justify-center">
                            <RiLeafFill/>
                        </div>
                        <div>
                            <h4 className="text-slate-900 text-lg font-bold">Sustainable Living</h4>
                            <p className="text-(--text-shade)">Reduce landfill waste and lower carbon footprints by giving quality items a second life locally.</p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex shrink-0 size-12 bg-(--primary-shaded) text-(--primary) rounded-full items-center justify-center">
                            <RiSparkling2Fill/>
                        </div>
                        <div>
                            <h4 className="text-slate-900 text-lg font-bold">Pure Simplicity</h4>
                            <p className="text-(--text-shade)">Our platform is designed to be intuitive and fast, making decluttering or treasure hunting effortless.</p>
                        </div>
                    </div>

                </div>
                </div>

                <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                    <div className="rounded-2xl overflow-hidden aspect-4/5 shadow-lg bg-slate-300">
                    <img src="children-book-set.jpg" className="w-full object-cover h-full"/>
                    </div>

                    <div className="rounded-2xl overflow-hidden aspect-square shadow-lg bg-slate-300">
                    <img src="mid-century-lamp.jpg" className="w-full object-cover h-full"/>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-2xl overflow-hidden aspect-square shadow-lg bg-slate-300">
                        <img src="mid-century-lamp.jpg" className="w-full object-cover h-full"/>
                    </div>

                     <div className="rounded-2xl overflow-hidden aspect-4/5 shadow-lg bg-slate-300">
                        <img src="children-book-set.jpg" className="w-full object-cover h-full"/>
                    </div>
                </div>
                </div>
            </div>
        </section>

        <section className="px-6 md:px-20 lg:px-40 py-20">
            <div className="bg-(--primary) rounded-4xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-(--primary-shaded)">
                <div className="absolute inset-0 opacity-10 pointer-events-none"></div>
                <h2 className="text-4xl md:text-5xl font-black text-white relative z-10 mb-6">
                    Ready to swap in your hood?
                </h2>
                <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10">
                    Join thousands of neighbors already making their communities more sustainable and connected.
                </p>
                <button className="bg-white text-(--primary) px-10 py-5 rounded-xl z-10 relative font-bold shadow-xl hover:bg-slate-100 text-xl md:text-xl transition-all">Get started for free</button>
            </div>
        </section>
    </main>

)
}