import { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Eye, MessageSquare, Calendar, Filter } from 'lucide-react';
import { mockDonors } from '../lib/mock-data';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../components/ui/sheet';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: 'secondary', label: 'Chờ sàng lọc' },
      interviewed: { variant: 'default', label: 'Đã phỏng vấn' },
      needs_tests: { variant: 'outline', label: 'Cần xét nghiệm' },
      approved: { variant: 'default', label: 'Đã duyệt' },
      rejected: { variant: 'destructive', label: 'Từ chối' },
    };
    const config = variants[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredDonors = mockDonors.filter(donor => {
    const matchesSearch = searchQuery === '' ||
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || donor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'id',
      header: 'Donor ID',
    },
    {
      key: 'name',
      header: 'Họ và tên',
    },
    {
      key: 'dob',
      header: 'Ngày sinh',
    },
    {
      key: 'phone',
      header: 'Số điện thoại',
    },
    {
      key: 'ehrId',
      header: 'EHR ID',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (donor: any) => getStatusBadge(donor.status),
    },
    {
      key: 'registeredAt',
      header: 'Ngày đăng ký',
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (donor: any) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedDonor(donor);
              setIsDrawerOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/donors/${donor.id}`)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/appointments')}
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
          <p className="text-muted-foreground">Quản lý thông tin các mẹ hiến sữa</p>
        </div>
        <Button onClick={() => navigate('/donors/new')}>
          Tạo hồ sơ thủ công
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm theo ID, tên, số điện thoại..."
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
            <SelectItem value="pending">Chờ sàng lọc</SelectItem>
            <SelectItem value="interviewed">Đã phỏng vấn</SelectItem>
            <SelectItem value="needs_tests">Cần xét nghiệm</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        data={filteredDonors}
        columns={columns}
        emptyMessage="Chưa có donor nào. Tạo hồ sơ thủ công để bắt đầu."
      />

      {/* Quick View Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Thông tin Donor</SheetTitle>
            <SheetDescription>
              Xem nhanh thông tin chi tiết
            </SheetDescription>
          </SheetHeader>
          {selectedDonor && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-muted-foreground">Donor ID</label>
                <p>{selectedDonor.id}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Họ và tên</label>
                <p>{selectedDonor.name}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Ngày sinh</label>
                <p>{selectedDonor.dob}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Số điện thoại</label>
                <p>{selectedDonor.phone}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Email</label>
                <p>{selectedDonor.email}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Địa chỉ</label>
                <p>{selectedDonor.address}</p>
              </div>
              <div>
                <label className="text-muted-foreground">EHR ID</label>
                <p>{selectedDonor.ehrId}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Trạng thái</label>
                <div className="mt-1">
                  {getStatusBadge(selectedDonor.status)}
                </div>
              </div>
              <div>
                <label className="text-muted-foreground">Ngày đăng ký</label>
                <p>{selectedDonor.registeredAt}</p>
              </div>
              <div className="pt-4">
                <Button 
                  className="w-full"
                  onClick={() => {
                    navigate(`/donors/${selectedDonor.id}`);
                    setIsDrawerOpen(false);
                  }}
                >
                  Xem hồ sơ đầy đủ
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>Implement server-side pagination with configurable page sizes (10/25/50)</li>
          <li>Add debounced search (300ms) to reduce API calls</li>
          <li>Sort by: ID, Name, Registration Date, Status (both ASC/DESC)</li>
          <li>Bulk actions: Assign staff, Send message, Export CSV</li>
          <li>Permission: Medical Staff can only view, Director/Admin can edit</li>
          <li>Keyboard navigation: Arrow keys, Enter to view, Tab to navigate</li>
        </ul>
      </div>
    </div>
  );
}
