import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Quote, Star, Heart } from "lucide-react";

export default function Testimonials() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleDonorRegister = () => {
    if (isAuthenticated) {
      navigate("/donor/register");
    } else {
      navigate("/register?role=donor");
    }
  };

  const testimonials = [
    {
      name: "Nguyen Thi Mai",
      role: "Milk Donor since 2023",
      avatar: "👩",
      quote:
        "Donating milk has been one of the most fulfilling experiences of my life. Knowing that I'm helping babies who need it most fills my heart with joy every day.",
      donations: 12,
      volume: "3.2L",
      rating: 5,
    },
    {
      name: "Tran Thanh Huong",
      role: "MC & Milk Donor",
      avatar: "👩‍🦱",
      quote:
        "As a public figure, I want to use my platform to encourage more mothers to donate. The process is safe, easy, and incredibly rewarding.",
      donations: 8,
      volume: "2.1L",
      rating: 5,
    },
    {
      name: "Le Minh Phuong",
      role: "First-time Mom & Donor",
      avatar: "👱‍♀️",
      quote:
        "I had extra milk and wanted to help other babies. The Milk Bank team made everything so easy and comfortable. I'm proud to be part of this community.",
      donations: 6,
      volume: "1.5L",
      rating: 5,
    },
    {
      name: "Pham Thu Thao",
      role: "Experienced Donor",
      avatar: "👩‍🦰",
      quote:
        "I've been donating for over a year now. The reward program is a nice bonus, but the real reward is knowing I'm making a difference in babies' lives.",
      donations: 20,
      volume: "5.8L",
      rating: 5,
    },
    {
      name: "Hoang Yen Nhi",
      role: "Working Mom & Donor",
      avatar: "👩‍💼",
      quote:
        "Even with a busy work schedule, I can donate regularly thanks to the flexible scheduling. It's so easy and the staff are always supportive.",
      donations: 10,
      volume: "2.7L",
      rating: 5,
    },
    {
      name: "Vo Thuy Linh",
      role: "Donor & Advocate",
      avatar: "🧕",
      quote:
        "I love that I can help babies while also earning rewards. The process is transparent, professional, and deeply meaningful. Highly recommend!",
      donations: 15,
      volume: "4.2L",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Donor <span className="text-pink-600">Testimonials</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our amazing donors about their experiences and why they
            choose to donate breast milk.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-10 w-10 text-pink-200" />
              </div>

              {/* Quote Text */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Donor Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  <span className="text-sm text-gray-600">
                    {testimonial.donations} donations
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {testimonial.volume} donated
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Share Your Story?</h2>
          <p className="text-xl mb-6 text-pink-100">
            Join our community of donors and make a difference today.
          </p>
          <button
            onClick={handleDonorRegister}
            className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-pink-50 transition-colors"
          >
            Become a Donor
          </button>
        </div>
      </div>
    </div>
  );
}
