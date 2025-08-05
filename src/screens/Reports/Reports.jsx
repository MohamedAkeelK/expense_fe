import React, { useEffect, useState, useRef } from "react";
import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { verify, getUserProfile } from "../../services/users";
import api from "../../services/apiConfig";
import { useNavigate } from "react-router-dom";

ChartJS.register(...registerables);

export default function Reports() {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgetRadar, setBudgetRadar] = useState({
    labels: [],
    actual: [],
    budget: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const reportRef = useRef();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const verified = await verify();
        if (!verified) return navigate("/login");

        // Fetch user profile only (includes incomes, expenses, goals)
        const profileData = await getUserProfile(verified.id);

        // Fetch monthly analytics separately
        const timeFiltered = await api.get("/analytics/monthly");

        setIncomes(profileData.incomes || []);
        setExpenses(profileData.expenses || []);
        setGoals(profileData.goals || []);

        // Process expenses for Radar chart budget vs actual
        const catGroups = timeFiltered.data.expenses.reduce((acc, exp) => {
          const cat = exp.category || "Other";
          acc[cat] = (acc[cat] || 0) + exp.amount;
          return acc;
        }, {});

        const radarLabels = Object.keys(catGroups).slice(0, 5);
        const actualSpending = radarLabels.map((cat) => catGroups[cat]);
        const fakeBudgets = actualSpending.map((n) => Math.ceil(n * 1.2));

        setBudgetRadar({
          labels: radarLabels,
          actual: actualSpending,
          budget: fakeBudgets,
        });
      } catch (err) {
        console.error("❌ Error loading report data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  if (loading) return <p className="text-center">Loading reports...</p>;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getMonthlyTotals = (items) => {
    const monthly = Array(12).fill(0);
    items.forEach((item) => {
      if (!item.date || !item.amount) return;
      const month = new Date(item.date).getMonth();
      monthly[month] += Number(item.amount);
    });
    return monthly;
  };

  const spendingByCategory = expenses.reduce((acc, exp) => {
    const cat = exp.category || "Other";
    acc[cat] = (acc[cat] || 0) + Number(exp.amount);
    return acc;
  }, {});

  const incomeSources = incomes.reduce((acc, inc) => {
    const source = inc.source || "Other";
    acc[source] = (acc[source] || 0) + Number(inc.amount);
    return acc;
  }, {});

  const goalLabels = goals.map((g) => g.title);
  const goalProgress = goals.map((g) => Number(g.currentProgress));

  const exportPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("financial_report.pdf");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports & Insights</h1>
        <button
          onClick={exportPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export to PDF
        </button>
      </div>

      <div
        ref={reportRef}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        <ChartCard title="Monthly Income">
          <Bar
            data={{
              labels: months,
              datasets: [
                {
                  label: "Income",
                  data: getMonthlyTotals(incomes),
                  backgroundColor: "rgba(59, 130, 246, 0.6)",
                },
              ],
            }}
          />
        </ChartCard>

        <ChartCard title="Monthly Expenses">
          <Line
            data={{
              labels: months,
              datasets: [
                {
                  label: "Expenses",
                  data: getMonthlyTotals(expenses),
                  borderColor: "#ef4444",
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  fill: true,
                },
              ],
            }}
          />
        </ChartCard>

        <ChartCard title="Spending by Category">
          <Pie
            data={{
              labels: Object.keys(spendingByCategory),
              datasets: [
                {
                  data: Object.values(spendingByCategory),
                  backgroundColor: [
                    "#3b82f6",
                    "#f59e0b",
                    "#ef4444",
                    "#10b981",
                    "#8b5cf6",
                  ],
                },
              ],
            }}
          />
        </ChartCard>

        <ChartCard title="Goal Progress">
          <Doughnut
            data={{
              labels: goalLabels,
              datasets: [
                {
                  data: goalProgress,
                  backgroundColor: ["#0ea5e9", "#f43f5e", "#10b981", "#facc15"],
                },
              ],
            }}
          />
        </ChartCard>

        <ChartCard title="Budget vs Actual">
          <Radar
            data={{
              labels: budgetRadar.labels,
              datasets: [
                {
                  label: "Budget",
                  data: budgetRadar.budget,
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59,130,246,0.2)",
                },
                {
                  label: "Actual",
                  data: budgetRadar.actual,
                  borderColor: "#10b981",
                  backgroundColor: "rgba(16,185,129,0.2)",
                },
              ],
            }}
          />
        </ChartCard>

        <ChartCard title="Income Sources">
          <PolarArea
            data={{
              labels: Object.keys(incomeSources),
              datasets: [
                {
                  data: Object.values(incomeSources),
                  backgroundColor: ["#facc15", "#3b82f6", "#ef4444", "#10b981"],
                },
              ],
            }}
          />
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}
