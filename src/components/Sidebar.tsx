import {
  RiFileList2Fill,
  RiMessage2Fill,
  RiStoreFill,
  RiUser2Fill,
} from "@remixicon/react";
import { Gavel } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface linkProps {
  name: string;
  path: string;
  icon: ReactNode;
}

export default function Sidebar() {
  const navigate = useNavigate();
  let location = useLocation();

  const links: linkProps[] = [
    {
      name: "Market",
      path: "/market",
      icon: <RiStoreFill color="#445268" />,
    },
    {
      name: "Profile",
      path: "/market/profile",
      icon: <RiUser2Fill color="#445268" />,
    },
    {
      name: "Messages",
      path: "/market/messages",
      icon: <RiMessage2Fill color="#445268" />,
    },
    {
      name: "My Listings",
      path: "/market/listings",
      icon: <RiFileList2Fill color="#445268" />,
    },
    {
      name: "Bids",
      path: "/market/bids",
      icon: <Gavel fill="true" color="#445268" />,
    },
  ];
  return (
    <div className="p-8 flex flex-col gap-12 bg-[#f1f5f9] h-screen">
      <span className="flex items-center gap-2 shrink-0">
        <span className="material-symbols-outlined font-extrabold text-[#f48c25]">
          handyman
        </span>
        <span className="text-xl lg:text-2xl font-bold text-slate-900">
          GarageSwap
        </span>
      </span>
      {/* user icon */}
      <div className="flex gap-3 items-center font-[Inter] bg-white px-4 py-2 rounded-md shadow-[1px]">
        <img
          src="/profile-picture.png"
          alt="profile icon"
          className="max-w-10"
        />
        <div>
          <p className="font-semibold text-slate-700 font-[Playfair_Display]">
            CabbageBuddy
          </p>
          <p className="text-xs font-base text-slate-700">MEMBER</p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <div
              key={link.name}
              className={`flex items-center gap-4 font-[Inter] relative cursor-pointer ${isActive ? "bg-[#64748b20] font-bold py-2 px-4" : null}`}
              onClick={() => navigate(link.path)}
            >
              <div
                className={`w-1 h-full bg-[#F48C25] absolute left-0 ${isActive ? "visible" : "hidden"}`}
              ></div>
              {link.icon}
              <p className="text-slate-700">{link.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
