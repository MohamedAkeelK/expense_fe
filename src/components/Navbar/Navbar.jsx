import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaMoneyBill,
  FaPlus,
  FaChartBar,
  FaBullseye,
  FaSignInAlt,
  FaUserPlus,
  FaPiggyBank,
} from "react-icons/fa";

function Navbar({ collapsed, setCollapsed }) {
  const [openMenus, setOpenMenus] = useState({
    expenses: false,
    incomes: false,
    goals: false,
  });

  const toggleSidebar = () => setCollapsed(!collapsed);

  const toggleMenu = (menu) => {
    if (collapsed) return;
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const iconClass = "text-lg";

  return (
    <aside
      className={`h-screen bg-gray-900 text-white fixed top-0 left-0 z-50 
      transition-all duration-300 ease-in-out overflow-hidden 
      ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-2 gap-2">
        <FaPiggyBank className="text-amber-300 text-2xl" />

        <Link
          to="/dashboard"
          className={`2x1 font-bold transition-opacity duration-300 ${
            collapsed ? "opacity-100" : "opacity-100"
          }`}
        >
          {collapsed ? "CC" : "CashCrash"}
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-2 mt-4 px-2">
        <Link
          to="/dashboard"
          className="flex items-center gap-4 py-2 px-3 hover:bg-gray-700 rounded-lg"
        >
          <FaHome className="iconClass text-amber-700" />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        {/* Expenses */}
        {collapsed ? (
          <Link
            to="/expenses"
            className="flex items-center gap-4 py-2 px-3 hover:bg-gray-700 rounded-lg"
          >
            <FaMoneyBill className="text-red-900" />
          </Link>
        ) : (
          <>
            <button
              onClick={() => toggleMenu("expenses")}
              className="flex items-center justify-between w-full py-2 px-3 hover:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <FaMoneyBill className="text-red-900" />
                <span>Expenses</span>
              </div>
              {openMenus.expenses ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenus.expenses && (
              <div className="ml-8 mt-2 flex flex-col gap-2">
                <Link to="/expenses" className="hover:text-gray-400 text-xs">
                  - View Expenses
                </Link>
                <Link
                  to="/expenses/add"
                  className="hover:text-gray-400 text-xs"
                >
                  - Add Expense
                </Link>
              </div>
            )}
          </>
        )}

        {/* Incomes */}
        {collapsed ? (
          <Link
            to="/incomes"
            className="flex items-center gap-4 py-2 px-3 hover:bg-gray-700 rounded-lg"
          >
            <FaPlus className="text-green-500" />
          </Link>
        ) : (
          <>
            <button
              onClick={() => toggleMenu("incomes")}
              className="flex items-center justify-between w-full py-2 px-3 hover:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <FaPlus className="text-green-500" />
                <span>Incomes</span>
              </div>
              {openMenus.incomes ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenus.incomes && (
              <div className="ml-8 mt-2 flex flex-col gap-2">
                <Link to="/incomes" className="hover:text-gray-400 text-xs">
                  - View Incomes
                </Link>
                <Link to="/incomes/add" className="hover:text-gray-400 text-xs">
                  - Add Income
                </Link>
              </div>
            )}
          </>
        )}

        {/* Goals */}
        {collapsed ? (
          <Link
            to="/goals"
            className="flex items-center gap-4 py-2 px-3 hover:bg-gray-700 rounded-lg"
          >
            <FaBullseye className="text-blue-600" />
          </Link>
        ) : (
          <>
            <button
              onClick={() => toggleMenu("goals")}
              className="flex items-center justify-between w-full py-2 px-3 hover:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <FaBullseye className="text-blue-600" />
                <span>Goals</span>
              </div>
              {openMenus.goals ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openMenus.goals && (
              <div className="ml-8 mt-2 flex flex-col gap-2">
                <Link to="/goals" className="hover:text-gray-400 text-xs">
                  - View Goals
                </Link>
                <Link to="/goals/add" className="hover:text-gray-400 text-xs">
                  - Add Goal
                </Link>
              </div>
            )}
          </>
        )}

        {/* Reports */}
        <Link
          to="/reports"
          className="flex items-center gap-4 py-2 px-3 hover:bg-gray-700 rounded-lg"
        >
          <FaChartBar className="iconClass text-teal-700" />
          {!collapsed && <span>Reports</span>}
        </Link>
      </nav>

      {/* Auth Links */}
      <div className="mt-auto px-2 mb-4">
        <Link
          to="/register"
          className="flex items-center gap-4 py-2 px-3 hover:bg-gray-700 rounded-lg"
        >
          <FaUserPlus className={iconClass} />
          {!collapsed && <span>Register</span>}
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-4 py-2 px-3 hover:bg-gray-700 rounded-lg"
        >
          <FaSignInAlt className={iconClass} />
          {!collapsed && <span>Login</span>}
        </Link>
      </div>

      {/* Floating Toggle Button */}
      <div className="absolute -right-3 bottom-4 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-white bg-opacity-10 text-black border-7 border-amber-300 rounded-full p-2 hover:bg-opacity-20 hover:bg-black hover:text-white transition-all duration-1000"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
    </aside>
  );
}

export default Navbar;
