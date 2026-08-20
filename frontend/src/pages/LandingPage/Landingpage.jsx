import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TopBar from "../../components/ui/Topbar";
import { Check } from "lucide-react";


const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col">
      <TopBar />

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center w-full">
        {/* Headline */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full border text-[11px] font-medium uppercase tracking-widest bg-[#E8F0EB] border-[#B8D4C0] text-[#2A5A38]">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4A7C59", display: "inline-block" }}></span>
            New — AI-powered invoice parsing
          </div>
          <h1
            className="text-4xl md:text-5xl text-[#0F0F0D] leading-[1.1] mb-6"
            style={{ fontFamily: "Lora, Georgia, serif", fontWeight: 400 }}
          >
            Professional invoices,
            <br />
            written by AI.
          </h1>
          <p className="text-base text-[#5A5848] leading-relaxed mb-8 max-w-md">
            Paste any invoice text. Our AI reads it, extracts every detail, and
            builds a typeset document ready to send in seconds.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/signup")}
              className="h-11 rounded-md bg-[#4A7C59] px-6 text-sm font-medium text-white hover:bg-[#3D6B4C]"
            >
              Start Free
            </button>

            <button
              onClick={() => navigate("/login")}
              className="h-11 rounded-md border border-gray-300 px-6 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;