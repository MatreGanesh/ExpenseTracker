import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { listTransactionsAPI } from "../../services/transactions/transactionService";
import { useFilters } from "../../FilterProvider";

ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionChart = () => {
  const { filters } = useFilters();

  const { data: transactions } = useQuery({
    queryFn: () => listTransactionsAPI(filters),
    queryKey: ["list-transactions", filters],
  });

  // const {
  //   data: transactions,
  //   isError,
  //   isLoading,
  //   isFetched,
  //   error,
  //   refetch,
  // } = useQuery({
  //   queryFn: listTransactionsAPI,
  //   queryKey: ["list-transactions"],
  // });

  //! calculate total income and expense
  const totals = transactions?.reduce(
    (acc, transaction) => {
      if (transaction?.type === "income") {
        acc.income += transaction?.amount;
      } else {
        acc.expense += transaction?.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );


  const balance = (totals?.income ?? 0) - (totals?.expense ?? 0);

  //! Data structure for the chart
  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Transactions",
        data: [totals?.income, totals?.expense],
        backgroundColor: ["#36A2EB", "#FF6384"],
        borderColor: ["#36A2EB", "#FF6384"],
        borderWith: 1,
        hoverOffset: 4,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 25,
          boxWidth: 12,
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Income vs Expense",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
    cutout: "70%",
  };



  return (
    <div className="flex justify-center my-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="w-full max-w-7xl">
        <h1 className="text-2xl font-bold text-center mb-6">Transaction Overview</h1>

        {/* Responsive flex container: column on small, row on md+ */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full h-auto md:h-[350px] gap-6">

          {/* Chart section: full width on small, half on md+ */}
          <div className="w-full md:w-1/2 h-auto md:h-full">
            <Doughnut data={data} options={options} className=" max-h-[350px]" />
          </div>

          {/* Stats section: full width on small, half on md+ */}
          <div className="w-full md:w-1/2 space-y-6 px-4 md:px-0">
            <div className="flex flex-col sm:flex-row items-center justify-evenly gap-4">
              <div className="w-full sm:w-2xl max-w-sm border text-center shadow-sm p-4 rounded-md space-y-4">
                <h2 className="text-sm md:text-xl font-bold">Total Income</h2>
                <p className="text-lg md:text-4xl font-bold text-green-500">
                  Rs.{totals?.income ?? 0}
                </p>
              </div>
              <div className="w-full sm:w-2xl max-w-sm border text-center shadow-sm p-4 rounded-md space-y-4">
                <h2 className="text-sm md:text-xl font-bold">Total Expense</h2>
                <p className="text-lg md:text-4xl font-bold text-red-500">
                  Rs.{totals?.expense ?? 0}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center mt-4">
              <div className="w-full sm:w-2xl max-w-sm border text-center shadow-sm p-4 rounded-md space-y-4">
                <h2 className="text-sm md:text-xl font-bold">Total Balance</h2>
                <p
                  className={`text-lg md:text-4xl font-bold ${balance < 0 ? "text-red-500" : "text-green-500"
                    }`}
                >
                  Rs.{balance}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default TransactionChart;
