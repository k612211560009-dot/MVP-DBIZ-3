import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Stepper } from './components/Stepper';
import { HelpPanel } from './components/HelpPanel';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { PhoneInput } from './components/PhoneInput';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { Checkbox } from './components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Alert, AlertDescription } from './components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './components/ui/dialog';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { 
  Heart, 
  Shield, 
  FileCheck, 
  CheckCircle, 
  Info, 
  Download, 
  Home as HomeIcon, 
  ChevronLeft,
  Calendar as CalendarIcon
} from 'lucide-react';

type Screen = 'landing' | 'registration' | 'review' | 'schedule';

interface PersonalInfo {
  fullName: string;
  dob: Date | undefined;
  idPassport: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  contactMethod: 'phone' | 'email' | 'both';
}

const STEPS = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Review & Submit' },
  { id: 3, label: 'Schedule Interview' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [donorId, setDonorId] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: 'Pham Thi Lan',
    dob: new Date(1996, 4, 18),
    idPassport: '079096001234',
    phone: '+84 912 888 123',
    email: 'lan.pham@example.com',
    province: 'Ho Chi Minh City',
    district: 'District 3',
    ward: 'Ward 7',
    address: '123 Le Van Sy Street',
    contactMethod: 'both',
  });
  
  const [confirmCorrect, setConfirmCorrect] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate age from DOB
  const calculateAge = (dob: Date | undefined): number => {
    if (!dob) return 0;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(personalInfo.dob);

  // Validation
  const validatePersonalInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!personalInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!personalInfo.dob) newErrors.dob = 'Date of birth is required';
    if (!personalInfo.idPassport.trim()) newErrors.idPassport = 'ID/Passport is required';
    if (!personalInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+84\d{9,10}$/.test(personalInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone format';
    }
    if (!personalInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartRegistration = () => {
    setCurrentScreen('registration');
    setCurrentStep(1);
  };

  const handleContinueToReview = () => {
    if (!validatePersonalInfo()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    setCurrentScreen('review');
    setCurrentStep(2);
  };

  const handleSubmit = () => {
    if (!confirmCorrect) {
      toast.error('Please confirm your information is correct');
      return;
    }
    
    setDonorId('DN-10245');
    toast.success('Registration submitted successfully!');
    
    // Go directly to schedule screen
    setCurrentScreen('schedule');
    setCurrentStep(3);
  };

  const handleSlotSelect = (date: Date, time: string) => {
    setSelectedSlot({ date, time });
    setShowConfirmDialog(true);
  };

  const handleConfirmAppointment = () => {
    setShowConfirmDialog(false);
    setConfirmedAppointment(true);
    toast.success('Appointment confirmed successfully!');
  };

  const handleBack = () => {
    if (currentScreen === 'review') {
      setCurrentScreen('registration');
      setCurrentStep(1);
    } else if (currentScreen === 'schedule' && !confirmedAppointment) {
      setCurrentScreen('review');
      setCurrentStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {currentScreen !== 'landing' && (
        <Stepper steps={STEPS} currentStep={currentStep} />
      )}

      {/* Landing Screen */}
      {currentScreen === 'landing' && (
        <div className="container max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="mb-4">Register as Milk Donor</h1>
                <p className="text-muted-foreground mb-6">
                  Join our community of mothers helping babies in need. Your donated breast milk can provide essential nutrition and health benefits to premature or ill infants.
                </p>
                
                <Alert className="mb-6">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Your privacy matters:</strong> All information is encrypted and handled according to healthcare privacy standards. We never share your personal data without consent.
                  </AlertDescription>
                </Alert>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h3 className="mb-1">Make Impact</h3>
                      <p className="text-[12px] text-muted-foreground">Help babies thrive with your donation</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h3 className="mb-1">Safe Process</h3>
                      <p className="text-[12px] text-muted-foreground">Medical-grade screening & handling</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <FileCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h3 className="mb-1">Easy Steps</h3>
                      <p className="text-[12px] text-muted-foreground">Simple registration & coordination</p>
                    </CardContent>
                  </Card>
                </div>

                <Button size="lg" onClick={handleStartRegistration}>
                  Start Registration
                </Button>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>4 simple steps to become a donor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Complete registration form',
                    'Review and submit information',
                    'Schedule screening interview',
                    'Start donating milk',
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[12px] font-medium">
                        {i + 1}
                      </div>
                      <p className="text-[13px]">{step}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Registration Screen */}
      {currentScreen === 'registration' && (
        <div className="container max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* Personal Info Section */}
                <Card id="personal-info-section">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Please provide your accurate personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          value={personalInfo.fullName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                          className={errors.fullName ? 'border-destructive' : ''}
                        />
                        {errors.fullName && <p className="text-[12px] text-destructive">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dob">
                          Date of Birth <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="dob"
                          type="date"
                          value={personalInfo.dob ? personalInfo.dob.toISOString().split('T')[0] : ''}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value ? new Date(e.target.value) : undefined })}
                          className={errors.dob ? 'border-destructive' : ''}
                        />
                        {errors.dob && <p className="text-[12px] text-destructive">{errors.dob}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age">Age (auto-calculated)</Label>
                        <Input
                          id="age"
                          value={age || ''}
                          disabled
                          className="opacity-60"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="idPassport">
                          ID / Passport Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="idPassport"
                          value={personalInfo.idPassport}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, idPassport: e.target.value })}
                          className={errors.idPassport ? 'border-destructive' : ''}
                        />
                        {errors.idPassport && <p className="text-[12px] text-destructive">{errors.idPassport}</p>}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <PhoneInput
                        value={personalInfo.phone}
                        onChange={(value) => setPersonalInfo({ ...personalInfo, phone: value })}
                        error={errors.phone}
                        required
                      />

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && <p className="text-[12px] text-destructive">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="province">Province / City</Label>
                        <Select value={personalInfo.province} onValueChange={(value) => setPersonalInfo({ ...personalInfo, province: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ho Chi Minh City">Ho Chi Minh City</SelectItem>
                            <SelectItem value="Hanoi">Hanoi</SelectItem>
                            <SelectItem value="Da Nang">Da Nang</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Select value={personalInfo.district} onValueChange={(value) => setPersonalInfo({ ...personalInfo, district: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="District 1">District 1</SelectItem>
                            <SelectItem value="District 3">District 3</SelectItem>
                            <SelectItem value="District 5">District 5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ward">Ward</Label>
                        <Select value={personalInfo.ward} onValueChange={(value) => setPersonalInfo({ ...personalInfo, ward: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ward 5">Ward 5</SelectItem>
                            <SelectItem value="Ward 7">Ward 7</SelectItem>
                            <SelectItem value="Ward 9">Ward 9</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={personalInfo.address}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                        placeholder="Enter your street address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Preferred Contact Method</Label>
                      <RadioGroup value={personalInfo.contactMethod} onValueChange={(value: any) => setPersonalInfo({ ...personalInfo, contactMethod: value })}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="phone" id="contact-phone" />
                          <Label htmlFor="contact-phone" className="font-normal">Phone</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="contact-email" />
                          <Label htmlFor="contact-email" className="font-normal">Email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="both" id="contact-both" />
                          <Label htmlFor="contact-both" className="font-normal">Both</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleContinueToReview}>
                        Continue to Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <HelpPanel />
            </div>
          </div>
        </div>
      )}

      {/* Review Screen */}
      {currentScreen === 'review' && (
        <div className="container max-w-4xl mx-auto px-4 sm:px-8 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="mb-2">Review & Submit</h1>
              <p className="text-muted-foreground">Please review your information before submitting</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] text-muted-foreground">Full Name</p>
                    <p className="text-[14px] font-medium">{personalInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground">Date of Birth</p>
                    <p className="text-[14px] font-medium">{personalInfo.dob?.toLocaleDateString('en-GB')}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground">Age</p>
                    <p className="text-[14px] font-medium">{age} years</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground">ID/Passport</p>
                    <p className="text-[14px] font-medium">{personalInfo.idPassport}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground">Phone</p>
                    <p className="text-[14px] font-medium">{personalInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground">Email</p>
                    <p className="text-[14px] font-medium">{personalInfo.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] text-muted-foreground">Address</p>
                  <p className="text-[14px] font-medium">
                    {personalInfo.address}, {personalInfo.ward}, {personalInfo.district}, {personalInfo.province}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-muted-foreground">Preferred Contact</p>
                  <p className="text-[14px] font-medium capitalize">{personalInfo.contactMethod}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="confirm" 
                    checked={confirmCorrect}
                    onCheckedChange={(checked) => setConfirmCorrect(checked as boolean)}
                  />
                  <Label htmlFor="confirm" className="font-normal cursor-pointer">
                    I confirm that all information provided is correct and accurate to the best of my knowledge.
                  </Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!confirmCorrect}>
                Submit Registration
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Screen */}
      {currentScreen === 'schedule' && (
        <div className="container max-w-5xl mx-auto px-4 sm:px-8 py-8">
          <div className="space-y-6">
            <div>
              <Alert className="mb-6 border-success bg-success/10">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  <strong>Registration Submitted!</strong> Donor ID: <strong>{donorId}</strong>
                </AlertDescription>
              </Alert>

              <h1 className="mb-2">Schedule Screening Interview</h1>
              <p className="text-muted-foreground">Select a convenient date and time for your health screening interview</p>
            </div>

            {!confirmedAppointment ? (
              <>
                <div className="flex gap-4 mb-6">
                  <Button variant="outline" size="sm">Morning (8AM - 12PM)</Button>
                  <Button variant="outline" size="sm">Afternoon (1PM - 5PM)</Button>
                  <span className="text-[12px] text-muted-foreground ml-auto self-center">Time zone: GMT+7 (Ho Chi Minh)</span>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Available Time Slots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-7 gap-4">
                      {Array.from({ length: 7 }).map((_, dayIndex) => {
                        const date = new Date();
                        date.setDate(date.getDate() + dayIndex);
                        const times = ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM'];
                        
                        return (
                          <div key={dayIndex} className="space-y-2">
                            <div className="text-center py-2 bg-muted rounded-t-lg">
                              <p className="text-[11px] text-muted-foreground">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </p>
                              <p className="text-[13px] font-medium">
                                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <div className="space-y-2">
                              {times.map((time, timeIndex) => (
                                <button
                                  key={timeIndex}
                                  onClick={() => handleSlotSelect(date, time)}
                                  className="w-full p-2 text-[11px] border border-border rounded hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h2 className="mb-2">Appointment Confirmed</h2>
                    <p className="text-muted-foreground mb-6">
                      Your screening interview has been scheduled for:
                    </p>
                    <div className="bg-muted p-4 rounded-lg inline-block mb-6">
                      <p className="font-medium">{selectedSlot?.date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-muted-foreground">{selectedSlot?.time}</p>
                      <p className="text-[12px] text-muted-foreground mt-2">Via Telehealth Video Call</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={() => setCurrentScreen('landing')}>
                        <HomeIcon className="w-4 h-4 mr-2" />
                        Back to Dashboard
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>
              Please confirm your screening interview appointment
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-[13px] text-muted-foreground">Date & Time</p>
              <p className="font-medium">{selectedSlot?.date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-muted-foreground">{selectedSlot?.time}</p>
              <p className="text-[12px] text-muted-foreground mt-3">Location</p>
              <p className="text-[13px]">Telehealth Video Call</p>
              <p className="text-[12px] text-muted-foreground">Link will be sent via email</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAppointment}>
              Confirm Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
