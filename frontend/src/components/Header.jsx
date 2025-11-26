import React from "react";
import { Heart } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Milk Bank</h1>
              <p className="text-xs text-gray-600">Ngân hàng sữa mẹ</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
