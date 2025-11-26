import React from "react";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";

export function ModernFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Milk Bank</span>
                <span className="text-xs text-gray-400">Ngân hàng sữa mẹ</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Kết nối tình yêu thương, mang lại dinh dưỡng tốt nhất cho các em
              bé. Cùng chúng tôi xây dựng cộng đồng hiến sữa mẹ ý nghĩa.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-pink-500 transition-colors"
                >
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-pink-500 transition-colors"
                >
                  Quy trình hiến sữa
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-pink-500 transition-colors"
                >
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-pink-500 transition-colors"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-pink-500 transition-colors"
                >
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-pink-500 transition-colors"
                >
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-pink-500 transition-colors"
                >
                  Liên hệ hỗ trợ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-pink-500 transition-colors"
                >
                  Báo cáo lỗi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-pink-500 transition-colors"
                >
                  Phản hồi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-pink-500 transition-colors"
                >
                  Tài liệu API
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span className="text-sm">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span className="text-sm">1900 1234</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span className="text-sm">info@milkbank.vn</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-400">
                  Giờ làm việc: 8:00 - 17:00
                  <br />
                  Thứ 2 - Chủ nhật
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 Milk Bank. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-pink-500 transition-colors"
              >
                Điều khoản
              </a>
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-pink-500 transition-colors"
              >
                Bảo mật
              </a>
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-pink-500 transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
