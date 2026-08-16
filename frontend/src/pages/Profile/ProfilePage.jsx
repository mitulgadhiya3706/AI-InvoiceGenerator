import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gst, setGst] = useState(user?.gst || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ name, businessName, address, phone, gst });
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#F7F5EF]">

      {/* Page header */}
      <div className="px-8 pt-8 pb-6">
        <h1 className="text-xl text-[#8A8778] font-medium tracking-wide">Profile</h1>
      </div>

      <form onSubmit={handleSave}>
        <div className="px-8 pb-8 grid grid-cols-[1fr_360px] gap-8 items-start">

          {/* Form card */}
          <div
            className="bg-[#FDFCF8] rounded-lg overflow-hidden"
            style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "#D8D4C8" }}
          >
            {/* Section header: Account */}
            <div className="bg-[#EFECE3] px-6 py-3">
              <span className="text-sm font-medium text-gray-600">ACCOUNT</span>
            </div>

            <div className="px-6 py-5">
              {/* Avatar row */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#4A7C59] flex items-center justify-center text-sm text-white font-medium shrink-0">
                  {name.trim()
                    ? name.trim()[0].toUpperCase()
                    : (user.email?.[0]?.toUpperCase() || "?")}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0F0F0D]">{name || user.name || "—"}</p>
                  <p className="text-xs text-[#8A8778]">{user.email}</p>
                </div>
              </div>

              {/* Full name */}
              <div className="mt-4">
                <label className="text-sm text-[#8A8778]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2 border border-[#D8D4C8] focus:border-[#4A7C59] focus:outline-none"
                />
              </div>

              {/* Email (readonly) */}
              <div className="mt-3">
                <label className="text-sm text-[#8A8778]">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2 border border-[#D8D4C8] focus:border-[#4A7C59] focus:outline-none"
                />
              </div>
            </div>

            {/* Section header: Business */}
            <div style={{ borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "#ECEAE0" }}>
              <div className="bg-[#EFECE3] px-6 py-3">
                <span className="text-sm font-medium text-gray-600">BUSINESS</span>
              </div>
              <div className="px-6 py-5 flex flex-col gap-4">
                <div>
                  <label className="text-sm text-[#8A8778]">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2 border border-[#D8D4C8] focus:border-[#4A7C59] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#8A8778]">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2 border border-[#D8D4C8] focus:border-[#4A7C59] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#8A8778]">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2 border border-[#D8D4C8] focus:border-[#4A7C59] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#8A8778]">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                    placeholder="22AAAAA0000A1Z5 (optional)"
                    className="w-full rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2 border border-[#D8D4C8] focus:border-[#4A7C59] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 flex justify-between items-center"
              style={{ borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "#ECEAE0" }}
            >
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-[#8A8778]"
              >
                Sign out
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#4A7C59] text-white text-xs px-4 py-2 rounded-md hover:bg-[#3d6b4a] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;