import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Heart,
  Shield,
  Award,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Quote,
  Star,
  Users,
  TrendingUp,
  Activity,
  UserPlus,
  LogIn,
  Gift,
  Share2,
  Copy,
} from "lucide-react";

const FEATURES = [
  {
    icon: Heart,
    title: "Safe Donation",
    description:
      "Donation process strictly controlled according to international medical standards",
  },
  {
    icon: Shield,
    title: "Data Privacy",
    description:
      "Personal information absolutely protected with modern encryption technology",
  },
  {
    icon: Award,
    title: "Rewards Program",
    description: "Points and benefits system for participating donors",
  },
];

const STATS = [
  { value: "2,500+", label: "Donors", icon: Users },
  { value: "15,000L", label: "Milk Donated", icon: Activity },
  { value: "98%", label: "Satisfaction Rate", icon: TrendingUp },
];

const TESTIMONIALS = [
  {
    name: "Nguyen Thi Mai",
    role: "Milk Donor",
    quote:
      "Donating milk not only helps babies but also brings me deep happiness and meaning.",
    donations: 12,
    volume: "3.2L",
  },
  {
    name: "Tran Thanh Huong",
    role: "MC & Milk Donor",
    quote:
      "As an influencer, I want to use my voice to spread the message about breast milk donation.",
    donations: 8,
    volume: "2.1L",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [referralCode, setReferralCode] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    // Generate unique referral code for authenticated users
    if (isAuthenticated && user) {
      const code = `MB${user.id?.toString().padStart(6, "0") || "000000"}`;
      setReferralCode(code);
    }
  }, [isAuthenticated, user]);

  const handleDonorRegister = () => {
    if (isAuthenticated) {
      // Already logged in -> Go directly to donor registration form
      navigate("/donor/register");
    } else {
      // Not logged in -> Go to account registration
      navigate("/register?role=donor");
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStaffLogin = () => {
    navigate("/login?role=medical_staff");
  };

  const handleGeneralLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto px-4">
            <Badge
              variant="secondary"
              className="mb-4 sm:mb-6 bg-pink-100 text-pink-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm"
            >
              Breast Milk Donation Program
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Share Love,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                Give Hope
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Join our community of caring mothers. Together, let's build a
              healthier future for babies through safe and meaningful breast
              milk donation.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <Button
                size="lg"
                onClick={handleDonorRegister}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-xl px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Start Donating Now
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg border-2 border-pink-200 text-pink-700 hover:bg-pink-50 w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 max-w-4xl mx-auto">
              <Card className="border-gray-200 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                        Simple Process
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Register in 3 easy steps and start helping babies in
                        need
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                        Health Screening
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Free health check and medical support for all donors
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <Award className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                        Reward Points
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Earn points and benefits for each successful donation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 sm:gap-8 text-center">
            {STATS.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="space-y-1 sm:space-y-2">
                  <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 mx-auto" />
                  <div className="text-xl sm:text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-base text-gray-600">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose Us?
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              We are committed to providing the safest, most professional, and
              meaningful milk donation service for the community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Stories from Our Community
            </h2>
            <p className="text-base sm:text-xl text-gray-600">
              Sharing from mothers who joined the program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-pink-500 mb-4" />
                  <p className="text-gray-700 italic mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-pink-600 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {testimonial.donations} donations • {testimonial.volume}
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Referral Program for Authenticated Users */}
      {isAuthenticated ? (
        <section className="py-12 sm:py-20 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto text-white px-4">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <Gift className="w-12 h-12 text-white" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Share the Love, Earn Rewards! 🎁
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-8 text-pink-100">
                Invite your friends to join our milk donation community. Both
                you and your friend will receive 500 bonus points!
              </p>

              {/* Referral Code Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 mb-8 border border-white/20">
                <div className="mb-4">
                  <p className="text-sm uppercase tracking-wider text-pink-100 mb-2">
                    Your Referral Code
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <code className="text-3xl sm:text-4xl font-bold tracking-widest bg-white/20 px-6 py-3 rounded-lg">
                      {referralCode}
                    </code>
                    <Button
                      onClick={handleCopyReferral}
                      className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40"
                      size="lg"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <Share2 className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Share Your Code</p>
                    <p className="text-xs text-pink-100 mt-1">
                      Send to friends via social media
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <UserPlus className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Friend Registers</p>
                    <p className="text-xs text-pink-100 mt-1">
                      They use your code when signing up
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Gift className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-semibold">Both Get Rewards</p>
                    <p className="text-xs text-pink-100 mt-1">
                      500 points credited to both accounts
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/donor/rewards")}
                  className="bg-white !text-rose-500 hover:bg-rose-50 hover:!text-rose-600 focus-visible:ring-2 focus-visible:ring-pink-200 focus-visible:ring-offset-2 focus-visible:ring-offset-pink-500 shadow-xl px-8 py-4 text-lg font-semibold"
                >
                  <Gift className="w-5 h-5 mr-2" />
                  Redeem Gifts
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleCopyReferral}
                  className="border-2 border-white text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Referral Code
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* CTA Section - Join Us for Non-Authenticated Users */
        <section className="py-12 sm:py-20 bg-gradient-to-r from-pink-500 to-rose-500">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto text-white px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Ready to Join Us?
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-pink-100">
                Start your journey of sharing love and creating miracles for the
                baby community today.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleDonorRegister}
                  className="bg-white !text-rose-500 hover:bg-rose-50 hover:!text-rose-600 focus-visible:ring-2 focus-visible:ring-pink-200 focus-visible:ring-offset-2 focus-visible:ring-offset-pink-500 shadow-xl px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Register as Donor
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleGeneralLogin}
                  className="border-2 border-white text-white hover:bg-white/20 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
                >
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Sign In to System
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="text-lg font-bold">Milk Bank</span>
              </div>
              <p className="text-gray-400">
                Breast Milk Bank - Share Love, Give Hope
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>1900 1234</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@milkbank.vn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>123 ABC Street, HN</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Working Hours</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Mon-Fri: 8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Sat: 8:00 AM - 12:00 PM</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">System Access</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={handleStaffLogin}
                >
                  Hospital Staff
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Milk Bank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
