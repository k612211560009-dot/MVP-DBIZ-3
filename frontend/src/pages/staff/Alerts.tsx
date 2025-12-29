import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { CheckCircle, Mail, UserPlus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../services/api";

export function Alerts() {
  const [statusFilter, setStatusFilter] = useState("unread");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [statusFilter, priorityFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (priorityFilter !== "all") params.priority = priorityFilter;

      const response = await api.get("/notifications", { params });
      setNotifications(response.data.data?.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = notifications;

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      high: { variant: "destructive", label: "High" },
      medium: { variant: "secondary", label: "Medium" },
      low: { variant: "outline", label: "Low" },
    };
    const config = variants[priority] || {
      variant: "secondary",
      label: priority,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      new_donor_registration: "New Donor Registration",
      new_appointment: "New Appointment",
      test_expiring: "Test Expiring",
      screening_incomplete: "Screening Incomplete",
      unsigned_consent: "Consent Unsigned",
      payment_pending: "Payment Pending",
    };
    return labels[type] || type;
  };

  const handleMarkResolved = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/status`, {
        status: "resolved",
      });
      toast.success("Notification marked as resolved");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to update notification");
    }
  };

  const handleSendReminder = (notification: any) => {
    const donorName = notification.metadata?.donor_name || "Donor";
    toast.success(`Reminder sent to ${donorName}`);
  };

  const columns = [
    {
      key: "priority",
      header: "Priority",
      render: (notif: any) => getPriorityBadge(notif.priority),
    },
    {
      key: "type",
      header: "Type",
      render: (notif: any) => getTypeLabel(notif.type),
    },
    {
      key: "donor",
      header: "Donor",
      render: (notif: any) => (
        <div>
          <p>{notif.metadata?.donor_name || "N/A"}</p>
          <p className="text-sm text-muted-foreground">
            {notif.metadata?.donor_email || ""}
          </p>
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
    },
    {
      key: "message",
      header: "Message",
    },
    {
      key: "created_at",
      header: "Created Date",
      render: (notif: any) =>
        new Date(notif.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "actions",
      header: "Actions",
      render: (notif: any) => (
        <div className="flex gap-2">
          {notif.status !== "resolved" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkResolved(notif.notification_id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Resolved
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendReminder(notif)}
              >
                <Mail className="h-4 w-4 mr-1" />
                Send Reminder
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const unreadCount = notifications.filter(
    (n: any) => n.status === "unread"
  ).length;
  const highPriorityCount = notifications.filter(
    (n: any) => n.status === "unread" && n.priority === "high"
  ).length;
  const resolvedCount = notifications.filter(
    (n: any) => n.status === "resolved"
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Alert Management</h1>
        <p className="text-muted-foreground">
          Monitor and handle system alerts
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Unread Notifications</p>
                <h2>{unreadCount}</h2>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">High Priority</p>
                <h2>{highPriorityCount}</h2>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Resolved</p>
                <h2>{resolvedCount}</h2>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "unread" ? "default" : "outline"}
            onClick={() => setStatusFilter("unread")}
          >
            Unread
          </Button>
          <Button
            variant={statusFilter === "read" ? "default" : "outline"}
            onClick={() => setStatusFilter("read")}
          >
            Read
          </Button>
          <Button
            variant={statusFilter === "resolved" ? "default" : "outline"}
            onClick={() => setStatusFilter("resolved")}
          >
            Resolved
          </Button>
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={priorityFilter === "high" ? "destructive" : "outline"}
            onClick={() =>
              setPriorityFilter(priorityFilter === "high" ? "all" : "high")
            }
          >
            High
          </Button>
          <Button
            variant={priorityFilter === "medium" ? "default" : "outline"}
            onClick={() =>
              setPriorityFilter(priorityFilter === "medium" ? "all" : "medium")
            }
          >
            Medium
          </Button>
          <Button
            variant={priorityFilter === "low" ? "secondary" : "outline"}
            onClick={() =>
              setPriorityFilter(priorityFilter === "low" ? "all" : "low")
            }
          >
            Low
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredAlerts}
        columns={columns}
        emptyMessage="No alerts found"
      />
    </div>
  );
}
export default Alerts;
