import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CheckCircle2, Heart, Users, FileText, Calendar } from "lucide-react";

export default function HowItWorks() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleDonorRegister = () => {
    if (isAuthenticated) {
      navigate("/donor/register");
    } else {
      navigate("/register?role=donor");
    }
  };

  const steps = [
    {
      number: 1,
      icon: FileText,
      title: "Register & Complete Form",
      description:
        "Sign up and fill out our comprehensive donor registration form with your personal and health information.",
    },
    {
      number: 2,
      icon: CheckCircle2,
      title: "Health Screening",
      description:
        "Answer health questionnaire and schedule an interview. We conduct thorough screening to ensure safety.",
    },
    {
      number: 3,
      icon: Users,
      title: "Medical Testing",
      description:
        "Complete required medical tests (HIV, Hepatitis B/C, Syphilis, TB). All tests are free of charge.",
    },
    {
      number: 4,
      icon: Calendar,
      title: "Schedule Donation",
      description:
        "Once approved, schedule your milk donation appointments at your convenience.",
    },
    {
      number: 5,
      icon: Heart,
      title: "Donate & Earn Rewards",
      description:
        "Donate breast milk regularly and earn reward points that can be redeemed for gifts!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How It <span className="text-pink-600">Works</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Becoming a milk donor is easy! Follow these simple steps to join our
            community and start making a difference.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl shadow-lg p-8 flex items-start gap-6 hover:shadow-xl transition-shadow"
            >
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {step.number}
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <step.icon className="h-8 w-8 text-pink-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-12 top-24 w-0.5 h-8 bg-pink-200" />
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6 text-pink-100">
            Join our community of caring mothers today and help babies in need.
          </p>
          <button
            onClick={handleDonorRegister}
            className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-pink-50 transition-colors"
          >
            Register to Donate
          </button>
        </div>
      </div>
    </div>
  );
}
