import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

const ListRecords = () => {

  const [records, setRecords] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  // FETCH RECORDS
  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get("/api/list-record/");
      setRecords(res.data);
    } catch (error) {
      console.log(error);
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
      fetchRecords();
    } catch (error){
      toast.error(res.message);
      console.log(error)
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">

        <h2 className="text-2xl font-bold mb-6">
          Business Records
        </h2>

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
              {records.map((rec) => (
                <tr key={rec.id} className="border-b text-center">

                  <td className="p-3">{rec.business_name}</td>
                  <td>{rec.date}</td>
                  <td>₹ {rec.sales}</td>
                  <td>₹ {rec.expenses}</td>
                  <td>₹ {rec.profit}</td>

                  <td className="space-x-2">

                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => handleEdit(rec)}
                      className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>

                    {/* DELETE BUTTON */}
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

        {/* EDIT MODAL */}
        {showModal && editRecord && (

          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

              <h3 className="text-xl font-bold mb-4">
                Edit Record
              </h3>

              <input
                type="text"
                name="business_name"
                value={editRecord.business_name}
                onChange={handleEditChange}
                className="w-full border p-2 rounded mb-3"
              />

              <input
                type="date"
                name="date"
                value={editRecord.date}
                onChange={handleEditChange}
                className="w-full border p-2 rounded mb-3"
              />

              <input
                type="number"
                name="sales"
                value={editRecord.sales}
                onChange={handleEditChange}
                className="w-full border p-2 rounded mb-3"
              />

              <input
                type="number"
                name="expenses"
                value={editRecord.expenses}
                onChange={handleEditChange}
                className="w-full border p-2 rounded mb-4"
              />

              <div className="flex justify-end gap-3">

                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
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
