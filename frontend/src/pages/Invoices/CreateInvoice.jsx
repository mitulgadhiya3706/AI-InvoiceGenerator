import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency, generateInvoiceNumber } from "../../utils/helper";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const emptyItem = { name: "", quantity: 1, unitPrice: 0, taxpercent: 0 };

const fieldStyle =
  "rounded-md text-sm text-[#0F0F0D] placeholder-[#9A9888] outline-none transition-colors duration-150 px-3 py-2 border border-[#D8D4C8] focus:border-[#4A7C59] focus:outline-none";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [billFrom, setBillFrom] = useState({
    businessName: "",
    email: "",
    address: "",
    phone: "",
  });

  const [billTo, setBillTo] = useState({
    clientName: "",
    email: "",
    address: "",
    phone: "",
  });

  const [items, setItems] = useState([{ ...emptyItem }]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (user) {
      setBillFrom({
        businessName: user.businessName || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const addItem = () => {
    setItems([...items, { ...emptyItem }]);
  }

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  }

  const getItemTotal = (item) => {
    return item.quantity * item.unitPrice;
  }

  const subtotal = items.reduce((sum, item) => sum + getItemTotal(item), 0);
  const taxTotal = items.reduce(
    (sum, item) => sum + getItemTotal(item) * ((item.taxpercent || 0) / 100),
    0
  );
  const total = subtotal + taxTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!billTo.clientName || !billTo.email) {
      toast.error("Client name and email are required");
      return;
    }
    if (!dueDate) {
      toast.error("Please choose a due date");
      return;
    }

    const invoiceData = {
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: new Date().toISOString(),
      dueDate,
      billFrom,
      billTo,
      items: items.map((item) => ({
        ...item,
        total: getItemTotal(item),
      })),
      notes,
    };

    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.INVOICES.CREATE, invoiceData);
      toast.success("Invoice created!");
      navigate("/invoices");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create invoice");
    }
    setLoading(false);
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-[#FDFCF8] border border-[#D8D4C8] rounded-lg p-6 sm:p-8">
        <h1 className="text-2xl font-semibold mb-6 text-[#0F0F0D]">Create Invoice</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Client details (billTo) */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm text-[#8A8778] mb-1">Client Name *</label>
              <input
                type="text"
                value={billTo.clientName}
                onChange={(e) => setBillTo({ ...billTo, clientName: e.target.value })}
                className={fieldStyle + " w-full"}
              />
            </div>
            <div>
              <label className="block text-sm text-[#8A8778] mb-1">Client Email *</label>
              <input
                type="email"
                value={billTo.email}
                onChange={(e) => setBillTo({ ...billTo, email: e.target.value })}
                className={fieldStyle + " w-full"}
              />
            </div>
            <div>
              <label className="block text-sm text-[#8A8778] mb-1">Client Address</label>
              <input
                type="text"
                value={billTo.address}
                onChange={(e) => setBillTo({ ...billTo, address: e.target.value })}
                className={fieldStyle + " w-full"}
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-[#8A8778]">Items</label>
              <button type="button" onClick={addItem} className="text-sm text-[#4A7C59]">
                + Add item
              </button>
            </div>

            <div className="flex gap-2 mb-1 text-xs text-[#8A8778]">
              <span className="flex-1">Description</span>
              <span className="w-16">Qty</span>
              <span className="w-24">Price</span>
              <span className="w-16">Tax %</span>
              <span className="w-6"></span>
            </div>

            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    className={fieldStyle + " flex-1"}
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                    className={fieldStyle + " w-16"}
                  />
                  <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, "unitPrice", Number(e.target.value))}
                    className={fieldStyle + " w-24"}
                  />
                  <input
                    type="number"
                    min="0"
                    value={item.taxpercent}
                    onChange={(e) => updateItem(index, "taxpercent", Number(e.target.value))}
                    className={fieldStyle + " w-16"}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="w-6 text-[#C8C4B8] hover:text-red-600 disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-sm text-[#8A8778] mb-1">Due Date *</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={fieldStyle + " w-full sm:w-60"}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-[#8A8778] mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={fieldStyle + " w-full"}
            />
          </div>

          {/* Totals preview*/}
          <div className="flex flex-col gap-1 items-end text-sm text-[#5A5848]">
            <p>Subtotal: {formatCurrency(subtotal)}</p>
            <p>Tax: {formatCurrency(taxTotal)}</p>
            <p className="text-lg font-semibold text-[#0F0F0D]">
              Total: {formatCurrency(total)}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#4A7C59] text-white text-sm font-medium rounded-md px-6 py-2.5 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Invoice"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/invoices")}
              className="text-sm text-[#5A5848] border border-[#D8D4C8] rounded-md px-6 py-2.5"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateInvoice;