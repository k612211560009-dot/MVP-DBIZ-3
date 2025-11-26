import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';

export function Documentation() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>System Documentation</h1>
        <p className="text-muted-foreground">
          Deployment and configuration guide for Mother Milk Bank Management System
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API Endpoints</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="design">Design System</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3>Description</h3>
                <p className="text-muted-foreground mt-2">
                  The breast milk bank management system helps organize the process from registration, screening,
                  testing, approval to recording milk donations and payments for donor mothers.
                </p>
              </div>

              <div>
                <h3>Main Modules</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-2">
                  <li><strong>Dashboard:</strong> KPI overview, charts, recent activities</li>
                  <li><strong>Donor Management:</strong> List, detailed profiles, approval</li>
                  <li><strong>Appointments:</strong> Screening and donation appointments</li>
                  <li><strong>Screening:</strong> 10-question screening form</li>
                  <li><strong>Donations:</strong> Log and record milk donations</li>
                  <li><strong>EHR Tests:</strong> Extract and track test results</li>
                  <li><strong>Alerts:</strong> Alerts for expired tests, incomplete screening</li>
                  <li><strong>Reports:</strong> Monthly statistical reports</li>
                  <li><strong>Rewards:</strong> Configure reward points by milk volume</li>
                  <li><strong>Payments:</strong> Payment support and receipt upload</li>
                </ul>
              </div>

              <div>
                <h3>Technologies Used</h3>
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
              <CardTitle>User Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3>Director / Admin</h3>
                <p className="text-muted-foreground mt-2">Highest level, full access:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li>View all dashboard and reports</li>
                  <li>Approve / reject donor profiles (E-signature)</li>
                  <li>View all appointments (All Appointments)</li>
                  <li>Configure reward rules</li>
                  <li>Manage payments</li>
                  <li>View and handle all alerts</li>
                  <li>Export reports</li>
                </ul>
              </div>

              <div>
                <h3>Medical Staff</h3>
                <p className="text-muted-foreground mt-2">Medical staff performing daily operations:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li>View dashboard (relevant data only)</li>
                  <li>View donor list (read-only)</li>
                  <li>View assigned appointments (My Appointments)</li>
                  <li>Fill screening forms</li>
                  <li>Record milk donations</li>
                  <li>Check-in, mark failed appointments</li>
                  <li>No permission to approve donors, configure rewards, payments</li>
                </ul>
              </div>

              <div>
                <h3>Finance Staff</h3>
                <p className="text-muted-foreground mt-2">Financial specialist:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li>View donor list</li>
                  <li>Manage payments (mark transferred, upload receipts)</li>
                  <li>View financial reports</li>
                  <li>No permission to approve donors, configure rewards</li>
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
              <CardTitle>Deployment Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3>System Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li>Node.js 18+</li>
                  <li>npm or yarn</li>
                  <li>Backend API (Express/NestJS/Spring Boot)</li>
                  <li>Database (PostgreSQL/MySQL)</li>
                  <li>File storage (AWS S3/Azure Blob)</li>
                  <li>Email service (SendGrid/AWS SES)</li>
                  <li>SMS service (Twilio/VNPT SMS)</li>
                  <li>CA Provider API (VNPT-CA/VN PT/Viettel CA)</li>
                </ul>
              </div>

              <div>
                <h3>Installation</h3>
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
