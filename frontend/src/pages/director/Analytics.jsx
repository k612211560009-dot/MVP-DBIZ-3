import React from "react";
import { BarChart, TrendingUp, PieChart, Activity } from "lucide-react";

const Analytics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Advanced analytics and data visualization
        </p>
      </div>

      {/* Coming Soon Message */}
      <div className="card p-12 text-center">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <BarChart className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Advanced Analytics Coming Soon
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          We're building comprehensive analytics tools including donation
          trends, donor behavior analysis, operational efficiency metrics, and
          financial insights. This feature will be available in a future update.
        </p>

        {/* Planned Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-blue-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Trend Analysis</h3>
            <p className="text-sm text-gray-600">
              Track donation volumes, donor retention, and seasonal patterns
            </p>
          </div>

          <div className="p-6 bg-green-50 rounded-lg">
            <PieChart className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">
              Performance Metrics
            </h3>
            <p className="text-sm text-gray-600">
              Operational KPIs, staff productivity, and resource utilization
            </p>
          </div>

          <div className="p-6 bg-purple-50 rounded-lg">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">
              Real-time Monitoring
            </h3>
            <p className="text-sm text-gray-600">
              Live dashboard with real-time updates and alerts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
