import React from "react";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";

const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Generate and manage system reports</p>
      </div>

      {/* Coming Soon Message */}
      <div className="card p-12 text-center">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <FileText className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Reporting System Coming Soon
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          A comprehensive reporting system is in development, featuring
          automated reports, custom report builders, scheduled deliveries, and
          export capabilities. This feature will be available in a future
          update.
        </p>

        {/* Planned Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-blue-50 rounded-lg">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">
              Scheduled Reports
            </h3>
            <p className="text-sm text-gray-600">
              Automated daily, weekly, and monthly reports delivered to your
              inbox
            </p>
          </div>

          <div className="p-6 bg-green-50 rounded-lg">
            <Download className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Export Options</h3>
            <p className="text-sm text-gray-600">
              Export reports in PDF, Excel, CSV, and other formats
            </p>
          </div>

          <div className="p-6 bg-purple-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Custom Reports</h3>
            <p className="text-sm text-gray-600">
              Build custom reports with filters, grouping, and calculations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
