import { useState, useEffect } from "react";
import { transactionsData } from "./data/mockData";
import SummaryCard from "./components/SummaryCard";
import ChartSection from "./components/ChartSection";
import Transactions from "./components/Transactions";
import Insights from "./components/Insights";
import Sidebar from "./components/Sidebar";
import AddTransactionModal from "./components/AddTransactionModal";
import LineChart from "./components/LineChart";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : transactionsData;
  });

  const [role, setRole] = useState("Viewer");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  //  Calculations
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  //  Add Transaction
  const handleAddTransaction = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  // Delete Transaction
  const handleDeleteTransaction = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
  };

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">

      {/* Sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="w-full md:ml-64 p-4 md:p-6">

        {/*  Mobile Header */}
        <div className="md:hidden mb-4">
          <h1 className="text-xl font-bold">💰 Finance Dashboard</h1>
        </div>

        {/*  Desktop Header */}
        <h1 className="hidden md:block text-3xl font-bold mb-6">
           Dashboard
        </h1>

        {/* Role Switch */}
        <select
          className="mb-4 p-2 rounded-lg bg-gray-700 text-white w-full md:w-auto"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>Viewer</option>
          <option>Admin</option>
        </select>

        <p className="mb-2">Current Role: {role}</p>

        {/* Admin Button */}
        {role === "Admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 px-4 py-2 rounded-lg mb-4 hover:scale-105 transition w-full md:w-auto"
          >
            + Add Transaction
          </button>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6">
          <SummaryCard title="Balance" value={balance} />
          <SummaryCard title="Income" value={income} />
          <SummaryCard title="Expense" value={expense} />
        </div>

        {/* Charts */}
        <ChartSection transactions={transactions} />
        <LineChart transactions={transactions} />

        {/* Transactions */}
        <Transactions
          transactions={transactions}
          onDelete={handleDeleteTransaction}
        />

        {/* Insights */}
        <Insights transactions={transactions} />
      </div>

      {/*  Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
}

export default App;