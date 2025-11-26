import { useState } from 'react';
import { ModernHeader } from '../ModernHeader';
import { ModernFooter } from '../ModernFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { DropletIcon, Award, Calendar, Share2, Gift, Copy, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface DashboardProps {
  user: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const GIFTS = [
  { id: 1, name: 'Bình sữa Comotomo (250ml)', points: 200, stock: 15, image: 'baby bottle' },
  { id: 2, name: 'Túi trữ sữa Medela (50 túi)', points: 150, stock: 30, image: 'storage bags' },
  { id: 3, name: 'Máy hâm sữa Philips Avent', points: 500, stock: 5, image: 'bottle warmer' },
  { id: 4, name: 'Bộ chăm sóc cho mẹ', points: 300, stock: 10, image: 'mother care set' },
  { id: 5, name: 'Voucher sữa bột 200k', points: 200, stock: 20, image: 'gift voucher' },
  { id: 6, name: 'Gối bơm sữa thông minh', points: 450, stock: 8, image: 'nursing pillow' },
];

export function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode || 'LAN123');
    setCopiedCode(true);
    toast.success('Đã sao chép mã giới thiệu!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRedeemGift = (gift: typeof GIFTS[0]) => {
    if (user.points >= gift.points) {
      toast.success(`Đổi quà "${gift.name}" thành công!`);
    } else {
      toast.error(`Bạn cần thêm ${gift.points - user.points} điểm để đổi quà này!`);
    }
  };

  const handleShare = (platform: string) => {
    toast.info(`Chia sẻ qua ${platform} (Chức năng demo)`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <ModernHeader
        user={user}
        breadcrumbs={[{ label: 'Dashboard' }]}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-[#1E293B] mb-2">
            Chào mừng, {user?.name || 'Bạn'}! 👋
          </h1>
          <p className="text-[#64748B]">
            Cảm ơn bạn đã đồng hành cùng cộng đồng MilkBank
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="referral">Giới thiệu</TabsTrigger>
            <TabsTrigger value="gifts">Đổi quà</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-[#E2E8F0]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                      <DropletIcon className="w-6 h-6 text-[#2E5BFF]" />
                    </div>
                    <Badge variant="secondary" className="bg-[#DBEAFE] text-[#2E5BFF]">
                      +250ml
                    </Badge>
                  </div>
                  <div className="text-2xl text-[#1E293B] mb-1">2,450 ml</div>
                  <p className="text-sm text-[#64748B]">Tổng lượng sữa hiến</p>
                </CardContent>
              </Card>

              <Card className="border-[#E2E8F0]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <Badge variant="secondary" className="bg-[#FEF3C7] text-[#F59E0B]">
                      +50
                    </Badge>
                  </div>
                  <div className="text-2xl text-[#1E293B] mb-1">{user?.points || 350} điểm</div>
                  <p className="text-sm text-[#64748B]">Điểm tích lũy</p>
                </CardContent>
              </Card>

              <Card className="border-[#E2E8F0]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#DCFCE7] rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#16A34A]" />
                    </div>
                    <Badge variant="secondary" className="bg-[#DCFCE7] text-[#16A34A]">
                      Sắp tới
                    </Badge>
                  </div>
                  <div className="text-2xl text-[#1E293B] mb-1">12</div>
                  <p className="text-sm text-[#64748B]">Lần hiến sữa</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-[#1E293B] mb-4">Thao tác nhanh</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <Button
                  onClick={() => onNavigate('registration')}
                  className="h-auto flex-col gap-2 py-6 bg-[#2E5BFF] hover:bg-[#2549CC]"
                >
                  <DropletIcon className="w-6 h-6" />
                  <span>Hiến sữa</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 py-6 border-[#E2E8F0]"
                  onClick={() => toast.info('Xem lịch hẹn (Chức năng demo)')}
                >
                  <Calendar className="w-6 h-6" />
                  <span>Lịch hẹn</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 py-6 border-[#E2E8F0]"
                  onClick={() => setActiveTab('gifts')}
                >
                  <Gift className="w-6 h-6" />
                  <span>Đổi quà</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 py-6 border-[#E2E8F0]"
                  onClick={() => setActiveTab('referral')}
                >
                  <Share2 className="w-6 h-6" />
                  <span>Giới thiệu</span>
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Lịch sử hiến sữa và đổi quà</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '08/11/2025', action: 'Hiến sữa', amount: '250ml', points: '+50' },
                    { date: '05/11/2025', action: 'Đổi quà', amount: 'Bình sữa Comotomo', points: '-200' },
                    { date: '01/11/2025', action: 'Hiến sữa', amount: '300ml', points: '+60' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-[#E2E8F0] last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activity.action === 'Hiến sữa' ? 'bg-[#DBEAFE]' : 'bg-[#FEF3C7]'
                        }`}>
                          {activity.action === 'Hiến sữa' ? (
                            <DropletIcon className="w-5 h-5 text-[#2E5BFF]" />
                          ) : (
                            <Gift className="w-5 h-5 text-[#F59E0B]" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-[#1E293B]">{activity.action}</div>
                          <div className="text-xs text-[#64748B]">{activity.amount}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm ${activity.points.startsWith('+') ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                          {activity.points} điểm
                        </div>
                        <div className="text-xs text-[#64748B]">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referral" className="space-y-6">
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <CardTitle>Giới thiệu bạn bè</CardTitle>
                <CardDescription>
                  Chia sẻ mã giới thiệu và nhận thêm điểm thưởng khi bạn bè đăng ký thành công
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-br from-[#2E5BFF] to-[#1E40AF] rounded-xl p-6 text-white">
                  <div className="text-sm opacity-90 mb-2">Mã giới thiệu của bạn</div>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl tracking-wider">{user?.referralCode || 'LAN123'}</div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleCopyReferralCode}
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-[#F8FAFC] rounded-lg">
                    <div className="text-2xl text-[#2E5BFF] mb-1">3</div>
                    <div className="text-xs text-[#64748B]">Lượt giới thiệu</div>
                  </div>
                  <div className="p-4 bg-[#F8FAFC] rounded-lg">
                    <div className="text-2xl text-[#16A34A] mb-1">2</div>
                    <div className="text-xs text-[#64748B]">Thành công</div>
                  </div>
                  <div className="p-4 bg-[#F8FAFC] rounded-lg">
                    <div className="text-2xl text-[#F59E0B] mb-1">100</div>
                    <div className="text-xs text-[#64748B]">Điểm nhận được</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-[#1E293B] mb-3">Chia sẻ qua</div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleShare('Facebook')}
                      className="justify-start"
                    >
                      <div className="w-5 h-5 bg-[#1877F2] rounded mr-2"></div>
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShare('Zalo')}
                      className="justify-start"
                    >
                      <div className="w-5 h-5 bg-[#0068FF] rounded mr-2"></div>
                      Zalo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShare('Email')}
                      className="justify-start"
                    >
                      <div className="w-5 h-5 bg-[#EA4335] rounded mr-2"></div>
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShare('Link')}
                      className="justify-start"
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Sao chép link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gifts" className="space-y-6">
            <Card className="border-[#E2E8F0]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Đổi quà tặng</CardTitle>
                    <CardDescription>Sử dụng điểm tích lũy để đổi quà</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#64748B]">Điểm hiện tại</div>
                    <div className="text-2xl text-[#2E5BFF]">{user?.points || 350}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {GIFTS.map((gift) => (
                    <Card key={gift.id} className="border-[#E2E8F0] overflow-hidden">
                      <div className="aspect-square bg-[#F8FAFC] flex items-center justify-center">
                        <Gift className="w-16 h-16 text-[#CBD5E1]" />
                      </div>
                      <CardContent className="pt-4">
                        <h4 className="text-[#1E293B] mb-2 line-clamp-2">{gift.name}</h4>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-[#F59E0B]" />
                            <span className="text-[#F59E0B]">{gift.points} điểm</span>
                          </div>
                          <span className="text-xs text-[#64748B]">Còn {gift.stock}</span>
                        </div>
                        <Button
                          onClick={() => handleRedeemGift(gift)}
                          disabled={user?.points < gift.points || gift.stock === 0}
                          className="w-full bg-[#2E5BFF] hover:bg-[#2549CC]"
                          size="sm"
                        >
                          {user?.points >= gift.points ? 'Đổi ngay' : 'Chưa đủ điểm'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <ModernFooter />
    </div>
  );
}
