import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';

export function Documentation() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Tài liệu hệ thống</h1>
        <p className="text-muted-foreground">
          Hướng dẫn triển khai và cấu hình Mother Milk Bank Management System
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="api">API Endpoints</TabsTrigger>
          <TabsTrigger value="permissions">Phân quyền</TabsTrigger>
          <TabsTrigger value="design">Design System</TabsTrigger>
          <TabsTrigger value="deployment">Triển khai</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tổng quan hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3>Mô tả</h3>
                <p className="text-muted-foreground mt-2">
                  Hệ thống quản lý ngân hàng sữa mẹ giúp tổ chức quy trình từ đăng ký, sàng lọc,
                  xét nghiệm, phê duyệt đến ghi nhận hiến sữa và thanh toán cho các mẹ donor.
                </p>
              </div>

              <div>
                <h3>Các module chính</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                  <li><strong>Dashboard:</strong> Tổng quan KPI, biểu đồ, hoạt động gần đây</li>
                  <li><strong>Donor Management:</strong> Danh sách, hồ sơ chi tiết, phê duyệt</li>
                  <li><strong>Appointments:</strong> Lịch hẹn sàng lọc và hiến sữa</li>
                  <li><strong>Screening:</strong> Phiếu sàng lọc 10 câu hỏi</li>
                  <li><strong>Donations:</strong> Nhật ký và ghi nhận lần hiến sữa</li>
                  <li><strong>EHR Tests:</strong> Trích xuất và theo dõi xét nghiệm</li>
                  <li><strong>Alerts:</strong> Cảnh báo xét nghiệm hết hạn, sàng lọc chưa xong</li>
                  <li><strong>Reports:</strong> Báo cáo thống kê theo tháng</li>
                  <li><strong>Rewards:</strong> Cấu hình điểm thưởng theo lượng sữa</li>
                  <li><strong>Payments:</strong> Hỗ trợ thanh toán và tải biên lai</li>
                </ul>
              </div>

              <div>
                <h3>Công nghệ sử dụng</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge>React</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>Tailwind CSS v4</Badge>
                  <Badge>Shadcn/ui</Badge>
                  <Badge>React Router</Badge>
                  <Badge>Recharts</Badge>
                  <Badge>Lucide Icons</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3>Donors</h3>
                <div className="mt-2 space-y-2 font-mono text-sm">
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="default">GET</Badge>
                    <code>/api/admin/donors?status=&q=&page=&per_page=</code>
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="default">GET</Badge>
                    <code>/api/admin/donors/{'{id}'}</code>
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/admin/donors/{'{id}'}/approve</code>
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/admin/donors/{'{id}'}/reject</code>
                  </div>
                </div>
              </div>

              <div>
                <h3>Appointments</h3>
                <div className="mt-2 space-y-2 font-mono text-sm">
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="default">GET</Badge>
                    <code>/api/admin/appointments?date=&staff_id=&status=</code>
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/admin/appointments/{'{id}'}/mark_failed</code>
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/admin/appointments/{'{id}'}/screening</code>
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/admin/appointments/{'{id}'}/donation</code>
                  </div>
                </div>
              </div>

              <div>
                <h3>Donations</h3>
                <div className="mt-2 space-y-2 font-mono text-sm">
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="default">GET</Badge>
                    <code>/api/admin/donations?donor_id=&date_from=&date_to=</code>
                  </div>
                </div>
              </div>

              <div>
                <h3>EHR Tests</h3>
                <div className="mt-2 space-y-2 font-mono text-sm">
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="default">GET</Badge>
                    <code>/api/admin/ehr-tests?donor_id=&validity=</code>
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/admin/ehr-tests/extract</code>
                  </div>
                </div>
              </div>

              <div>
                <h3>Alerts</h3>
                <div className="mt-2 space-y-2 font-mono text-sm">
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="default">GET</Badge>
                    <code>/api/admin/alerts?status=&priority=</code>
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="outline">PATCH</Badge>
                    <code>/api/admin/alerts/{'{id}'}/resolve</code>
                  </div>
                </div>
              </div>

              <div>
                <h3>Payments</h3>
                <div className="mt-2 space-y-2 font-mono text-sm">
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="default">GET</Badge>
                    <code>/api/admin/payments?status=</code>
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/admin/payments/{'{id}'}/mark-transferred</code>
                  </div>
                </div>
              </div>

              <div>
                <h3>Reward Rules</h3>
                <div className="mt-2 space-y-2 font-mono text-sm">
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="default">GET</Badge>
                    <code>/api/admin/reward-rules</code>
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/admin/reward-rules</code>
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="outline">PATCH</Badge>
                    <code>/api/admin/reward-rules/{'{id}'}</code>
                  </div>
                  <div className="flex gap-2 items-baseline">
                    <Badge variant="destructive">DELETE</Badge>
                    <code>/api/admin/reward-rules/{'{id}'}</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân quyền người dùng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3>Director / Admin</h3>
                <p className="text-muted-foreground mt-2">Quyền cao nhất, toàn quyền truy cập:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li>Xem tất cả dashboard và báo cáo</li>
                  <li>Phê duyệt / từ chối hồ sơ donor (E-signature)</li>
                  <li>Xem tất cả lịch hẹn (All Appointments)</li>
                  <li>Cấu hình reward rules</li>
                  <li>Quản lý thanh toán</li>
                  <li>Xem và xử lý tất cả alerts</li>
                  <li>Export báo cáo</li>
                </ul>
              </div>

              <div>
                <h3>Medical Staff</h3>
                <p className="text-muted-foreground mt-2">Nhân viên y tế thực hiện công việc hàng ngày:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li>Xem dashboard (chỉ số liệu liên quan)</li>
                  <li>Xem danh sách donor (read-only)</li>
                  <li>Xem lịch hẹn được giao (My Appointments)</li>
                  <li>Điền phiếu sàng lọc</li>
                  <li>Ghi nhận lần hiến sữa</li>
                  <li>Check-in, mark failed appointments</li>
                  <li>Không có quyền approve donor, configure rewards, payments</li>
                </ul>
              </div>

              <div>
                <h3>Finance Staff</h3>
                <p className="text-muted-foreground mt-2">Chuyên viên tài chính:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li>Xem danh sách donor</li>
                  <li>Quản lý thanh toán (mark transferred, upload receipts)</li>
                  <li>Xem báo cáo tài chính</li>
                  <li>Không có quyền approve donor, cấu hình rewards</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Design System & Tokens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3>Typography</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <h1>Heading 1 - Display</h1>
                    <code className="text-sm">text-2xl, font-medium</code>
                  </div>
                  <div>
                    <h2>Heading 2 - Page Title</h2>
                    <code className="text-sm">text-xl, font-medium</code>
                  </div>
                  <div>
                    <h3>Heading 3 - Section Title</h3>
                    <code className="text-sm">text-lg, font-medium</code>
                  </div>
                  <div>
                    <p>Body - Regular text for paragraphs and content</p>
                    <code className="text-sm">text-base, font-normal</code>
                  </div>
                </div>
              </div>

              <div>
                <h3>Spacing</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Page padding</p>
                    <code>p-6 (24px)</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Section gap</p>
                    <code>space-y-6 (24px)</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Card padding</p>
                    <code>p-4 to p-6 (16-24px)</code>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Element gap</p>
                    <code>gap-4 (16px)</code>
                  </div>
                </div>
              </div>

              <div>
                <h3>Colors</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary text-primary-foreground rounded">
                    <p>Primary</p>
                    <code>bg-primary</code>
                  </div>
                  <div className="p-4 bg-secondary text-secondary-foreground rounded">
                    <p>Secondary</p>
                    <code>bg-secondary</code>
                  </div>
                  <div className="p-4 bg-muted text-muted-foreground rounded">
                    <p>Muted</p>
                    <code>bg-muted</code>
                  </div>
                  <div className="p-4 bg-destructive text-destructive-foreground rounded">
                    <p>Destructive</p>
                    <code>bg-destructive</code>
                  </div>
                </div>
              </div>

              <div>
                <h3>Border Radius</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary rounded-sm" />
                    <code>rounded-sm (calc(var(--radius) - 4px))</code>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary rounded-md" />
                    <code>rounded-md (calc(var(--radius) - 2px))</code>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary rounded-lg" />
                    <code>rounded-lg (var(--radius) = 10px)</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn triển khai</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3>Yêu cầu hệ thống</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li>Node.js 18+</li>
                  <li>npm hoặc yarn</li>
                  <li>Backend API (Express/NestJS/Spring Boot)</li>
                  <li>Database (PostgreSQL/MySQL)</li>
                  <li>File storage (AWS S3/Azure Blob)</li>
                  <li>Email service (SendGrid/AWS SES)</li>
                  <li>SMS service (Twilio/VNPT SMS)</li>
                  <li>CA Provider API (VNPT-CA/VN PT/Viettel CA)</li>
                </ul>
              </div>

              <div>
                <h3>Cài đặt</h3>
                <pre className="bg-muted p-4 rounded-lg mt-2">
{`# Clone repository
git clone <repo-url>

# Install dependencies
npm install

# Set environment variables
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build`}
                </pre>
              </div>

              <div>
                <h3>Environment Variables</h3>
                <pre className="bg-muted p-4 rounded-lg mt-2">
{`VITE_API_URL=http://localhost:3000/api
VITE_CA_PROVIDER_URL=<vnpt-ca-api-url>
VITE_FILE_STORAGE_URL=<s3-bucket-url>
VITE_EHR_INTEGRATION_URL=<ehr-api-url>`}
                </pre>
              </div>

              <div>
                <h3>Responsive Breakpoints</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li><strong>Desktop:</strong> 1440px+ (Full sidebar, all features)</li>
                  <li><strong>Tablet:</strong> 1024px - 1439px (Collapsible sidebar)</li>
                  <li><strong>Mobile:</strong> < 1024px (Hidden sidebar, drawer menu)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
