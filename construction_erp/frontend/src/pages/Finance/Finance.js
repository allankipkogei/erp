import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { DollarSign, PlusCircle, RefreshCw, AlertCircle, FileText, TrendingUp, CreditCard, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

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

      const invoicesData = invoicesRes.status === 'fulfilled' 
        ? (invoicesRes.value.data.results || invoicesRes.value.data || [])
        : [];
      
      const expensesData = expensesRes.status === 'fulfilled'
        ? (expensesRes.value.data.results || expensesRes.value.data || [])
        : [];

      setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
    } catch (err) {
      console.error("Error loading finance data:", err);
      setError(err.message || "Failed to load finance data.");
      setInvoices([]);
      setExpenses([]);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading finance data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2">
              Finance Management
            </h1>
            <p className="text-gray-600 text-lg font-medium">Manage invoices, expenses & budgets</p>
          </div>
          <div className="flex gap-3">
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => navigate("/finance/invoice/create")}
            >
              <FileText size={22} />
              New Invoice
            </Button>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => navigate("/finance/expense/create")}
            >
              <Wallet size={22} />
              New Expense
            </Button>
          </div>
        </div>

        {/* Error Alert */}
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={TrendingUp}
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            color="green"
          />
          <StatCard 
            icon={CreditCard}
            title="Total Expenses"
            value={`$${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            color="red"
          />
          <StatCard 
            icon={DollarSign}
            title="Net Profit"
            value={`$${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            color={netProfit >= 0 ? "blue" : "orange"}
          />
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Invoices Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Recent Invoices
              </h2>
              <FileText className="text-green-600" size={32} />
            </div>
            
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-500">No invoices yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{invoice.invoice_number || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{invoice.client || 'Client'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${parseFloat(invoice.amount || 0).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{invoice.status || 'pending'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expenses Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Recent Expenses
              </h2>
              <Wallet className="text-red-600" size={32} />
            </div>
            
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="mx-auto text-gray-300 mb-4" size={64} />
                <p className="text-gray-500">No expenses yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{expense.description || 'Expense'}</p>
                        <p className="text-sm text-gray-600">{expense.category || 'Category'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">${parseFloat(expense.amount || 0).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, color }) => {
  const colorSchemes = {
    green: {
      gradient: "from-green-500 to-emerald-600",
      bg: "from-green-50 to-emerald-100",
      text: "text-green-700",
      border: "border-green-300"
    },
    red: {
      gradient: "from-red-500 to-pink-600",
      bg: "from-red-50 to-pink-100",
      text: "text-red-700",
      border: "border-red-300"
    },
    blue: {
      gradient: "from-blue-500 to-indigo-600",
      bg: "from-blue-50 to-indigo-100",
      text: "text-blue-700",
      border: "border-blue-300"
    },
    orange: {
      gradient: "from-orange-500 to-amber-600",
      bg: "from-orange-50 to-amber-100",
      text: "text-orange-700",
      border: "border-orange-300"
    }
  };

  const scheme = colorSchemes[color];

  return (
    <div className={`bg-gradient-to-br ${scheme.bg} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${scheme.border}`}>
      <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${scheme.gradient} flex items-center justify-center`}>
        <Icon className="text-white" size={28} />
      </div>
      <h3 className="text-sm font-bold text-gray-600 text-center mb-2 uppercase">{title}</h3>
      <p className={`text-3xl font-black text-center ${scheme.text}`}>{value}</p>
    </div>
  );
};
