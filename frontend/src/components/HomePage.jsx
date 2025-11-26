import React from "react";
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
  Baby,
  Droplets,
  ArrowRight,
} from "lucide-react";

export function HomePage({ onNavigate, onAuthModal }) {
  const TESTIMONIALS = [
    {
      name: "Nguyễn Thị Mai",
      role: "Người hiến sữa",
      quote:
        "Việc hiến sữa không chỉ giúp đỡ các em bé mà còn mang lại cho tôi niềm hạnh phúc và ý nghĩa sâu sắc. Tôi tự hào khi được đóng góp một phần nhỏ cho cộng đồng.",
      donations: 12,
      volume: "3.2L",
    },
    {
      name: "Trần Thanh Hương",
      role: "MC & Người hiến sữa",
      quote:
        "Là một người có ảnh hưởng, tôi muốn sử dụng tiếng nói của mình để lan tóa thông điệp về hiến sữa mẹ. Đây là hành động yêu thương thiết thực nhất.",
      donations: 8,
      volume: "2.1L",
    },
  ];

  const PROCESS_STEPS = [
    {
      step: 1,
      title: "Đăng ký trực tuyến",
      description:
        "Điền form đăng ký với thông tin cá nhân và trả lời các câu hỏi sàng lọc sức khỏe. Chỉ mất 5-10 phút.",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      step: 2,
      title: "Sàng lọc & Duyệt hồ sơ",
      description:
        "Hệ thống tự động kiểm tra tiêu chí. Nếu đạt, bạn sẽ nhận mã người hiến ngay lập tức.",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      step: 3,
      title: "Đặt lịch hẹn",
      description:
        "Chọn ngày giờ phù hợp trong vòng 7 ngày tới. Linh hoạt với lịch trình của bạn.",
      icon: Clock,
      color: "bg-purple-50 text-purple-600",
    },
    {
      step: 4,
      title: "Hiến sữa tại trung tâm",
      description:
        "Đến trung tâm, được hướng dẫn chu đáo. Quy trình vô trùng, an toàn tuyệt đối.",
      icon: Heart,
      color: "bg-pink-50 text-pink-600",
    },
    {
      step: 5,
      title: "Kiểm tra chất lượng",
      description:
        "Sữa được kiểm nghiệm vi sinh, dinh dưỡng theo tiêu chuẩn quốc tế WHO.",
      icon: Shield,
      color: "bg-orange-50 text-orange-600",
    },
    {
      step: 6,
      title: "Nhận điểm & Đổi quà",
      description:
        "Tích điểm sau mỗi lần hiến và đổi quà tặng hấp dẫn cho mẹ và bé.",
      icon: Award,
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  const STATS = [
    {
      icon: Heart,
      label: "Người hiến sữa",
      value: "2,150+",
      color: "text-pink-600",
    },
    {
      icon: Baby,
      label: "Em bé được hỗ trợ",
      value: "5,420+",
      color: "text-blue-600",
    },
    {
      icon: Droplets,
      label: "Lít sữa hiến tặng",
      value: "12,300+",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Tỷ lệ hài lòng",
      value: "98.5%",
      color: "text-purple-600",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 to-purple-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Kết nối{" "}
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  tình yêu thương
                </span>
                , mang lại dinh dưỡng tốt nhất
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Tham gia cộng đồng hiến sữa mẹ ý nghĩa. Mỗi giọt sữa là một món
                quà vô giá cho những em bé cần được chăm sóc đặc biệt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onAuthModal("signup")}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Đăng ký ngay</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("process")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="border-2 border-pink-500 text-pink-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-pink-50 transition-all"
                >
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 text-center">
                  <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Cùng chăm sóc tương lai
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Mỗi giọt sữa mẹ là một món quà quý giá cho sự phát triển của
                    trẻ em
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-pink-50 p-3 rounded-lg">
                      <div className="font-bold text-pink-600">100%</div>
                      <div className="text-gray-600">An toàn</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="font-bold text-purple-600">24/7</div>
                      <div className="text-gray-600">Hỗ trợ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${stat.color} bg-gray-50 rounded-full mb-4`}
                >
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quy trình hiến sữa đơn giản
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi đã thiết kế quy trình hiến sữa mẹ đơn giản, thuận tiện
              và hoàn toàn miễn phí
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((step, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center mr-4`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500">
                    Bước {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => onAuthModal("signup")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
            >
              Bắt đầu ngay hôm nay
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Về Ngân hàng Sữa Mẹ
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Chúng tôi là tổ chức phi lợi nhuận đầu tiên tại Việt Nam chuyên
                về việc thu gom, xử lý và phân phối sữa mẹ hiến tặng cho các em
                bé có nhu cầu đặc biệt.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Tiêu chuẩn quốc tế
                    </h4>
                    <p className="text-gray-600">
                      Tuân thủ nghiêm ngặt các tiêu chuẩn WHO về an toàn thực
                      phẩm
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Kiểm tra kỹ lưỡng
                    </h4>
                    <p className="text-gray-600">
                      Mọi mẫu sữa đều được kiểm nghiệm vi sinh và dinh dưỡng
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Hỗ trợ 24/7</h4>
                    <p className="text-gray-600">
                      Đội ngũ y bác sĩ và tư vấn viên luôn sẵn sàng hỗ trợ
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-6 rounded-xl text-white">
                <Shield className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">An toàn tuyệt đối</h3>
                <p className="text-pink-100">
                  Quy trình vô trùng được kiểm soát nghiêm ngặt
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl text-white">
                <Activity className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Chất lượng cao</h3>
                <p className="text-blue-100">
                  Sữa mẹ giữ nguyên dinh dưỡng tự nhiên
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-xl text-white col-span-2">
                <Award className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Được công nhận</h3>
                <p className="text-green-100">
                  Nhận chứng nhận từ Bộ Y tế và các tổ chức quốc tế uy tín
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Câu chuyện của những người hiến sữa
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lắng nghe những chia sẻ đầy cảm động từ các mẹ đã tham gia cộng
              đồng hiến sữa
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <Quote className="w-8 h-8 text-pink-500 mb-4" />
                <blockquote className="text-lg text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {testimonial.donations} lần hiến • {testimonial.volume}
                    </div>
                    <div className="flex space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng tham gia cộng đồng hiến sữa?
          </h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Cùng chúng tôi mang lại những điều tốt đẹp nhất cho các em bé. Hành
            trình ý nghĩa bắt đầu chỉ với một cú click.
          </p>
          <button
            onClick={() => onAuthModal("signup")}
            className="bg-white text-pink-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <span>Đăng ký ngay</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-xl text-gray-600">
              Có thắc mắc? Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hotline</h3>
              <p className="text-gray-600">1900 1234</p>
              <p className="text-sm text-gray-500">24/7 - Miễn phí</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@milkbank.vn</p>
              <p className="text-sm text-gray-500">Phản hồi trong 2h</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Địa chỉ</h3>
              <p className="text-gray-600">123 Đường ABC, Q1, TP.HCM</p>
              <p className="text-sm text-gray-500">Thứ 2 - CN: 8:00-17:00</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
