import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { PhoneInput } from "../components/PhoneInput";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { toast } from "sonner";
import {
  Heart,
  Shield,
  FileCheck,
  CheckCircle,
  Info,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const STEPS = ["Personal Info", "Review & Submit", "Schedule Interview"];

const PROVINCES = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bạc Liêu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cần Thơ",
  "Cao Bằng",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "TP. Hồ Chí Minh",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

const SCREENING_QUESTIONS = [
  { id: "q1", text: "Are you currently breastfeeding?", required: true },
  { id: "q2", text: "Do you have any infectious diseases?", required: true },
  {
    id: "q3",
    text: "Are you currently taking antibiotics?",
    required: true,
  },
  { id: "q4", text: "Do you smoke or drink alcohol?", required: true },
  {
    id: "q5",
    text: "Do you have a history of cardiovascular disease?",
    required: true,
  },
  {
    id: "q6",
    text: "Are you being treated for chronic diseases?",
    required: true,
  },
  {
    id: "q7",
    text: "Have you gotten a tattoo in the past 12 months?",
    required: true,
  },
  {
    id: "q8",
    text: "Have you received a blood transfusion in the past 12 months?",
    required: true,
  },
  {
    id: "q9",
    text: "Are you willing to commit to regular milk donation?",
    required: true,
  },
  {
    id: "q10",
    text: "Do you agree to allow storage of your medical information?",
    required: true,
  },
];

export default function RegistrationFlow() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showInterviewComplete, setShowInterviewComplete] = useState(false);
  const [donorId, setDonorId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    dob: "",
    idPassport: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    contactMethod: "phone",
  });

  const [screeningAnswers, setScreeningAnswers] = useState({});
  const [confirmCorrect, setConfirmCorrect] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Load user email on mount
  useEffect(() => {
    if (user?.email) {
      setPersonalInfo((prev) => ({
        ...prev,
        email: user.email,
      }));
    }
  }, [user]);

  // Helper functions
  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user types
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleScreeningAnswer = (questionId, answer, comment = "") => {
    console.log("Screening answer:", { questionId, answer, comment });
    setScreeningAnswers((prev) => {
      const updated = {
        ...prev,
        [questionId]: { answer, comment },
      };
      console.log("Updated screening answers:", updated);
      return updated;
    });
  };

  const isScreeningComplete = () => {
    const complete = SCREENING_QUESTIONS.every(
      (q) => screeningAnswers[q.id]?.answer
    );
    console.log("Is screening complete?", complete, {
      totalQuestions: SCREENING_QUESTIONS.length,
      answeredQuestions: Object.keys(screeningAnswers).filter(
        (k) => screeningAnswers[k]?.answer
      ).length,
      answers: screeningAnswers,
    });
    return complete;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate required fields
      const errors = {};
      if (!personalInfo.fullName?.trim())
        errors.fullName = "Full name is required";
      if (!personalInfo.dob) errors.dob = "Date of birth is required";
      if (!personalInfo.idPassport?.trim())
        errors.idPassport = "ID/Passport is required";
      if (!personalInfo.phone?.trim())
        errors.phone = "Phone number is required";
      if (!personalInfo.email?.trim())
        errors.email = "Email address is required";
      if (!personalInfo.province) errors.province = "Province is required";

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (currentStep === 1) {
      if (!confirmCorrect) {
        toast.error("Please confirm that the information is accurate");
        return;
      }
      // Generate donorId and submit registration
      const generatedId = `DN-${Date.now()}`;
      setDonorId(generatedId);
      toast.success("Registration confirmed!", {
        description: `Your donor ID: ${generatedId}`,
      });
    } else if (currentStep === 4) {
      if (!selectedSlot) {
        toast.error("Please select an interview time");
        return;
      }
      // Show interview complete screen
      setShowInterviewComplete(true);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      // On first step, go back to previous page (dashboard or home)
      navigate(-1);
    } else if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCompleteProcess = async () => {
    try {
      // Call backend API to submit registration
      const response = await api.post("/donors/register", {
        fullName: personalInfo.fullName,
        dob: personalInfo.dob,
        idPassport: personalInfo.idPassport,
        phone: personalInfo.phone,
        email: personalInfo.email,
        province: personalInfo.province,
        district: personalInfo.district,
        ward: personalInfo.ward,
        address: personalInfo.address,
      });

      if (response.data) {
        toast.success("Registration completed successfully!", {
          description:
            "Your profile has been created. Please review your information.",
        });

        // Navigate to donor profile page with refresh signal
        setTimeout(() => {
          navigate("/donor/profile", {
            state: { refresh: Date.now() }, // Trigger profile refresh
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to complete registration", {
        description: error.response?.data?.message || "Please try again later",
      });
    }
  };

  const handleCompleteProcessOld = async () => {
    try {
      // OLD CODE - Keep for reference
      // MVP: Mock EHR data - always negative
      const mockEhrData = {
        hiv: {
          status: "negative",
          date: new Date().toISOString().split("T")[0],
        },
        hepatitisB: {
          status: "negative",
          date: new Date().toISOString().split("T")[0],
        },
        hepatitisC: {
          status: "negative",
          date: new Date().toISOString().split("T")[0],
        },
        syphilis: {
          status: "negative",
          date: new Date().toISOString().split("T")[0],
        },
        tuberculosis: {
          status: "negative",
          date: new Date().toISOString().split("T")[0],
        },
      };

      const registrationData = {
        userId: user?.id,
        donorId: donorId,
        fullName: personalInfo.fullName,
        dob: personalInfo.dob,
        phone: personalInfo.phone,
        email: personalInfo.email,
        province: personalInfo.province,
        address: personalInfo.address,
        personalInfo,
        screeningAnswers,
        interviewSlot: selectedSlot,
        ehrTestResults: mockEhrData,
        donor_status: "active",
        screening_status: "approved",
        director_status: "approved", // MVP: auto-approve
        consent_signed_at: new Date().toISOString(),
        points_total: 200, // Welcome bonus
      };

      console.log("Final Registration Data:", registrationData);

      // Save to user context for display in dashboard
      updateUserProfile(registrationData);

      // TODO: Call backend API
      // await fetch('/api/donors/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(registrationData)
      // });

      toast.success(
        "🎉 Registration completed! Welcome to our donor community!",
        { duration: 3000 }
      );

      // Navigate to donor dashboard (not logout!)
      setTimeout(() => {
        navigate("/donor/dashboard", { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Error occurred while completing registration");
    }
  };

  // Render functions
  const renderPersonalInfoForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Please provide your personal information for registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={personalInfo.fullName}
                onChange={(e) =>
                  handlePersonalInfoChange("fullName", e.target.value)
                }
                placeholder="Enter your full name"
                required
                className={validationErrors.fullName ? "border-red-500" : ""}
              />
              {validationErrors.fullName && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors.fullName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={personalInfo.dob}
                onChange={(e) =>
                  handlePersonalInfoChange("dob", e.target.value)
                }
                required
                className={validationErrors.dob ? "border-red-500" : ""}
              />
              {validationErrors.dob && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors.dob}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="idPassport">ID/Passport Number *</Label>
              <Input
                id="idPassport"
                value={personalInfo.idPassport}
                onChange={(e) =>
                  handlePersonalInfoChange("idPassport", e.target.value)
                }
                placeholder="Enter your ID or passport number"
                required
                className={validationErrors.idPassport ? "border-red-500" : ""}
              />
              {validationErrors.idPassport && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors.idPassport}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <PhoneInput
                value={personalInfo.phone}
                onChange={(value) => handlePersonalInfoChange("phone", value)}
                placeholder="Enter your phone number"
                className={validationErrors.phone ? "border-red-500" : ""}
              />
              {validationErrors.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors.phone}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) =>
                  handlePersonalInfoChange("email", e.target.value)
                }
                placeholder="Enter your email address"
                required
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="province">Province/City *</Label>
              <Select
                value={personalInfo.province}
                onValueChange={(value) =>
                  handlePersonalInfoChange("province", value)
                }
              >
                <SelectTrigger
                  className={validationErrors.province ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select your province/city" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.province && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors.province}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Full Address *</Label>
              <Input
                id="address"
                value={personalInfo.address}
                onChange={(e) =>
                  handlePersonalInfoChange("address", e.target.value)
                }
                placeholder="Enter your full address"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label>Preferred Contact Method</Label>
              <RadioGroup
                value={personalInfo.contactMethod}
                onValueChange={(value) =>
                  handlePersonalInfoChange("contactMethod", value)
                }
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone-contact" />
                  <Label htmlFor="phone-contact">Phone</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email-contact" />
                  <Label htmlFor="email-contact">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both-contact" />
                  <Label htmlFor="both-contact">Both</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderScreeningForm = () => {
    const answeredCount = Object.keys(screeningAnswers).filter(
      (key) => screeningAnswers[key]?.answer
    ).length;
    const progress = (answeredCount / SCREENING_QUESTIONS.length) * 100;

    return (
      <div className="space-y-6">
        {/* Progress indicator */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-gray-500">
                  {answeredCount}/{SCREENING_QUESTIONS.length} questions
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Screening Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-pink-500" />
              Health Screening Questions
            </CardTitle>
            <CardDescription>
              Please answer all 10 questions to assess your health status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {SCREENING_QUESTIONS.map((question, index) => (
              <div key={question.id} className="border-b pb-6 last:border-0">
                <Label className="text-base font-medium mb-3 block">
                  {index + 1}. {question.text}
                </Label>
                <RadioGroup
                  value={screeningAnswers[question.id]?.answer || ""}
                  onValueChange={(value) =>
                    handleScreeningAnswer(question.id, value)
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                    <Label htmlFor={`${question.id}-yes`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`${question.id}-no`} />
                    <Label htmlFor={`${question.id}-no`}>No</Label>
                  </div>
                </RadioGroup>
                {screeningAnswers[question.id]?.answer && (
                  <div className="mt-3">
                    <Label
                      htmlFor={`${question.id}-comment`}
                      className="text-sm"
                    >
                      Additional notes (optional)
                    </Label>
                    <Textarea
                      id={`${question.id}-comment`}
                      value={screeningAnswers[question.id]?.comment || ""}
                      onChange={(e) =>
                        handleScreeningAnswer(
                          question.id,
                          screeningAnswers[question.id].answer,
                          e.target.value
                        )
                      }
                      placeholder="Add details if needed..."
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderReviewForm = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Confirm Registration Information
          </CardTitle>
          <CardDescription>
            Please review the information carefully before confirming
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Info Summary */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Họ tên:</span>
                <p className="font-medium">{personalInfo.fullName}</p>
              </div>
              <div>
                <span className="text-gray-600">Date of Birth:</span>
                <p className="font-medium">{personalInfo.dob}</p>
              </div>
              <div>
                <span className="text-gray-600">CMND/CCCD:</span>
                <p className="font-medium">{personalInfo.idPassport}</p>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <p className="font-medium">{personalInfo.phone}</p>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <p className="font-medium">{personalInfo.email}</p>
              </div>
              <div>
                <span className="text-gray-600">Tỉnh/Thành:</span>
                <p className="font-medium">{personalInfo.province}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Địa chỉ:</span>
                <p className="font-medium">{personalInfo.address}</p>
              </div>
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Sau khi xác nhận, bạn sẽ được yêu cầu đặt lịch phỏng vấn với nhân
              viên y tế. Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho
              donor registration purposes.
            </AlertDescription>
          </Alert>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Checkbox
              id="confirmCorrect"
              checked={confirmCorrect}
              onChange={(e) => setConfirmCorrect(e.target.checked)}
            />
            <Label htmlFor="confirmCorrect" className="text-sm cursor-pointer">
              I confirm that all the above information is accurate and truthful.
              I understand that providing false information may affect the
              registration process.
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderScheduleInterviewForm = () => {
    // Generate next 7 days
    const timeSlots = ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM"];
    const nextDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      return date;
    });

    return (
      <div className="space-y-6">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Registration confirmed!</strong> Donor ID:{" "}
            <span className="font-mono font-bold">{donorId}</span>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Schedule Interview
            </CardTitle>
            <CardDescription>
              Select a suitable time for interview with medical staff
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {nextDays.map((date) => (
                <div key={date.toISOString()} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">
                    {date.toLocaleDateString("vi-VN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={`${date.toISOString()}-${time}`}
                        variant={
                          selectedSlot?.date ===
                            date.toISOString().split("T")[0] &&
                          selectedSlot?.time === time
                            ? "default"
                            : "outline"
                        }
                        className={
                          selectedSlot?.date ===
                            date.toISOString().split("T")[0] &&
                          selectedSlot?.time === time
                            ? "bg-pink-600"
                            : ""
                        }
                        onClick={() =>
                          setSelectedSlot({
                            date: date.toISOString().split("T")[0],
                            time: time,
                          })
                        }
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedSlot && (
              <Alert className="border-pink-200 bg-pink-50">
                <Info className="h-4 w-4 text-pink-600" />
                <AlertDescription className="text-pink-800">
                  <strong>Selected schedule:</strong>{" "}
                  {new Date(selectedSlot.date).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  at {selectedSlot.time}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderInterviewCompleteScreen = () => {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Message */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-12 w-12 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  ✅ Interview completed!
                </h3>
                <p className="text-green-800">
                  Cảm ơn bạn đã hoàn thành buổi phỏng vấn. Chúng tôi đã thu thập
                  đầy đủ thông tin từ bạn.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EHR Collection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Collecting medical information from Electronic Health Records
            </CardTitle>
            <CardDescription>
              We are automatically extracting test results from medical national
              electronic health records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Automatic information:</strong> Hệ thống sẽ kiểm tra các
                xét nghiệm bắt buộc sau:
                <ul className="mt-2 ml-4 space-y-1 list-disc">
                  <li>HIV (Human Immunodeficiency Virus)</li>
                  <li>HBV (Hepatitis B)</li>
                  <li>HCV (Hepatitis C)</li>
                  <li>Syphilis (Syphilis)</li>
                  <li>Tuberculosis (Tuberculosis)</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-pink-600"></div>
                <p className="text-gray-600">Connecting to EHR system...</p>
                <p className="text-sm text-gray-500">
                  (Demo MVP: Will automatically show negative results)
                </p>
              </div>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Demo MVP:</strong> Trong phiên bản demo này, tất cả kết
                test results will be simulated as negative and you will be
                auto-approved for testing convenience.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleCompleteProcess}
            size="lg"
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Complete Registration & Go to Dashboard
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Donor Registration
          </h1>
          <p className="text-gray-600">
            Complete the following steps to start your milk donation journey
          </p>
        </div>

        {/* Show Interview Complete Screen or Normal Flow */}
        {showInterviewComplete ? (
          renderInterviewCompleteScreen()
        ) : (
          <>
            {/* Stepper */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          currentStep > index + 1
                            ? "bg-green-500 text-white"
                            : currentStep === index + 1
                            ? "bg-pink-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {currentStep > index + 1 ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <p
                        className={`mt-2 text-xs text-center ${
                          currentStep >= index + 1
                            ? "text-gray-900 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 ${
                          currentStep > index + 1
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              {currentStep === 1 && renderPersonalInfoForm()}
              {currentStep === 2 && renderReviewForm()}
              {currentStep === 3 && renderScheduleInterviewForm()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button onClick={handleBack} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  className="bg-pink-600 hover:bg-pink-700"
                  disabled={
                    (currentStep === 2 && !confirmCorrect) ||
                    (currentStep === 3 && !selectedSlot)
                  }
                >
                  {currentStep === 2
                    ? "Confirm & Continue"
                    : currentStep === 3
                    ? "Complete Interview"
                    : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
