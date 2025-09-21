"use client";

import React, { useState, useEffect } from "react";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsMobile(/iphone|ipad|ipod|android/.test(ua));
  }, []);

  const handleSupportClick = () => {
    if (isMobile) {
      window.open(
          "https://qr.kakaopay.com/281006011000010277268421",
          "_blank",
          "noopener,noreferrer"
      );
    } else {
      setShowQr(true);
    }
  };

  return (
      <footer className="bg-black text-green-300 font-mono py-8 border-t border-green-900/40">
        <div className="container mx-auto px-4 text-center text-sm space-y-2">
          <p>&gt; 개발자의, 개발자에 의한, 개발자를 위한 핑계 시스템</p>
          <p>&gt; Made with ❤️ by soheejjang0912@gmail.com</p>
          <p
              onClick={handleSupportClick}
              className="cursor-pointer hover:text-yellow-300 transition"
          >
            &gt; ☕ 카카오페이로 커피 한 잔 후원하기
          </p>
        </div>

        {/* CopyRight */}
        <div className="mt-8 border-t border-green-900/40 pt-4 text-center text-green-500 text-xs">
          <p>&copy; 2025 Excuse Me. All rights reserved.</p>
        </div>

        {/* PC 모달 (QR) */}
        {showQr && !isMobile && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                onClick={() => setShowQr(false)}
            >
              <div
                  className="bg-gray-50 rounded-lg shadow-2xl p-6 w-[92vw] max-w-md max-h-[88vh] overflow-auto text-center"
                  onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-lg font-bold mb-3 text-black">
                  카카오페이 송금
                </h4>
                <img
                    src="/kakaopay_qr.JPG"
                    alt="카카오페이 송금 QR"
                    className="w-full h-auto mx-auto rounded-md shadow max-h-[62vh] object-contain"
                />
                <p className="mt-2 text-sm text-gray-600">
                  📱 휴대폰 카메라로 스캔해주세요
                </p>
                <div className="mt-4 flex gap-2">
                  <a
                      href="https://qr.kakaopay.com/281006011000010277268421"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-center"
                  >
                    모바일로 열기
                  </a>
                  <button
                      onClick={() => setShowQr(false)}
                      className="flex-1 px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-black"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
        )}
      </footer>
  );
};

export default Footer;