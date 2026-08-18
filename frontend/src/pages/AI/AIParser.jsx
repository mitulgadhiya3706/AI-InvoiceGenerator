import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { generateInvoiceNumber, formatCurrency, formatDate } from "../../utils/helper";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// A few sample texts the user can click to try the feature instantly
const SAMPLES = {
  freelance: `Client: Acme Corp
Email: billing@acme.com

Items:
- Frontend Development, 40 hours at ₹2000/hr
- Code review and testing, 8 hours at ₹1500/hr

Make payment within next 30 days.`,

  design: `Client: Studio Nine
Email: accounts@studionine.in

- UI Design, 5 screens, ₹12000 flat
- Icon set, 20 icons, ₹4000 flat

Net 14`,

  consulting: `Client: GreenPath Ventures
Email: finance@greenpath.com

- Product roadmap consultation, 3 sessions, ₹8000/session
- Competitive analysis report, ₹15000 flat`,
};

const AIParser = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null); // everything the AI extracted: client, items, dueDate, notes
  const [loading, setLoading] = useState(false); // true while AI is reading the text
  const [creating, setCreating] = useState(false); // true while saving the final invoice

  // Send the raw text to the backend, which asks Gemini to extract
  // client details, items, due date, and notes from it
  const handleParse = async () => {
    if (!text.trim()) {
      toast.error("Please enter some invoice text");
      return;
    }

    setLoading(true);
    setParsed(null);

    try {
      const response = await axiosInstance.post(API_PATHS.AI.PARSE_TEXT, { text });
      setParsed(response.data);
      toast.success("Invoice data extracted!");
    } catch (error) {
      toast.error("Failed to parse invoice text");
    }
    setLoading(false);
  };

  // Save whatever the AI extracted as a real invoice — no editing step,
  // exactly what came back from the AI is what gets saved
  const handleCreateInvoice = async () => {
    if (!parsed) return;

    const items = (parsed.items || []).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxpercent: 0,
      total: item.quantity * item.unitPrice,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);

    const invoiceData = {
      invoiceNumber: generateInvoiceNumber(),
      dueDate: parsed.dueDate || "",
      notes: parsed.notes || "",
      billFrom: {
        businessName: user?.businessName || "",
        email: user?.email || "",
        address: user?.address || "",
        phone: user?.phone || "",
      },
      billTo: {
        clientName: parsed.clientName || "",
        email: parsed.email || "",
        address: parsed.address || "",
      },
      items,
      subtotal,
      taxTotal: 0,
      total: subtotal,
    };

    setCreating(true);
    try {
      await axiosInstance.post(API_PATHS.INVOICES.CREATE, invoiceData);
      toast.success("Invoice created from AI data!");
      navigate("/invoices");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create invoice");
    }
    setCreating(false);
  };

  const total = (parsed?.items || []).reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-[#0F0F0D]">Generate Invoice with AI</h1>

        {/* Text input */}
        <div>
          <label className="block text-sm text-[#8A8778] mb-1">
            Paste an email, message, or notes describing the work
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Client: Acme Corp&#10;Email: billing@acme.com&#10;&#10;Items:&#10;- Web Development, 10 hours at ₹2000/hr"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Sample buttons */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-[#8A8778] self-center">Try an example:</span>
          <button onClick={() => setText(SAMPLES.freelance)} className="text-xs border border-gray-300 rounded-full px-3 py-1">
            Freelance project
          </button>
          <button onClick={() => setText(SAMPLES.design)} className="text-xs border border-gray-300 rounded-full px-3 py-1">
            Design retainer
          </button>
          <button onClick={() => setText(SAMPLES.consulting)} className="text-xs border border-gray-300 rounded-full px-3 py-1">
            Consulting
          </button>
        </div>

        {/* Generate button */}
        <button
          onClick={handleParse}
          disabled={loading || !text.trim()}
          className="bg-[#4A7C59] text-white text-sm font-medium rounded-md py-2.5 disabled:opacity-50"
        >
          {loading ? "Extracting..." : "Extract & Preview Invoice"}
        </button>

        {/* Extracted result preview */}
        {parsed && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <p className="text-xs text-gray-500 uppercase mb-1">Bill To</p>
              <p className="text-sm font-medium text-gray-900">{parsed.clientName || "—"}</p>
              <p className="text-sm text-gray-500">{parsed.email}</p>
              <p className="text-sm text-gray-500 mb-1">
                Due Date:{" "}
                <span className="text-sm text-gray-500">
                  {parsed.dueDate ? formatDate(parsed.dueDate) : "Not mentioned"}
                </span>
              </p>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="text-left px-4 py-2">Description</th>
                  <th className="text-left px-4 py-2">Qty</th>
                  <th className="text-left px-4 py-2">Rate</th>
                  <th className="text-right px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(parsed.items || []).map((item, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 uppercase mb-1">Notes</p>
              <p className="text-sm text-gray-900">{parsed.notes || "None"}</p>
            </div>

            <div className="bg-gray-900 px-4 py-3 flex justify-between items-center">
              <span className="text-xs text-gray-300 uppercase">Total</span>
              <span className="text-lg font-medium text-white">{formatCurrency(total)}</span>
            </div>

            <div className="p-4 flex gap-3 border-t border-gray-200">
              <button
                onClick={handleCreateInvoice}
                disabled={creating}
                className="bg-[#4A7C59] text-white text-sm rounded-md px-4 py-2 disabled:opacity-50"
              >
                {creating ? "Saving..." : "Save Invoice"}
              </button>
              <button
                onClick={() => {
                  setParsed(null);
                  setText("");
                }}
                className="text-sm border border-gray-300 rounded-md px-4 py-2"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIParser;