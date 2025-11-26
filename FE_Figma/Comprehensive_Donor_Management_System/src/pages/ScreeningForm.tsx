import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner@2.0.3';
import { useNavigate } from 'react-router-dom';
import { screeningQuestions } from '../lib/mock-data';
import { CheckCircle, AlertCircle } from 'lucide-react';

/*
API Endpoint:
POST /api/admin/appointments/{id}/screening

Request body:
{
  personalInfo: {
    name: string,
    dob: string,
    phone: string,
    address: string,
    ehrId: string
  },
  questions: [
    { questionId: string, answer: 'yes'|'no', comment: string }
  ],
  result: 'pass'|'fail',
  failReasons: string[],
  notes: string,
  completedBy: string
}

Workflow:
1. Pre-fill personal details from donor registration (editable)
2. Answer 10 screening questions (Yes/No + optional comment)
3. Select overall result (Pass/Fail)
4. If Fail: select reason(s) from predefined list
5. Add final notes
6. Save: Update appointment status to 'completed', store form file, send notification to donor

Validation:
- All questions must be answered
- If result = 'fail', at least one reason must be selected
- Staff signature required (can be replaced with current_user)
*/

export function ScreeningForm() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  // Pre-filled personal info (from donor record)
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Nguyễn Thị A',
    dob: '1990-05-10',
    phone: '0912345678',
    address: 'Quận 1, TP.HCM',
    ehrId: 'EHR-12345',
  });

  // Question answers
  const [answers, setAnswers] = useState<Record<string, { answer: string; comment: string }>>({});
  
  // Final assessment
  const [result, setResult] = useState<'pass' | 'fail' | ''>('');
  const [failReasons, setFailReasons] = useState<string[]>([]);
  const [finalNotes, setFinalNotes] = useState('');

  const failReasonOptions = [
    'Có bệnh truyền nhiễm',
    'Sử dụng thuốc kháng sinh',
    'Hút thuốc/uống rượu',
    'Tiền sử bệnh lý nghiêm trọng',
    'Không đủ điều kiện sức khỏe',
    'Lý do khác',
  ];

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: {
        answer,
        comment: answers[questionId]?.comment || '',
      },
    });
  };

  const handleCommentChange = (questionId: string, comment: string) => {
    setAnswers({
      ...answers,
      [questionId]: {
        answer: answers[questionId]?.answer || '',
        comment,
      },
    });
  };

  const toggleFailReason = (reason: string) => {
    if (failReasons.includes(reason)) {
      setFailReasons(failReasons.filter(r => r !== reason));
    } else {
      setFailReasons([...failReasons, reason]);
    }
  };

  const handleSubmit = async () => {
    // Validation
    const allQuestionsAnswered = screeningQuestions.every(q => answers[q.id]?.answer);
    if (!allQuestionsAnswered) {
      toast.error('Vui lòng trả lời tất cả các câu hỏi');
      return;
    }

    if (!result) {
      toast.error('Vui lòng chọn kết quả sàng lọc');
      return;
    }

    if (result === 'fail' && failReasons.length === 0) {
      toast.error('Vui lòng chọn ít nhất một lý do từ chối');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Phiếu sàng lọc đã được lưu thành công', {
        description: 'Thông báo đã được gửi đến donor',
      });
      setIsSaving(false);
      navigate('/appointments');
    }, 1500);
  };

  const completedQuestions = Object.values(answers).filter(a => a.answer).length;
  const progress = (completedQuestions / screeningQuestions.length) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Phiếu sàng lọc Donor</h1>
        <p className="text-muted-foreground">Điền thông tin sàng lọc cho mẹ hiến sữa</p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span>Tiến độ hoàn thành</span>
            <span>{completedQuestions}/{screeningQuestions.length} câu hỏi</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên *</Label>
            <Input
              id="name"
              value={personalInfo.name}
              onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Ngày sinh *</Label>
            <Input
              id="dob"
              type="date"
              value={personalInfo.dob}
              onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ehrId">EHR ID</Label>
            <Input
              id="ehrId"
              value={personalInfo.ehrId}
              onChange={(e) => setPersonalInfo({ ...personalInfo, ehrId: e.target.value })}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="address">Địa chỉ *</Label>
            <Input
              id="address"
              value={personalInfo.address}
              onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Screening Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Câu hỏi sàng lọc</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {screeningQuestions.map((question, index) => (
            <div key={question.id} className="space-y-3 pb-6 border-b last:border-0">
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <Label className="text-base">{question.text}</Label>
                  {question.required && <span className="text-destructive ml-1">*</span>}
                </div>
                {answers[question.id]?.answer && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
              <RadioGroup
                value={answers[question.id]?.answer || ''}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                className="flex gap-4 ml-10"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                  <Label htmlFor={`${question.id}-yes`} className="cursor-pointer">Có</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${question.id}-no`} />
                  <Label htmlFor={`${question.id}-no`} className="cursor-pointer">Không</Label>
                </div>
              </RadioGroup>
              <Textarea
                placeholder="Ghi chú (nếu có)..."
                value={answers[question.id]?.comment || ''}
                onChange={(e) => handleCommentChange(question.id, e.target.value)}
                rows={2}
                className="ml-10"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Assessment Result */}
      <Card>
        <CardHeader>
          <CardTitle>Kết quả đánh giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Kết quả sàng lọc *</Label>
            <Select value={result} onValueChange={(value: any) => setResult(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn kết quả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pass">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Đạt
                  </div>
                </SelectItem>
                <SelectItem value="fail">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    Không đạt
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {result === 'fail' && (
            <div className="space-y-2">
              <Label>Lý do không đạt *</Label>
              <div className="flex flex-wrap gap-2">
                {failReasonOptions.map((reason) => (
                  <Badge
                    key={reason}
                    variant={failReasons.includes(reason) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleFailReason(reason)}
                  >
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="finalNotes">Ghi chú tổng quan</Label>
            <Textarea
              id="finalNotes"
              placeholder="Nhập ghi chú chung về quá trình sàng lọc..."
              value={finalNotes}
              onChange={(e) => setFinalNotes(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/appointments')}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? 'Đang lưu...' : 'Lưu phiếu sàng lọc'}
        </Button>
      </div>

      {/* Implementation Notes */}
      <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
        <h3>Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
          <li>POST /api/admin/appointments/{'{id}'}/screening - Save screening form</li>
          <li>Auto-save draft every 30 seconds to prevent data loss</li>
          <li>Validate all required fields before submission</li>
          <li>Store form as PDF file in document management system</li>
          <li>Update appointment status to 'completed'</li>
          <li>If result = 'pass', update donor status to 'needs_tests'</li>
          <li>If result = 'fail', update donor status to 'rejected' and send notification</li>
          <li>Only assigned staff can fill the form (check permission)</li>
        </ul>
      </div>
    </div>
  );
}
