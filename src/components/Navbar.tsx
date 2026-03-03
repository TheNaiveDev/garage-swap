import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./shared/Button";
import Input from "./shared/Input";
import { RiSearchLine, RiMenuLine, RiCloseLine } from "@remixicon/react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="font-[Inter] fixed top-0 left-0 w-full bg-[#fcfbfa] z-50 shadow-sm">
      {/* Main bar */}
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-16 xl:px-30 py-4">
        {/* Logo */}
        <span className="flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined font-extrabold text-[#f48c25]">
            handyman
          </span>
          <span className="text-xl lg:text-2xl font-bold text-slate-900">
            GarageSwap
          </span>
        </span>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            to="/"
            className="text-slate-700 font-medium hover:text-[#F48C25] transition-colors"
          >
            Browse
          </Link>
          <Link
            to="/"
            className="text-slate-700 font-medium hover:text-[#F48C25] transition-colors"
          >
            How it Works
          </Link>
          <Link
            to="/"
            className="text-slate-700 font-medium hover:text-[#F48C25] transition-colors"
          >
            Start Selling
          </Link>
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex flex-row items-center gap-4 lg:gap-8">
          <Input
            placeholder="Search for an item"
            icon={<RiSearchLine color="#F48C25" />}
          />
          <Link to="/sign-in">
            <Button
              text="Sign In"
              btnBg="bg-[#F48C2510]"
              textColor="text-[#F48C25]"
            />
          </Link>
          <Link to="/sign-in">
            <Button
              text="Sign Up"
              btnBg="bg-[#F48C25]"
              textColor="text-white"
            />
          </Link>
        </div>

        {/* Mobile: search icon + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/sign-in">
            <Button
              text="Sign Up"
              btnBg="bg-[#F48C25]"
              textColor="text-white"
            />
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-[#fcfbfa] px-5 pb-5 flex flex-col gap-4">
          {/* Search */}
          <div className="pt-4">
            <Input
              placeholder="Search for an item"
              icon={<RiSearchLine color="#F48C25" />}
            />
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-1">
            <Link
              to="/"
              className="text-slate-700 font-medium py-2.5 px-1 border-b border-slate-100 hover:text-[#F48C25] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Browse
            </Link>
            <Link
              to="/"
              className="text-slate-700 font-medium py-2.5 px-1 border-b border-slate-100 hover:text-[#F48C25] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              to="/"
              className="text-slate-700 font-medium py-2.5 px-1 hover:text-[#F48C25] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Start Selling
            </Link>
          </div>

          {/* Auth butons */}
          <div className="flex gap-3 pt-1">
            <Link
              to="/sign-in"
              className="flex-1"
              onClick={() => setMenuOpen(false)}
            >
              <Button
                text="Sign In"
                btnBg="bg-[#F48C2510]"
                textColor="text-[#F48C25]"
              />
            </Link>
            <Link
              to="/sign-in"
              className="flex-1"
              onClick={() => setMenuOpen(false)}
            >
              <Button
                text="Sign Up"
                btnBg="bg-[#F48C25]"
                textColor="text-white"
              />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
