import React, { useState } from "react";
import { Menu, X, Heart, User, LogOut, ChevronDown } from "lucide-react";

export function ModernHeader({ onNavigate, onAuthModal, user, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Trang chủ", href: "#", active: true },
    { label: "Về chúng tôi", href: "#about" },
    { label: "Quy trình hiến", href: "#process" },
    { label: "Tin tức", href: "#news" },
    { label: "Liên hệ", href: "#contact" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Milk Bank
              </span>
              <span className="text-xs text-gray-500">Ngân hàng sữa mẹ</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                  item.active ? "text-pink-600" : "text-gray-700"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* User Menu or Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
                    <div className="px-4 py-2 text-sm text-gray-600 border-b">
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs">{user.email}</div>
                      <div className="text-xs capitalize text-pink-600">
                        {user.role}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate("dashboard");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => onAuthModal("login")}
                  className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => onAuthModal("signup")}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
                >
                  Đăng ký
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-gray-50"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? "text-pink-600 bg-pink-50"
                      : "text-gray-700 hover:text-pink-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </a>
              ))}

              {!user && (
                <div className="pt-4 mt-4 border-t space-y-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onAuthModal("login");
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-gray-50 rounded-lg"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onAuthModal("signup");
                    }}
                    className="block w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
