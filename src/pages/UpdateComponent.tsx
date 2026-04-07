import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Input from "../components/shared/Input";
import BtnBig from "../components/shared/BtnBig";
import { RiKeyFill } from "@remixicon/react";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //Check if user is in recovery mode
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery mode activated");
      }
    });
  }, []);

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully!");
      navigate("/sign-in"); // or dashboard
    }
    setLoading(false);
  };

  return (
    <section className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] flex flex-col items-center max-w-lg font-[Poppins]">
      <div className="p-4 bg-white rounded-lg">
        <RiKeyFill color="#f48c25" size={32} />
      </div>
      <p className="text-3xl font-[Playfair_Display]">Set New Password</p>

      <div className="p-8 mt-5 rounded-md bg-white flex flex-col items-start gap-4 w-full font-[Poppins]">
        <Input
          placeholder="New Password"
          type="password"
          value={password}
          onchange={(e) => setPassword(e.target.value)}
        />
        <Input
          placeholder="Confirm New Password"
          type="password"
          value={confirmPassword}
          onchange={(e) => setConfirmPassword(e.target.value)}
        />

        <BtnBig
          text={loading ? "Updating..." : "Update Password"}
          textColor="text-white"
          btnBg="bg-[#f48c25]"
          onsubmit={handleUpdatePassword}
        />
      </div>
    </section>
  );
};

export default UpdatePassword;
