'use client';

import Link from 'next/link';
import { Smartphone, Home } from 'lucide-react';
import { Icon } from '@iconify/react';

export default function AppDownloadGuide() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-6 py-20 mt-16">
            <div className="max-w-2xl w-full text-center">
                {/* App Icon 視覺 */}
                <div className="mb-10 flex justify-center">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center border border-black/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0066CC]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Smartphone className="w-12 h-12 text-[#1D1D1F] group-hover:scale-110 transition-transform duration-500 delay-100" strokeWidth={1.5} />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-6 tracking-tight">
                    需透過 App <span className="text-[#0066CC]">開啟完整體驗</span>
                </h1>

                <p className="text-[#86868B] text-lg mb-12 leading-relaxed max-w-lg mx-auto">
                    為了提供您最完整的 3D 虛擬試穿與購物體驗，此頁面專門為 Tryzeon 應用程式設計。若您尚未安裝，請先下載 App。
                </p>

                {/* 主要按鈕 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <a
                        href="https://apps.apple.com/tw/app/tryzeon-%E9%87%8D%E6%96%B0%E5%AE%9A%E7%BE%A9%E4%BD%A0%E7%9A%84%E6%99%82%E5%B0%9A%E6%96%B0%E7%94%9F%E6%B4%BB/id6757691600"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1D1D1F] text-white rounded-2xl font-semibold hover:bg-black hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <Icon icon="mdi:apple" className="w-8 h-8" />
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px] text-gray-300 mb-1">Download on the</span>
                            <span className="text-lg font-semibold -mt-1">App Store</span>
                        </div>
                    </a>

                    <a
                        href="https://play.google.com/store/apps/details?id=com.tryzeon.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1D1D1F] text-white rounded-2xl font-semibold hover:bg-black hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <Icon icon="logos:google-play-icon" className="w-7 h-7" />
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px] text-gray-300 mb-1">GET IT ON</span>
                            <span className="text-lg font-semibold -mt-1">Google Play</span>
                        </div>
                    </a>
                </div>

                <div className="flex justify-center mb-16">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1D1D1F] rounded-full font-semibold hover:bg-[#F5F5F7] transition-all duration-300 shadow-[0_2px_10px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-black/5"
                    >
                        <Home className="w-5 h-5" />
                        回到官方網站
                    </Link>
                </div>
            </div>
        </div>
    );
}
