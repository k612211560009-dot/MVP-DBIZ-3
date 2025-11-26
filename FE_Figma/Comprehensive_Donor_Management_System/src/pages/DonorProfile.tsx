import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Download, Mail, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockDonors, mockDonations, mockEHRTests } from '../lib/mock-data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';

/*
API Endpoints:
GET /api/admin/donors/{id} - Get full donor profile
POST /api/admin/donors/{id}/approve - Approve donor with e-signature
POST /api/admin/donors/{id}/reject - Reject donor

E-signature Approval Flow (VNPT-CA Integration):
1. Click "Duyệt hồ sơ" button
2. Show approval modal
3. Step 1: Preview consent document
4. Step 2: Select CA provider (VNPT-CA / VN PT / Viettel CA)
5. Step 3: Call CA API to initiate signing
6. Step 4: Enter OTP received via SMS
7. Step 5: Submit OTP to verify signature
8. Step 6: Save signed document & update donor status to 'approved'

Request body for approval:
POST /api/admin/donors/{id}/approve
{
  action: 'approve',
  caProvider: 'vnpt-ca' | 'vn-pt' | 'viettel-ca',
  otp: string,
  signatureData: {
    transactionId: string,
    timestamp: string
  }
}
*/

const ESignatureModal = ({ donor, isOpen, onClose }: any) => {
  const [step, setStep] = useState(1);
  const [caProvider, setCAProvider] = useState('vnpt-ca');
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInitiateSigning = () => {
    setIsProcessing(true);
    // Simulate CA API call
    setTimeout(() => {
      toast.success('OTP đã được gửi đến số điện thoại của bạn');
      setIsProcessing(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      toast.error('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setIsProcessing(true);
    // Simulate OTP verification
    setTimeout(() => {
      toast.success('Hồ sơ đã được duyệt và ký số thành công', {
        description: `Donor ${donor.name} đã được phê duyệt`,
      });
      setIsProcessing(false);
      onClose(true);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Duyệt hồ sơ Donor - Ký số điện tử</DialogTitle>
          <DialogDescription>
            Xác nhận phê duyệt hồ sơ của {donor?.name} ({donor?.id})
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3>Thông tin Donor</h3>
              <div className="mt-2 space-y-1">
                <p>Họ tên: {donor?.name}</p>
                <p>Ngày sinh: {donor?.dob}</p>
                <p>Số điện thoại: {donor?.phone}</p>
                <p>EHR ID: {donor?.ehrId}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Chọn nhà cung cấp chữ ký số</Label>
              <div className="grid grid-cols-3 gap-3">
                {['vnpt-ca', 'vn-pt', 'viettel-ca'].map((provider) => (
                  <button
                    key={provider}
                    className={`p-4 border rounded-lg ${
                      caProvider === provider
                        ? 'border-primary bg-primary/10'
                        : 'border-border'
                    }`}
                    onClick={() => setCAProvider(provider)}
                  >
                    <div className="text-center">
                      <div className="h-12 flex items-center justify-center mb-2">
                        <FileText className="h-8 w-8" />
                      </div>
                      <p className="uppercase">{provider}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg">
              <p className="text-blue-900 dark:text-blue-100">
                Sau khi nhấn "Gửi OTP", bạn sẽ nhận được mã xác thực qua SMS.
                Vui lòng chuẩn bị điện thoại để nhận mã.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3>Nhập mã OTP</h3>
              <p className="text-muted-foreground mt-2">
                Mã OTP đã được gửi đến số điện thoại của bạn
              </p>
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <Label htmlFor="otp">Mã OTP (6 số)</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="text-center tracking-widest"
              />
            </div>

            <div className="text-center">
              <Button variant="link" onClick={handleInitiateSigning}>
                Gửi lại mã OTP
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose(false)}>
            Hủy
          </Button>
          {step === 1 && (
            <Button onClick={handleInitiateSigning} disabled={isProcessing}>
              {isProcessing ? 'Đang xử lý...' : 'Gửi OTP'}
            </Button>
          )}
          {step === 2 && (
            <Button onClick={handleVerifyOTP} disabled={isProcessing || otp.length !== 6}>
              {isProcessing ? 'Đang xác thực...' : 'Xác nhận ký'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function DonorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  
  const donor = mockDonors.find(d => d.id === id) || mockDonors[0];
  const donorDonations = mockDonations.filter(d => d.donorId === donor.id);
  const donorTests = mockEHRTests.filter(t => t.donorId === donor.id);

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

  const handleApprovalComplete = (success: boolean) => {
    setIsApprovalModalOpen(false);
    if (success) {
      // Refresh data or navigate
      navigate('/donors');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">
              {donor.name.split(' ').pop()?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1>{donor.name}</h1>
              {getStatusBadge(donor.status)}
            </div>
            <p className="text-muted-foreground">{donor.id} • EHR: {donor.ehrId}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Mail className="h-4 w-4" />
          </Button>
          {donor.status !== 'approved' && donor.status !== 'rejected' && (
            <>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn từ chối hồ sơ này?')) {
                    toast.success('Hồ sơ đã bị từ chối');
                  }
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Từ chối
              </Button>
              <Button onClick={() => setIsApprovalModalOpen(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Duyệt hồ sơ
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="screening">Phiếu sàng lọc</TabsTrigger>
          <TabsTrigger value="tests">Kết quả xét nghiệm</TabsTrigger>
          <TabsTrigger value="donations">Nhật ký hiến sữa</TabsTrigger>
          <TabsTrigger value="payments">Thanh toán</TabsTrigger>
          <TabsTrigger value="activity">Lịch sử hoạt động</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground">Họ và tên</label>
                <p>{donor.name}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Ngày sinh</label>
                <p>{donor.dob}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Số điện thoại</label>
                <p>{donor.phone}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Email</label>
                <p>{donor.email}</p>
              </div>
              <div className="col-span-2">
                <label className="text-muted-foreground">Địa chỉ</label>
                <p>{donor.address}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Liên hệ khẩn cấp</label>
                <p>{donor.emergencyContact}</p>
              </div>
              <div>
                <label className="text-muted-foreground">EHR ID</label>
                <p>{donor.ehrId}</p>
              </div>
              <div>
                <label className="text-muted-foreground">Ngày đăng ký</label>
                <p>{donor.registeredAt}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screening">
          <Card>
            <CardHeader>
              <CardTitle>Phiếu sàng lọc</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Chưa có phiếu sàng lọc nào được lưu.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Kết quả xét nghiệm EHR</CardTitle>
            </CardHeader>
            <CardContent>
              {donorTests.length > 0 ? (
                <div className="space-y-4">
                  {donorTests.map(test => (
                    <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p>{test.testType}</p>
                        <p className="text-muted-foreground">{test.lab} • {test.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={test.result === 'negative' ? 'default' : 'destructive'}>
                          {test.result === 'negative' ? 'Âm tính' : 'Dương tính'}
                        </Badge>
                        <Badge variant={test.validity === 'valid' ? 'default' : 'destructive'}>
                          {test.validity === 'valid' ? 'Còn hạn' : 'Hết hạn'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Chưa có kết quả xét nghiệm</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle>Nhật ký hiến sữa</CardTitle>
            </CardHeader>
            <CardContent>
              {donorDonations.length > 0 ? (
                <div className="space-y-4">
                  {donorDonations.map(donation => (
                    <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p>{donation.date}</p>
                        <p className="text-muted-foreground">
                          {donation.volume}ml • {donation.containers} container(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p>{donation.points} điểm</p>
                        <p className="text-muted-foreground">{donation.staff}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Chưa có lần hiến sữa nào</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Thanh toán & Biên lai</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Chưa có giao dịch thanh toán</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p>Đăng ký tham gia chương trình</p>
                    <p className="text-muted-foreground">{donor.registeredAt}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* E-Signature Modal */}
      <ESignatureModal
        donor={donor}
        isOpen={isApprovalModalOpen}
        onClose={handleApprovalComplete}
      />

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>GET /api/admin/donors/{'{id}'} - Fetch full donor profile with all related data</li>
          <li>POST /api/admin/donors/{'{id}'}/approve - E-signature flow with CA provider</li>
          <li>CA Integration: VNPT-CA API for OTP generation and signature verification</li>
          <li>Store signed consent document in secure document management system</li>
          <li>Audit trail: Log all approval/rejection actions with timestamp and user</li>
          <li>Permission: Only Director/Admin can approve/reject donor profiles</li>
          <li>Send email and SMS notification to donor after approval/rejection</li>
        </ul>
      </div>
    </div>
  );
}
