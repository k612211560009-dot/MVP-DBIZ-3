import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockDonors, mockDonations, mockAppointments } from '../lib/mock-data';

const volumeByMonth = [
  { month: 'T5/2025', volume: 3200, donors: 8 },
  { month: 'T6/2025', volume: 3800, donors: 10 },
  { month: 'T7/2025', volume: 4200, donors: 12 },
  { month: 'T8/2025', volume: 3900, donors: 11 },
  { month: 'T9/2025', volume: 4500, donors: 13 },
  { month: 'T10/2025', volume: 3800, donors: 12 },
];

const appointmentSuccessRate = [
  { month: 'T5', success: 85, failed: 15 },
  { month: 'T6', success: 88, failed: 12 },
  { month: 'T7', success: 90, failed: 10 },
  { month: 'T8', success: 87, failed: 13 },
  { month: 'T9', success: 92, failed: 8 },
  { month: 'T10', success: 89, failed: 11 },
];

export function Reports() {
  const [selectedMonth, setSelectedMonth] = useState('2025-10');

  const registeredDonors = mockDonors.length;
  const approvedDonors = mockDonors.filter(d => d.status === 'approved').length;
  const totalVolume = mockDonations.reduce((sum, d) => sum + d.volume, 0);
  const completedAppointments = mockAppointments.filter(a => a.status === 'completed').length;
  const totalAppointments = mockAppointments.length;
  const successRate = totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : 0;

  const topDonors = mockDonations.reduce((acc, donation) => {
    const existing = acc.find(d => d.id === donation.donorId);
    if (existing) {
      existing.volume += donation.volume;
      existing.count += 1;
    } else {
      acc.push({
        id: donation.donorId,
        name: donation.donorName,
        volume: donation.volume,
        count: 1,
      });
    }
    return acc;
  }, [] as any[])
  .sort((a, b) => b.volume - a.volume)
  .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Báo cáo thống kê</h1>
          <p className="text-muted-foreground">Tổng quan hoạt động ngân hàng sữa mẹ</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn tháng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-10">Tháng 10/2025</SelectItem>
              <SelectItem value="2025-09">Tháng 9/2025</SelectItem>
              <SelectItem value="2025-08">Tháng 8/2025</SelectItem>
              <SelectItem value="2025-07">Tháng 7/2025</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Xuất PDF
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Tổng số mẹ đăng ký</p>
            <h2>{registeredDonors}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Donor chính thức</p>
            <h2>{approvedDonors}</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Tổng lượng sữa</p>
            <h2>{totalVolume.toLocaleString()}ml</h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Tỷ lệ thành công</p>
            <h2>{successRate}%</h2>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lượng sữa thu thập theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="volume" fill="hsl(var(--chart-1))" name="Lượng sữa (ml)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ thành công lịch hẹn</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={appointmentSuccessRate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="success" stroke="hsl(var(--chart-1))" name="Thành công (%)" strokeWidth={2} />
                <Line type="monotone" dataKey="failed" stroke="hsl(var(--chart-5))" name="Thất bại (%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Donors */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Donor hiến nhiều nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topDonors.map((donor, index) => (
              <div key={donor.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                    <span className="font-semibold">#{index + 1}</span>
                  </div>
                  <div>
                    <p>{donor.name}</p>
                    <p className="text-muted-foreground">{donor.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p>{donor.volume.toLocaleString()}ml</p>
                  <p className="text-muted-foreground">{donor.count} lần</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Donor Registration Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng đăng ký Donor</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={volumeByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="donors" stroke="hsl(var(--chart-2))" name="Số donor" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>GET /api/admin/reports?month=YYYY-MM - Get monthly report data</li>
          <li>POST /api/admin/reports/export-pdf - Generate PDF report with all charts</li>
          <li>POST /api/admin/reports/export-csv - Export raw data to CSV</li>
          <li>Date range selector: Allow custom date ranges (not just monthly)</li>
          <li>Comparison mode: Compare current month with previous month/year</li>
          <li>Scheduled reports: Auto-send monthly report to Director via email</li>
          <li>Custom metrics: Allow admin to configure which KPIs to show</li>
          <li>Print-friendly view: Optimize layout for printing</li>
        </ul>
      </div>
    </div>
  );
}
