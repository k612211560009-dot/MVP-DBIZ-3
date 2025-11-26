import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Plus, Edit, Trash2, Play } from "lucide-react";
import { mockRewardRules } from "../lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Switch } from "../components/ui/switch";
import { toast } from "sonner";

export function Rewards() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    volumeThreshold: "",
    points: "",
    effectiveFrom: "",
    effectiveTo: "",
    active: true,
  });
  const [simulationVolume, setSimulationVolume] = useState("");

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.volumeThreshold ||
      !formData.points ||
      !formData.effectiveFrom
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    toast.success(editingRule ? "Đã cập nhật quy tắc" : "Đã tạo quy tắc mới");
    setIsCreateModalOpen(false);
    setEditingRule(null);
    setFormData({
      name: "",
      volumeThreshold: "",
      points: "",
      effectiveFrom: "",
      effectiveTo: "",
      active: true,
    });
  };

  const handleEdit = (rule: any) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      volumeThreshold: rule.volumeThreshold.toString(),
      points: rule.points.toString(),
      effectiveFrom: rule.effectiveFrom,
      effectiveTo: rule.effectiveTo || "",
      active: rule.active,
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = (ruleId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa quy tắc này?")) {
      toast.success("Đã xóa quy tắc");
    }
  };

  const calculateSimulation = () => {
    const volume = Number(simulationVolume);
    if (!volume) return null;

    const applicableRule = mockRewardRules
      .filter((r) => r.active && volume >= r.volumeThreshold)
      .sort((a, b) => b.volumeThreshold - a.volumeThreshold)[0];

    return applicableRule || null;
  };

  const simulationResult = calculateSimulation();

  const columns = [
    {
      key: "name",
      header: "Tên quy tắc",
    },
    {
      key: "volumeThreshold",
      header: "Ngưỡng (ml)",
      render: (rule: any) => `≥ ${rule.volumeThreshold}ml`,
    },
    {
      key: "points",
      header: "Điểm thưởng",
      render: (rule: any) => (
        <Badge variant="default">{rule.points} điểm</Badge>
      ),
    },
    {
      key: "effectiveFrom",
      header: "Hiệu lực từ",
    },
    {
      key: "effectiveTo",
      header: "Hiệu lực đến",
      render: (rule: any) => rule.effectiveTo || "Không giới hạn",
    },
    {
      key: "active",
      header: "Trạng thái",
      render: (rule: any) => (
        <Badge variant={rule.active ? "default" : "secondary"}>
          {rule.active ? "Hoạt động" : "Tạm dừng"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (rule: any) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(rule)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(rule.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Cấu hình quà tặng & điểm thưởng</h1>
          <p className="text-muted-foreground">
            Quản lý quy tắc tính điểm cho donor
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingRule(null);
            setFormData({
              name: "",
              volumeThreshold: "",
              points: "",
              effectiveFrom: "",
              effectiveTo: "",
              active: true,
            });
            setIsCreateModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo quy tắc mới
        </Button>
      </div>

      {/* Simulation Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Mô phỏng tính điểm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="simulation">Nhập lượng sữa để tính điểm</Label>
              <Input
                id="simulation"
                type="number"
                placeholder="Nhập số ml..."
                value={simulationVolume}
                onChange={(e) => setSimulationVolume(e.target.value)}
              />
            </div>
            <Button onClick={() => setSimulationVolume("")}>
              <Play className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </div>
          {simulationResult && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-muted-foreground mb-2">Kết quả:</p>
              <p>
                Với <strong>{simulationVolume}ml</strong> sữa, donor sẽ nhận
                được <strong>{simulationResult.points} điểm</strong> theo quy
                tắc "{simulationResult.name}"
              </p>
            </div>
          )}
          {simulationVolume && !simulationResult && (
            <div className="p-4 bg-muted rounded-lg border">
              <p className="text-muted-foreground">
                Không có quy tắc nào áp dụng cho lượng sữa này
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rules Table */}
      <DataTable
        data={mockRewardRules}
        columns={columns}
        emptyMessage="Chưa có quy tắc nào. Tạo quy tắc mới để bắt đầu."
      />

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Chỉnh sửa quy tắc" : "Tạo quy tắc mới"}
            </DialogTitle>
            <DialogDescription>
              Cấu hình điểm thưởng dựa trên lượng sữa hiến
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên quy tắc *</Label>
              <Input
                id="name"
                placeholder="VD: Mức cơ bản, Mức khuyến khích..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="threshold">Ngưỡng tối thiểu (ml) *</Label>
                <Input
                  id="threshold"
                  type="number"
                  placeholder="100"
                  value={formData.volumeThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      volumeThreshold: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Điểm thưởng *</Label>
                <Input
                  id="points"
                  type="number"
                  placeholder="5"
                  value={formData.points}
                  onChange={(e) =>
                    setFormData({ ...formData, points: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">Hiệu lực từ *</Label>
                <Input
                  id="from"
                  type="date"
                  value={formData.effectiveFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, effectiveFrom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">Hiệu lực đến</Label>
                <Input
                  id="to"
                  type="date"
                  value={formData.effectiveTo}
                  onChange={(e) =>
                    setFormData({ ...formData, effectiveTo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
              <Label htmlFor="active">Kích hoạt ngay</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleSave}>
              {editingRule ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>GET /api/admin/reward-rules - List all reward rules</li>
          <li>POST /api/admin/reward-rules - Create new rule</li>
          <li>PATCH /api/admin/reward-rules/{"{id}"} - Update existing rule</li>
          <li>
            DELETE /api/admin/reward-rules/{"{id}"} - Delete rule (soft delete
            recommended)
          </li>
          <li>
            Rules applied from highest to lowest threshold (best match wins)
          </li>
          <li>Only one rule applies per donation (not cumulative)</li>
          <li>
            Active rules with overlapping thresholds: highest threshold wins
          </li>
          <li>
            Audit trail: Log all changes to reward rules with user and timestamp
          </li>
          <li>Permission: Only Director/Admin can create/edit/delete rules</li>
        </ul>
      </div>
    </div>
  );
}

export default Rewards;
