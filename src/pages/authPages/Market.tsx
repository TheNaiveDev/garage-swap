import { useEffect, useState } from "react";
import {
  RiSearchLine,
  RiMapPinLine,
  RiTimeLine,
  RiArrowRightLine,
  RiLoader4Line,
  RiCloseLine,
  RiPhoneLine,
  RiWhatsappLine,
  RiBookmarkLine,
  RiBookmarkFill,
} from "@remixicon/react";
import { supabase } from "../../lib/supabaseClient";

const CATEGORIES = [
  "All",
  "Tools",
  "Furniture",
  "Electronics",
  "Garden",
  "Sports",
  "Clothing",
  "Books",
];

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

interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  listing_type: string;
  status: string;
  image_urls: string[];
  location: string;
  created_at: string;
}

interface SellerProfile {
  username: string;
  phone: string | null;
}

export default function Market() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Modal
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [sellerLoading, setSellerLoading] = useState(false);

  // Bookmarks
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Get current user and saved listings
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data } = await supabase
          .from("saved_listings")
          .select("listing_id")
          .eq("user_id", user.id);
        if (data) setSavedIds(new Set(data.map((r) => r.listing_id)));
      }
    };
    init();
  }, []);

  // Fetch listings with image_urls parsing
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        setError("Failed to load listings. Please try again.");
      } else {
        const parsedListings = (data || []).map((item: any) => ({
          ...item,
          image_urls:
            typeof item.image_urls === "string"
              ? JSON.parse(item.image_urls)
              : (item.image_urls ?? []),
        }));
        setListings(parsedListings);
      }
      setLoading(false);
    };

    fetchListings();
  }, []);

  const openListing = async (item: Listing) => {
    setSelectedListing(item);
    setSeller(null);
    setSellerLoading(true);

    const { data } = await supabase
      .from("profiles")
      .select("username, phone")
      .eq("user_id", item.user_id)
      .single();

    setSeller(data as SellerProfile | null);
    setSellerLoading(false);
  };

  const closeListing = () => {
    setSelectedListing(null);
    setSeller(null);
  };

  const toggleSave = async (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    if (!currentUserId) return;

    setSavingId(listingId);

    if (savedIds.has(listingId)) {
      await supabase
        .from("saved_listings")
        .delete()
        .eq("user_id", currentUserId)
        .eq("listing_id", listingId);
      setSavedIds((prev) => {
        const s = new Set(prev);
        s.delete(listingId);
        return s;
      });
    } else {
      await supabase
        .from("saved_listings")
        .insert({ user_id: currentUserId, listing_id: listingId });
      setSavedIds((prev) => new Set(prev).add(listingId));
    }
    setSavingId(null);
  };

  const filtered = listings.filter((item) => {
    const matchCat =
      activeCategory === "All" ||
      item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const formatPhone = (phone: string) =>
    phone.replace(/\s+/g, "").replace(/^0/, "+233");

  return (
    <>
      <section className="w-full max-w-4xl flex flex-col gap-10 mx-auto px-4 sm:px-8 py-10">
        {/* Header */}
        <div className="self-start w-full sm:w-2/3 flex flex-col gap-4">
          <h2 className="font-[Lora] font-bold text-3xl sm:text-5xl text-slate-700">
            Neighborhood Market
          </h2>
          <p className="font-[Poppins] text-lg text-[rgb(69,70,77)] font-light">
            Discover and trade goods with your neighbors. Every listing is a
            story waiting for a new chapter.
          </p>
        </div>

        <div className="w-full h-0.5 bg-slate-200" />

        {/* Search + Filter */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <RiSearchLine
              className="absolute left-3 top-1/2 -translate-y-1/2"
              color="#94a3b8"
              size={18}
            />
            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-md shadow-xs focus:outline outline-[#F48C25] font-[Poppins] text-slate-700 text-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-[Poppins] text-xs px-4 py-1.5 rounded-full border transition-colors duration-150 cursor-pointer
                  ${
                    activeCategory === cat
                      ? "bg-[#F48C25] border-[#F48C25] text-white"
                      : "bg-white border-slate-300 text-slate-600 hover:border-[#F48C25] hover:text-[#F48C25]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <RiLoader4Line size={20} className="animate-spin" />
            <p className="font-[Poppins] text-sm">Loading listings...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <p className="font-[Lora] font-bold text-xl text-slate-600">
              Something went wrong
            </p>
            <p className="font-[Poppins] text-sm text-slate-400">{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <p className="font-[Poppins] text-sm text-slate-400 -mt-4">
              {filtered.length} listing{filtered.length !== 1 ? "s" : ""} found
            </p>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-center">
                <p className="font-[Lora] font-bold text-xl text-slate-600">
                  No listings found
                </p>
                <p className="font-[Poppins] text-sm text-slate-400">
                  Try a different category or search term.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openListing(item)}
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

                      {currentUserId && (
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
                      )}
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
                              <RiMapPinLine size={12} />
                              {item.location}
                            </span>
                            <span className="text-slate-200">|</span>
                          </>
                        )}
                        <span className="flex items-center gap-1">
                          <RiTimeLine size={12} />
                          {new Date(item.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
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
            )}
          </>
        )}
      </section>

      {/* Modal */}
      {selectedListing && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-6"
          onClick={closeListing}
        >
          <div
            className="bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-56 bg-slate-100 overflow-hidden sm:rounded-t-xl rounded-t-xl">
              {selectedListing.image_urls?.[0] ? (
                <img
                  src={selectedListing.image_urls[0]}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="font-[Poppins] text-xs text-slate-400">
                    No image
                  </p>
                </div>
              )}

              <button
                onClick={closeListing}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <RiCloseLine size={18} color="#475569" />
              </button>

              {currentUserId && (
                <button
                  onClick={(e) => toggleSave(e, selectedListing.id)}
                  disabled={savingId === selectedListing.id}
                  className="absolute top-3 right-12 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
                >
                  {savedIds.has(selectedListing.id) ? (
                    <RiBookmarkFill size={18} color="#F48C25" />
                  ) : (
                    <RiBookmarkLine size={18} color="#94a3b8" />
                  )}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-[Lora] font-bold text-slate-700 text-xl leading-snug">
                  {selectedListing.title}
                </h2>
                <p className="font-[Lora] font-bold text-[#F48C25] text-xl shrink-0">
                  GH₵{parseFloat(selectedListing.price).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedListing.condition && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium font-[Poppins] ${conditionColor[selectedListing.condition] ?? "bg-slate-100 text-slate-500"}`}
                  >
                    {conditionLabel[selectedListing.condition] ??
                      selectedListing.condition}
                  </span>
                )}
                {selectedListing.category && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium font-[Poppins] bg-slate-100 text-slate-600 capitalize">
                    {selectedListing.category}
                  </span>
                )}
                {selectedListing.location && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium font-[Poppins] bg-slate-100 text-slate-600">
                    <RiMapPinLine size={11} />
                    {selectedListing.location}
                  </span>
                )}
              </div>

              <p className="font-[Poppins] text-sm text-[rgb(69,70,77)] font-light leading-relaxed">
                {selectedListing.description}
              </p>

              <div className="w-full h-px bg-slate-200" />

              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-500 font-medium font-[Poppins] tracking-wide">
                  SELLER
                </p>
                {sellerLoading ? (
                  <div className="flex items-center gap-2 text-slate-400">
                    <RiLoader4Line size={16} className="animate-spin" />
                    <span className="font-[Poppins] text-sm">
                      Loading seller info...
                    </span>
                  </div>
                ) : seller ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F48C2520] flex items-center justify-center shrink-0">
                        <span className="font-[Poppins] font-bold text-[#F48C25] text-sm uppercase">
                          {seller.username?.[0] ?? "?"}
                        </span>
                      </div>
                      <p className="font-[Poppins] font-medium text-slate-700 text-sm">
                        {seller.username}
                      </p>
                    </div>

                    {seller.phone ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={`tel:${formatPhone(seller.phone)}`}
                          className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 transition-colors font-[Poppins] text-sm text-slate-700"
                        >
                          <RiPhoneLine size={16} />
                          Call Seller
                        </a>
                        <a
                          href={`https://wa.me/${formatPhone(seller.phone).replace("+", "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-md bg-[#25D366] hover:bg-[#1fbd5a] transition-colors font-[Poppins] text-sm text-white"
                        >
                          <RiWhatsappLine size={16} />
                          WhatsApp
                        </a>
                      </div>
                    ) : (
                      <p className="font-[Poppins] text-sm text-slate-400 italic">
                        Seller hasn't added a phone number yet.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-[Poppins] text-sm text-slate-400">
                    Seller info unavailable.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
