import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { listTransactionsAPI, deleteTransactionAPI } from "../../services/transactions/transactionService";
import { listCategoriesAPI } from "../../services/category/categoryService";
import { useFilters } from "../../FilterProvider";

const TransactionList = () => {
  const { filters, setFilters } = useFilters();
  const [searchTerm, setSearchTerm] = useState("");
  // const [filters, setFilters] = useState({
  //   startDate: "",
  //   endDate: "",
  //   type: "",
  //   category: "",
  // });


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });

  // Fetch transactions
  const {
    data: transactions,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryFn: () => listTransactionsAPI(filters),
    queryKey: ["list-transactions", filters],
  });


  // Delete transaction mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTransactionAPI,
    onSuccess: () => {
      refetch(); // refresh list after delete
    },
  });

  // ✅ Define handleDelete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteMutation.mutate(id);
    }
  };

  // Filter transactions based on searchTerm
  const filteredTransactions = transactions?.filter((transaction) => {
    const categoryName = transaction.category?.name || transaction.category || "";
    const description = transaction.description || "";
    const lowerSearchTerm = searchTerm.toLowerCase();

    return (
      categoryName.toLowerCase().includes(lowerSearchTerm) ||
      description.toLowerCase().includes(lowerSearchTerm)
    );
  });

  return (
    <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Start Date */}
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="p-2 rounded-lg border-b-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
        {/* End Date */}
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="p-2 rounded-lg border-b-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
        {/* Type */}
        <div className="relative">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-b-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        {/* Category */}
        <div className="relative">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-b-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none"
          >
            <option value="All">All Categories</option>
            <option value="Uncategorized">Uncategorized</option>
            {categoriesData?.map((category) => (
              <option key={category?._id} value={category?.name}>
                {category?.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
        <div className="md:flex items-center justify-between mb-4 space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">
            Filtered Transactions
          </h3>

          {/* 2. Search input updates searchTerm */}
          <input
            type="text"
            placeholder="Search Transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border font-semibold text-gray-500 shadow-sm shadow-gray-400 w-full max-w-[350px] px-2 py-1.5 rounded-md outline-none"
          />
        </div>
        <ul className="list-disc pl-5 space-y-2">
          {/* 3. Map over filteredTransactions instead of transactions */}
          {filteredTransactions?.map((transaction) => (
            <li
              key={transaction._id}
              className="bg-white p-3 rounded-md shadow border border-gray-200 flex justify-between items-start"
            >
              <div className="space-y-2">
                <span className="font-medium text-gray-600">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
                <span
                  className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === "income"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  {transaction.type.charAt(0).toUpperCase() +
                    transaction.type.slice(1)}
                </span>

                <p className="text-gray-800 font-bold">
                  Rs.{transaction.amount.toLocaleString()}
                </p>

                <span className="text-gray-800 font-semibold flex items-center gap-2">
                  <p className="capitalize">
                    {transaction.category?.name || transaction.category} -
                  </p>
                  <p className="text-sm text-gray-600 italic font-semibold">
                    {transaction.description}
                  </p>
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDelete(transaction._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionList;
