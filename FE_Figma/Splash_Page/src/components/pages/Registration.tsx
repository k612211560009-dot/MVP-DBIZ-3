import { useState, useEffect } from 'react';
import { ModernHeader } from '../ModernHeader';
import { ModernFooter } from '../ModernFooter';
import { Stepper } from '../Stepper';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { AlertCircle, CheckCircle2, Calendar as CalendarIcon, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface RegistrationProps {
  user: any;
  onNavigate: (page: string) => void;
}

type Step = 'hero' | 'form' | 'review' | 'result' | 'schedule';
type FormStep = 'personal' | 'screening';

const SCREENING_QUESTIONS = [
  { id: 1, text: 'Bạn có đang dùng thuốc kháng sinh không?', key: 'antibiotics' },
  { id: 2, text: 'Bạn có sử dụng ma túy, chất kích thích không?', key: 'drugs' },
  { id: 3, text: 'Bạn có uống rượu, bia thường xuyên không?', key: 'alcohol' },
  { id: 4, text: 'Bạn có hút thuốc lá không?', key: 'smoking' },
  { id: 5, text: 'Bạn có tiền sử bệnh lây nhiễm (HIV, viêm gan B/C, giang mai)?', key: 'infectious' },
  { id: 6, text: 'Bạn có đang bị nhiễm trùng hoặc sốt không?', key: 'infection' },
  { id: 7, text: 'Bạn có xăm mình trong 12 tháng qua không?', key: 'tattoo' },
  { id: 8, text: 'Bạn có truyền máu trong 12 tháng qua không?', key: 'transfusion' },
  { id: 9, text: 'Bạn có bệnh mãn tính (tim mạch, tiểu đường) không?', key: 'chronic' },
  { id: 10, text: 'Bạn có đang dùng thuốc đặc biệt (hóa trị, xạ trị) không?', key: 'medication' },
];

const PROVINCES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
const DISTRICTS = {
  'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Long Biên', 'Cầu Giấy'],
  'TP. Hồ Chí Minh': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5'],
  'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn'],
  'Hải Phòng': ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An'],
  'Cần Thơ': ['Ninh Kiều', 'Cái Răng', 'Bình Thủy', 'Ô Môn'],
};

const STEPS = [
  { id: 1, label: 'Thông tin' },
  { id: 2, label: 'Sàng lọc' },
  { id: 3, label: 'Xem lại' },
  { id: 4, label: 'Kết quả' },
];

export function Registration({ user, onNavigate }: RegistrationProps) {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [formStep, setFormStep] = useState<FormStep>('personal');
  const [formData, setFormData] = useState({
    name: '',
    dob: undefined as Date | undefined,
    phone: '',
    email: user?.email || '',
    province: '',
    district: '',
    address: '',
  });
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, boolean>>({});
  const [age, setAge] = useState<number | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);
  const [donorId, setDonorId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (formData.dob) {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    }
  }, [formData.dob]);

  const getAnsweredCount = () => {
    return Object.keys(screeningAnswers).length;
  };

  const getYesCount = () => {
    return Object.values(screeningAnswers).filter(v => v).length;
  };

  const handleSubmit = () => {
    const reasons: string[] = [];
    
    if (age && age < 18) {
      reasons.push('Tuổi dưới 18');
    }
    
    if (getYesCount() > 0) {
      const yesAnswers = SCREENING_QUESTIONS.filter(q => screeningAnswers[q.key]);
      reasons.push(...yesAnswers.map(q => q.text));
    }

    if (reasons.length > 0) {
      setIsApproved(false);
      setRejectionReasons(reasons);
    } else {
      setIsApproved(true);
      const id = `DN-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      setDonorId(id);
    }

    setCurrentStep('result');
    toast.success('Đã nộp hồ sơ thành công!');
  };

  const handleScheduleConfirm = () => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Vui lòng chọn ngày và giờ!');
      return;
    }
    
    toast.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
    setTimeout(() => {
      onNavigate('dashboard');
    }, 1500);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === 17 && minute > 0) break;
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const available = Math.random() > 0.3; // 70% slots available
        slots.push({ time, available });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (currentStep === 'hero') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <ModernHeader
          user={user}
          breadcrumbs={[
            { label: 'Dashboard', href: 'dashboard' },
            { label: 'Đăng ký hiến sữa' },
          ]}
          onNavigate={onNavigate}
        />

        <main className="max-w-[1440px] mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-[#1E293B] mb-4">
                Đăng ký hiến sữa mẹ
              </h1>
              <p className="text-[#64748B] mb-8">
                Cảm ơn bạn đã có ý định tham gia. Vui lòng hoàn thành các bước sau để đăng ký làm người hiến sữa.
              </p>
              <Button
                size="lg"
                onClick={() => setCurrentStep('form')}
                className="bg-[#2E5BFF] hover:bg-[#2549CC]"
              >
                Bắt đầu
              </Button>
            </div>

            <Card className="border-[#E2E8F0]">
              <CardContent className="pt-6">
                <h3 className="text-[#1E293B] mb-4">Quy trình đăng ký</h3>
                <div className="space-y-4">
                  {STEPS.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#DBEAFE] text-[#2E5BFF] rounded-full flex items-center justify-center flex-shrink-0">
                        {step.id}
                      </div>
                      <div>
                        <div className="text-sm text-[#1E293B]">{step.label}</div>
                        <div className="text-xs text-[#64748B] mt-1">
                          {index === 0 && 'Điền thông tin cá nhân và địa chỉ'}
                          {index === 1 && 'Trả lời 10 câu hỏi sức khỏe'}
                          {index === 2 && 'Kiểm tra lại thông tin đã nhập'}
                          {index === 3 && 'Nhận kết quả duyệt hồ sơ'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (currentStep === 'form') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <ModernHeader
          user={user}
          breadcrumbs={[
            { label: 'Dashboard', href: 'dashboard' },
            { label: 'Đăng ký hiến sữa' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="sticky top-16 z-40 bg-white border-b border-[#E2E8F0] py-4">
          <div className="max-w-[800px] mx-auto px-6">
            <Stepper
              steps={STEPS}
              currentStep={formStep === 'personal' ? 0 : 1}
            />
          </div>
        </div>

        <main className="max-w-[800px] mx-auto px-6 py-8 pb-32">
          {formStep === 'personal' && (
            <Card className="border-[#E2E8F0]">
              <CardContent className="pt-6">
                <h2 className="text-[#1E293B] mb-6">Thông tin cá nhân</h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Phạm Thị Lan"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Ngày sinh *</Label>
                      <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.dob ? format(formData.dob, 'dd/MM/yyyy') : 'Chọn ngày'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.dob}
                            onSelect={(date) => {
                              setFormData({ ...formData, dob: date });
                              setShowCalendar(false);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {age !== null && (
                        <p className="text-xs text-[#64748B]">Tuổi: {age}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+84 912 888 123"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                      <Select
                        value={formData.province}
                        onValueChange={(value) => setFormData({ ...formData, province: value, district: '' })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tỉnh/thành" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVINCES.map(province => (
                            <SelectItem key={province} value={province}>{province}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">Quận/Huyện *</Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => setFormData({ ...formData, district: value })}
                        disabled={!formData.province}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.province && DISTRICTS[formData.province as keyof typeof DISTRICTS]?.map(district => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ chi tiết *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Số nhà, tên đường..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {formStep === 'screening' && (
            <Card className="border-[#E2E8F0]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[#1E293B]">Câu hỏi sàng lọc</h2>
                  <Badge variant="secondary">
                    {getAnsweredCount()}/10 câu
                  </Badge>
                </div>

                <Alert className="mb-6 border-[#DBEAFE] bg-[#EFF6FF]">
                  <AlertCircle className="h-4 w-4 text-[#2E5BFF]" />
                  <AlertDescription className="text-[#2E5BFF]">
                    Vui lòng trả lời trung thực để đảm bảo sữa mẹ an toàn cho các bé
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {SCREENING_QUESTIONS.map((question) => (
                    <div
                      key={question.id}
                      className="flex items-start justify-between p-4 bg-[#F8FAFC] rounded-lg"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-6 h-6 bg-[#2E5BFF] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                          {question.id}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[#1E293B]">{question.text}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="text-[#94A3B8] hover:text-[#64748B]">
                                <HelpCircle className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs max-w-xs">
                                Câu hỏi này giúp đánh giá tính an toàn của sữa mẹ
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#64748B] w-12">
                            {screeningAnswers[question.key] === undefined ? '' : screeningAnswers[question.key] ? 'Có' : 'Không'}
                          </span>
                          <Switch
                            checked={screeningAnswers[question.key] || false}
                            onCheckedChange={(checked) =>
                              setScreeningAnswers({ ...screeningAnswers, [question.key]: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] py-4 z-50">
          <div className="max-w-[800px] mx-auto px-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4 text-sm">
                {formStep === 'screening' && (
                  <>
                    <span className="text-[#64748B]">
                      Đã trả lời: <span className="text-[#1E293B]">{getAnsweredCount()}/10</span>
                    </span>
                    <span className="text-[#64748B]">
                      Tuổi: <span className="text-[#1E293B]">{age || '--'}</span>
                    </span>
                    <span className="text-[#64748B]">
                      Trạng thái:{' '}
                      <span className={getYesCount() > 0 || (age && age < 18) ? 'text-[#DC2626]' : 'text-[#16A34A]'}>
                        {getYesCount() > 0 || (age && age < 18) ? 'Cảnh báo' : 'Tốt'}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {formStep === 'screening' && (
                <Button
                  variant="outline"
                  onClick={() => setFormStep('personal')}
                >
                  Quay lại
                </Button>
              )}
              
              {formStep === 'personal' ? (
                <Button
                  onClick={() => setFormStep('screening')}
                  disabled={!formData.name || !formData.dob || !formData.phone || !formData.email || !formData.province || !formData.district || !formData.address}
                  className="flex-1 bg-[#2E5BFF] hover:bg-[#2549CC]"
                >
                  Tiếp tục
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentStep('review')}
                  disabled={getAnsweredCount() < 10}
                  className="flex-1 bg-[#2E5BFF] hover:bg-[#2549CC]"
                >
                  Xem lại
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'review') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <ModernHeader
          user={user}
          breadcrumbs={[
            { label: 'Dashboard', href: 'dashboard' },
            { label: 'Đăng ký hiến sữa' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="sticky top-16 z-40 bg-white border-b border-[#E2E8F0] py-4">
          <div className="max-w-[800px] mx-auto px-6">
            <Stepper steps={STEPS} currentStep={2} />
          </div>
        </div>

        <main className="max-w-[800px] mx-auto px-6 py-8">
          <Card className="border-[#E2E8F0] mb-6">
            <CardContent className="pt-6">
              <h2 className="text-[#1E293B] mb-6">Thông tin cá nhân</h2>
              <div className="grid md:grid-cols-2 gap-4 opacity-60">
                <div>
                  <div className="text-xs text-[#64748B] mb-1">Họ và tên</div>
                  <div className="text-sm text-[#1E293B]">{formData.name}</div>
                </div>
                <div>
                  <div className="text-xs text-[#64748B] mb-1">Ngày sinh</div>
                  <div className="text-sm text-[#1E293B]">
                    {formData.dob ? format(formData.dob, 'dd/MM/yyyy') : '--'} ({age} tuổi)
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#64748B] mb-1">Số điện thoại</div>
                  <div className="text-sm text-[#1E293B]">{formData.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-[#64748B] mb-1">Email</div>
                  <div className="text-sm text-[#1E293B]">{formData.email}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs text-[#64748B] mb-1">Địa chỉ</div>
                  <div className="text-sm text-[#1E293B]">
                    {formData.address}, {formData.district}, {formData.province}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E2E8F0] mb-6">
            <CardContent className="pt-6">
              <h2 className="text-[#1E293B] mb-6">Câu hỏi sàng lọc</h2>
              <div className="space-y-3 opacity-60">
                {SCREENING_QUESTIONS.map((question) => (
                  <div key={question.id} className="flex items-start justify-between text-sm">
                    <span className="text-[#64748B] flex-1">{question.text}</span>
                    <span className={screeningAnswers[question.key] ? 'text-[#DC2626]' : 'text-[#16A34A]'}>
                      {screeningAnswers[question.key] ? 'Có' : 'Không'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E2E8F0]">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <Checkbox id="confirm" />
                <label htmlFor="confirm" className="text-sm text-[#64748B] cursor-pointer">
                  Tôi xác nhận rằng tất cả thông tin trên là chính xác và đồng ý với{' '}
                  <span className="text-[#2E5BFF]">điều khoản sử dụng</span> và{' '}
                  <span className="text-[#2E5BFF]">chính sách bảo mật</span>.
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('form')}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-[#2E5BFF] hover:bg-[#2549CC]"
                >
                  Nộp hồ sơ
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (currentStep === 'result') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <ModernHeader
          user={user}
          breadcrumbs={[
            { label: 'Dashboard', href: 'dashboard' },
            { label: 'Đăng ký hiến sữa' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="sticky top-16 z-40 bg-white border-b border-[#E2E8F0] py-4">
          <div className="max-w-[800px] mx-auto px-6">
            <Stepper steps={STEPS} currentStep={3} />
          </div>
        </div>

        <main className="max-w-[800px] mx-auto px-6 py-12">
          {isApproved ? (
            <Card className="border-[#16A34A]">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#16A34A]" />
                </div>
                <h2 className="text-[#16A34A] mb-2">
                  Chúc mừng! Hồ sơ đã được duyệt
                </h2>
                <p className="text-[#64748B] mb-6">
                  Cảm ơn bạn đã đăng ký làm người hiến sữa. Mã người hiến của bạn là:
                </p>
                <div className="bg-[#F8FAFC] rounded-lg p-6 mb-6">
                  <div className="text-sm text-[#64748B] mb-2">Mã người hiến</div>
                  <div className="text-2xl text-[#1E293B] tracking-wider">{donorId}</div>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('dashboard')}
                  >
                    Về Dashboard
                  </Button>
                  <Button
                    onClick={() => setCurrentStep('schedule')}
                    className="bg-[#16A34A] hover:bg-[#15803D]"
                  >
                    Đặt lịch ngay
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-[#DC2626]">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-[#DC2626]" />
                </div>
                <h2 className="text-[#DC2626] mb-2 text-center">
                  Rất tiếc, hồ sơ chưa được duyệt
                </h2>
                <p className="text-[#64748B] mb-6 text-center">
                  Hồ sơ của bạn chưa đáp ứng các tiêu chí sau:
                </p>

                <Alert className="mb-6 border-[#FEE2E2] bg-[#FEF2F2]">
                  <AlertCircle className="h-4 w-4 text-[#DC2626]" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-2 text-sm text-[#DC2626]">
                      {rejectionReasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="bg-[#F8FAFC] rounded-lg p-6 mb-6">
                  <h3 className="text-[#1E293B] mb-3">Hướng dẫn</h3>
                  <ul className="space-y-2 text-sm text-[#64748B]">
                    <li>• Nếu bạn đang sử dụng thuốc, hãy tham khảo ý kiến bác sĩ</li>
                    <li>• Khi đã khỏe mạnh hoàn toàn, bạn có thể đăng ký lại</li>
                    <li>• Liên hệ hotline 1900-xxxx để được tư vấn thêm</li>
                  </ul>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('dashboard')}
                  >
                    Về Dashboard
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentStep('hero');
                      setFormStep('personal');
                      setScreeningAnswers({});
                    }}
                    className="bg-[#2E5BFF] hover:bg-[#2549CC]"
                  >
                    Đăng ký lại
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    );
  }

  if (currentStep === 'schedule') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <ModernHeader
          user={user}
          breadcrumbs={[
            { label: 'Dashboard', href: 'dashboard' },
            { label: 'Đặt lịch hẹn' },
          ]}
          onNavigate={onNavigate}
        />

        <main className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-[#1E293B] mb-2">
              Đặt lịch hiến sữa
            </h1>
            <p className="text-[#64748B]">
              Chọn ngày và giờ phù hợp với bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-[#E2E8F0] md:col-span-2">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-[#1E293B] mb-4">Chọn ngày</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
                    className="rounded-md border"
                  />
                </div>

                {selectedDate && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[#1E293B]">Chọn giờ</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">Sáng (8h-12h)</Badge>
                        <Badge variant="outline">Chiều (13h-17h)</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedSlot === slot.time ? 'default' : 'outline'}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={
                            selectedSlot === slot.time
                              ? 'bg-[#2E5BFF] hover:bg-[#2549CC]'
                              : slot.available
                              ? ''
                              : 'opacity-30'
                          }
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0] h-fit">
              <CardContent className="pt-6">
                <h3 className="text-[#1E293B] mb-4">Thông tin đặt lịch</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-xs text-[#64748B] mb-1">Ngày</div>
                    <div className="text-sm text-[#1E293B]">
                      {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: vi }) : 'Chưa chọn'}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[#64748B] mb-1">Giờ</div>
                    <div className="text-sm text-[#1E293B]">
                      {selectedSlot || 'Chưa chọn'}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[#64748B] mb-1">Địa điểm</div>
                    <div className="text-sm text-[#1E293B]">
                      Trung tâm MilkBank Hà Nội
                    </div>
                    <div className="text-xs text-[#64748B] mt-1">
                      123 Đường ABC, Ba Đình
                    </div>
                  </div>
                </div>

                <Alert className="mb-6 border-[#DBEAFE] bg-[#EFF6FF]">
                  <AlertCircle className="h-4 w-4 text-[#2E5BFF]" />
                  <AlertDescription className="text-xs text-[#2E5BFF]">
                    Vui lòng đến trước giờ hẹn 10 phút
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Button
                    onClick={handleScheduleConfirm}
                    disabled={!selectedDate || !selectedSlot}
                    className="w-full bg-[#16A34A] hover:bg-[#15803D]"
                  >
                    Xác nhận đặt lịch
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('dashboard')}
                    className="w-full"
                  >
                    Để sau
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
