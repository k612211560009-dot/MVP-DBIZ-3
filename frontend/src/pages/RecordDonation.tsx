import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Alert, AlertDescription } from "../components/ui/alert";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Droplet } from "lucide-react";
import { donationVisitAPI } from "../services/donationVisitAPI";

/*
API Endpoint:
POST /api/admin/appointments/{id}/donation

Request body:
{
  donorId: string,
  healthStatus: 'good' | 'bad',
  volume: number,  // ml
  containers: number,
  timestamp: string,
  notes: string,
  staffId: string
}

Workflow:
1. Select donor (or pre-fill from appointment)
2. Check donor health status (Good/Bad)
3. If Bad: Set volume & containers to 0, show warning
4. If Good: Enter volume (ml) and number of containers
5. Add notes
6. Save: Update donation log, award points based on volume, send notification to donor

Points calculation:
- Based on reward rules configured in system
- Default: 100-299ml = 5 points, 300-499ml = 10 points, 500+ml = 15 points

Validation:
- Health status required
- If health = good, volume must be > 0
- If health = bad, volume must be 0
- Container count must match volume (roughly 150-200ml per container)
*/

export function RecordDonation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const visitId = searchParams.get("visitId");

  const [visit, setVisit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<"good" | "bad" | "">("");
  const [volume, setVolume] = useState("");
  const [containers, setContainers] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load visit data if visitId provided
  useEffect(() => {
    if (visitId) {
      loadVisitData();
    } else {
      setLoading(false);
    }
  }, [visitId]);

  const loadVisitData = async () => {
    try {
      setLoading(true);
      const response = await donationVisitAPI.getVisitById(visitId!);
      setVisit(response.data.visit);
    } catch (error: any) {
      console.error("Load visit error:", error);
      toast.error("Failed to load visit data", {
        description: error.response?.data?.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const donorInfo = visit?.donor
    ? {
        id: visit.donor.donor_id,
        name: visit.donor.user?.name || "N/A",
        ehrId: visit.donor.ehr_id || "N/A",
      }
    : {
        id: "MB-000125",
        name: "Lê Thị C",
        ehrId: "EHR-12347",
      };

  const calculatePoints = (volumeMl: number): number => {
    if (volumeMl >= 500) return 15;
    if (volumeMl >= 300) return 10;
    if (volumeMl >= 100) return 5;
    return 0;
  };

  const estimatedPoints =
    healthStatus === "good" && volume ? calculatePoints(Number(volume)) : 0;

  const handleSubmit = async () => {
    // Validation
    if (!healthStatus) {
      toast.error("Please select health status");
      return;
    }

    if (healthStatus === "good") {
      if (!volume || Number(volume) <= 0) {
        toast.error("Please enter milk volume");
        return;
      }
      if (!containers || Number(containers) <= 0) {
        toast.error("Please enter container count");
        return;
      }
    }

    if (!visitId) {
      toast.error("Visit ID is required");
      return;
    }

    setIsSaving(true);

    try {
      const actualVolume = healthStatus === "good" ? Number(volume) : 0;

      const response = await donationVisitAPI.recordDonation(visitId, {
        health_status: healthStatus,
        milk_volume_ml: actualVolume,
        container_count: Number(containers) || 0,
        health_notes: notes,
        quality_notes: healthStatus === "good" ? "Normal" : "Not collected",
      });

      const pointsAwarded = response.data.pointsAwarded || 0;

      toast.success("Milk donation recorded successfully", {
        description: `${actualVolume}ml recorded. ${pointsAwarded} points awarded to donor.`,
      });

      // Navigate to donation log after short delay
      setTimeout(() => {
        navigate("/donations");
      }, 1500);
    } catch (error: any) {
      console.error("Record donation error:", error);
      toast.error("Failed to record donation", {
        description: error.response?.data?.message || "Please try again",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Loading visit data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1>Ghi nhận lần hiến sữa</h1>
        <p className="text-muted-foreground">Nhập thông tin lần hiến sữa mới</p>
      </div>

      {/* Donor Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin Donor</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-muted-foreground">Donor ID</label>
            <p>{donorInfo.id}</p>
          </div>
          <div>
            <label className="text-muted-foreground">Họ và tên</label>
            <p>{donorInfo.name}</p>
          </div>
          <div>
            <label className="text-muted-foreground">EHR ID</label>
            <p>{donorInfo.ehrId}</p>
          </div>
        </CardContent>
      </Card>

      {/* Health Check */}
      <Card>
        <CardHeader>
          <CardTitle>Kiểm tra sức khỏe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tình trạng sức khỏe hiện tại *</Label>
            <RadioGroup
              value={healthStatus}
              onValueChange={(value: any) => {
                setHealthStatus(value);
                if (value === "bad") {
                  setVolume("0");
                  setContainers("0");
                }
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="health-good" />
                <Label
                  htmlFor="health-good"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Tốt - Đủ điều kiện hiến sữa
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bad" id="health-bad" />
                <Label
                  htmlFor="health-bad"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  Không tốt - Không đủ điều kiện
                </Label>
              </div>
            </RadioGroup>
          </div>

          {healthStatus === "bad" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Donor không đủ điều kiện sức khỏe. Lượng sữa và số container sẽ
                được đặt về 0. Vui lòng ghi chú lý do cụ thể.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Donation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin hiến sữa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="volume">
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4" />
                  Lượng sữa (ml) *
                </div>
              </Label>
              <Input
                id="volume"
                type="number"
                min="0"
                step="10"
                placeholder="0"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                disabled={healthStatus === "bad"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="containers">Số container *</Label>
              <Input
                id="containers"
                type="number"
                min="0"
                placeholder="0"
                value={containers}
                onChange={(e) => setContainers(e.target.value)}
                disabled={healthStatus === "bad"}
              />
            </div>
          </div>

          {healthStatus === "good" && volume && Number(volume) > 0 && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Donor sẽ nhận được <strong>{estimatedPoints} điểm</strong> cho
                lần hiến sữa này.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú về lần hiến sữa (nếu có)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4>Tóm tắt</h4>
            <div className="mt-2 space-y-1 text-muted-foreground">
              <p>
                Donor: {donorInfo.name} ({donorInfo.id})
              </p>
              <p>
                Sức khỏe:{" "}
                {healthStatus === "good"
                  ? "✓ Tốt"
                  : healthStatus === "bad"
                  ? "✗ Không tốt"
                  : "- Chưa chọn"}
              </p>
              <p>Lượng sữa: {volume || 0}ml</p>
              <p>Số container: {containers || 0}</p>
              <p>Điểm thưởng: {estimatedPoints} điểm</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/appointments")}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving || !healthStatus}>
          {isSaving ? "Đang lưu..." : "Lưu ghi nhận"}
        </Button>
      </div>

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>
            POST /api/admin/appointments/{"{id}"}/donation - Save donation
            record
          </li>
          <li>
            Automatically calculate points based on reward rules from system
            config
          </li>
          <li>Update donor's total donation volume and point balance</li>
          <li>
            Send SMS notification to donor with donation summary and points
          </li>
          <li>
            If health status = bad, require detailed notes explaining reason
          </li>
          <li>
            Container validation: warn if container count doesn't match volume
            ratio
          </li>
          <li>
            Permission: Medical Staff can record, Director can edit/delete
            records
          </li>
          <li>
            Barcode scanner integration for container tracking (future
            enhancement)
          </li>
        </ul>
      </div>
    </div>
  );
}

export default RecordDonation;
