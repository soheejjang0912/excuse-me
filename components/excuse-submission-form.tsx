"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function ExcuseSubmissionForm() {
  const [nickname, setNickname] = useState("");
  const [excuseText, setExcuseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !excuseText.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-excuse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: nickname.trim(),
          excuse_text: excuseText.trim(),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setNickname("");
        setExcuseText("");
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting excuse:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-gray-900/50 border-green-500/30 p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-green-400 mb-2">
            제출이 완료되었습니다!
          </h3>
          <p className="text-green-300 text-sm">
            관리자 검토 후 승인되면 핑계 목록에 추가됩니다.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-green-500/30 p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-green-400 mb-2">
          &gt; 새로운 핑계 추가
        </h3>
        <p className="text-green-300 text-sm">
          당신만의 창의적인 개발자 핑계를 공유해보세요!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="nickname" className="text-green-400 mb-2">
            닉네임
          </Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="익명의 개발자"
            maxLength={50}
            className="bg-gray-800 border-green-500/30 text-green-300 placeholder:text-green-600"
            required
          />
        </div>

        <div>
          <Label htmlFor="excuse" className="text-green-400 mb-2">
            핑계 내용
          </Label>
          <Textarea
            id="excuse"
            value={excuseText}
            onChange={(e) => setExcuseText(e.target.value)}
            placeholder="제 로컬에서는 잘 됩니다..."
            maxLength={200}
            rows={3}
            className="bg-gray-800 border-green-500/30 text-green-300 placeholder:text-green-600"
            required
          />
          <div className="text-right text-xs text-green-600 mt-1">
            {excuseText.length}/200
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !nickname.trim() || !excuseText.trim()}
          className="w-full bg-green-600 hover:bg-green-500 text-black font-bold"
        >
          {isSubmitting ? "> 제출 중..." : "> 핑계 제출하기"}
        </Button>
      </form>
    </Card>
  );
}
