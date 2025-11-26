import { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Download, Filter, TrendingUp } from 'lucide-react';
import { mockDonations, mockDonors } from '../lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export function DonationLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [donorFilter, setDonorFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredDonations = mockDonations.filter(donation => {
    const matchesSearch = searchQuery === '' ||
      donation.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.donorId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDonor = donorFilter === 'all' || donation.donorId === donorFilter;
    
    const matchesDateFrom = !dateFrom || donation.date >= dateFrom;
    const matchesDateTo = !dateTo || donation.date <= dateTo;
    
    return matchesSearch && matchesDonor && matchesDateFrom && matchesDateTo;
  });

  const totalVolume = filteredDonations.reduce((sum, d) => sum + d.volume, 0);
  const totalPoints = filteredDonations.reduce((sum, d) => sum + d.points, 0);
  const totalDonations = filteredDonations.length;

  const columns = [
    {
      key: 'id',
      header: 'Donation ID',
    },
    {
      key: 'donor',
      header: 'Donor',
      render: (donation: any) => (
        <div>
          <p>{donation.donorName}</p>
          <p className="text-muted-foreground">{donation.donorId}</p>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Ngày hiến',
    },
    {
      key: 'volume',
      header: 'Lượng sữa',
      render: (donation: any) => <span>{donation.volume}ml</span>,
    },
    {
      key: 'containers',
      header: 'Số container',
    },
    {
      key: 'staff',
      header: 'Nhân viên',
    },
    {
      key: 'points',
      header: 'Điểm',
      render: (donation: any) => (
        <Badge variant="default">{donation.points} điểm</Badge>
      ),
    },
    {
      key: 'healthStatus',
      header: 'Sức khỏe',
      render: (donation: any) => (
        <Badge variant={donation.healthStatus === 'good' ? 'default' : 'destructive'}>
          {donation.healthStatus === 'good' ? 'Tốt' : 'Không tốt'}
        </Badge>
      ),
    },
    {
      key: 'notes',
      header: 'Ghi chú',
      render: (donation: any) => (
        <span className="text-muted-foreground">{donation.notes || '-'}</span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Nhật ký hiến sữa</h1>
          <p className="text-muted-foreground">Theo dõi tất cả các lần hiến sữa</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Xuất CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Tổng lượng sữa</p>
                <h2>{totalVolume.toLocaleString()}ml</h2>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Tổng lần hiến</p>
                <h2>{totalDonations}</h2>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Tổng điểm tặng</p>
                <h2>{totalPoints}</h2>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Tìm kiếm donor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={donorFilter} onValueChange={setDonorFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Chọn donor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả donor</SelectItem>
            {mockDonors.filter(d => d.status === 'approved').map(donor => (
              <SelectItem key={donor.id} value={donor.id}>
                {donor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          placeholder="Từ ngày"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <Input
          type="date"
          placeholder="Đến ngày"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>

      {/* Table */}
      <DataTable
        data={filteredDonations}
        columns={columns}
        emptyMessage="Không có dữ liệu hiến sữa"
      />

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>GET /api/admin/donations?donor_id=&date_from=&date_to=&page=&per_page=</li>
          <li>Export CSV: Include all columns with Vietnamese headers</li>
          <li>Allow adjusting points for specific donation (Director only)</li>
          <li>Show donation trend chart by month/week</li>
          <li>Filter by staff member who recorded the donation</li>
          <li>Bulk operations: Delete, Adjust points, Export selected</li>
          <li>Link to donor profile from donor name</li>
        </ul>
      </div>
    </div>
  );
}
