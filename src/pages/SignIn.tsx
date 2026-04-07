import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BtnBig from "../components/shared/BtnBig";
import Input from "../components/shared/Input";
import {
  RiMailFill,
  RiLockFill,
  RiUserFill,
  RiEyeFill,
  RiEyeCloseFill,
} from "@remixicon/react";
import { supabase } from "../lib/supabaseClient";

export default function SignIn() {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const date_today = new Date().toISOString().split("T")[0];

  // Toggle between Sign In and Sign Up
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(""); // Clear error when switching modes
    setUsername("");
    setPassword("");
  };

  // Clear error when user starts typing
  const clearError = () => setError("");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    clearError();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    clearError();
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Handle Sign In
  async function handleSignIn(email: string, password: string) {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      console.error("Sign in error:", authError);
      if (authError.message.includes("Invalid login credentials")) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError(authError.message || "Failed to sign in. Please try again.");
      }
    } else if (data.user) {
      console.log("Sign in successful:", data);
      navigate("/market/profile");
    }
  }

  // Handle Sign Up
  async function handleSignUp(
    email: string,
    password: string,
    username: string,
  ) {
    if (!email || !password || !username) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.trim(),
          date_joined: date_today,
        },
      },
    });

    setLoading(false);

    if (authError) {
      console.error("Sign up error:", authError);
      if (authError.message.includes("already registered")) {
        setError(
          "An account with this email already exists. Try signing in instead.",
        );
      } else if (authError.message.includes("Password")) {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError(
          authError.message || "Failed to create account. Please try again.",
        );
      }
    } else {
      console.log("Sign up successful:", data);
      setError("");
      navigate("/market/profile");
    }
  }

  // handle password visibility function
  function handlePasswordVisibility() {
    setIsPassword(!isPassword);
  }

    if (isSignUp) {
      handleSignUp(email, password, username);
    } else {
      handleSignIn(email, password);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row items-stretch">
      {/* LEFT SIDE — Desktop Hero */}
      <div className="hidden lg:flex lg:flex-2 flex-col justify-end p-12 bg-[url(/lay-flat.jpg)] bg-bottom-left bg-cover relative">
        <div className="relative z-10">
          <h3 className="font-[Poppins] text-8xl font-extrabold text-white text-shadow-lg">
            The neighbourly way to swap.
          </h3>
          <p className="w-2/3 text-2xl text-white text-shadow-lg font-[Poppins]">
            Join thousands of people across the country discovering treasures
            and building community right next door.
          </p>
        </div>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* MOBILE HERO BANNER */}
      <div className="lg:hidden w-full h-48 sm:h-64 bg-[url(/background.jpg)] bg-center bg-cover relative flex items-end p-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined font-extrabold text-[#F48C25] text-2xl">
              handyman
            </span>
            <span className="text-xl font-bold text-white">GarageSwap</span>
          </div>
          <p className="text-white/90 text-sm font-medium">
            The neighbourly way to swap.
          </p>
        </div>
        <div className="absolute inset-0 bg-black/35"></div>
      </div>

      {/* RIGHT SIDE — Form */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-20 py-10 lg:py-0">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col gap-6 lg:gap-8 font-[Poppins]"
        >
          {/* Header */}
          <div>
            <h4 className="text-3xl lg:text-4xl font-bold text-[#0F172A]">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h4>
            <p className="text-[#475569] mt-1">
              {isSignUp
                ? "Create an account to continue"
                : "Log into your account to continue"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Username (only for Sign Up) */}
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-[#334155] text-sm lg:text-base"
              >
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                value={username}
                onchange={handleUsernameChange}
                placeholder="cookingpot237"
                icon={<RiUserFill color="#94A3B8" />}
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[#334155] text-sm lg:text-base"
            >
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onchange={handleEmailChange}
              placeholder="neighbour@example.com"
              icon={<RiMailFill color="#94A3B8" />}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="password"
              className="text-[#334155] text-sm lg:text-base"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onchange={handlePasswordChange}
                placeholder="Enter your password"
                icon={<RiLockFill color="#94A3B8" />}
                passwordIcon={
                  isPasswordVisible ? (
                    <RiEyeFill
                      color="#94A3B8"
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <RiEyeCloseFill
                      color="#94A3B8"
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  )
                }
                required
              />
            </div>

            {/* Forgot Password (only visible on Sign In) */}
            {!isSignUp && (
              <div
                className="text-[#F48C25] text-sm cursor-pointer hover:underline self-end mt-1"
                onClick={() => navigate("/forgotpassword")}
              >
                Forgot password?
              </div>
            )}
          </div>

          {/* Submit Button */}
          <BtnBig
            text={
              loading
                ? "Please wait..."
                : isSignUp
                  ? "Create Account"
                  : "Sign In"
            }
            textColor="text-white"
            btnBg="bg-[#F48C25]"
            onsubmit={handleSubmit}
          />

          {/* Toggle between Sign In and Sign Up */}
          <div className="text-center text-sm sm:text-base pb-4 lg:pb-0">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <span
              className="text-[#F48C25] font-semibold cursor-pointer hover:underline"
              onClick={toggleMode}
            >
              {isSignUp ? "Sign In" : "Create an account"}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
