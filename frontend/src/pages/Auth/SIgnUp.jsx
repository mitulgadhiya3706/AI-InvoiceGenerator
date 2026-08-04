import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created!");
      navigate("/workspace");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account. Please try again.");
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

          <h1 className="text-2xl font-normal text-[#0F0F0D]">
            Create your workspace
          </h1>
          <p className="text-sm text-[#5A5848]">Start generating invoices in seconds</p>
        </div>

        {/* Form card */}
        <div className="bg-[#FDFCF8] rounded-lg p-6 border border-gray-300">

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-name"
                className="text-sm text-[#8A8778]"
              >
                Full name
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                autoComplete="name"
                className="rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2 border border-[#D8D4C8] focus:border-[#4A7C59] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-sm text-[#8A8778]"
              >
                Email
              </label>
              <input
                id="signup-email"
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
                htmlFor="login-email"
                className="text-sm text-[#8A8778]"
              >
               Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
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
              className="w-full bg-[#4A7C59] text-white text-sm font-medium rounded-md py-2 mt-1 hover:bg-[#3d6b4a]"
            >
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>
        </div>

        {/* Below card */}
        <p className="text-sm text-[#5A5848] text-center mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#4A7C59] hover:underline transition-colors duration-150"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default SignUp;