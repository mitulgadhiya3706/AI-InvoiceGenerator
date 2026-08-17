import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency, formatDate } from "../../utils/helper";
import StatusBadge from "../../components/ui/StatusBadge";
import toast from "react-hot-toast";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICES.GET_ALL);
        setInvoices(response.data);     //Backend's getInvoice controller sends back a plain array directly
      } catch (error) {
        toast.error("Could not load invoices");
      }
      setLoading(false);
    }

    loadInvoices();
  }, []);

  // Start with everything, then narrow it down step by step
  let filteredInvoices = invoices;

  if (statusFilter !== "All") {
    filteredInvoices = invoices.filter((inv) => inv.status === statusFilter);
  }

  // Filter by search text (matches client name or invoice number)
  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    filteredInvoices = filteredInvoices.filter((inv) => {
      const clientName = inv.billTo?.clientName?.toLowerCase() || "";
      const invoiceNumber = inv.invoiceNumber?.toLowerCase() || "";
      return clientName.includes(search) || invoiceNumber.includes(search);
    });
  }

  if (loading) {
    return <p className="p-8 text-gray-500">Loading invoices...</p>;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl tracking-wide font-semibold text-[#0F0F0D]">
          Invoices ({filteredInvoices.length})
        </h1>
        <Link
          to="/invoices/new"
          className="bg-[#4A7C59] text-white text-sm font-medium rounded-md px-4 py-2"
        >
          + New Invoice
        </Link>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by client or invoice number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      
      {filteredInvoices.length === 0 ? (
        <p className="text-gray-500">No invoices found.</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="p-3">Client</th>
              <th className="p-3">Invoice #</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{invoice.billTo?.clientName || "—"}</td>
                <td className="p-3">{invoice.invoiceNumber}</td>
                <td className="p-3">{formatDate(invoice.createdAt)}</td>
                <td className="p-3">{formatCurrency(invoice.total)}</td>
                <td className="p-3">
                  <StatusBadge status={invoice.status} />
                </td>
                <td className="p-3">
                  <Link to={`/invoices/${invoice._id}`} className="text-blue-600 text-sm">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllInvoices;