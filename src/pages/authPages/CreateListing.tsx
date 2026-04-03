import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabaseClient"
import {
  RiAddCircleFill, RiCamera2Fill, RiImage2Fill, RiPriceTag3Fill,
  RiGame2Fill, RiGiftFill, RiInformationFill, RiLightbulbFill,
  RiShieldCheckFill, RiDraftFill, RiRocketFill, RiCloseLine
} from "@remixicon/react"

export default function CreateListing() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // All the form fields in one state object
  const [form, setForm] = useState({
    title: "",
    category: "",
    condition: "new",
    description: "",
    listing_type: "fixed",
    price: "",
    location: "",
  })

  // Images the user picked, and their preview URLs
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Update any form field when the user types
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // When user picks images, add them to the list (max 10)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const picked = Array.from(e.target.files)
    const combined = [...images, ...picked].slice(0, 10)
    setImages(combined)
    setPreviews(combined.map(f => URL.createObjectURL(f)))
  }

  // Remove a single image from the list
  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    setImages(updated)
    setPreviews(updated.map(f => URL.createObjectURL(f)))
  }

  // Upload all images to Supabase Storage and return their public URLs
  const uploadImages = async (listingId: string): Promise<string[]> => {
    const imageUrls: string[] = []

    for (const image of images) {
      // Each image goes in a folder named after the listing ID
      const filePath = `${listingId}/${Date.now()}-${image.name}`

      // Step 1: Upload the file
      const { error: uploadError } = await supabase.storage
        .from("listing_images")
        .upload(filePath, image)

      if (uploadError) throw uploadError

      // Step 2: Get the public URL to display it later
      const { data } = supabase.storage
        .from("listing_images")
        .getPublicUrl(filePath)

      imageUrls.push(data.publicUrl)
    }

    return imageUrls
  }

  // Called when user hits Publish or Save as Draft
  const handleSubmit = async (isDraft = false) => {
    if (!form.title.trim()) {
      setError("Please add a title for your listing.")
      return
    }

    setLoading(true)
    setError("")

    try {
      // 1. Make sure the user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("You must be logged in to create a listing.")

      // 2. Save the listing to the database (images come after)
      const { data: listing, error: insertError } = await supabase
        .from("listings")
        .insert({
          user_id: user.id,
          title: form.title,
          description: form.description,
          price: form.listing_type === "free" ? null : form.price ? parseFloat(form.price) : null,
          category: form.category,
          condition: form.condition,
          listing_type: form.listing_type,
          location: form.location,
          status: isDraft ? "draft" : "active",
          image_urls: [], // placeholder, we update this after uploading
        })
        .select()
        .single()

      if (insertError) throw insertError

      // 3. Upload images (if any) and save their URLs to the listing
      if (images.length > 0) {
        const imageUrls = await uploadImages(listing.id)
        const { error: updateError } = await supabase
          .from("listings")
          .update({ image_urls: imageUrls })
          .eq("id", listing.id)
        if (updateError) throw updateError
      }

      // 4. Go back to the listings page
      navigate("/market/listings")

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 flex justify-center py-8 px-4 md:px-0">
      <div className="w-full max-w-200 flex flex-col gap-8">

        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-(--primary) text-sm font-semibold uppercase tracking-wider">
            <RiAddCircleFill />
            <span>New Listing</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Sell something awesome</h1>
          <p className="text-slate-600 dark:text-slate-400">Fill out the details below to reach thousands of local swappers.</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 border-none rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">

            {/* ── Photos ── */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <RiImage2Fill className="text-(--primary)" />
                Photos
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Add photo button — hidden once 10 images are picked */}
                {images.length < 10 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-(--primary) flex flex-col items-center justify-center gap-2 bg-(--primary/5) hover:bg-(--primary-shaded) cursor-pointer transition-all"
                  >
                    <RiCamera2Fill className="text-(--primary) animate-pulse" />
                    <span className="text-xs font-medium text-(--primary)">Add photo</span>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Show selected image previews */}
                {previews.map((src, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden relative group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {/* Remove button on hover */}
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <RiCloseLine size={14} />
                    </button>
                    {/* Mark first image as cover */}
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded font-bold">
                        Cover
                      </span>
                    )}
                  </div>
                ))}

                {/* Empty placeholder slots */}
                {Array.from({ length: Math.max(0, 3 - previews.length) }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                ))}
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Upload up to 10 photos. First photo is your cover image.
              </p>
            </div>

            <hr className="border-(--primary)/10" />

            {/* ── Item Details ── */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <RiInformationFill className="text-(--primary)" />
                Item Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Title */}
                <div className="flex flex-col gap-2 col-span-full">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Item Title *</label>
                  <input
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. 1970s Vintage Record Player"
                    className="w-full rounded-lg border border-(--primary)/20 bg-slate-50 dark:bg-slate-800/30 focus:border-(--primary) h-12 px-4 text-slate-900 dark:text-slate-100 outline-none transition-colors"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-(--primary)/20 h-12 px-4 text-slate-900 dark:text-slate-100 outline-none transition-colors"
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="furniture">Furniture</option>
                    <option value="tools">Tools</option>
                    <option value="clothing">Clothing</option>
                    <option value="collectibles">Collectibles</option>
                  </select>
                </div>

                {/* Condition */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Condition</label>
                  <select
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-(--primary)/20 h-12 px-4 text-slate-900 dark:text-slate-100 outline-none transition-colors"
                  >
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor / For Parts</option>
                  </select>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2 col-span-full">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell buyers about the condition, features, and why you're selling it..."
                    className="w-full rounded-lg border border-(--primary)/20 bg-slate-50 dark:bg-slate-800/30 p-4 text-slate-900 dark:text-slate-100 resize-none outline-none transition-colors"
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-2 col-span-full">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                  <input
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Accra, East Legon"
                    className="w-full rounded-lg border border-(--primary)/20 bg-slate-50 dark:bg-slate-800/30 h-12 px-4 text-slate-900 dark:text-slate-100 outline-none transition-colors"
                  />
                </div>

              </div>
            </div>

            <hr className="border-(--primary)/10" />

            {/* ── Listing Type & Price ── */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <RiPriceTag3Fill className="text-(--primary)" />
                Listing Type &amp; Price
              </h3>

              {/* Radio cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "fixed", icon: <RiPriceTag3Fill className="text-(--primary) mb-2 text-xl" />, label: "Fixed Price", sub: "Set a specific price" },
                  { value: "bidding", icon: <RiGame2Fill className="text-(--primary) mb-2 text-xl" />, label: "Bidding", sub: "Let swappers bid" },
                  { value: "free", icon: <RiGiftFill className="text-(--primary) mb-2 text-xl" />, label: "Free", sub: "Give it away" },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-colors ${
                      form.listing_type === opt.value
                        ? "border-(--primary) bg-(--primary)/5"
                        : "border-(--primary)/20 bg-slate-50 dark:bg-slate-800/30 hover:border-(--primary)"
                    }`}
                  >
                    <input
                      type="radio"
                      name="listing_type"
                      value={opt.value}
                      checked={form.listing_type === opt.value}
                      onChange={handleChange}
                      className="absolute right-4 top-4 accent-(--primary)"
                    />
                    {opt.icon}
                    <span className="font-bold text-slate-900 dark:text-slate-100">{opt.label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{opt.sub}</span>
                  </label>
                ))}
              </div>

              {/* Price input — hidden when listing is free */}
              {form.listing_type !== "free" && (
                <div className="flex flex-col gap-2 max-w-xs">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Price / Starting Bid
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-(--primary)/20 bg-slate-50 dark:bg-slate-800/30 h-12 pl-10 pr-4 text-slate-900 dark:text-slate-100 outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer Actions ── */}
            <div className="pt-6 border-t border-(--primary)/10 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
              <button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 rounded-lg border border-(--primary)/30 text-(--primary) font-semibold hover:bg-(--primary)/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RiDraftFill />
                Save as Draft
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 rounded-lg bg-(--primary) text-white font-bold hover:bg-(--primary)/90 shadow-lg shadow-(--primary)/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? "Publishing..." : "Publish Listing"}</span>
                <RiRocketFill />
              </button>
            </div>

          </div>
        </div>

        {/* ── Help Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          <div className="p-6 bg-(--primary)/5 rounded-xl border border-(--primary)/10">
            <h4 className="font-bold text-(--primary) mb-2 flex items-center gap-2">
              <RiLightbulbFill />
              Selling Tip
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Items with clear, natural lighting in their photos sell 3x faster. Try to show the item from multiple angles!
            </p>
          </div>
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <RiShieldCheckFill className="text-slate-600 dark:text-slate-400" />
              Swap Safety
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Always meet in public, well-lit places for exchanges. GarageSwap recommends your local police station's safe swap zone.
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}