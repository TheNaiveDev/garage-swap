import {
  RiFileList2Fill,
  RiMessage2Fill,
  RiStoreFill,
  RiUser2Fill,
} from "@remixicon/react";
import { Gavel } from "lucide-react";
import React from "react";
import { type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BtnBig from "./shared/BtnBig";

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
      icon: <RiStoreFill />,
    },
    {
      name: "Profile",
      path: "/market/profile",
      icon: <RiUser2Fill />,
    },
    {
      name: "Messages",
      path: "/market/messages",
      icon: <RiMessage2Fill />,
    },
    {
      name: "My Listings",
      path: "/market/listings",
      icon: <RiFileList2Fill />,
    },
    {
      name: "Bids",
      path: "/market/bids",
      icon: <Gavel fill="true" />,
    },
  ];
  return (
    <div className="p-8 flex flex-col gap-16 bg-[#0f172a] h-screen">
      <span className="flex items-center gap-2 shrink-0">
        <span className="material-symbols-outlined font-extrabold text-[#f48c25]">
          handyman
        </span>
        <span className="text-xl lg:text-2xl font-bold text-white">
          GarageSwap
        </span>
      </span>
      <div className="flex flex-col gap-8">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const iconColor = isActive ? "white" : "gray";
          return (
            <div
              key={link.name}
              className={`flex items-center gap-4 font-[Poppins] relative cursor-pointer ${isActive ? "bg-[#64748b20] text-white py-2 px-4" : null}`}
              onClick={() => navigate(link.path)}
            >
              <div
                className={`w-1 h-full bg-[#F48C25] absolute left-0 ${isActive ? "visible" : "hidden"}`}
              ></div>
              {React.cloneElement(link.icon as React.ReactElement, {
                color: iconColor,
              })}
              <p className={`${isActive ? "text-white" : "text-gray-400"}`}>
                {link.name}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex-1 flex flex-col justify-end hover:font-medium">
        <BtnBig text="Sign Out" btnBg="bg-[#64748b20]" textColor="text-white" />
      </div>
    </div>
  );
}
