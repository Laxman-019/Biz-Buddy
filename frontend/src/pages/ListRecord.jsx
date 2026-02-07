import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Layout from "../components/Layout";

const ListRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get("/api/list-record/");
      setRecords(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-6">Business Records</h2>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Business</th>
                <th>Date</th>
                <th>Sales</th>
                <th>Expenses</th>
                <th>Profit</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ListRecords;
