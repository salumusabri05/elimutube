
ElimuTube
Tanzania Video Learning Platform
Project Concept, Architecture & Development Specification Unified Single-App Edition

Field	Value
Version	2.0.0 — Single-App Architecture
Status	Draft — Approved for Development
Platform	Flutter (iOS / Android) + Node.js Backend
Market	Tanzania — Swahili & English
Date	June 2026

CONFIDENTIAL — For internal development use only
1. Executive Summary
ElimuTube is a YouTube-style mobile learning marketplace purpose-built for the Tanzanian education market. The platform enables unemployed and underemployed teachers to monetise their subject expertise by creating digital content channels, while giving students across Tanzania — including those in low-connectivity areas — affordable, curriculum-aligned learning resources in both Swahili and English.

Unlike generic global platforms, ElimuTube is designed end-to-end for Tanzania: payments exclusively via mobile money (M-Pesa, Airtel Money, Tigo Pesa), content mapped to NECTA and CSEE syllabi, Swahili-first UI, offline video download for low-bandwidth environments, and an AI layer (powered by the Anthropic API) that auto-generates lesson summaries, quizzes, and bilingual transcripts.

Core Value Proposition: Teachers earn a sustainable income from their expertise. Students access quality, affordable, curriculum-aligned lessons anywhere in Tanzania — even offline. One app serves both — just like YouTube.

1.1  Architecture Change: One App, Two Roles
V2.0 changes the architecture from two separate Flutter apps (Teacher App + Student App) to ONE unified Flutter app with role-based experiences — identical to how YouTube works. A single codebase, one backend, one database. Users switch between Student and Teacher modes within the same app.

Old Architecture (v1)	New Architecture (v2)
Two separate Flutter apps	One unified Flutter app
Teacher App (separate APK/IPA)	Teacher Mode (role-based screen switcher)
Student App (separate APK/IPA)	Student Mode (role-based screen switcher)
Two codebases to maintain	Single codebase — shared state & components
Users must install two apps	One install, switch modes via profile
Separate release pipelines	Single CI/CD pipeline for one app

1.2  Key Metrics Targeted (Year 1)
Metric	Target
Teacher accounts (content creators)	5,000
Active student subscribers	50,000
Monthly active users	80,000
Avg. teacher monthly earnings	TSh 120,000
Content pieces published	25,000
Platform GMV (Gross Merchandise Value)	TSh 480M/year

2. Project Concept
2.1  Problem Statement
Tanzania faces a dual crisis in education: a significant teacher unemployment or under-employment problem (particularly outside Dar es Salaam), and a severe shortage of quality digital learning resources aligned to the national curriculum. Students preparing for NECTA Form II, Form IV (CSEE), and Form VI (ACSEE) examinations largely depend on expensive private tutors or low-quality photocopied notes.

Existing global platforms (YouTube, Udemy, Coursera) fail this market on multiple dimensions:
•	No Swahili-language content for core NECTA subjects
•	No local mobile money payment integration — credit cards are not accessible to most Tanzanians
•	No curriculum alignment to Tanzania’s NECTA/CSEE/ACSEE syllabi
•	No offline-first design for low-bandwidth rural areas
•	No teacher monetisation pathway for locally-qualified educators

2.2  Solution Overview
ElimuTube provides ONE unified mobile application and a web-based admin panel, sharing a single NestJS/Node.js backend and PostgreSQL database — exactly like YouTube which serves both creators and viewers in one app.

Application	Description
ElimuTube App (Flutter — unified)	A single app for ALL users. After login, users choose their role: Student Mode for browsing, subscribing, and learning; Teacher Mode for creating channels, uploading content, and tracking earnings. Role can be switched at any time from the profile screen.
Admin Panel (Web)	Platform operators manage teacher verification, content moderation, payout processing, dispute resolution, and platform analytics.

2.3  Role-Based Mode Switching (YouTube Model)
Like YouTube’s switch between “Viewer” and “Your Channel”, ElimuTube users can hold both Student and Teacher roles simultaneously. This is especially important for teachers who also want to learn from other teachers.

Scenario	How It Works
New user (Student only)	Registers, selects Student role — sees Student Mode home feed
New teacher signup	Any user can apply for Teacher status in Profile > Become a Teacher
Approved teacher	Teacher Mode tab appears in the bottom nav bar
Teacher watching other lessons	Switches to Student Mode to browse other channels
Same account, dual access	One login, one subscription wallet, one notification inbox

2.4  Target Users
Primary — Teachers
•	University-trained teachers with degree or diploma, currently unemployed or underemployed
•	Retired teachers with deep subject expertise
•	Part-time tutors looking to scale their reach beyond physical location
•	Subject focus: Mathematics, Physics, Chemistry, Biology, English, Kiswahili, History, Geography, Accounts

Primary — Students
•	Form 2–6 students preparing for national examinations
•	University and college students needing supplementary learning
•	Adult learners and self-study individuals

2.5  Monetisation Model
The platform uses a teacher-driven subscription model with a 70/30 revenue split.
Revenue Stream	Description	Split
Monthly Subscription	Students subscribe per-teacher. Teachers set price (TSh 2,000–20,000/month).	Teacher 70% / Platform 30%
Pay-Per-Lesson	One-off purchase of a single premium lesson or PDF.	Teacher 70% / Platform 30%
Featured Listing	Teachers pay to appear in Discover feed promotions.	100% Platform
Live Class Ticket	Premium live sessions with a one-time access fee.	Teacher 70% / Platform 30%

3. Unified Monorepo Structure
3.1  Repository Philosophy
The entire ElimuTube platform lives in a single Git repository (monorepo). With one unified Flutter app, this is even more efficient — no duplication between teacher and student codebases. Shared packages, one CI/CD pipeline, and atomic commits across the full stack.

Repository Name: elimutube — hosted on GitHub under the organisation elimutube-tz. One app, one backend, one repo.

3.2  Top-Level Directory Layout
Path	Contents
/apps/elimutube-app/	Flutter app — unified Teacher + Student app (single codebase)
/apps/admin-web/	React/Next.js web admin panel
/packages/ui-kit/	Shared Flutter widget library (design system)
/packages/models/	Shared Dart model classes, enums, constants
/backend/gateway/	NestJS API Gateway — JWT auth, rate limiting, routing
/backend/user-service/	NestJS — users, profiles, teacher verification, role management
/backend/content-service/	NestJS — upload pipeline, video, PDF, search
/backend/subscription-service/	NestJS — plans, access control, renewal
/backend/payment-service/	NestJS — Selcom aggregator, payouts, ledger
/backend/live-service/	NestJS — Agora room management, scheduling
/backend/ai-service/	NestJS — Anthropic API integration hub
/backend/notification-service/	NestJS — BullMQ + FCM push notifications
/infrastructure/	Terraform, Docker Compose, CI/CD configs
/docs/	ADRs, API contracts (OpenAPI YAML), diagrams
/.github/workflows/	GitHub Actions pipelines per service + single app pipeline

3.3  Shared Packages
packages/ui-kit (Flutter)
•	ElimuTheme — colour tokens, typography scale, spacing constants
•	ElimuButton, ElimuTextField, ElimuCard — base UI components
•	VideoThumbnailCard, TeacherAvatarChip — domain-specific widgets
•	StudentHomeFeed, TeacherDashboardLayout — role-aware layout shells
•	Swahili + English localisation ARB files

packages/models (Dart)
•	Shared entity models: User, Teacher, Course, Lesson, Subscription, Payment
•	API response DTOs — generated from OpenAPI spec via openapi-generator
•	Enum definitions: SubjectArea, FormLevel, PaymentMethod, ContentType, UserRole

4. System Architecture
4.1  Architecture Overview
ElimuTube uses a microservices backend behind a single API Gateway. The ONE Flutter app communicates exclusively with the API Gateway and never calls individual services directly. The role system (STUDENT / TEACHER / ADMIN) is enforced at the gateway level — teacher-only endpoints return 403 for users without the TEACHER role.

Single App → API Gateway → Microservices → Shared PostgreSQL + Redis. One database. One backend. Same as YouTube’s architecture where all users share the same infrastructure, with role checks controlling access.

4.2  Backend Services
Service	Tech Stack	Key Responsibilities
API Gateway	NestJS + PassportJS	JWT validation, role-based route guards, rate limiting, request proxying, CORS, Swagger docs
User Service	NestJS + Prisma + PG	Registration, login, JWT issuance, teacher verification workflow, role management (STUDENT/TEACHER/ADMIN)
Content Service	NestJS + Prisma + PG	Video/PDF/quiz CRUD, Mux upload delegation, search, metadata storage
Subscription Service	NestJS + Prisma + PG	Teacher plans, student subscriptions, access-control middleware, renewal scheduling
Payment Service	NestJS + Prisma + PG	Selcom STK push, webhook processing, double-entry ledger, teacher payout scheduling
Live Service	NestJS + Agora SDK	Agora token generation, class scheduling, recording triggers, attendee management
AI Service	NestJS + Anthropic SDK	Lesson summarisation, quiz generation, transcript translation (EN/SW), AI tutor chat
Notification Service	NestJS + BullMQ + FCM	Push notification templates, delivery queuing, in-app notification store

4.3  Data Layer
Store	Purpose
PostgreSQL (primary DB)	All relational data — users, roles, content metadata, subscriptions, payments, quiz results. A single shared DB with schema prefixes per service. Hosted on Oracle Cloud Free Tier with WAL-G backups.
Cloudflare R2 (object storage)	Raw video uploads, PDF files, lesson thumbnails, user avatars. Served via Cloudflare CDN globally.
Mux (video platform)	Video transcoding, HLS adaptive streaming, playback tokens.
Redis via Upstash	Session tokens, BullMQ job queues, API response cache, Pub/Sub for live class events.
Isar (Flutter local)	Offline-cached video metadata, downloaded lesson content, draft quiz answers, cached teacher profiles. Shared by both Student and Teacher modes.

4.4  Flutter App Architecture (Unified)
The single ElimuTube Flutter app follows Clean Architecture with role-aware routing. The bottom navigation bar adapts based on the user’s active role. A user with both STUDENT and TEACHER roles sees a role-switcher in their profile — tapping it swaps the entire nav context.

Layer	Packages / Patterns
State Management	Riverpod 2.x — AsyncNotifier for server state, StateNotifier for local UI state. A single AppUserNotifier holds the active role and drives nav rendering.
Navigation	go_router 13.x — declarative routes with role-based redirect guards. /student/* and /teacher/* route namespaces, both accessible from one shell.
Networking	Dio + Retrofit — typed REST client generated from OpenAPI spec
Local Storage	Isar 3.x — offline content cache, Hive for simple key-value settings
Video Playback	video_player + better_player — HLS streaming, offline playback, subtitles
Live Classes	agora_rtc_engine — Agora Flutter SDK for real-time video/audio
PDF Viewer	flutter_pdfview — in-app PDF rendering for lesson notes
Localisation	flutter_localizations + custom ARB — Swahili (sw_TZ) and English (en)
Dependency Injection	Riverpod providers — no service locator pattern
Push Notifications	firebase_messaging + flutter_local_notifications

4.5  AI Layer (Anthropic API Integration)
All AI features are routed through the AI Service, which calls the Anthropic Messages API (claude-sonnet-4-20250514). Accessible from both Student Mode (AI Tutor Chat) and Teacher Mode (Quiz Generator, Summariser).
Feature	Trigger	Output
Lesson Summariser	Teacher uploads & transcribes content	3-paragraph Swahili + English summary stored as lesson metadata
Quiz Generator	Teacher taps ‘Generate quiz’ in Teacher Mode	5–10 MCQ questions with correct answers, stored as Quiz entity
Transcript Translator	Mux sends transcript webhook	Swahili captions file (.vtt) stored in R2 alongside English captions
AI Tutor Chat	Student opens chat tab on a lesson in Student Mode	Streaming chat responses grounded in lesson content via system prompt injection

5. Feature Specification
5.1  Unified App — Shared Features (Both Modes)
Onboarding & Authentication
•	Single registration flow — user selects initial role (Student or Teacher) at signup
•	Email + phone (OTP) verification
•	Profile: avatar, display name, bio, subject interests / qualifications
•	In-app role upgrade: Student can apply for Teacher role without reinstalling
•	Settings: language (Swahili / English), notification preferences, payment methods

Notifications (shared inbox)
•	New lesson from subscribed teacher
•	Live class starting in 30 minutes
•	Subscription renewal reminder
•	Teacher: new subscriber, payout processed, content approved/rejected

5.2  Student Mode — Feature List
Discovery & Subscriptions
•	Home feed: subscribed teacher latest content, live class alerts, AI-recommended lessons
•	Discover: browse by subject (Mathematics, Biology, etc.), form level (Form 1–6, Standard 1–7), or teacher name
•	Search: full-text search across lesson titles, descriptions, and AI-generated transcripts
•	Teacher channel page: bio, lessons list, subscriber count, rating, preview of first lesson
•	Subscription flow: select plan, pay via M-Pesa/Airtel/Tigo, immediate access granted

Learning
•	Video player: HLS adaptive bitrate, subtitle toggle (EN/SW), playback speed (0.75x–2x), picture-in-picture
•	Offline download: download lesson video + PDF for offline access, managed via Isar + secure file store
•	PDF viewer: inline notes viewer with highlight and annotation support
•	Quiz: timed MCQ interface, instant feedback, score tracking, retry logic
•	AI Tutor: per-lesson chat interface, responses grounded in lesson content, history persisted locally
•	Progress tracker: per-subject completion percentage, quiz scores, study streak counter

Live Classes
•	Live class browser: upcoming classes from subscribed teachers, sortable by date/subject
•	Join live class: Agora viewer with real-time Q&A chat, raise hand, screen share view
•	Replay: access recorded sessions from past live classes

5.3  Teacher Mode — Feature List
Channel & Profile
•	Onboarding wizard: subject selection, qualifications upload, ID verification
•	Channel page editor: bio, profile photo, intro video, subject tags, form levels
•	Teacher verification badge (reviewed by admin within 48h)

Content Management
•	Video upload: direct-to-Mux upload via pre-signed URL, background processing with progress indicator
•	PDF upload: drag-and-drop, stored in R2, in-app preview before publish
•	Quiz builder: manual MCQ creation OR one-tap AI generation from uploaded PDF/transcript
•	Interactive lesson builder: combine video + PDF notes + quiz into a structured lesson
•	Content versioning: replace video/PDF while preserving view counts and student progress

Live Classes
•	Schedule live class: title, subject, date/time, max attendees, price
•	Live class room: Agora-powered video with screen share, whiteboard overlay, Q&A chat
•	Auto-recording: sessions saved to R2 and published as on-demand replay within 2h

Analytics & Earnings
•	Dashboard: total subscribers, monthly revenue, top-performing content, view trends (7d / 30d / 90d)
•	Per-content: views, completion rate, quiz pass rate, average watch time
•	Earnings ledger: subscription revenue, pay-per-lesson income, live ticket revenue
•	Payout: monthly automatic M-Pesa transfer on the 5th of each month

6. Core Database Schema
The following describes the primary tables across the shared PostgreSQL database. One database serves all users regardless of role. Each backend service owns its own schema prefix (e.g., user_service.users, content_service.lessons).

6.1  User & Role Tables
Column	Type	Description
id	UUID PK	Primary key
email	VARCHAR	Unique — used for login
phone	VARCHAR	Tanzanian format (+255...)
roles	ENUM[]	Array: STUDENT, TEACHER, ADMIN — a user can hold multiple roles
active_role	ENUM	Current active mode: STUDENT ─ TEACHER (set client-side, stored for session restore)
display_name	VARCHAR	Public name on channel
avatar_url	TEXT	R2 object path
verified_at	TIMESTAMP	NULL until admin approves teacher role
created_at	TIMESTAMP	Row creation time

6.2  Content Tables
Column	Type	Description
id	UUID PK	Primary key
teacher_id	UUID FK	References users.id (must have TEACHER role)
type	ENUM	VIDEO │ PDF │ QUIZ │ LIVE │ INTERACTIVE
title	VARCHAR	Lesson title (EN)
title_sw	VARCHAR	Lesson title (SW)
mux_asset_id	VARCHAR	Mux video asset reference
pdf_url	TEXT	R2 path for PDF content
subject	ENUM	MATH │ PHYSICS │ CHEMISTRY │ ...
form_level	ENUM	FORM_1 ... FORM_6 │ STD_1 ... STD_7
is_free	BOOLEAN	Whether lesson is free-preview
duration_sec	INTEGER	Video duration in seconds
published_at	TIMESTAMP	NULL = draft

6.3  Subscription & Payment Tables
Column	Type	Description
id	UUID PK	Primary key
student_id	UUID FK	References users.id (must have STUDENT role)
teacher_id	UUID FK	References users.id (must have TEACHER role)
price_tsh	INTEGER	Monthly price in Tanzanian shillings
status	ENUM	ACTIVE │ CANCELLED │ EXPIRED │ PAUSED
payment_method	ENUM	MPESA │ AIRTEL │ TIGO
selcom_ref	VARCHAR	Selcom transaction reference
period_start	DATE	Subscription billing start
period_end	DATE	Subscription billing end
auto_renew	BOOLEAN	Whether to auto-charge on renewal

7. Key API Endpoints
7.1  Authentication
Endpoint	Description
POST /api/v1/auth/register	Register account (role: STUDENT or TEACHER selected at signup)
POST /api/v1/auth/login	Email/password login — returns JWT with roles[] claim + refresh token
POST /api/v1/auth/refresh	Exchange refresh token for new access token
POST /api/v1/auth/logout	Invalidate refresh token
POST /api/v1/auth/verify-phone	OTP verification via SMS
POST /api/v1/auth/upgrade-to-teacher	Student requests Teacher role upgrade (triggers verification flow)

7.2  Teacher & Content
Endpoint	Description
GET  /api/v1/teachers/:id	Fetch teacher channel profile
GET  /api/v1/teachers/:id/lessons	List published lessons for a channel
POST /api/v1/lessons	Create lesson (requires TEACHER role)
POST /api/v1/lessons/:id/upload-video	Request Mux pre-signed upload URL
POST /api/v1/lessons/:id/upload-pdf	Upload PDF to R2 via pre-signed URL
POST /api/v1/lessons/:id/generate-quiz	Trigger AI quiz generation
GET  /api/v1/lessons/:id/summary	Fetch AI-generated lesson summary
GET  /api/v1/search?q=&subject=&form=	Full-text search across lessons and teachers

7.3  Subscriptions & Payments
Endpoint	Description
POST /api/v1/subscriptions	Initiate subscription — triggers STK push
GET  /api/v1/subscriptions/my	List student’s active subscriptions
DELETE /api/v1/subscriptions/:id	Cancel a subscription
POST /api/v1/payments/webhook/selcom	Selcom payment confirmation webhook
GET  /api/v1/earnings/summary	Teacher monthly earnings summary (requires TEACHER role)
POST /api/v1/payouts/request	Request early M-Pesa payout (requires TEACHER role)

7.4  Live Classes & AI
Endpoint	Description
POST /api/v1/live/classes	Create scheduled live class (requires TEACHER role)
GET  /api/v1/live/classes/upcoming	List upcoming classes from subscribed teachers
POST /api/v1/live/classes/:id/token	Generate Agora RTC token for student/teacher
POST /api/v1/ai/tutor/chat	Send message to lesson AI tutor (streaming SSE)
POST /api/v1/ai/transcript/translate	Trigger Swahili transcript generation

8. Tanzanian Payment Integration
8.1  Selcom as MNO Aggregator
Rather than integrating three separate mobile money APIs (Vodacom M-Pesa, Airtel Money, Tigo Pesa), ElimuTube uses Selcom as the single payment aggregator. Selcom provides a unified REST API that routes STK push requests to the correct MNO based on the student’s phone number prefix.

MNO	Prefix
Vodacom M-Pesa	+255 74x, 75x, 76x
Airtel Money	+255 68x, 69x, 78x
Tigo Pesa	+255 71x, 65x, 67x
TTCL / Halopesa	+255 62x, 73x

8.2  Subscription Payment Flow
•	Student (in Student Mode) selects a teacher plan and confirms their phone number in the app
•	ElimuTube App calls POST /api/v1/subscriptions with teacher_id, phone, payment_method
•	Payment Service calls Selcom STK Push API — a USSD popup appears on the student’s phone
•	Student approves the payment on their phone
•	Selcom sends a webhook to POST /api/v1/payments/webhook/selcom
•	Payment Service validates the webhook signature and updates subscription status to ACTIVE
•	Notification Service sends a FCM push confirming access — received in the same app
•	Content Service access-control middleware checks subscription status on every lesson request

8.3  Teacher Payout Flow
On the 5th of each month, the Payment Service runs a scheduled BullMQ job that:
•	Aggregates all SETTLED subscription payments for the previous month per teacher
•	Calculates teacher share: gross revenue minus 30% platform fee minus any Selcom transaction fees
•	Calls the Selcom B2C (Business-to-Customer) API to push the amount to the teacher’s registered M-Pesa/Airtel number
•	Records a payout_ledger entry with Selcom reference number
•	Sends the teacher an SMS and push notification (received in the ElimuTube app) with the payout confirmation

9. Development Roadmap
9.1  Phase 1 — Core MVP (Weeks 1–6)
Goal: A working end-to-end flow: teacher uploads a video in Teacher Mode, student subscribes in Student Mode and watches it, payment settles. One app, one backend.

Sprint	Deliverables
Week 1–2	Monorepo scaffold, NestJS gateway + user-service, JWT auth with roles[] claim, unified Flutter app shell with Riverpod + go_router, role-switcher navigation, shared ui-kit
Week 2–3	Content Service: video upload pipeline via Mux, HLS playback in Flutter (Student Mode), PDF upload + viewer, Teacher Mode upload screens
Week 4	Subscription Service: plan creation (Teacher Mode), student subscription flow (Student Mode)
Week 5	Payment Service: Selcom STK push integration, webhook handler, subscription activation, sandbox testing
Week 6	Teacher analytics dashboard (Teacher Mode), student progress tracker (Student Mode), end-to-end testing + TestFlight/Play Console beta

9.2  Phase 2 — Learning Layer (Weeks 7–9)
Goal: Enrich the learning experience with AI features, quizzes, and interactive content.

Sprint	Deliverables
Week 7	AI Service: Anthropic API integration, lesson summarisation, Swahili transcript generation
Week 8	Quiz builder in Teacher Mode (manual + AI-generated), quiz player in Student Mode, quiz result tracking
Week 9	AI Tutor Chat in Student Mode (streaming SSE), interactive lesson builder (Teacher Mode), offline download feature

9.3  Phase 3 — Live & Scale (Weeks 10–12)
Goal: Add live classes, launch admin panel, and harden for production scale.

Sprint	Deliverables
Week 10	Live Service: Agora integration, class scheduling (Teacher Mode), student viewer (Student Mode), recording pipeline
Week 11	Admin Panel (Next.js): teacher verification, content moderation, payout management, platform analytics
Week 12	Performance hardening, push notification system, App Store / Google Play submission (single app), production deployment

10. Infrastructure & DevOps
10.1  Hosting
Component	Hosting
NestJS microservices	Oracle Cloud Compute (Free Tier ARM instances) + Docker Compose
PostgreSQL	Oracle Cloud managed DB or self-hosted with WAL-G to R2 backups
Redis	Upstash (serverless Redis — pay-per-request, zero idle cost)
Object Storage	Cloudflare R2 (zero egress fees — critical for Tanzania CDN economics)
Video CDN + transcoding	Mux (per-minute billing, no upfront infra cost)
DNS + DDoS protection	Cloudflare
Admin Panel	Vercel (Next.js edge deployment)
FCM Push Notifications	Google Firebase — free tier covers 5M messages/month

10.2  CI/CD
•	GitHub Actions: separate workflow per backend service + ONE workflow for the unified Flutter app
•	Backend: lint → test → Docker build → push to GitHub Container Registry → deploy to Oracle Cloud via SSH
•	Flutter app: flutter test → flutter build → Fastlane → upload to TestFlight / Play Console internal track
•	Environments: development (local Docker Compose) → staging (Oracle Cloud) → production (Oracle Cloud)

10.3  Security
•	JWT RS256 signed tokens with roles[] array claim (asymmetric — private key on auth server only)
•	Role-based route guards on API Gateway — teacher endpoints return 403 for STUDENT-only accounts
•	Selcom webhook signature validation (HMAC-SHA256)
•	Row-level security on PostgreSQL subscription check for content access
•	Mux signed playback tokens — video URLs expire in 4 hours
•	R2 pre-signed upload URLs — 15-minute expiry
•	Rate limiting on API Gateway: 60 req/min unauthenticated, 300 req/min authenticated

11. Risks & Mitigations
Risk	Likelihood	Mitigation
Selcom API instability	Medium	Implement retry logic with exponential backoff; maintain fallback to manual bank transfer for payouts
Low-bandwidth video playback	High	Mux adaptive bitrate (HLS) auto-selects 240p on slow connections; offline download for zero-connectivity
Teacher content quality	Medium	Admin verification before publish; student ratings and report system; content guidelines in onboarding
Teacher churn (no earnings)	High	Seed platform with 20 verified teachers before public launch; featured listing for early adopters; first 3 months 0% platform fee
App Store / Play Store approval	Low	Single unified app; follow Flutter best practices; use web checkout on iOS to avoid IAP bypass issues
AI hallucinations in tutor	Medium	Ground AI tutor prompts strictly in lesson transcript; add disclaimer; allow students to flag wrong answers
Role abuse (Student bypassing Teacher gate)	Low	Server-side role enforcement on all teacher endpoints; teacher role requires admin verification

12. Glossary
Term	Definition
NECTA	National Examinations Council of Tanzania — the body administering Form II, IV, and VI national exams
CSEE	Certificate of Secondary Education Examination — Form IV national exam
ACSEE	Advanced Certificate of Secondary Education Examination — Form VI national exam
MNO	Mobile Network Operator — Vodacom, Airtel, Tigo, etc.
STK Push	SIM Toolkit Push — the USSD popup on a mobile phone that prompts the user to approve a mobile money payment
HLS	HTTP Live Streaming — Apple’s adaptive bitrate video protocol used by Mux for streaming
Selcom	Tanzanian fintech company providing a unified mobile money API aggregating all major MNOs
Agora	Real-time communications SDK used for live class video/audio streaming
R2	Cloudflare’s S3-compatible object storage with zero egress fees
BullMQ	Redis-backed job queue library for Node.js used for async processing (payouts, notifications)
Isar	Flutter-native NoSQL embedded database used for offline caching
Mux	Video infrastructure platform for transcoding, hosting, and HLS streaming
ADR	Architecture Decision Record — a short document capturing a key technical decision and its rationale
Role Switcher	The in-app UI control (similar to YouTube’s channel switcher) that toggles between Student Mode and Teacher Mode within the single ElimuTube app

ElimuTube — Empowering Tanzanian Teachers. Educating Tanzania. elimutube-tz  │  Version 2.0.0  │  June 2026  │  One App. Two Roles. One Platform.

