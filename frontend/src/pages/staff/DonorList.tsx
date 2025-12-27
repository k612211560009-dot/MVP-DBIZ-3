import { useState, useEffect } from "react";
import { DataTable } from "../../components/DataTable";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Eye, MessageSquare, Calendar, Filter, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDonors, type Donor } from "../../services/donorAPI";
import { toast } from "sonner";

/*
API Endpoints:
GET /api/admin/donors?status=&q=&page=&per_page=&sort_by=&order=

Query parameters:
- status: pending|interviewed|needs_tests|approved|rejected
- q: search keyword (ID, name, phone)
- page: current page number
- per_page: items per page (10, 25, 50)
- sort_by: registeredAt|name|status
- order: asc|desc

Response structure:
{
  data: [...donors],
  pagination: {
    total: 100,
    page: 1,
    per_page: 10,
    total_pages: 10
  }
}

Required fields for donor record:
- name (required, min 2 chars)
- dob (required, age > 18)
- phone (required, Vietnamese phone format)
- email (required, valid email)
- address (required)
- emergencyContact (required, phone format)

Validation rules:
- Donor must be 18-45 years old
- Phone must be unique in system
- Email must be unique in system
*/

export function DonorList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Fetch donors from API
  useEffect(() => {
    fetchDonors();
  }, [statusFilter, searchQuery, pagination.page]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await getDonors({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter === "all" ? undefined : statusFilter,
        q: searchQuery || undefined,
        sortBy: "created_at",
        sortOrder: "desc",
      });

      setDonors(response.data.donors);
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages,
      }));
    } catch (error: any) {
      console.error("Error fetching donors:", error);
      toast.error("Không thể tải danh sách donor", {
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      in_progress: { variant: "secondary", label: "Đang đăng ký" },
      active: { variant: "default", label: "Đang hoạt động" },
      suspended: { variant: "outline", label: "Tạm ngưng" },
      removed: { variant: "destructive", label: "Đã xóa" },
      rejected: { variant: "destructive", label: "Từ chối" },
      failed_positive: { variant: "destructive", label: "Test dương tính" },
      abandoned: { variant: "secondary", label: "Đã bỏ" },
    };
    const config = variants[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Transform API data to match table format
  const tableData = donors.map((donor) => ({
    id: donor.donor_id,
    name: donor.ehrData?.full_name || donor.user?.email || "N/A", // Ưu tiên tên thật từ EHR
    dob: formatDate(donor.ehrData?.date_of_birth),
    phone: donor.ehrData?.phone || "N/A",
    email: donor.ehrData?.email || donor.user?.email || "N/A",
    address: donor.ehrData?.address || "N/A",
    province: donor.ehrData?.province || "",
    district: donor.ehrData?.district || "",
    ward: donor.ehrData?.ward || "",
    status: donor.donor_status,
    isClear: donor.ehrData?.is_clear || false,
    healthTests: {
      hiv: donor.ehrData?.hiv_result || "unknown",
      hbv: donor.ehrData?.hbv_result || "unknown",
      hcv: donor.ehrData?.hcv_result || "unknown",
      syphilis: donor.ehrData?.syphilis_result || "unknown",
      htlv: donor.ehrData?.htlv_result || "unknown",
    },
    registeredAt: formatDate(donor.created_at),
    rawData: donor, // Keep full donor data for drawer
  }));

  const columns = [
    {
      key: "id",
      header: "Donor ID",
    },
    {
      key: "name",
      header: "Họ và tên",
    },
    {
      key: "phone",
      header: "Số điện thoại",
    },
    {
      key: "dob",
      header: "Ngày sinh",
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (donor: any) => getStatusBadge(donor.status),
    },
    {
      key: "isClear",
      header: "Sàng lọc Y tế",
      render: (donor: any) => (
        <div className="flex items-center gap-1">
          {donor.isClear ? (
            <Badge variant="default" className="bg-green-600">
              ✓ Âm tính
            </Badge>
          ) : (
            <Badge variant="secondary">Chưa rõ</Badge>
          )}
        </div>
      ),
    },
    {
      key: "registeredAt",
      header: "Ngày đăng ký",
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (donor: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedDonor(donor);
              setIsDrawerOpen(true);
            }}
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/staff/donors/${donor.id}`)}
            title="Xem hồ sơ đầy đủ"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/staff/appointments")}
            title="Xem lịch hẹn"
          >
            <Calendar className="h-4 w-4" />
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
          <h1>Danh sách Donor</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin các mẹ hiến sữa ({pagination.total} donors)
          </p>
        </div>
        <Button onClick={() => navigate("/staff/donors/new")}>
          Tạo hồ sơ thủ công
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm theo email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="in_progress">Đang đăng ký</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="suspended">Tạm ngưng</SelectItem>
            <SelectItem value="removed">Đã xóa</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải danh sách donor...</span>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <DataTable
          data={tableData}
          columns={columns}
          emptyMessage="Chưa có donor nào. Tạo hồ sơ thủ công để bắt đầu."
        />
      )}

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Trang {pagination.page} / {pagination.pages} (Tổng{" "}
            {pagination.total} donors)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 1}
            >
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page === pagination.pages}
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}

      {/* Quick View Drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/50"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="h-full w-full sm:max-w-lg bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Thông tin Donor</h3>
                <p className="text-sm text-gray-600">
                  Xem nhanh thông tin chi tiết
                </p>
              </div>
              {selectedDonor && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Donor ID</label>
                    <p className="font-medium">{selectedDonor.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Họ và tên</label>
                    <p className="font-medium">{selectedDonor.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ngày sinh</label>
                    <p className="font-medium">{selectedDonor.dob}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Số điện thoại
                    </label>
                    <p className="font-medium">{selectedDonor.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium">{selectedDonor.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Địa chỉ</label>
                    <p className="font-medium">{selectedDonor.address}</p>
                    {selectedDonor.ward && (
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedDonor.ward}, {selectedDonor.district},{" "}
                        {selectedDonor.province}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Trạng thái</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedDonor.status)}
                    </div>
                  </div>

                  {/* Health Screening Results */}
                  <div className="border-t pt-4">
                    <label className="text-sm text-gray-600 font-semibold">
                      Kết quả sàng lọc Y tế
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tình trạng chung:</span>
                        {selectedDonor.isClear ? (
                          <Badge variant="default" className="bg-green-600">
                            ✓ Âm tính toàn bộ
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Chưa có kết quả</Badge>
                        )}
                      </div>
                      {selectedDonor.healthTests && (
                        <div className="grid grid-cols-2 gap-2 text-sm mt-2 p-3 bg-gray-50 rounded">
                          <div>
                            HIV:{" "}
                            <Badge variant="outline" className="text-xs">
                              {selectedDonor.healthTests.hiv}
                            </Badge>
                          </div>
                          <div>
                            HBV:{" "}
                            <Badge variant="outline" className="text-xs">
                              {selectedDonor.healthTests.hbv}
                            </Badge>
                          </div>
                          <div>
                            HCV:{" "}
                            <Badge variant="outline" className="text-xs">
                              {selectedDonor.healthTests.hcv}
                            </Badge>
                          </div>
                          <div>
                            Giang mai:{" "}
                            <Badge variant="outline" className="text-xs">
                              {selectedDonor.healthTests.syphilis}
                            </Badge>
                          </div>
                          <div>
                            HTLV:{" "}
                            <Badge variant="outline" className="text-xs">
                              {selectedDonor.healthTests.htlv}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      Ngày đăng ký
                    </label>
                    <p className="font-medium">{selectedDonor.registeredAt}</p>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        navigate(`/staff/donors/${selectedDonor.id}`);
                        setIsDrawerOpen(false);
                      }}
                    >
                      Xem hồ sơ đầy đủ
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default DonorList;
