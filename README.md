# 🎲 버그 핑계 뽑기 시스템 v1.0

> 개발자를 위한 랜덤 핑계 생성기  
> 복사 기능과 사용량 집계를 지원합니다
> https://excuseme.cloud

---

## 🚀 주요 기능
- 🎲 **랜덤 핑계 뽑기**: 클릭 한 번으로 새로운 변명 생성
- 📊 **사용량 카운트**: 복사 시 자동으로 사용 횟수 기록
- 🏆 **실시간 랭킹**: 가장 많이 사용된 핑계 순위 확인
- ✍️ **핑계 제출 폼**: 커뮤니티가 직접 핑계 제안 가능
- 🚀 **즉시 공유**: 복사하기를 통한 간편 공유

---

## 🛠 기술 스택
- **Frontend**: Next.js 13+, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Infra/Deploy**: Vercel, AWS EC2 (선택 배포 가능)

---

## 📂 프로젝트 구조
```bash
/app
  /generator            # 핑계 뽑기 UI
  /rankings             # 실시간 랭킹
  /api
    /approved-excuses   # 승인된 핑계 조회 API
    /submit-excuse      # 신규 핑계 제출 API
    /database-stats     # 통계 조회 API
/components
  excuse-generator.tsx
  excuse-submission-form.tsx
```

---

## ☁️ AWS EC2 배포

- **Elastic IP** 고정
    - 인스턴스 재시작 시에도 동일한 IP 유지

- **Nginx + PM2** 구성
    - **Nginx**: 리버스 프록시 + HTTPS 처리
    - **PM2**: 앱 실행/모니터링, 자동 재시작

- **SSL(HTTPS) 적용**
    - Let's Encrypt + Certbot으로 무료 SSL 발급
    - `excuseme.cloud`, `www.excuseme.cloud` 인증서 적용
    - HTTP → HTTPS 자동 리디렉트

- **SSL 자동 갱신**
    - `certbot.timer` 등록으로 인증서 만료 전 자동 갱신
    - `sudo certbot renew --dry-run` 테스트 완료

- **GitHub Actions CI/CD**
    - main 브랜치 push 시 EC2로 자동 배포
    - `npm ci && npm run build` 후 `pm2 restart` 자동 실행

- **보안 그룹 (Security Group)**
    - 22 (SSH), 80 (HTTP), 443 (HTTPS)만 허용

- **도메인 연결**
    - 가비아에서 구매한 `excuseme.cloud` → AWS Elastic IP 매핑
 