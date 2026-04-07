import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiUploadCloud2Line,
  RiCloseLine,
  RiLoader4Line,
  RiArrowLeftLine,
  RiImageLine,
} from "@remixicon/react";
import { supabase } from "../../lib/supabaseClient";

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
  { value: "new", label: "new" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];
const LISTING_TYPES = [
  { value: "fixed", label: "Fixed Price" },
  { value: "free", label: "Free" },
];

interface FormState {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  listing_type: string;
  location: string;
  status: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  price: "",
  category: "",
  condition: "",
  listing_type: "fixed",
  location: "",
  status: "active",
};

export default function CreateListing() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const combined = [...images, ...files].slice(0, 4); // max 4 images
    setImages(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!form.title.trim()) return setError("Title is required.");
    if (!form.category) return setError("Please select a category.");
    if (!form.condition) return setError("Please select a condition.");
    if (form.listing_type === "fixed" && !form.price)
      return setError("Please enter a price.");

    setSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in.");

      const listingId = crypto.randomUUID();

      // Upload images
      const imageUrls: string[] = [];
      for (const file of images) {
        const ext = file.name.split(".").pop();
        const path = `${listingId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("listing_images")
          .upload(path, file, { contentType: file.type });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("listing_images")
          .getPublicUrl(path);

        imageUrls.push(urlData.publicUrl);
      }

      // Insert listing
      const { error: insertError } = await supabase.from("listings").insert({
        id: listingId,
        user_id: user.id,
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.listing_type === "free" ? null : parseFloat(form.price),
        category: form.category,
        condition: form.condition,
        listing_type: form.listing_type,
        status: form.status,
        location: form.location.trim(),
        image_urls: imageUrls,
      });

      if (insertError) throw insertError;

      navigate("/market/listings");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-4xl flex flex-col gap-10 mx-auto px-4 sm:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/market/listings")}
          className="flex items-center gap-1.5 text-sm font-[Poppins] text-slate-400 hover:text-slate-600 transition-colors self-start"
        >
          <RiArrowLeftLine size={15} />
          Back to My Listings
        </button>
        <div className="flex flex-col gap-2">
          <h2 className="font-[Lora] font-bold text-3xl sm:text-5xl text-slate-700">
            Create a Listing
          </h2>
          <p className="font-[Poppins] text-lg text-[rgb(69,70,77)] font-light">
            Fill in the details below and let your neighbors find what you're
            offering.
          </p>
        </div>
      </div>

      <div className="w-full h-0.5 bg-slate-200" />

      {/* ── Section: Basic Info ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h5 className="font-[Lora] font-bold text-slate-700">Basic Info</h5>
          <p className="font-[Poppins] font-light text-sm text-[rgb(69,70,77)] mt-1">
            Give your listing a clear title and describe what you're selling.
          </p>
        </div>
        <div className="md:col-span-2 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
              TITLE <span className="text-[#F48C25]">*</span>
            </label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. DeWalt Cordless Drill"
              className="border border-slate-300 rounded-md px-3 py-2 w-full font-[Poppins] text-sm text-slate-700 shadow-xs focus:outline outline-[#F48C25]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
              DESCRIPTION
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the item — its condition, history, what's included..."
              className="border border-slate-300 rounded-md px-3 py-2 w-full font-[Poppins] text-sm text-slate-700 shadow-xs focus:outline outline-[#F48C25] resize-none"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
              LOCATION
            </label>
            <input
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Madina, Accra"
              className="border border-slate-300 rounded-md px-3 py-2 w-full font-[Poppins] text-sm text-slate-700 shadow-xs focus:outline outline-[#F48C25]"
            />
          </div>
        </div>
      </div>

      <div className="w-full h-0.5 bg-slate-200" />

      {/* ── Section: Details ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h5 className="font-[Lora] font-bold text-slate-700">Details</h5>
          <p className="font-[Poppins] font-light text-sm text-[rgb(69,70,77)] mt-1">
            Category, condition, and pricing help buyers find and evaluate your
            item.
          </p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
              CATEGORY <span className="text-[#F48C25]">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border border-slate-300 rounded-md px-3 py-2 w-full font-[Poppins] text-sm text-slate-700 shadow-xs focus:outline outline-[#F48C25] bg-white"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
              CONDITION <span className="text-[#F48C25]">*</span>
            </label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="border border-slate-300 rounded-md px-3 py-2 w-full font-[Poppins] text-sm text-slate-700 shadow-xs focus:outline outline-[#F48C25] bg-white"
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Listing type */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
              LISTING TYPE
            </label>
            <div className="flex gap-3">
              {LISTING_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      listing_type: t.value,
                      price: t.value === "free" ? "" : p.price,
                    }))
                  }
                  className={`flex-1 py-2 rounded-md border text-sm font-[Poppins] transition-colors
                    ${
                      form.listing_type === t.value
                        ? "bg-[#F48C25] border-[#F48C25] text-white"
                        : "bg-white border-slate-300 text-slate-600 hover:border-[#F48C25] hover:text-[#F48C25]"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
              PRICE{" "}
              {form.listing_type === "fixed" && (
                <span className="text-[#F48C25]">*</span>
              )}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-[Poppins] text-sm text-slate-400">
                GH₵
              </span>
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                disabled={form.listing_type === "free"}
                placeholder={form.listing_type === "free" ? "Free" : "0.00"}
                className="border border-slate-300 rounded-md pl-10 pr-3 py-2 w-full font-[Poppins] text-sm text-slate-700 shadow-xs focus:outline outline-[#F48C25] disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-xs text-slate-700 font-semibold font-[Poppins] tracking-wide">
              PUBLISH AS
            </label>
            <div className="flex gap-3">
              {[
                { value: "active", label: "Active — visible to everyone" },
                { value: "draft", label: "Draft — save for later" },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, status: s.value }))}
                  className={`flex-1 py-2 px-3 rounded-md border text-sm font-[Poppins] text-left transition-colors
                    ${
                      form.status === s.value
                        ? "bg-[#F48C25] border-[#F48C25] text-white"
                        : "bg-white border-slate-300 text-slate-600 hover:border-[#F48C25] hover:text-[#F48C25]"
                    }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-0.5 bg-slate-200" />

      {/* ── Section: Images ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h5 className="font-[Lora] font-bold text-slate-700">Photos</h5>
          <p className="font-[Poppins] font-light text-sm text-[rgb(69,70,77)] mt-1">
            Add up to 4 photos. The first image will be the cover.
          </p>
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Upload zone */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 4}
            className="w-full border-2 border-dashed border-slate-300 rounded-md py-10 flex flex-col items-center gap-3 hover:border-[#F48C25] hover:bg-[#F48C2508] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RiUploadCloud2Line size={32} color="#F48C25" />
            <div className="text-center">
              <p className="font-[Poppins] text-sm font-medium text-slate-700">
                Click to upload photos
              </p>
              <p className="font-[Poppins] text-xs text-slate-400 mt-0.5">
                PNG, JPG, WEBP — up to 4 images
              </p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImages}
          />

          {/* Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-md overflow-hidden border border-slate-200 group"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-[#F48C25] text-white text-[10px] font-[Poppins] px-1.5 py-0.5 rounded">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <RiCloseLine size={14} color="#475569" />
                  </button>
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 4 - previews.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-md border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-[#F48C25] transition-colors"
                >
                  <RiImageLine size={20} color="#cbd5e1" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-0.5 bg-slate-200" />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3">
          <p className="font-[Poppins] text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate("/market/listings")}
          className="w-full sm:w-auto font-[Poppins] text-sm px-6 py-2.5 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full sm:w-auto font-[Poppins] text-sm font-medium px-8 py-2.5 rounded-md bg-[#F48C25] text-white hover:bg-[#e07d1a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <RiLoader4Line size={16} className="animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish Listing"
          )}
        </button>
      </div>
    </section>
  );
}
