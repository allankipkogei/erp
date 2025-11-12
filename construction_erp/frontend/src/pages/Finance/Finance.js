import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { DollarSign, PlusCircle, RefreshCw, AlertCircle, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navigation/Navbar";

export default function Finance() {
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadFinanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invoicesRes, expensesRes] = await Promise.allSettled([
        api.get("/invoices/"),
        api.get("/expenses/")
      ]);

      const invoicesData = invoicesRes.status === 'fulfilled' ? (invoicesRes.value.data.results || invoicesRes.value.data || []) : [];
      const expensesData = expensesRes.status === 'fulfilled' ? (expensesRes.value.data.results || expensesRes.value.data || []) : [];

      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
    } catch (err) {
      console.error("Error loading finance data:", err);
      setError(err.message || "Failed to load finance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  const totalRevenue = invoices.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600" size={32} />
          </div>
          <p className="mt-6 text-xl text-gray-700 font-semibold">Loading finance data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                Finance & Accounting
              </h1>
              <p className="text-gray-600 text-lg font-medium">Manage invoices, expenses & budgets</p>
            </div>
            <div className="flex gap-3">
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg"
                onClick={() => navigate("/finance/invoice/create")}
              >
                <PlusCircle size={20} />
                New Invoice
              </Button>
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg"
                onClick={() => navigate("/finance/expense/create")}
              >
                <PlusCircle size={20} />
                New Expense
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-500" size={24} />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadFinanceData}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <FinanceStatCard
              title="Total Revenue"
              value={`$${totalRevenue.toFixed(2)}`}
              icon={<TrendingUp size={32} />}
              color="green"
            />
            <FinanceStatCard
              title="Total Expenses"
              value={`$${totalExpenses.toFixed(2)}`}
              icon={<TrendingDown size={32} />}
              color="red"
            />
            <FinanceStatCard
              title="Net Profit"
              value={`$${netProfit.toFixed(2)}`}
              icon={<DollarSign size={32} />}
              color={netProfit >= 0 ? "blue" : "orange"}
            />
          </div>

          {/* Invoices & Expenses Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Invoices */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Invoices</h2>
                <Button size="sm" onClick={() => navigate("/finance/invoice/create")}>
                  <PlusCircle size={16} className="mr-1" />
                  Add
                </Button>
              </div>
              {invoices.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No invoices yet</p>
              ) : (
                <div className="space-y-3">
                  {invoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-400 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900">{invoice.invoice_number || invoice.client || 'Invoice'}</p>
                          <p className="text-sm text-gray-600">${invoice.amount}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.status?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expenses */}
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Expenses</h2>
                <Button size="sm" onClick={() => navigate("/finance/expense/create")}>
                  <PlusCircle size={16} className="mr-1" />
                  Add
                </Button>
              </div>
              {expenses.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No expenses yet</p>
              ) : (
                <div className="space-y-3">
                  {expenses.slice(0, 5).map((expense) => (
                    <div key={expense.id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-red-400 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900">{expense.description || 'Expense'}</p>
                          <p className="text-sm text-gray-600">${expense.amount}</p>
                        </div>
                        <FileText size={20} className="text-red-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const FinanceStatCard = ({ title, value, icon, color }) => {
  const colorSchemes = {
    green: { gradient: "from-green-500 to-emerald-600", bg: "from-green-50 to-emerald-100", text: "text-green-700" },
    red: { gradient: "from-red-500 to-pink-600", bg: "from-red-50 to-pink-100", text: "text-red-700" },
    blue: { gradient: "from-blue-500 to-indigo-600", bg: "from-blue-50 to-indigo-100", text: "text-blue-700" },
    orange: { gradient: "from-orange-500 to-red-600", bg: "from-orange-50 to-red-100", text: "text-orange-700" }
  };

  const scheme = colorSchemes[color];

  return (
    <div className={`bg-gradient-to-br ${scheme.bg} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300`}>
      <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${scheme.gradient} flex items-center justify-center`}>
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-sm font-bold text-gray-600 text-center mb-2 uppercase">{title}</h3>
      <p className={`text-3xl font-black text-center ${scheme.text}`}>{value}</p>
    </div>
  );
};
