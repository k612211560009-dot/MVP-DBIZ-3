import React from "react";
import { Heart, Users, Award, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-pink-600">Milk Bank</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are a community-driven organization dedicated to providing safe,
            high-quality breast milk to babies in need.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to connect generous milk donors with families who
            need breast milk for their babies. We ensure the highest safety
            standards through rigorous screening, testing, and processing
            protocols. Every drop of donated milk helps save lives and gives
            babies the best start in life.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Compassion</h3>
            <p className="text-sm text-gray-600">
              We care deeply about every baby and family we serve
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-sm text-gray-600">
              Building a network of support and solidarity
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Safety</h3>
            <p className="text-sm text-gray-600">
              Following strict medical protocols for screening and testing
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Excellence</h3>
            <p className="text-sm text-gray-600">
              Committed to the highest quality standards
            </p>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-pink-100">Registered Donors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15,000L</div>
              <div className="text-pink-100">Milk Donated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-pink-100">Babies Helped</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
