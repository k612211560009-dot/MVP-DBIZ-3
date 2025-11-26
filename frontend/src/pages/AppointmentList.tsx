import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Calendar as CalendarIcon,
  Filter,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import { mockAppointments } from "../lib/mock-data";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { toast } from "sonner";

/*
API Endpoints:
GET /api/admin/appointments?date=&staff_id=&status=&type=&page=&per_page=
POST /api/admin/appointments/{id}/check-in
POST /api/admin/appointments/{id}/mark_failed { reason: string, notes: string }
PATCH /api/admin/appointments/{id}/status { status: 'scheduled'|'arrived'|'completed'|'failed' }

Mark Failed Flow:
1. Click "Đánh dấu thất bại" button
2. Show modal with reason selection
3. Required: reason (predefined list or custom)
4. Optional: additional notes
5. On confirm: Update appointment status, send SMS notification to donor
6. Show success toast

Permissions:
- Medical Staff: Can view "My Appointments" only (where staff = current user)
- Director/Admin: Can view "All Appointments"
*/

const failReasons = [
  "Donor didn't show up",
  "Donor cancelled last minute",
  "Donor's health not qualified",
  "Equipment not ready",
  "Other reason",
];

export function AppointmentList() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"all" | "my">("all");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [failReason, setFailReason] = useState("");
  const [failNotes, setFailNotes] = useState("");

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      scheduled: { variant: "secondary", label: "Scheduled" },
      arrived: { variant: "default", label: "Arrived" },
      completed: { variant: "default", label: "Completed" },
      failed: { variant: "destructive", label: "Failed" },
    };
    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline">
        {type === "screening" ? "Screening" : "Donation"}
      </Badge>
    );
  };

  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    const matchesType = typeFilter === "all" || apt.type === typeFilter;
    const matchesDate = !dateFilter || apt.date === dateFilter;
    return matchesStatus && matchesType && matchesDate;
  });

  const handleMarkAsFailed = () => {
    if (!failReason) {
      toast.error("Please select a reason");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success(`Appointment ${selectedAppointment.id} marked as failed`, {
        description: `Notification sent to ${selectedAppointment.donorName}`,
      });
      setIsFailModalOpen(false);
      setFailReason("");
      setFailNotes("");
    }, 500);
  };

  const columns = [
    {
      key: "id",
      header: "Appointment ID",
    },
    {
      key: "donor",
      header: "Donor",
      render: (apt: any) => (
        <div>
          <p>{apt.donorName}</p>
          <p className="text-muted-foreground">{apt.donorId}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Loại",
      render: (apt: any) => getTypeBadge(apt.type),
    },
    {
      key: "datetime",
      header: "Ngày & Giờ",
      render: (apt: any) => (
        <div>
          <p>{apt.date}</p>
          <p className="text-muted-foreground">{apt.time}</p>
        </div>
      ),
    },
    {
      key: "staff",
      header: "Nhân viên",
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (apt: any) => getStatusBadge(apt.status),
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (apt: any) => (
        <div className="flex gap-2">
          {apt.status === "scheduled" && (
            <Button variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Check-in
            </Button>
          )}
          {apt.status === "arrived" && apt.type === "screening" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate(`/screening?appointmentId=${apt.id}`)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Điền phiếu
            </Button>
          )}
          {apt.status === "arrived" && apt.type === "donation" && (
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                navigate(`/record-donation?appointmentId=${apt.id}`)
              }
            >
              <Edit className="h-4 w-4 mr-1" />
              Ghi nhận
            </Button>
          )}
          {(apt.status === "scheduled" || apt.status === "arrived") && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setSelectedAppointment(apt);
                setIsFailModalOpen(true);
              }}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Thất bại
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Appointment List</h1>
          <p className="text-muted-foreground">
            Manage screening and donation appointments
          </p>
        </div>
        <Button onClick={() => navigate("/appointments/new")}>
          Create New Appointment
        </Button>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === "all" ? "default" : "outline"}
          onClick={() => setViewMode("all")}
        >
          All Appointments
        </Button>
        <Button
          variant={viewMode === "my" ? "default" : "outline"}
          onClick={() => setViewMode("my")}
        >
          My Appointments
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-48"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="scheduled">Đã lên lịch</SelectItem>
            <SelectItem value="arrived">Đã đến</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="failed">Thất bại</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="screening">Sàng lọc</SelectItem>
            <SelectItem value="donation">Hiến sữa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        data={filteredAppointments}
        columns={columns}
        emptyMessage="No appointments."
      />

      {/* Mark as Failed Modal */}
      <Dialog open={isFailModalOpen} onOpenChange={setIsFailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Appointment as Failed</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this appointment as failed?
              {selectedAppointment && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p>Donor: {selectedAppointment.donorName}</p>
                  <p>Appointment ID: {selectedAppointment.id}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason *</Label>
              <RadioGroup value={failReason} onValueChange={setFailReason}>
                {failReasons.map((reason) => (
                  <div key={reason} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason} id={reason} />
                    <Label htmlFor={reason} className="cursor-pointer">
                      {reason}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter detailed notes..."
                value={failNotes}
                onChange={(e) => setFailNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsFailModalOpen(false);
                setFailReason("");
                setFailNotes("");
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleMarkAsFailed}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>
            POST /api/admin/appointments/{"{id}"}/mark_failed with reason and
            notes
          </li>
          <li>
            Send SMS notification to donor when appointment is marked as failed
          </li>
          <li>
            Log all status changes with timestamp and user who made the change
          </li>
          <li>
            Calendar mini view shows appointments by date (integrate with date
            filter)
          </li>
          <li>
            Medical Staff can only see appointments where staff =
            current_user_id
          </li>
          <li>Director/Admin can reassign appointments to different staff</li>
        </ul>
      </div>
    </div>
  );
}

export default AppointmentList;
