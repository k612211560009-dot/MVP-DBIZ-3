import { Heart, Shield, Award, ChevronRight, Phone, Mail, MapPin, Clock, CheckCircle2, Quote, Star, Facebook, Instagram, Youtube, Twitter, Users, TrendingUp, Activity } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

interface HomeProps {
  onNavigate: (page: 'login' | 'signup' | 'registration') => void;
}

const TESTIMONIALS = [
  {
    name: 'Nguyễn Thị Mai',
    role: 'Người hiến sữa',
    image: 'https://images.unsplash.com/photo-1701047018936-fe557ef2c98a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMG1vdGhlciUyMHNtaWxpbmd8ZW58MXx8fHwxNzYyODA1MDYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    quote: 'Việc hiến sữa không chỉ giúp đỡ các em bé mà còn mang lại cho tôi niềm hạnh phúc và ý nghĩa sâu sắc. Tôi tự hào khi được đóng góp một phần nhỏ cho cộng đồng.',
    donations: 12,
    volume: '3.2L',
  },
  {
    name: 'Trần Thanh Hương',
    role: 'MC & Người hiến sữa',
    image: 'https://images.unsplash.com/photo-1626296420762-c80977b60c87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdib3JuJTIwYmFieSUyMGhvc3BpdGFsfGVufDF8fHx8MTc2MjgwNTA2M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    quote: 'Là một người có ảnh hưởng, tôi muốn sử dụng tiếng nói của mình để lan tóa thông điệp về hiến sữa mẹ. Đây là hành động yêu thương thiết thực nhất.',
    donations: 8,
    volume: '2.1L',
  },
];

const TEAM_MEMBERS = [
  {
    name: 'BS. Nguyễn Văn An',
    role: 'Giám đốc Y khoa',
    image: 'https://images.unsplash.com/photo-1755189118414-14c8dacdb082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjI3OTQ1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'DS. Lê Thị Bình',
    role: 'Trưởng phòng Dinh dưỡng',
    image: 'https://images.unsplash.com/photo-1762190102324-116a615896da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVhbSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjI3OTY2NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Phạm Thu Hà',
    role: 'Điều phối viên',
    image: 'https://images.unsplash.com/photo-1730620703553-262b0563bb15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjBiYWJ5JTIwY2FyZXxlbnwxfHx8fDE3NjI3NDA1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Đỗ Minh Tuấn',
    role: 'Chuyên viên Kỹ thuật',
    image: 'https://images.unsplash.com/photo-1512069511692-b82d787265cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NjI3Mzk0OTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const PROCESS_STEPS = [
  {
    step: 1,
    title: 'Đăng ký trực tuyến',
    description: 'Điền form đăng ký với thông tin cá nhân và trả lời các câu hỏi sàng lọc sức khỏe. Chỉ mất 5-10 phút.',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    step: 2,
    title: 'Sàng lọc & Duyệt hồ sơ',
    description: 'Hệ thống tự động kiểm tra tiêu chí. Nếu đạt, bạn sẽ nhận mã người hiến ngay lập tức.',
    icon: CheckCircle2,
    color: 'bg-green-50 text-green-600',
  },
  {
    step: 3,
    title: 'Đặt lịch hẹn',
    description: 'Chọn ngày giờ phù hợp trong vòng 7 ngày tới. Linh hoạt với lịch trình của bạn.',
    icon: Clock,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    step: 4,
    title: 'Hiến sữa tại trung tâm',
    description: 'Đến trung tâm, được hướng dẫn chu đáo. Quy trình vô trùng, an toàn tuyệt đối.',
    icon: Heart,
    color: 'bg-pink-50 text-pink-600',
  },
  {
    step: 5,
    title: 'Kiểm tra chất lượng',
    description: 'Sữa được kiểm nghiệm vi sinh, dinh dưỡng theo tiêu chuẩn quốc tế WHO.',
    icon: Shield,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    step: 6,
    title: 'Nhận điểm & Đổi quà',
    description: 'Tích điểm sau mỗi lần hiến và đổi quà tặng hấp dẫn cho mẹ và bé.',
    icon: Award,
    color: 'bg-yellow-50 text-yellow-600',
  },
];

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0] shadow-sm">
        <div className="h-20 px-6 flex items-center justify-between max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2E5BFF] to-[#1E40AF] rounded-xl flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C9.20435 2 8.44129 2.31607 7.87868 2.87868C7.31607 3.44129 7 4.20435 7 5C7 5.79565 7.31607 6.55871 7.87868 7.12132C8.44129 7.68393 9.20435 8 10 8C10.7956 8 11.5587 7.68393 12.1213 7.12132C12.6839 6.55871 13 5.79565 13 5C13 4.20435 12.6839 3.44129 12.1213 2.87868C11.5587 2.31607 10.7956 2 10 2ZM5 5C5 3.67392 5.52678 2.40215 6.46447 1.46447C7.40215 0.526784 8.67392 0 10 0C11.3261 0 12.5979 0.526784 13.5355 1.46447C14.4732 2.40215 15 3.67392 15 5C15 6.32608 14.4732 7.59785 13.5355 8.53553C12.5979 9.47322 11.3261 10 10 10C8.67392 10 7.40215 9.47322 6.46447 8.53553C5.52678 7.59785 5 6.32608 5 5Z" fill="white"/>
                <path d="M10 11C7.87827 11 5.84344 11.8429 4.34315 13.3431C2.84285 14.8434 2 16.8783 2 19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20C3.26522 20 3.51957 19.8946 3.70711 19.7071C3.89464 19.5196 4 19.2652 4 19C4 17.4087 4.63214 15.8826 5.75736 14.7574C6.88258 13.6321 8.4087 13 10 13C11.5913 13 13.1174 13.6321 14.2426 14.7574C15.3679 15.8826 16 17.4087 16 19C16 19.2652 16.1054 19.5196 16.2929 19.7071C16.4804 19.8946 16.7348 20 17 20C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19C18 16.8783 17.1571 14.8434 15.6569 13.3431C14.1566 11.8429 12.1217 11 10 11Z" fill="white"/>
              </svg>
            </div>
            <div>
              <div className="text-[#1E293B]">MilkBank</div>
              <div className="text-xs text-[#64748B]">Ngân hàng sữa mẹ</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-[#64748B] hover:text-[#2E5BFF] transition-colors">Về chúng tôi</a>
            <a href="#process" className="text-sm text-[#64748B] hover:text-[#2E5BFF] transition-colors">Quy trình</a>
            <a href="#stories" className="text-sm text-[#64748B] hover:text-[#2E5BFF] transition-colors">Câu chuyện</a>
            <a href="#team" className="text-sm text-[#64748B] hover:text-[#2E5BFF] transition-colors">Đội ngũ</a>
            <a href="#contact" className="text-sm text-[#64748B] hover:text-[#2E5BFF] transition-colors">Liên hệ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => onNavigate('login')}
              className="hidden md:flex"
            >
              Đăng nhập
            </Button>
            <Button
              onClick={() => onNavigate('signup')}
              className="bg-gradient-to-r from-[#2E5BFF] to-[#1E40AF] hover:opacity-90 shadow-lg"
            >
              Đăng ký ngay
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Question & Purpose */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE] py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-[1440px] mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge className="bg-[#2E5BFF] text-white hover:bg-[#2549CC]">
                <Activity className="w-3 h-3 mr-1" />
                Đã giúp đỡ hơn 1,500 em bé
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl text-[#1E293B] leading-tight">
                  Bạn có thể giúp
                  <span className="block text-[#2E5BFF]">cứu sống một em bé?</span>
                </h1>
                <p className="text-xl text-[#64748B] leading-relaxed">
                  Mỗi giọt sữa mẹ là một món quà vô giá. Hãy tham gia cùng chúng tôi để mang lại cơ hội sống cho những em bé sinh non và có hoàn cảnh khó khăn.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => onNavigate('signup')}
                  className="bg-gradient-to-r from-[#2E5BFF] to-[#1E40AF] hover:opacity-90 shadow-xl text-lg h-14 px-8"
                >
                  Bắt đầu hiến sữa
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#2E5BFF] text-[#2E5BFF] hover:bg-[#2E5BFF] hover:text-white text-lg h-14 px-8"
                  onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Tìm hiểu thêm
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#2E5BFF]/20">
                <div>
                  <div className="text-3xl text-[#2E5BFF]">1,500+</div>
                  <div className="text-sm text-[#64748B]">Em bé được giúp</div>
                </div>
                <div>
                  <div className="text-3xl text-[#2E5BFF]">350+</div>
                  <div className="text-sm text-[#64748B]">Người hiến sữa</div>
                </div>
                <div>
                  <div className="text-3xl text-[#2E5BFF]">5,200L</div>
                  <div className="text-sm text-[#64748B]">Sữa đã hiến</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1730620703553-262b0563bb15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjBiYWJ5JTIwY2FyZXxlbnwxfHx8fDE3NjI3NDA1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Mother and baby"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Floating Card */}
              <Card className="absolute -bottom-8 -left-8 bg-white shadow-2xl border-0 w-64">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-[#64748B]">Hôm nay</div>
                      <div className="text-[#1E293B]">15 mẹ hiến sữa</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-24 bg-white" id="about">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-[#EFF6FF] text-[#2E5BFF] mb-4">Tại sao nên hiến sữa</Badge>
            <h2 className="text-4xl text-[#1E293B] mb-4">
              Giá trị bạn mang lại
            </h2>
            <p className="text-xl text-[#64748B] max-w-3xl mx-auto">
              Sữa mẹ không chỉ là thức ăn, đó là món quà sự sống cho những em bé cần được giúp đỡ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#E2E8F0] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-[#2E5BFF]" />
                </div>
                <h3 className="text-xl text-[#1E293B] mb-3">Cứu sống bé sinh non</h3>
                <p className="text-[#64748B] leading-relaxed">
                  Sữa mẹ chứa kháng thể và dinh dưỡng tối ưu, giúp các bé sinh non phát triển khỏe mạnh và giảm 50% nguy cơ nhiễm trùng nguy hiểm.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-[#16A34A]" />
                </div>
                <h3 className="text-xl text-[#1E293B] mb-3">An toàn & Chuyên nghiệp</h3>
                <p className="text-[#64748B] leading-relaxed">
                  Quy trình kiểm tra nghiêm ngặt theo tiêu chuẩn WHO và bảo quản ở -20°C. Đội ngũ y tế chuyên môn cao đồng hành cùng bạn.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-[#F59E0B]" />
                </div>
                <h3 className="text-xl text-[#1E293B] mb-3">Ưu đãi hấp dẫn</h3>
                <p className="text-[#64748B] leading-relaxed">
                  Tích điểm sau mỗi lần hiến và đổi quà tặng cao cấp cho mẹ và bé: bình sữa, máy hâm sữa, voucher và nhiều hơn nữa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Process Section */}
      <section className="py-24 bg-gradient-to-b from-[#F8FAFC] to-white" id="process">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-[#EFF6FF] text-[#2E5BFF] mb-4">Quy trình đơn giản</Badge>
            <h2 className="text-4xl text-[#1E293B] mb-4">
              Chỉ 6 bước để bắt đầu
            </h2>
            <p className="text-xl text-[#64748B] max-w-3xl mx-auto">
              Quy trình hiến sữa được thiết kế đơn giản, dễ dàng và hoàn toàn minh bạch
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={step.step} className="border-[#E2E8F0] hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-8 h-8" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="secondary" className="text-xs">Bước {step.step}</Badge>
                          <h3 className="text-xl text-[#1E293B]">{step.title}</h3>
                        </div>
                        <p className="text-[#64748B] leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => onNavigate('signup')}
              className="bg-gradient-to-r from-[#2E5BFF] to-[#1E40AF] hover:opacity-90 shadow-xl text-lg h-14 px-8"
            >
              Bắt đầu hiến sữa ngay
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials/Stories Section */}
      <section className="py-24 bg-white" id="stories">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-[#FEF3C7] text-[#F59E0B] mb-4">
              <Star className="w-3 h-3 mr-1" />
              Câu chuyện thật
            </Badge>
            <h2 className="text-4xl text-[#1E293B] mb-4">
              Những người hiến sữa tiêu biểu
            </h2>
            <p className="text-xl text-[#64748B] max-w-3xl mx-auto">
              Chia sẻ từ những người mẹ đã và đang đồng hành cùng MilkBank
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="border-[#E2E8F0] hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-[#2E5BFF] opacity-20 mb-4" />
                  <p className="text-[#64748B] leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#2E5BFF]">
                      <ImageWithFallback
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-[#1E293B]">{testimonial.name}</div>
                      <div className="text-sm text-[#64748B]">{testimonial.role}</div>
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-[#F8FAFC] rounded-lg">
                      <div className="text-2xl text-[#2E5BFF]">{testimonial.donations}</div>
                      <div className="text-xs text-[#64748B]">Lần hiến</div>
                    </div>
                    <div className="text-center p-3 bg-[#F8FAFC] rounded-lg">
                      <div className="text-2xl text-[#16A34A]">{testimonial.volume}</div>
                      <div className="text-xs text-[#64748B]">Tổng lượng</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-b from-[#F8FAFC] to-white" id="team">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-[#EFF6FF] text-[#2E5BFF] mb-4">Đội ngũ chuyên môn</Badge>
            <h2 className="text-4xl text-[#1E293B] mb-4">
              Cam kết của chúng tôi
            </h2>
            <p className="text-xl text-[#64748B] max-w-3xl mx-auto">
              Đội ngũ y bác sĩ và chuyên gia giàu kinh nghiệm, tận tâm với sứ mệnh bảo vệ sức khỏe các em bé
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {TEAM_MEMBERS.map((member, index) => (
              <Card key={index} className="border-[#E2E8F0] hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="pt-6 pb-6 text-center">
                  <div className="text-[#1E293B] mb-1">{member.name}</div>
                  <div className="text-sm text-[#64748B]">{member.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#E2E8F0] bg-gradient-to-br from-[#EFF6FF] to-white">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-12 h-12 bg-[#2E5BFF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-[#1E293B] mb-2">Tiêu chuẩn quốc tế</h4>
                <p className="text-sm text-[#64748B]">
                  Tuân thủ nghiêm ngặt theo hướng dẫn của WHO về ngân hàng sữa mẹ
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0] bg-gradient-to-br from-[#DCFCE7] to-white">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-12 h-12 bg-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-[#1E293B] mb-2">Quy trình minh bạch</h4>
                <p className="text-sm text-[#64748B]">
                  Mỗi giọt sữa được theo dõi từ hiến tặng đến khi đến tay bé
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#E2E8F0] bg-gradient-to-br from-[#FEF3C7] to-white">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-[#1E293B] mb-2">Hỗ trợ liên tục</h4>
                <p className="text-sm text-[#64748B]">
                  Tư vấn và hỗ trợ 24/7 cho người hiến sữa và người nhận
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#2E5BFF] to-[#1E40AF] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-[1440px] mx-auto px-6 text-center relative">
          <h2 className="text-4xl lg:text-5xl mb-6">
            Sẵn sàng thay đổi cuộc đời các em bé?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Hành trình của bạn bắt đầu chỉ với một cú click. Cùng nhau, chúng ta có thể tạo nên điều kỳ diệu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate('signup')}
              className="bg-white text-[#2E5BFF] hover:bg-gray-100 shadow-xl text-lg h-14 px-8"
            >
              Đăng ký hiến sữa ngay
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg h-14 px-8"
            >
              <Phone className="w-5 h-5 mr-2" />
              Hotline: 1900-xxxx
            </Button>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-[#0F172A] text-white py-16" id="contact">
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

      <style>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
