import { useState } from "react";
import { DataTable } from "../../components/DataTable";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { RefreshCw, CheckCircle, AlertTriangle, Flag } from "lucide-react";
import { getSafeEHRTests } from "../../lib/safe-mock-data";

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

  const filteredTests = getSafeEHRTests().filter((test) => {
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
      valid: { variant: "default", label: "Valid", icon: CheckCircle },
      expiring_soon: {
        variant: "secondary",
        label: "Expiring Soon",
        icon: AlertTriangle,
      },
      expired: {
        variant: "destructive",
        label: "Expired",
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
      negative: { variant: "default", label: "Negative" },
      positive: { variant: "destructive", label: "Positive" },
      pending: { variant: "secondary", label: "Pending" },
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
      header: "Test Type",
    },
    {
      key: "result",
      header: "Result",
      render: (test: any) => getResultBadge(test.result),
    },
    {
      key: "date",
      header: "Test Date",
    },
    {
      key: "expiryDate",
      header: "Expiry Date",
    },
    {
      key: "validity",
      header: "Validity",
      render: (test: any) => getValidityBadge(test.validity),
    },
    {
      key: "lab",
      header: "Laboratory",
    },
    {
      key: "actions",
      header: "Actions",
      render: (test: any) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            Verify
          </Button>
          <Button variant="outline" size="sm">
            <Flag className="h-4 w-4 mr-1" />
            Flag
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
          <h1>EHR Test Tracking</h1>
          <p className="text-muted-foreground">
            Extract and verify test results
          </p>
        </div>
        <Button onClick={handleManualExtraction} disabled={isExtracting}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isExtracting ? "animate-spin" : ""}`}
          />
          {isExtracting ? "Extracting..." : "Manual Extraction"}
        </Button>
      </div>

      {/* Job Status */}
      <Card>
        <CardHeader>
          <CardTitle>Automatic Job Status</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-muted-foreground">Last Run</label>
            <p>{jobStatus.lastRun}</p>
          </div>
          <div>
            <label className="text-muted-foreground">Next Run</label>
            <p>{jobStatus.nextRun}</p>
          </div>
          <div>
            <label className="text-muted-foreground">Status</label>
            <Badge variant="default">
              {jobStatus.status === "completed" ? "Completed" : "Running"}
            </Badge>
          </div>
          <div>
            <label className="text-muted-foreground">Records Extracted</label>
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
                <p className="text-muted-foreground">Valid</p>
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
                <p className="text-muted-foreground">Expiring Soon</p>
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
                <p className="text-muted-foreground">Expired</p>
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
            All
          </Button>
          <Button
            variant={validityFilter === "valid" ? "default" : "outline"}
            onClick={() => setValidityFilter("valid")}
          >
            Valid
          </Button>
          <Button
            variant={validityFilter === "expiring_soon" ? "default" : "outline"}
            onClick={() => setValidityFilter("expiring_soon")}
          >
            Expiring Soon
          </Button>
          <Button
            variant={validityFilter === "expired" ? "default" : "outline"}
            onClick={() => setValidityFilter("expired")}
          >
            Expired
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
        emptyMessage="No test results"
      />
    </div>
  );
}
export default EHRTests;
