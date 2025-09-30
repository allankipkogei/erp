import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import PaymentForm from "./PaymentForm";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await API.get("payments/");
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await API.delete(`payments/${id}/`);
        fetchPayments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Payments</h2>
        <button
          onClick={() => {
            setSelectedPayment(null);
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Payment
        </button>
      </div>

      {showForm && (
        <PaymentForm
          record={selectedPayment}
          onClose={() => {
            setShowForm(false);
            fetchPayments();
          }}
        />
      )}

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Invoice</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Payment Date</th>
            <th className="px-4 py-2 border">Method</th>
            <th className="px-4 py-2 border">Reference</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">
                  {payment.invoice_number || "—"}
                </td>
                <td className="px-4 py-2 border">Ksh {payment.amount}</td>
                <td className="px-4 py-2 border">{payment.payment_date}</td>
                <td className="px-4 py-2 border">{payment.method}</td>
                <td className="px-4 py-2 border">{payment.reference}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowForm(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(payment.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-2 border text-center" colSpan="6">
                No payments recorded.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
