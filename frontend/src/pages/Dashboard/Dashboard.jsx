import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatCurrency, formatDate } from "../../utils/helper";
import StatusBadge from "../../components/ui/StatusBadge";
import toast from "react-hot-toast";

function Dashboard() {

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICES.GET_ALL);
        setInvoices(response.data.invoices);
      } catch (error) {
        toast.error("Could not load invoices");
      }
      setLoading(false);
    }

    loadInvoices();
  }, []);

  let paidCount = 0;
  let pendingCount = 0;
  let totalRevenue = 0;

  for (let i = 0; i < invoices.length; i++) {
    const invoice = invoices[i];

    if (invoice.status === "paid") {
      paidCount = paidCount + 1;
      totalRevenue = totalRevenue + invoice.totalAmount;
    }

    if (invoice.status === "pending") {
      pendingCount = pendingCount + 1;
    }
  }

  const recentInvoices = invoices.slice(0, 5);

  if (loading) {
    return <p className="p-8 text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="p-8">
      {/* Four simple stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold">{invoices.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Paid</p>
          <p className="text-2xl font-bold">{paidCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Header row for the table */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Recent Invoices</h2>
        <Link to="/invoices" className="text-blue-600 text-sm">
          View All
        </Link>
      </div>

      {recentInvoices.length === 0 ? (
        <p className="text-gray-500">No invoices yet.</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="p-3">Client</th>
              <th className="p-3">Invoice #</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentInvoices.map((invoice) => (
              <tr key={invoice._id} className="border-b">
                <td className="p-3">{invoice.clientName}</td>
                <td className="p-3">{invoice.invoiceNumber}</td>
                <td className="p-3">{formatDate(invoice.createdAt)}</td>
                <td className="p-3">{formatCurrency(invoice.totalAmount)}</td>
                <td className="p-3">
                  <StatusBadge status={invoice.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;