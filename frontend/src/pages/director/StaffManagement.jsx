import React from "react";
import { Users, UserPlus, Settings, Award } from "lucide-react";

const StaffManagement = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-600 mt-1">
          Manage team members and permissions
        </p>
      </div>

      {/* Coming Soon Message */}
      <div className="card p-12 text-center">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Users className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Staff Management System Coming Soon
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          A complete staff management system is under development, including
          employee profiles, role management, performance tracking, and access
          control. This feature will be available in a future update.
        </p>

        {/* Planned Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-blue-50 rounded-lg">
            <UserPlus className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">
              Employee Management
            </h3>
            <p className="text-sm text-gray-600">
              Add, edit, and manage staff profiles and contact information
            </p>
          </div>

          <div className="p-6 bg-green-50 rounded-lg">
            <Settings className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">
              Role & Permissions
            </h3>
            <p className="text-sm text-gray-600">
              Define roles and set granular permissions for system access
            </p>
          </div>

          <div className="p-6 bg-purple-50 rounded-lg">
            <Award className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">
              Performance Tracking
            </h3>
            <p className="text-sm text-gray-600">
              Monitor staff performance and track key metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
