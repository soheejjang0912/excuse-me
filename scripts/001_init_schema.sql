-- 001_init_schema.sql
-- This script initializes the database with the 'excuses' table.

-- Drop any old tables to ensure a clean slate
DROP TABLE IF EXISTS public.status;
DROP TABLE IF EXISTS public.excuses;

-- Create the new 'excuses' table as per user specification
CREATE TABLE public.excuses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  excuse_text text NOT NULL,
  nickname character varying(50) NULL DEFAULT 'System'::character varying,
  is_approved boolean NULL DEFAULT true,
  usage_count integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  approved_at timestamp with time zone NULL DEFAULT now(),
  approved_by character varying(100) NULL DEFAULT 'System'::character varying,
  CONSTRAINT excuses_pkey PRIMARY KEY (id),
  CONSTRAINT excuses_excuse_text_key UNIQUE (excuse_text)
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_excuses_approved ON public.excuses USING btree (is_approved) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_excuses_created_at ON public.excuses USING btree (created_at DESC) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.excuses ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.excuses
  FOR SELECT
  USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" ON public.excuses
  FOR INSERT
  WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Allow public update access" ON public.excuses
  FOR UPDATE
  USING (true);

-- Seed some initial data
INSERT INTO public.excuses (excuse_text, is_approved, usage_count) VALUES
('제 로컬에서는 잘 됩니다', true, 50),
('캐시를 지워보세요', true, 45),
('이건 기획 변경이 필요한 부분입니다', true, 30),
('서버가 느려서 그런 것 같아요', true, 35),
('배포 환경과 개발 환경이 달라서요', true, 25),
('외부 API가 불안정해서 그렇습니다', true, 28),
('데이터베이스 마이그레이션 중이에요', true, 22),
('테스트 코드에는 통과했는데요', true, 40),
('버전 충돌이 난 것 같아요', true, 33),
('방금 전까지는 잘 됐습니다', true, 55),
('운영 서버랑 로컬 설정이 달라요', true, 29),
('저희 팀에서 만든 게 아니라서 잘 몰라요', true, 18),
('일단 재시작해보시겠어요?', true, 42),
('배포 과정에서 뭔가 꼬인 것 같습니다', true, 36),
('라이브러리 버그 같습니다', true, 31),
('ChatGPT가 이렇게 짜줬는데요?', true, 12),
('Stack Overflow 답변 그대로 쓴 건데…', true, 23),
('제 노트북에서는 절대 안 터졌습니다', true, 40),
('배터리가 부족해서 그런 것 같아요', true, 8),
('이건 미래의 저에게 맡겨야 할 문제네요', true, 5),
('AI가 버그까지 학습했나 봅니다', true, 14),
('금요일이라 서버도 퇴근하고 싶어하나 봐요', true, 19),
('빌드 머신이 월요일이라 힘이 없어요', true, 16),
('제 탓이 아니라 Git 탓입니다', true, 28),
('코드 리뷰 때는 멀쩡했는데요?', true, 22),
('버그가 아니라 Hidden Feature라고 불러주세요', true, 11),
('그건 프론트엔드 쪽 문제 같습니다', true, 33),
('그건 백엔드 쪽 문제 같습니다', true, 34),
('그건 인프라 쪽 문제 같습니다', true, 35),
('제 로컬에선 신기하게 잘 돌아가요', true, 60),
('그건 버그가 아니라 원래 기능이에요', true, 20),
('CI/CD 파이프라인에서 캐시가 또 말썽이네요', true, 27),
('npm install만 다시 하면 해결돼요', true, 44),
('브라우저 호환성 문제일 수도 있어요', true, 32),
('Git 머지할 때 뭔가 꼬였나 봅니다', true, 38),
('일단 로그를 더 찍어봐야 알 것 같아요', true, 55),
('API 명세서가 최신이 아닌 것 같아요', true, 29),
('운영 서버에서만 재현돼서 디버깅이 힘드네요', true, 41),
('Jira 티켓에는 없던 요구사항이네요', true, 19),
('시간대(Timezone) 이슈 같아요', true, 33),
('라이브러리 업데이트가 원인일 수도 있어요', true, 26),
('테스트 데이터라 실제랑 달라서 그래요', true, 35),
('이건 제가 짠 코드가 아닌 것 같은데요?', true, 22),
('밤새 돌리면 언젠가 잘 될 거예요', true, 15),
('이건 “빠른 수정”이라 코드가 좀 지저분합니다', true, 28),
('버그라기보단 예상치 못한 동작이라고 하죠', true, 17),
('저희는 QA를 믿습니다…', true, 10),
('오늘만 그런 거 같아요', true, 25),
('그건 기획서에 없었는데요?', true, 30),
('버그가 아니라 사용자 경험을 풍부하게 해주는 거예요', true, 13),
('git pull 하기 전에 테스트했을 땐 괜찮았는데요', true, 33),
('Mac에선 잘 되는데 Windows라서 그런가 봐요', true, 29),
('Windows에선 잘 되는데 Mac이라서 그런가 봐요', true, 29),
('그건 의도한 동작입니다', true, 17),
('AI 코드 자동완성이 이상하게 짠 것 같아요', true, 14),
('VPN을 안 켜서 그런 것 같아요', true, 18),
('VPN을 켜서 그런 것 같아요', true, 18),
('어제까지는 진짜 잘 됐습니다', true, 45),
('AWS 크레딧이 다 떨어졌나 봅니다', true, 7);