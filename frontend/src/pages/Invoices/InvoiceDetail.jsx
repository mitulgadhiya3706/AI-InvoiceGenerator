import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency, formatDate } from "../../utils/helper";
import toast from "react-hot-toast";


const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  // For AI-generated reminder email modal
  const [emailText, setEmailText] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [generatingEmail, setGeneratingEmail] = useState(false);


  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICES.GET_BY_ID(id));
        setInvoice(response.data);
      } catch (error) {
        toast.error("Failed to load invoice");
        navigate("/invoices");
      }
      setLoading(false);
    }

    loadInvoice();
  }, [id, navigate]);


  const toggleStatus = async () => {
    const newStatus = invoice.status === "Paid" ? "Unpaid" : "Paid";
    try {
      const response = await axiosInstance.put(API_PATHS.INVOICES.UPDATE(id), {
        status: newStatus,
      });
      setInvoice(response.data);
      toast.success(`Marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this invoice? This cannot be undone.");
    if (!confirmed) return;
    try {
      await axiosInstance.delete(API_PATHS.INVOICES.DELETE(id));
      toast.success("Invoice deleted");
      navigate("/invoices");
    } catch (error) {
      toast.error("Failed to delete invoice");
    }
  }

  //Payment reminder email by AI
  const handleGenerateEmail = async () => {
    setGeneratingEmail(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_REMINDER, {
        invoiceId: invoice._id,
      });

      const generatedText = response.data?.email;
      if (!generatedText) {
        toast.error("No email content returned");
        return;
      }

      setEmailText(generatedText);
      setShowEmailModal(true);
    } catch (error) {
      toast.error("Failed to generate reminder email");
    }
    setGeneratingEmail(false);
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailText);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  }

  if (loading) {
    return <p className="p-8 text-gray-500">Loading invoice...</p>;
  }
  if (!invoice) {
    return null;
  }

  const isPaid = invoice.status === "Paid";

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/*Action buttons*/}
        {/* no-print: hidden this section when printing, printed docs. should only contain invoice  */}
        <div className="no-print flex flex-wrap items-center justify-end gap-2 mb-4">
          <button onClick={() => window.print()} className="text-sm border border-gray-300 rounded-md px-4 py-2">
            Print
          </button>
          <button onClick={handleGenerateEmail}
                  disabled={generatingEmail}
                  className="text-sm border border-gray-300 rounded-md px-4 py-2 disabled:opacity-50"
          >
            {generatingEmail ? "Generating..." : "Reminder Email"}
          </button>
          <button onClick={toggleStatus} className="text-sm border border-gray-300 rounded-md px-4 py-2 font-medium">
            Mark as {isPaid ? "Unpaid" : "Paid"}
          </button>
          <button onClick={handleDelete} className="text-sm text-red-600 px-3 py-2">
            Delete
          </button>
        </div>

        {/*Invoice document*/}
        {/* print-area: this is the ONLY thing that should show up in the printed PDF */}
        <div className="print-area bg-white border border-gray-200 rounded-lg">
          {/* Invoice header */}
          <div className="p-6 border-b border-gray-200 flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Invoice</p>
              <p className="text-lg font-medium text-gray-900">{invoice.invoiceNumber}</p>
              <p className="text-sm text-gray-500 mt-2">Issued {formatDate(invoice.createdAt)}</p>
              {invoice.dueDate && (
                <p className="text-sm text-gray-500">Due {formatDate(invoice.dueDate)}</p>
              )}
            </div>
            <span
              className={ "text-xs font-medium uppercase px-3 py-1.5 rounded " +
                (isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")
              }
            >
              {invoice.status}
            </span>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 border-b border-gray-200">
            <div className="p-6 border-r border-gray-200">
              <p className="text-xs text-gray-500 uppercase mb-2">From</p>
              <p className="text-sm font-medium text-gray-900">{invoice.billFrom?.businessName || "—"}</p>
              <p className="text-sm text-gray-500">{invoice.billFrom?.email}</p>
              <p className="text-sm text-gray-500">{invoice.billFrom?.address}</p>
              <p className="text-sm text-gray-500">{invoice.billFrom?.phone}</p>
            </div>
            <div className="p-6">
              <p className="text-xs text-gray-500 uppercase mb-2">To</p>
              <p className="text-sm font-medium text-gray-900">{invoice.billTo?.clientName || "—"}</p>
              <p className="text-sm text-gray-500">{invoice.billTo?.email}</p>
              <p className="text-sm text-gray-500">{invoice.billTo?.address}</p>
              <p className="text-sm text-gray-500">{invoice.billTo?.phone}</p>
            </div>
          </div>

          {/* Items table */}
          <div className="border-b border-gray-200">
            <p className="text-xs text-gray-500 uppercase px-6 pt-5 pb-3">Items</p>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-sm text-gray-500 ">
                  <th className="text-left px-6 py-2">Description</th>
                  <th className="text-left px-6 py-2">Qty</th>
                  <th className="text-left px-6 py-2">Price</th>
                  <th className="text-left px-6 py-2">Tax</th>
                  <th className="text-right px-6 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-6 py-3 text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{item.quantity}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{item.taxpercent || 0}%</td>
                    <td className="px-6 py-3 text-sm text-right font-medium text-gray-900">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notes + Subtotal/Tax */}
          <div className="grid grid-cols-2 border-b border-gray-200">
            <div className="p-6 border-r border-gray-200">
              {invoice.notes && (
                <>
                  <p className="text-xs text-gray-500 uppercase mb-2">Notes</p>
                  <p className="text-sm text-gray-600">{invoice.notes}</p>
                </>
              )}
            </div>
            <div className="p-6 flex flex-col gap-2 justify-end">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax</span>
                <span>{formatCurrency(invoice.taxTotal)}</span>
              </div>
            </div>
          </div>

          {/* Total due bar */}
          <div className="bg-gray-900 px-6 py-3 flex justify-between items-center rounded-b-lg">
            <span className="text-xs text-gray-300 uppercase">Total Due</span>
            <span className="text-xl font-medium text-white">{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Reminder email modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg max-h-[80vh] flex flex-col bg-white rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <p className="text-xs text-gray-500 uppercase">Reminder Email</p>
              <button onClick={() => setShowEmailModal(false)} className="text-gray-400 text-xl leading-none">
                ×
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">{emailText}</pre>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={handleCopyEmail} className="bg-[#4A7C59] text-white text-sm rounded-md px-4 py-2">
                Copy to clipboard
              </button>
              <button onClick={() => setShowEmailModal(false)} className="text-sm border border-gray-300 rounded-md px-4 py-2">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceDetail;