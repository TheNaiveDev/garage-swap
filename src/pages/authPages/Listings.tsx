import { useEffect, useState } from "react"
import { RiAddCircleFill, RiDeleteBinLine, RiEditLine, RiImageLine } from "@remixicon/react"
import { Link } from "react-router-dom"
import { supabase } from "../../lib/supabaseClient"

type Listing = {
  id: string
  title: string
  price: number | null
  category: string
  condition: string
  listing_type: string
  status: string
  image_urls: string[]
  created_at: string
}

const TABS = ["all", "active", "sold", "draft"]

export default function Listings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)

  // Fetch listings whenever the active tab changes
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      let query = supabase
        .from("listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (activeTab !== "all") {
        query = query.eq("status", activeTab)
      }

      const { data } = await query

      // Parse image_urls in case it comes back as a string
      const parsed = (data || []).map(item => ({
        ...item,
        image_urls: typeof item.image_urls === "string"
          ? JSON.parse(item.image_urls)
          : item.image_urls ?? []
      }))

      setListings(parsed)
      setLoading(false)
    }

    fetchListings()
  }, [activeTab])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?")
    if (!confirmed) return
    await supabase.from("listings").delete().eq("id", id)
    setListings(prev => prev.filter(l => l.id !== id))
  }

  const formatPrice = (listing: Listing) => {
    if (listing.listing_type === "free") return "Free"
    if (listing.price) return `$${listing.price}`
    return "—"
  }

  const statusColor = (status: string) => {
    if (status === "active") return "bg-green-100 text-green-700"
    if (status === "draft") return "bg-slate-100 text-slate-500"
    if (status === "sold") return "bg-red-100 text-red-500"
    return ""
  }

  return (
    <div className="flex-1 mt-5 px-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">My Listings</h1>
          <p className="text-(--text-shade) text-sm mt-1">Manage and track your items for sale</p>
        </div>
        <Link
          to="/market/listings/create"
          className="bg-(--primary) hover:bg-amber-50 hover:text-(--primary) flex items-center gap-2 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shrink-0"
        >
          <RiAddCircleFill />
          <span className="tracking-wide">Create New Listing</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-(--primary/10) mb-6 gap-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 pb-3 text-sm font-bold whitespace-nowrap capitalize transition-colors ${
              activeTab === tab
                ? "border-(--primary) text-(--primary)"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse h-64" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && listings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <RiImageLine className="text-slate-300 mb-4" size={48} />
          <h3 className="text-2xl font-black tracking-tight text-slate-900">No Items Listed</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            {activeTab === "all"
              ? "You haven't posted anything yet."
              : `No ${activeTab} listings found.`}
          </p>
          <Link
            to="/market/listings/create"
            className="bg-(--primary) text-white font-bold py-2 px-6 rounded-lg text-sm"
          >
            Create your first listing
          </Link>
        </div>
      )}

      {/* Listings grid */}
      {!loading && listings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
          {listings.map(listing => (
            <div
              key={listing.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Cover image */}
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {listing.image_urls?.[0] ? (
                  <img
                    src={listing.image_urls[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <RiImageLine size={32} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                    {listing.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 capitalize ${statusColor(listing.status)}`}>
                    {listing.status}
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-1 capitalize">
                  {listing.category || "No category"} · {listing.condition}
                </p>

                <p className="text-(--primary) font-black mt-2">
                  {formatPrice(listing)}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/market/listings/${listing.id}/edit`}
                    className="flex items-center gap-1 text-xs border border-(--primary)/30 text-(--primary) font-semibold px-3 py-1.5 rounded-lg hover:bg-(--primary)/5 transition-colors"
                  >
                    <RiEditLine size={14} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="flex items-center gap-1 text-xs border border-red-200 text-red-500 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <RiDeleteBinLine size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}