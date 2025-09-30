import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import InvoiceForm from "./InvoiceForm";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchInvoices = async () => {
    try {
      const res = await API.get("invoices/");
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await API.delete(`invoices/${id}/`);
        fetchInvoices();
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <button
          onClick={() => {
            setSelectedInvoice(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Invoice
        </button>
      </div>

      {showForm && (
        <InvoiceForm
          record={selectedInvoice}
          onClose={() => {
            setShowForm(false);
            fetchInvoices();
          }}
        />
      )}

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Invoice Number</th>
            <th className="px-4 py-2 border">Client</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Date Issued</th>
            <th className="px-4 py-2 border">Due Date</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{invoice.invoice_number}</td>
                <td className="px-4 py-2 border">{invoice.client}</td>
                <td className="px-4 py-2 border">Ksh {invoice.amount}</td>
                <td className="px-4 py-2 border">{invoice.date_issued}</td>
                <td className="px-4 py-2 border">{invoice.due_date}</td>
                <td className="px-4 py-2 border">{invoice.status}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowForm(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-2 border text-center" colSpan="7">
                No invoices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;
