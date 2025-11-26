import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { Separator } from './ui/separator';

export function ModernFooter() {
  return (
    <footer className="bg-[#0F172A] text-white py-16">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2E5BFF] to-[#1E40AF] rounded-xl flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C9.20435 2 8.44129 2.31607 7.87868 2.87868C7.31607 3.44129 7 4.20435 7 5C7 5.79565 7.31607 6.55871 7.87868 7.12132C8.44129 7.68393 9.20435 8 10 8C10.7956 8 11.5587 7.68393 12.1213 7.12132C12.6839 6.55871 13 5.79565 13 5C13 4.20435 12.6839 3.44129 12.1213 2.87868C11.5587 2.31607 10.7956 2 10 2ZM5 5C5 3.67392 5.52678 2.40215 6.46447 1.46447C7.40215 0.526784 8.67392 0 10 0C11.3261 0 12.5979 0.526784 13.5355 1.46447C14.4732 2.40215 15 3.67392 15 5C15 6.32608 14.4732 7.59785 13.5355 8.53553C12.5979 9.47322 11.3261 10 10 10C8.67392 10 7.40215 9.47322 6.46447 8.53553C5.52678 7.59785 5 6.32608 5 5Z" fill="white"/>
                  <path d="M10 11C7.87827 11 5.84344 11.8429 4.34315 13.3431C2.84285 14.8434 2 16.8783 2 19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20C3.26522 20 3.51957 19.8946 3.70711 19.7071C3.89464 19.5196 4 19.2652 4 19C4 17.4087 4.63214 15.8826 5.75736 14.7574C6.88258 13.6321 8.4087 13 10 13C11.5913 13 13.1174 13.6321 14.2426 14.7574C15.3679 15.8826 16 17.4087 16 19C16 19.2652 16.1054 19.5196 16.2929 19.7071C16.4804 19.8946 16.7348 20 17 20C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19C18 16.8783 17.1571 14.8434 15.6569 13.3431C14.1566 11.8429 12.1217 11 10 11Z" fill="white"/>
                </svg>
              </div>
              <div>
                <div className="text-lg">MilkBank</div>
                <div className="text-xs text-gray-400">Ngân hàng sữa mẹ</div>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Nền tảng hiến sữa mẹ uy tín, kết nối những tấm lòng yêu thương để cùng nhau chăm sóc các em bé.
            </p>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Về MilkBank</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors text-sm">Giới thiệu</a></li>
              <li><a href="#process" className="text-gray-400 hover:text-white transition-colors text-sm">Quy trình</a></li>
              <li><a href="#team" className="text-gray-400 hover:text-white transition-colors text-sm">Đội ngũ</a></li>
              <li><a href="#stories" className="text-gray-400 hover:text-white transition-colors text-sm">Câu chuyện</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4">Tài nguyên</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Hướng dẫn hiến sữa</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Tin tức</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#2E5BFF] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">123 Đường ABC, Quận Ba Đình, Hà Nội</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#2E5BFF] flex-shrink-0" />
                <span className="text-gray-400 text-sm">Hotline: 1900-xxxx</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#2E5BFF] flex-shrink-0" />
                <span className="text-gray-400 text-sm">support@milkbank.vn</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#2E5BFF] flex-shrink-0" />
                <span className="text-gray-400 text-sm">8:00 - 17:00 (T2-T6)</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 MilkBank. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Chính sách bảo mật</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
