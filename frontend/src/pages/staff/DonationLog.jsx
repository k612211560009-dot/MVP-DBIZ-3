import React, { useState, useEffect } from "react";
import {
  FileText,
  User,
  Calendar,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { api } from "../../services/api";
import { getSafeDonations } from "../../lib/safe-mock-data";

const DonationLog = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [donations, searchTerm, statusFilter, dateFilter]);

  const fetchDonations = async () => {
    try {
      const response = await api.get("/staff/donations");
      setDonations(response.data.data?.donations || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
      // Use mock data as fallback
      setDonations(getSafeDonations() || []);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    // Safety check: ensure donations is an array
    if (!Array.isArray(donations)) {
      setFilteredDonations([]);
      return;
    }

    let filtered = [...donations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (donation) =>
          donation.donorName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          donation.id?.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (donation) => donation.status === statusFilter
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let cutoffDate;

      switch (dateFilter) {
        case "today":
          cutoffDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "week":
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
      }

      if (cutoffDate) {
        filtered = filtered.filter(
          (donation) => new Date(donation.date) >= cutoffDate
        );
      }
    }

    setFilteredDonations(filtered);
  };

  const exportToCsv = () => {
    const headers = [
      "Date",
      "Donor",
      "Volume (mL)",
      "Status",
      "Processing Notes",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredDonations.map((donation) =>
        [
          new Date(donation.date).toLocaleDateString(),
          `"${donation.donorName}"`,
          donation.volume,
          donation.status,
          `"${donation.processingNotes || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donation-log.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "collected":
        return "bg-blue-100 text-blue-800";
      case "processed":
        return "bg-green-100 text-green-800";
      case "stored":
        return "bg-purple-100 text-purple-800";
      case "distributed":
        return "bg-indigo-100 text-indigo-800";
      case "rejected":
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
          <h1 className="text-2xl font-bold text-gray-900">Donation Log</h1>
          <p className="text-gray-600 mt-1">
            Track and manage donation processing
          </p>
        </div>
        <button
          onClick={exportToCsv}
          className="btn-secondary"
          disabled={filteredDonations.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
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
              placeholder="Search by donor or ID..."
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
            <option value="collected">Collected</option>
            <option value="processed">Processed</option>
            <option value="stored">Stored</option>
            <option value="distributed">Distributed</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <div className="text-sm text-gray-500">
            Showing {filteredDonations.length} of {donations.length} donations
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Donation Records
          </h3>
        </div>

        <div className="overflow-x-auto">
          {filteredDonations.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donation ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume (mL)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processed By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{donation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${donation.donorName}&background=2563eb&color=fff`}
                          alt=""
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {donation.donorName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {donation.donorId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(donation.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {donation.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {donation.volume}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          donation.status
                        )}`}
                      >
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.processedBy || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div
                        className="truncate"
                        title={donation.processingNotes}
                      >
                        {donation.processingNotes || "-"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No donation records found</p>
              <p className="text-sm text-gray-400 mt-1">
                {donations.length === 0
                  ? "No donations have been logged yet."
                  : "Try adjusting your filters to see more results."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationLog;
