import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";

const RECORDS_PER_PAGE = 20;

const ListRecords = () => {

  const [records, setRecords] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRecords();
  }, []);

  // FETCH RECORDS
  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get("/api/list-record/");
      setRecords(
        res.data.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    } catch (error) {
      console.log(error);
    }
  };

  // PAGINATION LOGIC
  const totalPages = Math.ceil(records.length / RECORDS_PER_PAGE);
  const paginatedRecords = records.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // OPEN EDIT MODAL
  const handleEdit = (record) => {
    setEditRecord(record);
    setShowModal(true);
  };

  // HANDLE EDIT CHANGE
  const handleEditChange = (e) => {
    setEditRecord({
      ...editRecord,
      [e.target.name]: e.target.value
    });
  };

  // UPDATE RECORD
  const handleUpdate = async () => {
    try {
      await axiosInstance.put(
        `/api/update-record/${editRecord.id}/`,
        editRecord
      );
      toast.success("Record Updated");
      setShowModal(false);
      fetchRecords();
    } catch {
      toast.error("Update failed");
    }
  };

  // DELETE RECORD
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      const res = await axiosInstance.delete(`/api/delete-record/${id}/`);
      toast.success(res.message);
      // If deleting the last record on the current page, go back one page
      if (paginatedRecords.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      fetchRecords();
    } catch (error) {
      toast.error("Delete failed");
      console.log(error);
    }
  };

  // CSV DATA WITHOUT THE ACTION COLUMN
  const csvHeaders = [
    { label: "Business", key: "business_name" },
    { label: "Date", key: "date" },
    { label: "Sales", key: "sales" },
    { label: "Expenses", key: "expenses" },
    { label: "Profit", key: "profit" },
  ];

  const csvData = records.map((rec) => ({
    business_name: rec.business_name,
    date: rec.date,
    sales: rec.sales,
    expenses: rec.expenses,
    profit: rec.profit,
  }));

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Business Records</h2>
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename="business-records.csv"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <i className="fa-solid fa-file"></i> Export CSV
          </CSVLink>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Business</th>
                <th>Date</th>
                <th>Sales</th>
                <th>Expenses</th>
                <th>Profit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((rec) => (
                <tr key={rec.id} className="text-center">
                  <td className="p-3">{rec.business_name}</td>
                  <td>{rec.date}</td>
                  <td>₹ {rec.sales}</td>
                  <td>₹ {rec.expenses}</td>
                  <td>₹ {rec.profit}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(rec)}
                      className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rec.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-5">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * RECORDS_PER_PAGE + 1}–
              {Math.min(currentPage * RECORDS_PER_PAGE, records.length)} of{" "}
              {records.length} records
            </p>

            <div className="flex items-center gap-1">
              {/* PREV */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &laquo;
              </button>

              {/* PAGE NUMBERS */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md border text-sm font-medium transition ${currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              ))}

              {/* NEXT */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &raquo;
              </button>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showModal && editRecord && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-white p-6 w-96 rounded-2xl shadow-2xl animate-scaleIn">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">Edit Record</h3>
              <input
                type="text"
                name="business_name"
                value={editRecord.business_name}
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-3 rounded-xl mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Business Name"
              />
              <input
                type="date"
                name="date"
                value={editRecord.date}
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-3 rounded-xl mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="number"
                name="sales"
                value={editRecord.sales}
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-3 rounded-xl mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Sales"
              />
              <input
                type="number"
                name="expenses"
                value={editRecord.expenses}
                onChange={handleEditChange}
                className="w-full border border-gray-300 p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Expenses"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default ListRecords;