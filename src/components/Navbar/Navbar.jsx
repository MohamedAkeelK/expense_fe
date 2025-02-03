import { Link } from "react-router-dom";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function Navbar() {
  const [openMenus, setOpenMenus] = useState({
    expenses: false,
    incomes: false,
    goals: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4 fixed">
      {/* Logo */}
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold">ExpenseApp</h1>
      </div>

      {/* Main Links */}
      <nav className="flex flex-col flex-1">
        <Link to="/dashboard" className="py-2 px-3 hover:bg-gray-700 rounded-lg">
          Dashboard
        </Link>

        {/* Expenses */}
        <div className="py-2">
          <button
            onClick={() => toggleMenu("expenses")}
            className="flex justify-between items-center w-full px-3 py-2 hover:bg-gray-700 rounded-lg"
          >
            Expenses {openMenus.expenses ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus.expenses && (
            <div className="ml-4 mt-2 space-y-2">
              <Link to="/expenses" className="block hover:text-gray-400">
                View Expenses
              </Link>
              <Link to="/expenses/add" className="block hover:text-gray-400">
                Add New Expense
              </Link>
            </div>
          )}
        </div>

        {/* Incomes */}
        <div className="py-2">
          <button
            onClick={() => toggleMenu("incomes")}
            className="flex justify-between items-center w-full px-3 py-2 hover:bg-gray-700 rounded-lg"
          >
            Incomes {openMenus.incomes ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus.incomes && (
            <div className="ml-4 mt-2 space-y-2">
              <Link to="/incomes" className="block hover:text-gray-400">
                View Incomes
              </Link>
              <Link to="/incomes/add" className="block hover:text-gray-400">
                Add New Income
              </Link>
            </div>
          )}
        </div>

        {/* Goals */}
        <div className="py-2">
          <button
            onClick={() => toggleMenu("goals")}
            className="flex justify-between items-center w-full px-3 py-2 hover:bg-gray-700 rounded-lg"
          >
            Goals {openMenus.goals ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openMenus.goals && (
            <div className="ml-4 mt-2 space-y-2">
              <Link to="/goals" className="block hover:text-gray-400">
                View Goals
              </Link>
              <Link to="/goals/add" className="block hover:text-gray-400">
                Add New Goal
              </Link>
            </div>
          )}
        </div>

        {/* Reports */}
        <Link to="/reports" className="py-2 px-3 hover:bg-gray-700 rounded-lg">
          Reports
        </Link>
      </nav>

      {/* Bottom Links */}
      <div className="mt-auto">
        <Link to="/register" className="block py-2 px-3 hover:bg-gray-700 rounded-lg">
          Register
        </Link>
        <Link to="/login" className="block py-2 px-3 hover:bg-gray-700 rounded-lg">
          Login
        </Link>
      </div>
    </aside>
  );
}

export default Navbar;
