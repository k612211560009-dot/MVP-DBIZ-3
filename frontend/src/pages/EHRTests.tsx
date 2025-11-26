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
import { RefreshCw, CheckCircle, AlertTriangle, Flag } from "lucide-react";
import { mockEHRTests } from "../lib/mock-data";

/*
API Endpoints:
GET /api/admin/ehr-tests/status - Get extraction job status
POST /api/admin/ehr-tests/extract - Trigger manual extraction
GET /api/admin/ehr-tests?donor_id=&validity=&test_type=
PATCH /api/admin/ehr-tests/{id}/verify - Manual verification
POST /api/admin/ehr-tests/{id}/flag - Flag for follow-up

Job Status Response:
{
  lastRun: "2025-10-21 08:00:00",
  nextRun: "2025-10-22 08:00:00",
  status: "completed" | "running" | "failed",
  totalExtracted: 15,
  errors: []
}

Test validity rules:
- HIV: Valid for 6 months
- Hepatitis B/C: Valid for 6 months
- Syphilis: Valid for 6 months
- Expiring soon: < 30 days remaining
*/

export function EHRTests() {
  const [validityFilter, setValidityFilter] = useState("all");
  const [testTypeFilter, setTestTypeFilter] = useState("all");
  const [isExtracting, setIsExtracting] = useState(false);

  const jobStatus = {
    lastRun: "2025-10-21 08:00:00",
    nextRun: "2025-10-22 08:00:00",
    status: "completed",
    totalExtracted: 15,
  };

  const filteredTests = mockEHRTests.filter((test) => {
    const matchesValidity =
      validityFilter === "all" || test.validity === validityFilter;
    const matchesType =
      testTypeFilter === "all" || test.testType === testTypeFilter;
    return matchesValidity && matchesType;
  });

  const handleManualExtraction = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
    }, 3000);
  };

  const getValidityBadge = (validity: string) => {
    const variants: Record<string, any> = {
      valid: { variant: "default", label: "Còn hạn", icon: CheckCircle },
      expiring_soon: {
        variant: "secondary",
        label: "Sắp hết hạn",
        icon: AlertTriangle,
      },
      expired: {
        variant: "destructive",
        label: "Hết hạn",
        icon: AlertTriangle,
      },
    };
    const config = variants[validity] || {
      variant: "secondary",
      label: validity,
      icon: AlertTriangle,
    };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getResultBadge = (result: string) => {
    const variants: Record<string, any> = {
      negative: { variant: "default", label: "Âm tính" },
      positive: { variant: "destructive", label: "Dương tính" },
      pending: { variant: "secondary", label: "Đang chờ" },
    };
    const config = variants[result] || { variant: "secondary", label: result };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns = [
    {
      key: "donor",
      header: "Donor",
      render: (test: any) => (
        <div>
          <p>{test.donorName}</p>
          <p className="text-muted-foreground">{test.donorId}</p>
        </div>
      ),
    },
    {
      key: "testType",
      header: "Loại xét nghiệm",
    },
    {
      key: "result",
      header: "Kết quả",
      render: (test: any) => getResultBadge(test.result),
    },
    {
      key: "date",
      header: "Ngày XN",
    },
    {
      key: "expiryDate",
      header: "Ngày hết hạn",
    },
    {
      key: "validity",
      header: "Hiệu lực",
      render: (test: any) => getValidityBadge(test.validity),
    },
    {
      key: "lab",
      header: "Phòng XN",
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (test: any) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            Xác thực
          </Button>
          <Button variant="outline" size="sm">
            <Flag className="h-4 w-4 mr-1" />
            Đánh dấu
          </Button>
        </div>
      ),
    },
  ];

  const validCount = filteredTests.filter((t) => t.validity === "valid").length;
  const expiringCount = filteredTests.filter(
    (t) => t.validity === "expiring_soon"
  ).length;
  const expiredCount = filteredTests.filter(
    (t) => t.validity === "expired"
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Theo dõi xét nghiệm EHR</h1>
          <p className="text-muted-foreground">
            Trích xuất và xác minh kết quả xét nghiệm
          </p>
        </div>
        <Button onClick={handleManualExtraction} disabled={isExtracting}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isExtracting ? "animate-spin" : ""}`}
          />
          {isExtracting ? "Đang trích xuất..." : "Trích xuất thủ công"}
        </Button>
      </div>

      {/* Job Status */}
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái công việc tự động</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-muted-foreground">Lần chạy cuối</label>
            <p>{jobStatus.lastRun}</p>
          </div>
          <div>
            <label className="text-muted-foreground">Lần chạy tiếp theo</label>
            <p>{jobStatus.nextRun}</p>
          </div>
          <div>
            <label className="text-muted-foreground">Trạng thái</label>
            <Badge variant="default">
              {jobStatus.status === "completed" ? "Hoàn thành" : "Đang chạy"}
            </Badge>
          </div>
          <div>
            <label className="text-muted-foreground">
              Số bản ghi trích xuất
            </label>
            <p>{jobStatus.totalExtracted}</p>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Còn hạn</p>
                <h2>{validCount}</h2>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Sắp hết hạn</p>
                <h2>{expiringCount}</h2>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Hết hạn</p>
                <h2>{expiredCount}</h2>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex gap-2">
          <Button
            variant={validityFilter === "all" ? "default" : "outline"}
            onClick={() => setValidityFilter("all")}
          >
            Tất cả
          </Button>
          <Button
            variant={validityFilter === "valid" ? "default" : "outline"}
            onClick={() => setValidityFilter("valid")}
          >
            Còn hạn
          </Button>
          <Button
            variant={validityFilter === "expiring_soon" ? "default" : "outline"}
            onClick={() => setValidityFilter("expiring_soon")}
          >
            Sắp hết hạn
          </Button>
          <Button
            variant={validityFilter === "expired" ? "default" : "outline"}
            onClick={() => setValidityFilter("expired")}
          >
            Hết hạn
          </Button>
        </div>
        <div className="flex gap-2">
          {["HIV", "Hepatitis B", "Hepatitis C", "Syphilis"].map((type) => (
            <Button
              key={type}
              variant={testTypeFilter === type ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setTestTypeFilter(testTypeFilter === type ? "all" : type)
              }
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredTests}
        columns={columns}
        emptyMessage="Không có kết quả xét nghiệm"
      />

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>
            GET /api/admin/ehr-tests/status - Job status and next run time
          </li>
          <li>
            POST /api/admin/ehr-tests/extract - Manual trigger extraction job
          </li>
          <li>Integration with hospital EHR system via API or file import</li>
          <li>Automated job runs daily at 8:00 AM (configurable)</li>
          <li>Send alerts when tests expire or are expiring soon (30 days)</li>
          <li>Manual verification: Staff can confirm test result accuracy</li>
          <li>Flag for follow-up: Assign to staff for further investigation</li>
          <li>
            Export list of donors with expired/expiring tests for scheduling
          </li>
        </ul>
      </div>
    </div>
  );
}

export default EHRTests;
