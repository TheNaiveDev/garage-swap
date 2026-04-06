import { useEffect, useState, useRef } from "react";
import {
  RiAddCircleFill,
  RiDeleteBinLine,
  RiEditLine,
  RiImageLine,
  RiLoader4Line,
  RiCloseLine,
  RiUploadCloud2Line,
} from "@remixicon/react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: string;
  condition: string;
  listing_type: string;
  status: string;
  location: string;
  image_urls: string[];
  created_at: string;
};

const TABS = ["all", "active", "sold", "draft"];
const CATEGORIES = [
  "Tools",
  "Furniture",
  "Electronics",
  "Garden",
  "Sports",
  "Clothing",
  "Books",
  "Other",
];

const CONDITIONS = [
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

const conditionLabel: Record<string, string> = {
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
};

const statusColor: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-100 text-slate-500",
  sold: "bg-red-100 text-red-500",
};

export default function Listings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  // Phone number check
  const [hasPhone, setHasPhone] = useState<boolean | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Delete
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit modal
  const [editListing, setEditListing] = useState<Listing | null>(null);
  const [editForm, setEditForm] = useState<Partial<Listing>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // New images for edit
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchListings();
    checkUserProfile();
  }, [activeTab]);

  const checkUserProfile = async () => {
    setProfileLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setHasPhone(false);
      setProfileLoading(false);
      return;
    }

    // FIXED: Using user_id to match your profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("phone")
      .eq("user_id", user.id)
      .single();

    setHasPhone(!!profile?.phone?.trim());
    setProfileLoading(false);
  };

  const fetchListings = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    let query = supabase
      .from("listings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (activeTab !== "all") {
      query = query.eq("status", activeTab);
    }

    const { data } = await query;

    const parsed = (data || []).map((item) => ({
      ...item,
      image_urls:
        typeof item.image_urls === "string"
          ? JSON.parse(item.image_urls)
          : (item.image_urls ?? []),
    }));

    setListings(parsed);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    await supabase.from("listings").delete().eq("id", id);
    setListings((prev) => prev.filter((l) => l.id !== id));
    setConfirmDeleteId(null);
    setDeleting(false);
  };

  const openEdit = (listing: Listing) => {
    setEditListing(listing);
    setEditForm({ ...listing });
    setExistingUrls([...(listing.image_urls ?? [])]);
    setNewImages([]);
    setNewPreviews([]);
    setEditError(null);
  };

  const closeEdit = () => {
    setEditListing(null);
    setEditForm({});
    setNewImages([]);
    setNewPreviews([]);
    setEditError(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const total = existingUrls.length + newImages.length;
    const slots = 4 - total;
    if (slots <= 0) return;

    const added = files.slice(0, slots);
    setNewImages((prev) => [...prev, ...added]);
    setNewPreviews((prev) => [
      ...prev,
      ...added.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeExistingImage = (index: number) => {
    setExistingUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditSave = async () => {
    if (!editListing) return;
    setEditError(null);

    if (!editForm.title?.trim()) return setEditError("Title is required.");
    if (!editForm.category) return setEditError("Please select a category.");
    if (!editForm.condition) return setEditError("Please select a condition.");
    if (editForm.listing_type === "fixed" && !editForm.price)
      return setEditError("Please enter a price.");

    setEditSaving(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of newImages) {
        const path = `${editListing.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("listing_images")
          .upload(path, file, { contentType: file.type });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("listing_images")
          .getPublicUrl(path);
        uploadedUrls.push(urlData.publicUrl);
      }

      const finalImageUrls = [...existingUrls, ...uploadedUrls];

      const { error: updateError } = await supabase
        .from("listings")
        .update({
          title: editForm.title?.trim(),
          description: editForm.description?.trim(),
          price:
            editForm.listing_type === "free"
              ? null
              : editForm.price
                ? Number(editForm.price)
                : null,
          category: editForm.category,
          condition: editForm.condition,
          listing_type: editForm.listing_type,
          status: editForm.status,
          location: editForm.location?.trim(),
          image_urls: finalImageUrls,
        })
        .eq("id", editListing.id);

      if (updateError) throw updateError;

      await fetchListings();
      closeEdit();
    } catch (err: any) {
      setEditError(err.message ?? "Something went wrong.");
    } finally {
      setEditSaving(false);
    }
  };

  const formatPrice = (listing: Listing) => {
    if (listing.listing_type === "free") return "Free";
    if (listing.price) return `GH₵${listing.price.toLocaleString()}`;
    return "—";
  };

  const totalImageSlots = existingUrls.length + newImages.length;

  return (
    <>
      <section className="w-full max-w-4xl flex flex-col gap-10 mx-auto px-4 sm:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h2 className="font-[Lora] font-bold text-3xl sm:text-5xl text-slate-700">
              My Listings
            </h2>
            <p className="font-[Poppins] text-lg text-[rgb(69,70,77)] font-light">
              Manage and track your items for sale in the neighborhood exchange.
            </p>
          </div>

          {/* New Listing Button */}
          <div className="flex flex-col items-end gap-2">
            <Link
              to={hasPhone ? "/market/listings/create" : "#"}
              onClick={(e) => {
                if (!hasPhone) {
                  e.preventDefault();
                  alert(
                    "Please add your phone number in your profile before creating a listing.",
                  );
                }
              }}
              className={`flex items-center gap-2 font-[Poppins] text-sm font-medium px-5 py-2.5 rounded-md transition-colors shrink-0 self-start sm:self-auto ${
                hasPhone
                  ? "bg-[#F48C25] text-white hover:bg-[#e07d1a]"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              <RiAddCircleFill size={16} />
              New Listing
            </Link>

            {!hasPhone && !profileLoading && (
              <p className="text-amber-600 text-sm font-[Poppins] text-right max-w-[280px]">
                ⚠️ You must add a phone number to your profile before posting
                listings.
              </p>
            )}
          </div>
        </div>

        <div className="w-full h-0.5 bg-slate-200" />

        {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto -mt-4 border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-[Poppins] font-medium whitespace-nowrap capitalize transition-colors border-b-2 -mb-px
                ${
                  activeTab === tab
                    ? "border-[#F48C25] text-[#F48C25]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <RiLoader4Line size={20} className="animate-spin" />
            <p className="font-[Poppins] text-sm">Loading listings...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <RiImageLine className="text-slate-300" size={48} />
            <p className="font-[Lora] font-bold text-xl text-slate-600">
              No listings yet
            </p>
            <p className="font-[Poppins] text-sm text-slate-400">
              {activeTab === "all"
                ? "You haven't posted anything yet."
                : `No ${activeTab} listings found.`}
            </p>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && listings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col border border-slate-200 rounded-md bg-white shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-150 overflow-hidden"
              >
                <div className="w-full h-44 bg-slate-100 overflow-hidden">
                  {listing.image_urls?.[0] ? (
                    <img
                      src={listing.image_urls[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <RiImageLine size={28} color="#cbd5e1" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 p-5 pt-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-[Lora] font-bold text-slate-700 text-base leading-snug truncate">
                      {listing.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium font-[Poppins] shrink-0 capitalize ${statusColor[listing.status] ?? "bg-slate-100 text-slate-500"}`}
                    >
                      {listing.status}
                    </span>
                  </div>
                  <p className="font-[Poppins] text-xs text-slate-400 capitalize">
                    {listing.category || "No category"} ·{" "}
                    {conditionLabel[listing.condition] ?? listing.condition}
                  </p>
                  <p className="font-[Lora] font-bold text-[#F48C25] text-lg">
                    {formatPrice(listing)}
                  </p>
                  <div className="w-full h-px bg-slate-100" />

                  {confirmDeleteId === listing.id ? (
                    <div className="flex items-center gap-2">
                      <p className="font-[Poppins] text-xs text-slate-500 flex-1">
                        Delete this listing?
                      </p>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        disabled={deleting}
                        className="text-xs font-[Poppins] font-medium bg-red-500 text-white px-3 py-1.5 rounded-sm hover:bg-red-600 transition-colors disabled:opacity-60"
                      >
                        {deleting ? "Deleting..." : "Yes, delete"}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs font-[Poppins] font-medium border border-slate-300 text-slate-600 px-3 py-1.5 rounded-sm hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(listing)}
                        className="flex items-center gap-1 text-xs font-[Poppins] font-medium border border-slate-300 text-slate-600 px-3 py-1.5 rounded-sm hover:bg-slate-50 transition-colors"
                      >
                        <RiEditLine size={13} /> Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(listing.id)}
                        className="flex items-center gap-1 text-xs font-[Poppins] font-medium border border-red-200 text-red-500 px-3 py-1.5 rounded-sm hover:bg-red-50 transition-colors"
                      >
                        <RiDeleteBinLine size={13} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Modal */}
      {editListing && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-6"
          onClick={closeEdit}
        >
          <div
            className="bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="font-[Lora] font-bold text-slate-700 text-lg">
                Edit Listing
              </h3>
              <button
                onClick={closeEdit}
                className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <RiCloseLine size={18} color="#475569" />
              </button>
            </div>

            <div className="flex flex-col gap-5 px-6 py-6">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
                  TITLE
                </label>
                <input
                  name="title"
                  type="text"
                  value={editForm.title ?? ""}
                  onChange={handleEditChange}
                  className="border border-slate-300 rounded-md px-3 py-2 w-full font-[Poppins] text-sm text-slate-700 shadow-xs focus:outline outline-[#F48C25]"
                />
              </div>

              {/* Description, Location, Category, Condition, Type, Price, Status, Images... */}
              {/* (All your original fields are included below) */}

              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
                  DESCRIPTION
                </label>
                <textarea
                  name="description"
                  value={editForm.description ?? ""}
                  onChange={handleEditChange}
                  rows={3}
                  className="border border-slate-300 rounded-md px-3 py-2 w-full font-[Poppins] text-sm text-slate-700 shadow-xs focus:outline outline-[#F48C25] resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
                  LOCATION
                </label>
                <input
                  name="location"
                  type="text"
                  value={editForm.location ?? ""}
                  onChange={handleEditChange}
                  className="border border-slate-300 rounded-md px-3 py-2 w-full font-[Poppins] text-sm text-slate-700 shadow-xs focus:outline outline-[#F48C25]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
                    CATEGORY
                  </label>
                  <select
                    name="category"
                    value={editForm.category ?? ""}
                    onChange={handleEditChange}
                    className="border border-slate-300 rounded-md px-3 py-2 w-full font-[Poppins] text-sm text-slate-700 shadow-xs focus:outline outline-[#F48C25] bg-white"
                  >
                    <option value="">Select</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c.toLowerCase()}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
                    CONDITION
                  </label>
                  <select
                    name="condition"
                    value={editForm.condition ?? ""}
                    onChange={handleEditChange}
                    className="border border-slate-300 rounded-md px-3 py-2 w-full font-[Poppins] text-sm text-slate-700 shadow-xs focus:outline outline-[#F48C25] bg-white"
                  >
                    <option value="">Select</option>
                    {CONDITIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
                    TYPE
                  </label>
                  <div className="flex gap-2">
                    {["fixed", "free"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setEditForm((p) => ({
                            ...p,
                            listing_type: t,
                            price: t === "free" ? null : p.price,
                          }))
                        }
                        className={`flex-1 py-2 rounded-md border text-xs font-[Poppins] capitalize transition-colors ${
                          editForm.listing_type === t
                            ? "bg-[#F48C25] border-[#F48C25] text-white"
                            : "bg-white border-slate-300 text-slate-600 hover:border-[#F48C25]"
                        }`}
                      >
                        {t === "fixed" ? "Fixed" : "Free"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
                    PRICE
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-[Poppins] text-sm text-slate-400">
                      GH₵
                    </span>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      value={editForm.price ?? ""}
                      onChange={handleEditChange}
                      disabled={editForm.listing_type === "free"}
                      className="border border-slate-300 rounded-md pl-10 pr-3 py-2 w-full font-[Poppins] text-sm text-slate-700 shadow-xs focus:outline outline-[#F48C25] disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
                  STATUS
                </label>
                <div className="flex gap-2">
                  {["active", "draft", "sold"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditForm((p) => ({ ...p, status: s }))}
                      className={`flex-1 py-2 rounded-md border text-xs font-[Poppins] capitalize transition-colors ${
                        editForm.status === s
                          ? "bg-[#F48C25] border-[#F48C25] text-white"
                          : "bg-white border-slate-300 text-slate-600 hover:border-[#F48C25]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images Section */}
              <div className="flex flex-col gap-3">
                <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
                  PHOTOS
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {existingUrls.map((url, i) => (
                    <div
                      key={url}
                      className="relative aspect-square rounded-md overflow-hidden border border-slate-200 group"
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 bg-[#F48C25] text-white text-[9px] font-[Poppins] px-1 py-0.5 rounded">
                          Cover
                        </span>
                      )}
                      <button
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <RiCloseLine size={12} color="#475569" />
                      </button>
                    </div>
                  ))}
                  {newPreviews.map((src, i) => (
                    <div
                      key={`new-${i}`}
                      className="relative aspect-square rounded-md overflow-hidden border border-slate-200 group"
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <RiCloseLine size={12} color="#475569" />
                      </button>
                    </div>
                  ))}
                  {totalImageSlots < 4 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-md border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-[#F48C25] transition-colors"
                    >
                      <RiUploadCloud2Line size={18} color="#F48C25" />
                      <span className="text-[9px] font-[Poppins] text-slate-400">
                        Add
                      </span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleNewImages}
                />
              </div>

              {editError && (
                <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3">
                  <p className="font-[Poppins] text-sm text-red-600">
                    {editError}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-slate-200 sticky bottom-0 bg-white">
              <button
                onClick={closeEdit}
                className="flex-1 font-[Poppins] text-sm border border-slate-300 text-slate-600 py-2.5 rounded-md hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={editSaving}
                className="flex-1 font-[Poppins] text-sm font-medium bg-[#F48C25] text-white py-2.5 rounded-md hover:bg-[#e07d1a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {editSaving ? (
                  <>
                    <RiLoader4Line size={15} className="animate-spin" />{" "}
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
