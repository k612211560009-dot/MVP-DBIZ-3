import React from "react";
import {
  Heart,
  User,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  Droplets,
  Baby,
  Shield,
  Activity,
  ChevronRight,
  BarChart3,
  PieChart,
  Users,
} from "lucide-react";

export function Dashboard({ user, onNavigate, onLogout }) {
  const isDonor = user?.role === "donor";

  const donorStats = [
    {
      icon: Droplets,
      label: "Tổng lượng hiến",
      value: "2.4L",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Calendar,
      label: "Lần hiến gần nhất",
      value: "3 ngày",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Award,
      label: "Điểm tích lũy",
      value: "1,250",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Cấp độ",
      value: "Vàng",
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  const staffStats = [
    {
      icon: Users,
      label: "Người hiến hôm nay",
      value: "12",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Baby,
      label: "Em bé được hỗ trợ",
      value: "45",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Droplets,
      label: "Sữa xử lý (L)",
      value: "23.5",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Shield,
      label: "Tỷ lệ đạt chuẩn",
      value: "98.2%",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const upcomingAppointments = [
    {
      time: "09:00",
      name: "Nguyễn Thị Mai",
      type: "Hiến sữa định kỳ",
      status: "confirmed",
    },
    {
      time: "10:30",
      name: "Trần Thanh Hương",
      type: "Sàng lọc ban đầu",
      status: "pending",
    },
    {
      time: "14:00",
      name: "Lê Thị Bình",
      type: "Kiểm tra sức khỏe",
      status: "confirmed",
    },
  ];

  const recentActivities = isDonor
    ? [
        {
          time: "2 giờ trước",
          action: "Đặt lịch hẹn hiến sữa",
          detail: "Thứ 6, 15/11 - 10:00",
        },
        {
          time: "1 ngày trước",
          action: "Nhận điểm thưởng",
          detail: "+150 điểm từ lần hiến gần nhất",
        },
        {
          time: "3 ngày trước",
          action: "Hoàn thành hiến sữa",
          detail: "Số lượng: 250ml",
        },
        {
          time: "1 tuần trước",
          action: "Cập nhật thông tin sức khỏe",
          detail: "Kết quả kiểm tra: Tốt",
        },
      ]
    : [
        {
          time: "10 phút trước",
          action: "Xử lý mẫu sữa",
          detail: "Mã: MS20241115001",
        },
        {
          time: "1 giờ trước",
          action: "Hoàn thành kiểm tra",
          detail: "Người hiến: Nguyễn Thị Mai",
        },
        {
          time: "2 giờ trước",
          action: "Phê duyệt đăng ký",
          detail: "ID: DN20241115003",
        },
        {
          time: "1 ngày trước",
          action: "Cập nhật báo cáo",
          detail: "Báo cáo tuần 46/2024",
        },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isDonor ? "Dashboard Người hiến" : "Dashboard Nhân viên"}
              </h1>
              <p className="text-gray-600">
                Xin chào {user?.name}! Chào mừng bạn quay trở lại.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Trạng thái</div>
                <div className="font-medium text-green-600">Hoạt động</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {(isDonor ? donorStats : staffStats).map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isDonor ? "Hành động nhanh" : "Công việc hôm nay"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isDonor
                  ? [
                      {
                        icon: Calendar,
                        text: "Đặt lịch hiến sữa",
                        color: "bg-blue-500",
                      },
                      {
                        icon: Heart,
                        text: "Kiểm tra sức khỏe",
                        color: "bg-pink-500",
                      },
                      {
                        icon: Award,
                        text: "Đổi điểm thưởng",
                        color: "bg-purple-500",
                      },
                      {
                        icon: User,
                        text: "Cập nhật hồ sơ",
                        color: "bg-green-500",
                      },
                    ]
                  : [
                      {
                        icon: Users,
                        text: "Quản lý người hiến",
                        color: "bg-blue-500",
                      },
                      {
                        icon: BarChart3,
                        text: "Xem báo cáo",
                        color: "bg-green-500",
                      },
                      {
                        icon: Shield,
                        text: "Kiểm tra chất lượng",
                        color: "bg-orange-500",
                      },
                      {
                        icon: Activity,
                        text: "Theo dõi hệ thống",
                        color: "bg-purple-500",
                      },
                    ].map((action, index) => (
                      <button
                        key={index}
                        className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-3`}
                      >
                        <action.icon className="w-5 h-5" />
                        <span className="font-medium">{action.text}</span>
                      </button>
                    ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hoạt động gần đây
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.detail}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin cá nhân
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Họ tên</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vai trò</span>
                  <span className="capitalize font-medium text-pink-600">
                    {user?.role === "donor" ? "Người hiến" : "Nhân viên"}
                  </span>
                </div>
                {isDonor && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã hiến</span>
                      <span className="font-medium">{user?.user_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tham gia từ</span>
                      <span className="font-medium">Tháng 10, 2024</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Upcoming Schedule */}
            {!isDonor && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Lịch hẹn hôm nay
                </h3>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.time}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {appointment.type}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appointment.status === "confirmed"
                          ? "Xác nhận"
                          : "Chờ xử lý"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {isDonor && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thành tích
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Người hiến tích cực
                      </p>
                      <p className="text-sm text-gray-500">
                        5 lần hiến trong tháng
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Trái tim vàng</p>
                      <p className="text-sm text-gray-500">
                        Chất lượng sữa xuất sắc
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Đại sứ cộng đồng
                      </p>
                      <p className="text-sm text-gray-500">
                        Mời 3 người tham gia
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
