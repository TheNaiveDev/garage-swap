// src/components/footer.tsx
import { useState } from "react";
export default function Footer() {
  const [email, setEmail] = useState<string>("");
  return (
    <footer className="bg-[#f5f2ec] px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 pt-14 pb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <span className="material-symbols-outlined font-extrabold text-[#f48c25] pr-2">
            handyman
          </span>
          <span className="text-2xl font-bold text-slate-900">GarageSwap</span>
          <p className="text-gray-500 text-sm leading-relaxed mt-2">
            Bringing the traditional garage sale experience into the digital
            age. Built for neighbors, by neighbors.
          </p>
        </div>
        {/* Quick Links */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Quick Links
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              "Browse All",
              "Recent Listings",
              "How it Works",
              "Community Rules",
            ].map((link: string) => (
              <li key={link}>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Support */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Support
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            {["Help Center", "Safety Tips", "Contact Us", "Feedback"].map(
              (link: string) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
        {/* Newsletter */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Newsletter
          </p>
          <p className="text-sm text-gray-500 mb-3">
            Stay updated on new items in your neighborhood.
          </p>
          <div className="flex rounded-full overflow-hidden border border-gray-200 bg-white">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 text-sm outline-none"
            />
          </div>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
        <p>© 2024 GarageSwap. All rights reserved.</p>
        <div className="flex gap-5">
          {["Privacy Policy", "Terms of Service", "Cookies Policy"].map(
            (link: string) => (
              <a
                key={link}
                href="#"
                className="hover:text-gray-700 transition-colors"
              >
                {link}
              </a>
            ),
          )}
        </div>
      </div>
    </footer>
  );
}
