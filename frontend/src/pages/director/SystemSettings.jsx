import React from "react";
import { Settings, Shield, Database, Bell } from "lucide-react";

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure system preferences and settings
        </p>
      </div>

      {/* Coming Soon Message */}
      <div className="card p-12 text-center">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Settings className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          System Configuration Coming Soon
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          A comprehensive system settings panel is being developed, including
          security settings, notification preferences, data management tools,
          and system configuration options. This feature will be available in a
          future update.
        </p>

        {/* Planned Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-blue-50 rounded-lg">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">
              Security Settings
            </h3>
            <p className="text-sm text-gray-600">
              Configure authentication, access controls, and security policies
            </p>
          </div>

          <div className="p-6 bg-green-50 rounded-lg">
            <Bell className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Notifications</h3>
            <p className="text-sm text-gray-600">
              Manage email notifications, alerts, and communication preferences
            </p>
          </div>

          <div className="p-6 bg-purple-50 rounded-lg">
            <Database className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Data Management</h3>
            <p className="text-sm text-gray-600">
              Backup settings, data retention policies, and system maintenance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
