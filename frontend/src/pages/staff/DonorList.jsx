import React, { useState, useEffect } from "react";
import { Users, Search, Filter, Eye, Edit, UserPlus } from "lucide-react";
import { api } from "../../services/api";

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [donors, searchTerm, statusFilter]);

  const fetchDonors = async () => {
    try {
      const response = await api.get("/staff/donors");
      setDonors(response.data.data?.donors || []);
    } catch (error) {
      console.error("Error fetching donors:", error);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    // Safety check: ensure donors is an array
    if (!Array.isArray(donors)) {
      setFilteredDonors([]);
      return;
    }

    let filtered = [...donors];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (donor) =>
          donor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.phoneNumber?.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((donor) => donor.status === statusFilter);
    }

    setFilteredDonors(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donor Management</h1>
          <p className="text-gray-600 mt-1">
            Manage donor profiles and information
          </p>
        </div>
        <button className="btn-primary">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Donor
        </button>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search donors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          <div className="text-sm text-gray-500">
            Showing {filteredDonors.length} of {donors.length} donors
          </div>
        </div>
      </div>

      {/* Donors Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Donor List</h3>
        </div>

        <div className="overflow-x-auto">
          {filteredDonors.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Donation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Donations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${donor.fullName}&background=2563eb&color=fff`}
                          alt=""
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {donor.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {donor.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donor.email}</div>
                      <div className="text-sm text-gray-500">
                        {donor.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          donor.status
                        )}`}
                      >
                        {donor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donor.lastDonation
                        ? new Date(donor.lastDonation).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donor.totalDonations || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No donors found</p>
              <p className="text-sm text-gray-400 mt-1">
                {donors.length === 0
                  ? "No donors registered yet."
                  : "Try adjusting your filters to see more results."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorList;
