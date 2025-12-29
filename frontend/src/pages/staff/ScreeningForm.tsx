import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { screeningQuestions } from "../../lib/safe-mock-data";
import { CheckCircle, AlertCircle } from "lucide-react";

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
    name: "Nguyen Thi A",
    dob: "1990-05-10",
    phone: "0912345678",
    address: "District 1, HCMC",
    ehrId: "EHR-12345",
  });

  // Question answers
  const [answers, setAnswers] = useState<
    Record<string, { answer: string; comment: string }>
  >({});

  // Final assessment
  const [result, setResult] = useState<"pass" | "fail" | "">("");
  const [failReasons, setFailReasons] = useState<string[]>([]);
  const [finalNotes, setFinalNotes] = useState("");

  const failReasonOptions = [
    "Has infectious disease",
    "Using antibiotics",
    "Smoking/drinking alcohol",
    "Serious medical history",
    "Does not meet health requirements",
    "Other reason",
  ];

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: {
        answer,
        comment: answers[questionId]?.comment || "",
      },
    });
  };

  const handleCommentChange = (questionId: string, comment: string) => {
    setAnswers({
      ...answers,
      [questionId]: {
        answer: answers[questionId]?.answer || "",
        comment,
      },
    });
  };

  const toggleFailReason = (reason: string) => {
    if (failReasons.includes(reason)) {
      setFailReasons(failReasons.filter((r) => r !== reason));
    } else {
      setFailReasons([...failReasons, reason]);
    }
  };

  const handleSubmit = async () => {
    // Validation
    const allQuestionsAnswered = screeningQuestions.every(
      (q) => answers[q.id]?.answer
    );
    if (!allQuestionsAnswered) {
      toast.error("Please answer all questions");
      return;
    }

    if (!result) {
      toast.error("Please select screening result");
      return;
    }

    if (result === "fail" && failReasons.length === 0) {
      toast.error("Please select at least one reason for rejection");
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Screening form has been saved successfully", {
        description: "Notification has been sent to donor",
      });
      setIsSaving(false);
      navigate("/appointments");
    }, 1500);
  };

  const completedQuestions = Object.values(answers).filter(
    (a) => a.answer
  ).length;
  const progress = (completedQuestions / screeningQuestions.length) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Donor Screening Form</h1>
        <p className="text-muted-foreground">
          Fill in screening information for milk donor
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span>Completion Progress</span>
            <span>
              {completedQuestions}/{screeningQuestions.length} questions
            </span>
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
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={personalInfo.name}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              type="date"
              value={personalInfo.dob}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, dob: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ehrId">EHR ID</Label>
            <Input
              id="ehrId"
              value={personalInfo.ehrId}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, ehrId: e.target.value })
              }
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={personalInfo.address}
              onChange={(e) =>
                setPersonalInfo({ ...personalInfo, address: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Screening Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Screening Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {screeningQuestions.map((question, index) => (
            <div
              key={question.id}
              className="space-y-3 pb-6 border-b last:border-0"
            >
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <Label className="text-base">{question.text}</Label>
                  {question.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </div>
                {answers[question.id]?.answer && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
              <RadioGroup
                value={answers[question.id]?.answer || ""}
                onValueChange={(value) =>
                  handleAnswerChange(question.id, value)
                }
                className="flex gap-4 ml-10"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                  <Label
                    htmlFor={`${question.id}-yes`}
                    className="cursor-pointer"
                  >
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${question.id}-no`} />
                  <Label
                    htmlFor={`${question.id}-no`}
                    className="cursor-pointer"
                  >
                    No
                  </Label>
                </div>
              </RadioGroup>
              <Textarea
                placeholder="Notes (optional)..."
                value={answers[question.id]?.comment || ""}
                onChange={(e) =>
                  handleCommentChange(question.id, e.target.value)
                }
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
          <CardTitle>Assessment Result</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Screening Result *</Label>
            <Select
              value={result}
              onValueChange={(value: any) => setResult(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pass">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Pass
                  </div>
                </SelectItem>
                <SelectItem value="fail">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    Fail
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {result === "fail" && (
            <div className="space-y-2">
              <Label>Reason for Failure *</Label>
              <div className="flex flex-wrap gap-2">
                {failReasonOptions.map((reason) => (
                  <Badge
                    key={reason}
                    variant={
                      failReasons.includes(reason) ? "default" : "outline"
                    }
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
            <Label htmlFor="finalNotes">General Notes</Label>
            <Textarea
              id="finalNotes"
              placeholder="Enter general notes about the screening process..."
              value={finalNotes}
              onChange={(e) => setFinalNotes(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/appointments")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Screening Form"}
        </Button>
      </div>
    </div>
  );
}
export default ScreeningForm;
