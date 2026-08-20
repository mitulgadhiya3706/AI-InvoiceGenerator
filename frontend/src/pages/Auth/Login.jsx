import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F7F5EF" }}
    >
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#4A7C59] rounded-sm flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 11 11" fill="none">
                <rect x="1" y="1" width="4" height="4" fill="#F0EDE4" rx="0.5" />
                <rect x="6" y="1" width="4" height="4" fill="#F0EDE4" rx="0.5" opacity="0.6" />
                <rect x="1" y="6" width="4" height="4" fill="#F0EDE4" rx="0.5" opacity="0.6" />
                <rect x="6" y="6" width="4" height="4" fill="#F0EDE4" rx="0.5" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#0F0F0D]">AI Invoice</span>
          </Link>

          <h1
            className="text-2xl font-normal text-[#0F0F0D]"
          >
            Welcome back
          </h1>
          <p className="text-sm text-[#5A5848]">Sign in to your workspace</p>
        </div>

        {/* Form card */}
        <div className="bg-[#FDFCF8] rounded-lg p-6 border border-gray-300">

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-sm text-[#8A8778]"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2 border border-[#D8D4C8] focus:border-[#4A7C59] focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-password"
                className="text-sm text-[#8A8778]"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2 border border-[#D8D4C8] focus:border-[#4A7C59] focus:outline-none"
              />
            </div>

            {/* Error banner */}
            {error && (
              <div className="px-1 py-1 rounded text-sm text-[#cf2f2f]">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A7C59] text-white text-sm font-medium rounded-md py-2 mt-1 hover:bg-[#3d6b4a]  "
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        {/* Below card */}
        <p className="text-sm text-[#5A5848] text-center mt-5">
          No account?{" "}
          <Link
            to="/signup"
            className="text-[#4A7C59] hover:underline transition-colors duration-150"
          >
            Create one free
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;