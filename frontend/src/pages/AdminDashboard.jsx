import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 5;

  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/leads", {
        params: { search, course }
      });
      setLeads(res.data);
    } catch (err) {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id) => {
    try {
      await API.put(`/admin/leads/${id}`, {
        status: "contacted"
      });

      toast.success("Status updated successfully");
      fetchLeads();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const logout = async () => {
    await API.post("/admin/logout");
    toast.success("Logged out successfully");
     window.location.replace("/admin");
  };

  useEffect(() => {
    setCurrentPage(1); // reset page when filter/search changes
    fetchLeads();
  }, [search, course]);

  // Pagination Logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(leads.length / leadsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-64 shadow-sm"
        />

        <input
          type="text"
          placeholder="Filter by course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="border p-2 rounded w-full md:w-48 shadow-sm"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-600 mb-4">
          Loading leads...
        </div>
      )}

      {/* Table */}
      {!loading && (
        <>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentLeads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-500">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  currentLeads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      className={
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }
                    >
                      <td className="p-3">{lead.name}</td>
                      <td className="p-3">{lead.email}</td>
                      <td className="p-3">{lead.course}</td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            lead.status === "new"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-green-200 text-green-800"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      <td className="p-3">
                        {lead.status === "new" && (
                          <button
                            onClick={() => updateStatus(lead.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow"
                          >
                            Mark Contacted
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
