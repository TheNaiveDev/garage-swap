import { useEffect, useState } from "react";
import {
  RiLoader4Line,
  RiMapPinLine,
  RiTimeLine,
  RiArrowRightLine,
  RiBookmarkFill,
  RiBookmarkLine,
} from "@remixicon/react";
import { supabase } from "../../lib/supabaseClient";

interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  status: string;
  image_urls: string[];
  location: string;
  created_at: string;
}

const conditionColor: Record<string, string> = {
  like_new: "bg-emerald-100 text-emerald-700",
  good: "bg-blue-100 text-blue-700",
  fair: "bg-amber-100 text-amber-700",
};

const conditionLabel: Record<string, string> = {
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
};

export default function Favourites() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    setCurrentUserId(user.id);

    // Get saved listing IDs
    const { data: saved } = await supabase
      .from("saved_listings")
      .select("listing_id")
      .eq("user_id", user.id);

    if (!saved || saved.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }

    const ids = saved.map((r) => r.listing_id);
    setSavedIds(new Set(ids));

    // Fetch those listings
    const { data: listingData } = await supabase
      .from("listings")
      .select("*")
      .in("id", ids)
      .eq("status", "active");

    const parsed = (listingData || []).map((item: any) => ({
      ...item,
      image_urls:
        typeof item.image_urls === "string"
          ? JSON.parse(item.image_urls)
          : (item.image_urls ?? []),
    }));

    setListings(parsed);
    setLoading(false);
  };

  const toggleSave = async (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    if (!currentUserId) return;

    setSavingId(listingId);

    await supabase
      .from("saved_listings")
      .delete()
      .eq("user_id", currentUserId)
      .eq("listing_id", listingId);

    // Remove from UI instantly
    setSavedIds((prev) => {
      const s = new Set(prev);
      s.delete(listingId);
      return s;
    });
    setListings((prev) => prev.filter((l) => l.id !== listingId));

    setSavingId(null);
  };

  return (
    <section className="w-full max-w-4xl flex flex-col gap-10 mx-auto px-4 sm:px-8 py-10">
      <div className="self-start w-full sm:w-2/3 flex flex-col gap-4">
        <h2 className="font-[Lora] font-bold text-3xl sm:text-5xl text-slate-700">
          Favourites
        </h2>
        <p className="font-[Poppins] text-lg text-[rgb(69,70,77)] font-light">
          Items you've saved from the market. Unbookmark to remove them.
        </p>
      </div>

      <div className="w-full h-0.5 bg-slate-200" />

      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
          <RiLoader4Line size={20} className="animate-spin" />
          <p className="font-[Poppins] text-sm">Loading favourites...</p>
        </div>
      )}

      {!loading && listings.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <RiBookmarkLine size={36} color="#cbd5e1" />
          <p className="font-[Lora] font-bold text-xl text-slate-600">
            No saved items yet
          </p>
          <p className="font-[Poppins] text-sm text-slate-400">
            Bookmark listings from the Market to see them here.
          </p>
        </div>
      )}

      {!loading && listings.length > 0 && (
        <>
          <p className="font-[Poppins] text-sm text-slate-400 -mt-4">
            {listings.length} saved item{listings.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {listings.map((item) => (
              <div
                key={item.id}
                className="flex flex-col border border-slate-200 rounded-md bg-white shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-150 cursor-pointer group overflow-hidden"
              >
                <div className="relative w-full h-44 overflow-hidden bg-slate-100">
                  {item.image_urls?.[0] ? (
                    <img
                      src={item.image_urls[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="font-[Poppins] text-xs text-slate-400">
                        No image
                      </p>
                    </div>
                  )}

                  <button
                    onClick={(e) => toggleSave(e, item.id)}
                    disabled={savingId === item.id}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    {savedIds.has(item.id) ? (
                      <RiBookmarkFill size={16} color="#F48C25" />
                    ) : (
                      <RiBookmarkLine size={16} color="#94a3b8" />
                    )}
                  </button>
                </div>

                <div className="flex flex-col gap-3 p-5 pt-3">
                  <h3 className="font-[Lora] font-bold text-slate-700 text-base leading-snug group-hover:text-[#F48C25] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-[Poppins] text-sm text-[rgb(69,70,77)] font-light leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-[Poppins] text-slate-400">
                    {item.location && (
                      <>
                        <span className="flex items-center gap-1">
                          <RiMapPinLine size={12} /> {item.location}
                        </span>
                        <span className="text-slate-200">|</span>
                      </>
                    )}
                    <span className="flex items-center gap-1">
                      <RiTimeLine size={12} />
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {item.condition && (
                      <>
                        <span className="text-slate-200">|</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${conditionColor[item.condition] ?? "bg-slate-100 text-slate-500"}`}
                        >
                          {conditionLabel[item.condition] ?? item.condition}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="w-full h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <p className="font-[Lora] font-bold text-slate-700 text-xl">
                      GH₵{parseFloat(item.price).toLocaleString()}
                    </p>
                    <span className="flex items-center gap-1 font-[Poppins] text-xs font-medium text-[#F48C25] border border-[#F48C2550] px-3 py-1.5 rounded-sm">
                      View Listing <RiArrowRightLine size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
