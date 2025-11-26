import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Gift,
  Star,
  TrendingUp,
  Package,
  Heart,
  Award,
  Check,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

const REWARD_ITEMS = [
  {
    id: 1,
    name: "Premium Baby Care Kit",
    points: 500,
    image: "🎁",
    description: "Complete baby care essentials package",
    stock: 15,
    category: "Baby Care",
  },
  {
    id: 2,
    name: "Organic Baby Food Voucher",
    points: 300,
    image: "🍼",
    description: "$50 voucher for organic baby food",
    stock: 30,
    category: "Voucher",
  },
  {
    id: 3,
    name: "Spa & Wellness Package",
    points: 1000,
    image: "💆‍♀️",
    description: "Full day spa treatment for mothers",
    stock: 5,
    category: "Wellness",
  },
  {
    id: 4,
    name: "Breastfeeding Pillow",
    points: 400,
    image: "🛏️",
    description: "Ergonomic nursing pillow with cover",
    stock: 12,
    category: "Baby Care",
  },
  {
    id: 5,
    name: "Health Check-up Voucher",
    points: 600,
    image: "🏥",
    description: "Comprehensive health screening",
    stock: 20,
    category: "Health",
  },
  {
    id: 6,
    name: "Baby Monitor System",
    points: 800,
    image: "📹",
    description: "Smart baby monitoring device",
    stock: 8,
    category: "Technology",
  },
  {
    id: 7,
    name: "Shopping Gift Card",
    points: 250,
    image: "💳",
    description: "$30 gift card for retail stores",
    stock: 50,
    category: "Voucher",
  },
  {
    id: 8,
    name: "Premium Diaper Package",
    points: 350,
    image: "👶",
    description: "6-month supply of premium diapers",
    stock: 25,
    category: "Baby Care",
  },
];

const RECENT_REDEMPTIONS = [
  {
    id: 1,
    item: "Premium Baby Care Kit",
    points: 500,
    date: "2025-11-10",
    status: "delivered",
  },
  {
    id: 2,
    item: "Shopping Gift Card",
    points: 250,
    date: "2025-11-05",
    status: "processing",
  },
];

export default function RewardsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userPoints] = useState(1250); // Mock data - should come from backend

  const categories = [
    "All",
    "Baby Care",
    "Voucher",
    "Wellness",
    "Health",
    "Technology",
  ];

  const filteredRewards =
    selectedCategory === "All"
      ? REWARD_ITEMS
      : REWARD_ITEMS.filter((item) => item.category === selectedCategory);

  const handleRedeem = (item) => {
    if (userPoints < item.points) {
      toast.error("Insufficient points!", {
        description: `You need ${
          item.points - userPoints
        } more points to redeem this item.`,
      });
      return;
    }

    toast.success("Redemption successful!", {
      description: `You've redeemed ${item.name}. We'll contact you for delivery details.`,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <Check className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/donor/dashboard")}
          className="mb-6 text-gray-600 hover:text-pink-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Rewards & Gifts 🎁
          </h1>
          <p className="text-gray-600">
            Redeem your points for exclusive rewards and gifts
          </p>
        </div>

        {/* Points Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-pink-500 to-rose-500 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm mb-1">Available Points</p>
                  <p className="text-4xl font-bold">
                    {userPoints.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Star className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Redeemed</p>
                  <p className="text-3xl font-bold text-gray-900">750</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Gift className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Lifetime Points</p>
                  <p className="text-3xl font-bold text-gray-900">2,000</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Earn Points Section */}
        <Card className="mb-8 border-pink-200 bg-pink-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-pink-600" />
              How to Earn More Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Donate Milk</p>
                  <p className="text-sm text-gray-600">
                    +50 points per donation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Gift className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Referral Bonus</p>
                  <p className="text-sm text-gray-600">
                    +500 points per friend
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Monthly Active</p>
                  <p className="text-sm text-gray-600">+100 bonus points</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Complete Profile
                  </p>
                  <p className="text-sm text-gray-600">+200 bonus points</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredRewards.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-lg transition-shadow border-gray-200"
            >
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">{item.image}</div>
                  <Badge variant="secondary" className="mb-2">
                    {item.category}
                  </Badge>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-pink-600 font-bold text-xl mb-3">
                    <Star className="w-5 h-5 fill-current" />
                    {item.points} Points
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    {item.stock} items available
                  </p>
                  <Button
                    onClick={() => handleRedeem(item)}
                    disabled={userPoints < item.points || item.stock === 0}
                    className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300"
                  >
                    {userPoints < item.points
                      ? "Insufficient Points"
                      : item.stock === 0
                      ? "Out of Stock"
                      : "Redeem Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Redemptions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Redemptions</CardTitle>
            <CardDescription>
              Your recent reward redemption history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_REDEMPTIONS.map((redemption) => (
                <div
                  key={redemption.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {redemption.item}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(redemption.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-gray-900">
                      -{redemption.points} pts
                    </p>
                    <Badge className={getStatusColor(redemption.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(redemption.status)}
                        <span className="capitalize">{redemption.status}</span>
                      </div>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
