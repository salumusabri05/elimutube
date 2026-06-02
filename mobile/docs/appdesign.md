🎓  ElimuTube
Tanzania Video Learning Platform
Google Stitch Mockup Design Guide
Screens • Color System • Components • Typography • Constraints
Version 2.0 — Single-App Architecture  |  June 2026

🎓  Student Mode	📚  Teacher Mode	⚙️  Shared Screens	🛡️  Admin / Other
 1.  Brand Identity & Color System
ElimuTube's visual identity is built around trust, learning, and Tanzania. The palette combines deep educational blue with vibrant Swahili green, accented by warm amber — colours that resonate with the Tanzanian flag and feel approachable on AMOLED mobile screens.

1.1  Primary Color Palette

Swatch	Hex Code	Name	Role	Usage in UI
	#1B6CA8	ElimuTube Blue	Brand / Primary	App bar, primary buttons, headings, links, active tab indicators
	#27AE60	Swahili Green	Success / Teacher	Success states, teacher verification badges, positive earnings
	#F39C12	Warm Amber	CTA / Highlight	Subscribe button, pay button, featured labels, earnings highlights
	#2980B9	Sky Blue	Student Mode	Student nav bar accent, lesson cards, progress bars, student avatars
	#16A085	Mode Teal	Teacher Mode	Teacher nav bar accent, channel headers, earnings cards, upload buttons
	#E74C3C	Alert Red	Destructive / Error	Error states, cancel subscription, content rejection badges
	#2C3E50	Deep Charcoal	Text Primary	All heading text, card titles, form labels
	#4A4A4A	Body Gray	Text Body	Paragraph text, descriptions, lesson metadata
	#7F8C8D	Muted Gray	Text Muted	Placeholders, timestamps, secondary labels, helper text
	#F5F7FA	Surface Gray	Background	Screen background, card backgrounds, input field fills
	#BDC3C7	Border Gray	Borders / Dividers	Card borders, list separators, input borders, divider lines
	#FFFFFF	Pure White	Surface Primary	Card surfaces, modal backgrounds, navigation bar background

1.2  Mode-Specific Color Application
Because ElimuTube uses one app with two roles, the accent colour of key UI surfaces shifts when the user switches modes. This gives immediate visual feedback that the mode has changed — similar to how YouTube Studio uses a darker palette vs the standard YouTube experience.

UI Element	Student Mode Color	Teacher Mode Color
Bottom Navigation Bar Active Tab	#2980B9 — Sky Blue	#16A085 — Mode Teal
App Bar Background	#1B6CA8 — Deep Blue	#1B6CA8 — Deep Blue (same)
Primary Action Button (CTA)	#F39C12 — Subscribe / Pay button	#16A085 — Upload / Publish button
Card Accent Strip (left border)	#2980B9 — Sky Blue	#16A085 — Mode Teal
Profile Badge / Role Indicator	Blue "Student" chip	Teal "Teacher" chip
Floating Action Button (FAB)	None (no FAB in Student)	#F39C12 — Upload new lesson

1.3  Gradient & Overlay Recipes
Google Stitch supports linear gradients on container fills. Use these predefined gradient values for card headers, banners, and hero sections:

Gradient Name	Stitch Fill Values (Hex)	Where Used
Hero Banner	#1B6CA8 → #2980B9	Home feed top banner, onboarding splash
Teacher Channel Header	#16A085 → #1ABC9C	Teacher channel profile hero area
Subscription Card	#F39C12 → #E67E22	Subscribe CTA card, plan pricing card
Earnings Card	#27AE60 → #2ECC71	Earnings summary card in Teacher Mode
Overlay on Thumbnails	rgba(0,0,0,0.45) → transparent	Video thumbnail duration + title overlay
Live Badge Background	#E74C3C → #C0392B	Live class "LIVE" indicator badge
 2.  Typography System
ElimuTube uses a clean, legible type hierarchy optimised for mobile reading. All type is set in Noto Sans — chosen for its extensive Swahili character support, native feel on Android, and Google Fonts availability. Stitch maps to this via the "Body" and "Title" text style containers.

2.1  Type Scale

Style Name	Font	Size (sp)	Weight	Usage
Display Large	Noto Sans	34sp	Bold 700	Splash screen headline, onboarding title
Headline 1	Noto Sans	28sp	Bold 700	Screen titles (Home, Discover, My Channel)
Headline 2	Noto Sans	22sp	SemiBold 600	Section headers, card primary titles
Subtitle 1	Noto Sans	18sp	Medium 500	Teacher name on channel cards, dialog titles
Subtitle 2	Noto Sans	16sp	Medium 500	List item labels, tab bar labels, form labels
Body 1	Noto Sans	15sp	Regular 400	Lesson descriptions, bio text, paragraphs
Body 2	Noto Sans	13sp	Regular 400	Metadata (views, date, duration), captions
Caption	Noto Sans	11sp	Regular 400	Timestamps, helper text, tooltip labels
Button	Noto Sans	14sp	Bold 700	All button labels, chip text, badge text
Overline	Noto Sans	10sp	Medium 500 + ALL CAPS	Section category labels (e.g., MATHEMATICS, FORM 4)

2.2  Bilingual Typography Rules (Swahili / English)
Since ElimuTube serves both Swahili and English content, the following rules apply in Google Stitch mockups:

•	Primary lesson titles: display the English title (Headline 2) with the Swahili translation (Subtitle 2, muted color) directly below it in the same card.
•	Navigation labels: always use Swahili first in mockup text — e.g., "Nyumbani" (Home), "Gundua" (Discover), "Maendeleo" (Progress), "Akaunti" (Account).
•	Button labels: show both where space allows — e.g., "Jiandikishe / Subscribe".
•	AI-generated content badges: tag with 🤖 icon + "AI — Muhtasari" (AI Summary) in Caption style.
•	Subject category chips: Swahili first — "Hisabati", "Fizikia", "Kemia", "Baiolojia", "Kiingereza".
 3.  Spacing, Layout & Grid
3.1  Base Grid & Spacing Tokens
Stitch uses an 8dp base unit. All spacing in mockups should be multiples of 8dp (or 4dp for micro-spacing).

Token	Value	Usage
space-xs	4dp	Icon-to-label gap, badge padding, between metadata items
space-sm	8dp	Internal card padding (tight), chip horizontal padding
space-md	16dp	Standard card padding, list item vertical padding, section horizontal margin
space-lg	24dp	Section top/bottom margin, modal vertical padding, screen content top margin
space-xl	32dp	Hero section internal padding, onboarding screen margins
space-2xl	48dp	Splash / empty state illustration top offset

3.2  Mobile Frame Specification
Design all screens for a 390 × 844pt viewport (iPhone 14 / Pixel 7 equivalent). Safe areas:

•	Status bar height: 44pt (iOS) / 24dp (Android) — use 44pt in Stitch for universal coverage
•	Bottom safe area: 34pt (iOS home indicator) — add 34pt padding to all bottom nav bars
•	Navigation bar height: 56dp (Material 3 standard)
•	Bottom navigation bar height: 64dp + 34pt safe area = ~98dp total container height
•	Content area = viewport height − status bar − app bar − bottom nav bar

3.3  Component Sizing Standards

Component	Height / Size	Notes
App Bar / Top Navigation	56dp	Logo left, search icon + avatar right
Bottom Navigation Bar	64dp + safe area	4 tabs in Student Mode, 5 in Teacher Mode
Lesson Thumbnail Card (landscape)	16:9 ratio thumbnail + 72dp info row	Width = full content width or 50% for 2-col grid
Teacher Channel Card (horizontal)	80dp total height	64dp avatar + text, chevron right
Subject Chip / Badge	32dp height	Horizontal padding 12dp, corner radius 16dp
Primary CTA Button	48dp height	Full width or fixed 200dp; corner radius 24dp (pill)
Floating Action Button (Teacher)	56dp circle	Upload icon, #Accent color, bottom-right 16dp from edge
Input Field	52dp height	Label above, 8dp gap, outlined style with 4dp radius
Avatar (Teacher profile)	48dp / 64dp / 96dp	Three sizes: list / card / channel hero
Video Player	16:9 aspect, full width	Controls overlay, progress bar at bottom
Section Divider / List Separator	1dp stroke	Color: #BDC3C7
 4.  Screen Inventory for Google Stitch
The following 24 screens cover the complete ElimuTube MVP and should be created in Google Stitch. Each screen card shows the mode, priority (P1 = MVP must-have, P2 = Phase 2, P3 = Phase 3), and the key components to include.

⚙️  SHARED SCREENS — Onboarding & Authentication

01	Splash Screen
Mode: Shared	Priority: 1	Phase 1
📋 Description
Full-screen branded splash shown for 2–3s on app launch. ElimuTube logo centered on deep blue background. Tagline in Swahili below logo. Transitions to either Login or Home depending on auth state.
🧩 Key UI Components
•	Full-screen container with #1B6CA8 → #2980B9 gradient background
•	ElimuTube logo (white, centered, 120dp wide)
•	Tagline: "Elimu kwa Kila Mtanzania" — white, Subtitle 1, centered
•	Small loading spinner or progress indicator at bottom (white, 24dp)
•	Powered by Anthropic AI badge — Caption, muted white, bottom center
💡 Stitch Notes
Use a fixed-size frame (390×844). Lock the logo to the center. No navigation elements. Dark status bar icons (white). This is a static screen — no interaction states needed in Stitch.

02	Login Screen
Mode: Shared	Priority: 1	Phase 1
📋 Description
Primary entry point for returning users. Email/password form with mobile money registration prompt for new users. Supports both Swahili and English via language toggle at top-right.
🧩 Key UI Components
•	App bar: ElimuTube logo left, Language toggle (SW / EN) right — no back button
•	Illustration or graphic hero: 120dp tall, subject to image availability
•	Form: Email input field (52dp), Password input field with show/hide toggle
•	Primary button: "Ingia / Login" — full width, pill shape, #Accent color
•	Divider with "AU" text (Swahili for "OR")
•	Secondary button: "Jiandikishe / Register" — outlined style, full width
•	Footer link: "Umesahau nenosiri? / Forgot password?" — center, Caption, primary color
💡 Stitch Notes
In Stitch, group the form inputs into a white card with 16dp padding and 12dp corner radius, overlapping slightly onto the hero illustration. Show the keyboard safe area as a separate frame variant.

03	Registration Screen
Mode: Shared	Priority: 1	Phase 1
📋 Description
New user sign-up. Collects name, phone (Tanzanian format), email, password, and initial role selection. Role selection is a segmented toggle — "Mwanafunzi / Student" vs "Mwalimu / Teacher".
🧩 Key UI Components
•	Progress indicator at top: 3 steps, step 1 active (blue)
•	Full Name input field
•	Phone input: +255 prefix fixed, 9-digit input field
•	Email input field
•	Password + Confirm Password inputs with strength indicator
•	Role Selector: segmented toggle with Student icon (book) and Teacher icon (graduation cap)
•	"Endelea / Continue" button — full width, primary color
•	Terms and Privacy notice — Caption, centered, links underlined in primary color
💡 Stitch Notes
Show the role selector as a pill-shaped segmented control. Whichever role is selected should fill with either #Sky Blue (Student) or #Mode Teal (Teacher). Include one filled and one unfilled state in your Stitch prototype.

04	OTP Verification Screen
Mode: Shared	Priority: 1	Phase 1
📋 Description
SMS OTP verification sent to the registered phone number. 6-digit OTP input with auto-advance between boxes. Resend timer countdown.
🧩 Key UI Components
•	Back arrow in app bar
•	Instruction text: "Weka nambari uliyopelekwa / Enter the code sent to +255 7XX XXX XXX"
•	6 individual OTP digit input boxes (48×56dp each, side by side with 8dp gap)
•	Auto-focus advances to next box on digit entry
•	"Thibitisha / Verify" button — enabled only when all 6 digits filled
•	Resend link with countdown timer: "Tuma tena baada ya 0:45 / Resend in 0:45"
💡 Stitch Notes
In Stitch, create two variants: "digits empty" (all boxes light gray border) and "digits filled" (all boxes with blue border, button enabled). The countdown timer is a text label — just show the static value.

 🎓  STUDENT MODE SCREENS

05	Student Home Feed
Mode: Student	Priority: 1	Phase 1
📋 Description
The main landing screen after login for Student Mode users. Shows a personalised video feed from subscribed teachers, live class alerts, and AI-recommended lessons. Mirrors YouTube home tab.
🧩 Key UI Components
•	App bar: Logo left, Search icon (🔍), notification bell with badge, avatar right
•	Mode indicator chip below app bar: "🎓 Hali ya Mwanafunzi / Student Mode" — sky blue chip
•	Hero banner (if any live class active): "LIVE NOW" red badge, teacher name, subject
•	"Malengo yangu / My Feed" section header with horizontal scroll of subscribed teacher avatars
•	Vertical list of LessonThumbnailCards (full width): 16:9 thumbnail, title, teacher name, views, duration badge
•	"Inayopendekezwa / Recommended for you" section with AI chip icon
•	Subject filter chips horizontal scroll: Hisabati, Fizikia, Kemia, Biolojia, etc.
•	Bottom Navigation Bar: Nyumbani (Home) active, Gundua, Maendeleo, AI Tutor, Akaunti
💡 Stitch Notes
This is the most complex screen. Build it in layers in Stitch: background (light gray), then a vertical scroll container, then individual section groups. The bottom nav should be a fixed, non-scrolling component. Show the Sky Blue active indicator on the Home tab.

06	Discover / Browse Screen
Mode: Student	Priority: 1	Phase 1
📋 Description
Browse ElimuTube by subject, form level, or popular teachers. Full-text search bar at top. Horizontal subject category chips filter the grid below.
🧩 Key UI Components
•	Search bar at top: full width, "Tafuta masomo... / Search lessons..." placeholder
•	Horizontal scroll subject chips: ALL / Hisabati / Fizikia / Kemia / Biolojia / Kiingereza / Historia
•	"Walimu Maarufu / Popular Teachers" horizontal scroll — TeacherAvatarCards (64dp avatar, name, subject, subscriber count)
•	Form Level filter row: Form 1 / Form 2 / Form 3 / Form 4 / Form 5&6 / Standard (primary)
•	2-column lesson grid below — LessonThumbnailCards at 50% width
•	Bottom Navigation: Gundua (Discover) active
💡 Stitch Notes
Set the search bar in a white container with a subtle shadow. The chip row should be a horizontal scroll group. For the 2-column grid, use a table-style layout or two parallel auto-layout containers in Stitch.

07	Teacher Channel Page
Mode: Student	Priority: 1	Phase 1
📋 Description
A teacher's public channel viewed by a student. Shows bio, lessons, subscriber count, rating, and the subscribe/pay button. Similar to a YouTube channel page.
🧩 Key UI Components
•	240dp hero image/gradient header with teacher avatar (96dp, white ring border) bottom-center
•	Teacher name (Headline 2) + verification badge (✅ or 🏫)
•	Subject chips: e.g., "Hisabati • Form 4" badges
•	Stats row: subscriber count, lesson count, avg rating (stars)
•	"Jiandikishe / Subscribe" pill button — full width, Amber CTA — with price "TSh 5,000/mwezi"
•	Tab row: "Masomo / Lessons" | "Kuhusu / About" | "Wanafunzi / Reviews"
•	Lessons tab: vertical list of LessonThumbnailCards
•	"Somo la Bure / Free Preview" badge on first lesson if is_free = true
•	Bottom nav visible (student mode)
💡 Stitch Notes
The hero header is the key visual element. In Stitch, stack: gradient container → teacher avatar (overlap 50% below container edge) → name + badge. Use a bottom sheet pattern for the Subscribe button if the screen is long.

08	Video Player Screen
Mode: Student	Priority: 1	Phase 1
📋 Description
Full video playback screen. Landscape and portrait variants. HLS streaming with subtitles toggle (SW/EN), playback speed control, and offline download button.
🧩 Key UI Components
•	Portrait: 16:9 video area at top (full width, ~220dp tall), controls overlay on tap
•	Video controls overlay (appears on tap): play/pause, seek bar, time display, fullscreen icon, subtitle toggle (SW/EN), speed selector (0.75x / 1x / 1.25x / 1.5x / 2x)
•	Download button: cloud icon, "Pakua / Download" — right side of video frame
•	Lesson title (Headline 2) below video
•	Teacher chip: avatar (32dp) + name + subscribe mini-button
•	Tab row: "Muhtasari / Summary" | "Maswali / Quiz" | "AI Tutor" | "Maelezo / Notes"
•	Summary tab: AI-generated summary text (3 paragraphs), 🤖 AI badge
•	Related lessons vertical list at bottom
💡 Stitch Notes
Create two screen variants: Portrait (default) and Landscape (fullscreen). In landscape, the video fills 100% of screen, controls overlay, no nav bars. Use a translucent overlay (rgba 0,0,0,0.45) for the controls background in landscape mode.

09	Quiz Player Screen
Mode: Student	Priority: 2	Phase 1
📋 Description
Timed MCQ quiz interface. One question per screen with swipe/next navigation. Shows question number, countdown timer, and 4 answer choices. Instant feedback on selection.
🧩 Key UI Components
•	Progress bar at top: "Swali 3/10" (Question 3 of 10) with time countdown badge
•	Question text (Headline 2, centered or left-aligned, 3–4 lines)
•	4 answer option cards (full width, 52dp tall, white card with border)
•	On selection: correct = green card + ✅, wrong = red card + ❌ + correct highlighted green
•	"Swali Lijalo / Next Question" button — appears after selection, full width, amber
•	Score screen (last question answered): circular score indicator, stars rating, retry / exit buttons
💡 Stitch Notes
Show 3 variants in Stitch: Question Unanswered (all choices white), Question Answered Correct (selected = green), Question Answered Wrong (selected = red, correct = green). The score screen is a separate frame.

 10	AI Tutor Chat Screen
Mode: Student	Priority: 2	Phase 1
📋 Description
Lesson-grounded AI chat interface. Students ask questions about the lesson content. Streaming responses. Chat history persisted locally. Powered by Anthropic Claude.
🧩 Key UI Components
•	App bar: "🤖 AI Tutor — [Lesson Title]" back button left, context chip right
•	Chat history scroll area (takes most of the screen)
•	AI messages: left-aligned, light blue bubble, 🤖 avatar, Noto Sans Body 1
•	User messages: right-aligned, sky blue bubble, white text
•	Typing indicator: 3 animated dots in AI bubble (show static for Stitch)
•	"Andika swali lako... / Type your question..." text input bar, fixed at bottom
•	Send button: right of input, primary color, plane icon
•	Disclaimer strip above input: "AI inaweza kukosea / AI may make mistakes" — Caption, amber background
💡 Stitch Notes
The chat bubbles are the core design element. Left bubbles have 12dp radius on all corners except bottom-left (4dp). Right bubbles have 12dp except bottom-right (4dp). Show at least 4 turns of conversation in the mockup.

11	Progress Tracker Screen
Mode: Student	Priority: 2	Phase 1
📋 Description
Student's learning dashboard. Per-subject completion percentage, quiz scores, study streak counter, and subscription overview.
🧩 Key UI Components
•	App bar: "Maendeleo yangu / My Progress" — no back button
•	Study streak card: flame icon 🔥, "Mfululizo: 7 siku / 7-day streak", amber gradient card
•	Subscription status: "3 walimu / 3 teachers", list of subscribed teacher names + renewal dates
•	Subject completion list: each subject as a card with label, circular progress %, last studied date
•	Recent quiz results: table or list with subject, score (X/10), date, retry link
•	Bottom navigation: Maendeleo (Progress) active
💡 Stitch Notes
The streak card should be the hero element at the top — use an amber-to-orange gradient. Progress percentages are circular progress indicators (40dp diameter). Show 3–4 subjects in the list.

12	Live Classes Browser (Student)
Mode: Student	Priority: 3	Phase 1
📋 Description
Browse upcoming and active live classes from subscribed teachers. Join or buy ticket. Replay past sessions.
🧩 Key UI Components
•	App bar: "Madarasa ya Moja kwa Moja / Live Classes"
•	"Sasa Hivi / Live Now" section: red LIVE badge, teacher avatar, title, join button
•	"Yanayokuja / Upcoming" list: date/time chip, subject, teacher name, ticket price or "Bure" (Free for subscribers)
•	"Rekodi za Awali / Past Recordings" section: thumbnail cards
•	Join button: green "Ingia / Join" for subscribed users, amber "Nunua Tiketi / Buy Ticket" for non-subscribers
💡 Stitch Notes
The "Live Now" section should visually dominate — use a pulsing red dot animation placeholder (show as static red dot in Stitch) next to the LIVE badge. Past recordings use the same LessonThumbnailCard pattern.

 📚  TEACHER MODE SCREENS

13	Teacher Mode Home / Dashboard
Mode: Teacher	Priority: 1	Phase 1
📋 Description
Primary landing screen when Teacher Mode is active. Shows key stats, recent uploads, and quick-action buttons for uploading content or going live.
🧩 Key UI Components
•	App bar: "Dashibodi / Dashboard" — mode chip "📚 Hali ya Mwalimu / Teacher Mode" in teal
•	Earnings summary card: green gradient, "Mapato ya Mwezi / Monthly Earnings" — TSh amount, trend arrow
•	Stats row: Wanafunzi (Subscribers), Masomo (Lessons), Maoni (Views) — 3 mini stat cards
•	Quick actions row: Upload Video (📹), Upload PDF (📄), Go Live (🔴), Quiz Builder (✏️)
•	"Masomo ya Hivi Karibuni / Recent Lessons" list — 3 items with view counts and status badges (Published / Draft)
•	FAB button: "+" in teal circle, bottom-right corner
•	Bottom Navigation: Teacher nav — Dashibodi / Masomo / Mapato / Madarasa / Akaunti
💡 Stitch Notes
The earnings card is the hero element. Use the green-to-teal gradient. FAB is always visible. Quick actions row uses 4 icon+label square tiles in a 2×2 or 1×4 layout. Bottom nav accent is Mode Teal, not Sky Blue.

14	Content Upload Screen (Video)
Mode: Teacher	Priority: 1	Phase 1
📋 Description
Upload a new video lesson. Multipart form: upload video file, add title (EN + SW), select subject and form level, write description, add PDF notes, set price (free or paid), create quiz.
🧩 Key UI Components
•	App bar: "Pakia Video / Upload Video" with Cancel (X) and Publish button
•	Upload drop zone / pick file area: dashed border, cloud upload icon, "Chagua faili / Choose file" button
•	Upload progress bar (show at 65% filled, teal fill)
•	Title EN field: "Kichwa cha Somo (Kiingereza) / Lesson Title (English)"
•	Title SW field: "Kichwa cha Somo (Kiswahili) / Lesson Title (Swahili)"
•	Subject dropdown: Hisabati, Fizikia, Kemia... (spinner/dropdown)
•	Form Level multi-select chips: Form 1 through Form 6
•	Description text area (4 lines)
•	"Somo Huru? / Free Lesson?" toggle switch
•	Price field (appears when toggle off): "TSh" prefix, numeric input
•	"Ongeza PDF / Add PDF Notes" secondary button
•	"Tengeneza Maswali kwa AI / Generate Quiz with AI" button — amber, robot icon
💡 Stitch Notes
This is a long-scroll form screen. Group fields into logical cards: (1) Video Upload card, (2) Lesson Details card, (3) Access & Pricing card, (4) AI Features card. The AI Generate Quiz button should stand out visually — amber background, full width.

15	Quiz Builder Screen (Teacher)
Mode: Teacher	Priority: 2	Phase 1
📋 Description
Create or review MCQ quiz questions. Manual input mode and AI-generated mode. Each question card shows question text + 4 choices + correct answer selector.
🧩 Key UI Components
•	App bar: "Jenga Maswali / Quiz Builder" with save button
•	"Tengeneza kwa AI / Generate with AI" banner at top — amber background, one-tap trigger
•	Question card list: each card shows question number, question text, 4 answer inputs, correct answer radio
•	"Ongeza Swali / Add Question" button — outlined, teal, between cards
•	AI Generation loading state: skeleton cards + "AI inatengeneza maswali..." spinner
•	"Hifadhi / Save" and "Chunguza / Preview" buttons at bottom
💡 Stitch Notes
Show two variants: Manual Mode (empty question cards, user filling in) and AI-Generated Mode (cards pre-filled with AI content, user reviewing). AI-generated cards have a small "🤖 AI" badge in the top-right corner of each card.

16	Teacher Analytics Screen
Mode: Teacher	Priority: 1	Phase 1
📋 Description
Detailed analytics for the teacher's channel. Views trend chart, subscriber growth, top-performing lessons, quiz completion rates, and earnings ledger.
🧩 Key UI Components
•	App bar: "Takwimu / Analytics" with date range selector (7d / 30d / 90d tabs)
•	Revenue card: TSh total, trend arrow, "compared to last month"
•	Line chart: Views over time (simple area chart — use Stitch chart component or a placeholder rectangle with axis labels)
•	"Masomo Bora / Top Lessons" list: ranked 1–5 with views, completion %, quiz pass %
•	"Wanafunzi Wapya / New Subscribers" sparkline mini-chart
•	"Chati ya Masomo kwa Darasa / Content by Form Level" bar chart or donut chart
💡 Stitch Notes
Charts are the focus here. Use simple rectangles with axis labels as chart placeholders in Stitch if native chart support is limited. The revenue card uses the green gradient from Section 1.3.

 17	Earnings & Payout Screen
Mode: Teacher	Priority: 1	Phase 1
📋 Description
Teacher earnings ledger showing monthly breakdown, per-content revenue, and payout history. Payout request button for early withdrawal.
🧩 Key UI Components
•	App bar: "Mapato / Earnings"
•	Total balance card: teal gradient, "Salio Inayosubiri / Pending Balance" — TSh amount, Payout date ("Malipo ya 5 Julai / Payout on Jul 5")
•	"Omba Malipo Mapema / Request Early Payout" button — outlined amber
•	Month selector tabs: Juni / Mei / Aprili scrollable horizontal
•	Earnings breakdown table: Subscription revenue, Pay-per-lesson, Live tickets, Platform fee (deduction), Net payout
•	Per-lesson earnings list: thumbnail + title, subscribers who paid, amount
•	Past payouts list: date, amount, Selcom reference, status badge
💡 Stitch Notes
The balance card is the hero. Show the Selcom logo (or "Selcom" text) on the payout button area to reinforce the payment method. Use green for positive amounts, red for deductions in the breakdown table.

18	Live Class Setup Screen (Teacher)
Mode: Teacher	Priority: 3	Phase 1
📋 Description
Schedule or start a live class. Title, subject, date/time picker, ticket pricing, and max attendees. Also the active live room UI when the class is in session.
🧩 Key UI Components
•	Setup form: Title, Subject dropdown, Date + Time pickers, Max Attendees (number input), Ticket Price or "Bure kwa wanaoandikishwa / Free for subscribers" toggle
•	"Ratibisha / Schedule" and "Anza Sasa / Start Now" buttons
•	Live Room UI (separate frame/variant): Agora video view fullscreen, teacher controls bar at bottom: Mic/Camera toggles, Screen Share, End Class, participant count
•	Q&A chat panel slides in from right: chat bubbles, "Jibu / Reply" actions
•	"LIVE" red pulsing badge in corner of live room
💡 Stitch Notes
Create two separate screen frames: (1) Class Setup Form and (2) Active Live Room. The live room frame should feel immersive — dark background, minimal UI, camera feed as the dominant element.

19	Teacher Channel Editor
Mode: Teacher	Priority: 1	Phase 1
📋 Description
Edit the public-facing teacher channel. Update bio, profile photo, intro video, subject tags, qualifications. This is what students see on Screen 7.
🧩 Key UI Components
•	App bar: "Hariri Chaneli / Edit Channel" with Save button
•	"Picha ya Profaili / Profile Photo" — circular avatar with edit overlay (camera icon)
•	"Video ya Utangulizi / Intro Video" — upload or record button with 16:9 thumbnail placeholder
•	Display Name field, Bio text area (5 lines)
•	Subject multi-select chips: checkable subject chips
•	Form Levels multi-select: Form 1–6 checkboxes
•	"Hati za Elimu / Qualifications" — file upload for certificates, shows uploaded file names
•	Verification status badge: "Inangojwa / Pending Verification" yellow, "Imethibitishwa / Verified" green
💡 Stitch Notes
Show two states: Unverified teacher (yellow pending banner at top) and Verified teacher (green verified badge). The verification state should be prominently visible to guide new teachers on what to expect.

 ⚙️  SHARED UTILITY SCREENS

20	Profile & Settings Screen
Mode: Shared	Priority: 1	Phase 1
📋 Description
User account screen. Shows avatar, name, active role badge, role-switch toggle, notification settings, language preference, payment methods, and logout.
🧩 Key UI Components
•	Profile header: 120dp avatar, display name, email, active role chip (sky blue for Student / teal for Teacher)
•	"Badilisha Hali / Switch Mode" prominent toggle row — with animated role icon swap
•	"Jiunge na Walimu / Become a Teacher" CTA card (for Student-only users)
•	Settings sections: Notifications, Language (Kiswahili / English), Payment Methods (Vodacom/Airtel/Tigo phone numbers)
•	Logout button — red text, bottom of list
•	App version and support link — Caption, muted
💡 Stitch Notes
The role-switch toggle is the most unique element on this screen. Design it as a large pill toggle with Student icon on left and Teacher icon on right — the active side fills with the mode color. Show both states.

21	Search Results Screen
Mode: Shared	Priority: 1	Phase 1
📋 Description
Full-text search results page. Shows lessons, teachers, and subjects matching the query. Filterable by subject, form level, content type, and price.
🧩 Key UI Components
•	Search bar at top (pre-filled with query text), back button
•	Result count: "Matokeo 47 kwa 'hesabu' / 47 results for 'hesabu'"
•	Filter chips row: Aina (Type: Video/PDF/Quiz/Live), Darasa (Form), Bei (Price: Free/Paid)
•	"Walimu / Teachers" horizontal scroll section (if any teacher names match)
•	"Masomo / Lessons" vertical list (main results)
•	Empty state: magnifying glass illustration + "Hakuna matokeo / No results found" + suggestions
💡 Stitch Notes
Show two states: Results Found (with the filter chips and list) and Empty State (illustration + suggestions). The filter chips should visually update the results — just show the active-filter state statically in Stitch.

22	Subscription Checkout Screen
Mode: Shared	Priority: 1	Phase 1
📋 Description
Mobile money payment flow for subscribing to a teacher. Shows plan details, phone number confirmation, and STK push waiting state.
🧩 Key UI Components
•	App bar: "Lipia Usajili / Pay for Subscription" with back arrow
•	Teacher summary: avatar (48dp), name, price (large, amber), subscription period
•	"Nambari ya Simu / Phone Number" field: pre-filled from profile, editable, +255 prefix
•	MNO auto-detected badge: "Vodacom M-Pesa" or "Airtel Money" or "Tigo Pesa" based on prefix
•	"Lipia Sasa / Pay Now" large full-width amber button
•	STK Push waiting screen (variant): phone illustration + "Angalia simu yako / Check your phone" + spinner + amount shown
•	Success screen (variant): green checkmark, "Umefanikiwa! / Success!", access now button
💡 Stitch Notes
Three screen variants required: (1) Form Screen, (2) STK Push Waiting, (3) Payment Success. The MNO detection badge should change icon/color based on number prefix — show one example (e.g., M-Pesa in red).

23	Notification Center
Mode: Shared	Priority: 2	Phase 1
📋 Description
Unified notification inbox. Both Student and Teacher notifications in one list, grouped by type. Badge counter on app bar bell icon.
🧩 Key UI Components
•	App bar: "Arifa / Notifications" with "Weka Wote Kusomwa / Mark all read" action
•	Notification type filter chips: Zote (All) / Masomo (Lessons) / Malipo (Payments) / Madarasa (Live)
•	Notification list items: icon + message text + timestamp, unread = light blue background
•	Notification types with distinct icons: New lesson (📹), Live soon (🔴), Payment (💰), Subscriber (👤), System (⚙️)
•	Empty state: bell illustration + "Hakuna arifa / No notifications yet"
💡 Stitch Notes
Unread notifications have a sky blue background tint (very subtle, ~10% opacity). Read notifications are white. The timestamp uses relative time: "Dakika 5 zilizopita / 5 minutes ago".

24	Teacher Onboarding Wizard
Mode: Teacher	Priority: 1	Phase 1
📋 Description
Multi-step wizard for new teachers setting up their channel for the first time after applying for teacher role. 4 steps: Channel Info → Subjects → Qualifications → Review.
🧩 Key UI Components
•	Step indicator at top: 4 circles with connecting line, active step filled in teal
•	Step 1 — Channel Info: Display name, bio, profile photo upload
•	Step 2 — Subjects & Levels: Grid of checkable subject chips + form level checkboxes
•	Step 3 — Qualifications: File upload for degree certificate, national ID, brief teaching experience note
•	Step 4 — Review & Submit: Summary of all entered info, "Wasilisha kwa Ukaguzi / Submit for Review" button
•	"Maombi Yako Yamewasilishwa / Your Application Has Been Submitted" success state with 48h review notice
💡 Stitch Notes
Show all 4 step frames in Stitch. The step indicator is the persistent navigation element at the top — never inside a scroll. Stitch prototype should link Step 1 Next → Step 2 → Step 3 → Step 4 → Success screen.

 5.  Reusable Component Library (Google Stitch)
The following components should be created as reusable Stitch components (similar to Figma components / symbols). Once defined, they are instanced across all screens.

5.1  Core Components to Define

Component Name	Variants	Description
LessonThumbnailCard	2: Full-width / Half-width	16:9 thumbnail, duration badge, title, teacher name, views count, subject chip
TeacherAvatarCard	2: Horizontal list / Grid	64dp avatar, display name, subject, subscriber count, verify badge
SubjectChip	3: Default / Active / Disabled	Pill shape, subject label, icon optional, 32dp height
PrimaryButton	3: Default / Loading / Disabled	Full-width pill, 48dp, amber CTA color, Button typography
OutlinedButton	2: Default / Disabled	Full-width, 48dp, transparent fill with border, primary color text
InputField	3: Empty / Focused / Error	Label above, 52dp field, outlined border, helper text below
RoleModeChip	2: Student / Teacher	Pill shape, 32dp, role icon + label, sky blue or teal background
EarningsCard	1 variant	Green gradient card, amount, trend arrow, period label, 120dp tall
LiveBadge	2: Active / Upcoming	"LIVE" red pill or "Inakuja / Upcoming" amber pill, 24dp height
AIBadge	1 variant	"🤖 AI" chip, amber/gold background, Caption typography, indicates AI content
BottomNavBar_Student	5 tab states	Nyumbani / Gundua / Maendeleo / AI / Akaunti — sky blue active color
BottomNavBar_Teacher	5 tab states	Dashibodi / Masomo / Mapato / Madarasa / Akaunti — teal active color
NotificationItem	2: Unread / Read	Icon left, message body, timestamp, subtle blue bg for unread
StatMiniCard	1 variant	Number (Headline 2), label (Caption), icon, white card, 33% width

5.2  Icon Set
Use Material Symbols (Outlined weight) throughout. Key icons required:

•	Navigation: home, search, bar_chart, smart_toy (AI), person
•	Actions: upload, download, play_arrow, pause, add, edit, delete, share
•	Content: video_library, picture_as_pdf, quiz, live_tv, school
•	Payments: payments, account_balance_wallet, receipt_long
•	Notifications: notifications, notifications_active, notifications_off
•	Status: verified, pending, error, check_circle, cancel
•	AI/Misc: smart_toy, auto_awesome, translate, record_voice_over
 6.  Google Stitch Workflow & Setup Guide
6.1  Recommended Stitch Project Structure
Organise your Google Stitch project into these pages/sections:

•	📐 Design Tokens — Color swatches, typography specimens, spacing guide (this document translated to Stitch)
•	🧩 Component Library — All reusable components from Section 5 with all variants
•	⚙️ Shared Screens — Screens 1–4, 20–24 (Splash, Login, Register, OTP, Profile, Search, Checkout, Notifications, Teacher Onboarding)
•	🎓 Student Mode — Screens 5–12 (Home, Discover, Channel Page, Video Player, Quiz, AI Tutor, Progress, Live Browser)
•	📚 Teacher Mode — Screens 13–19 (Dashboard, Upload, Quiz Builder, Analytics, Earnings, Live Setup, Channel Editor)
•	🔄 Prototype Flows — Link screens into user journeys (see Section 6.2)

6.2  Priority Prototype Flows to Build
After creating all screen frames, link them in these prototype flows:

Flow Name	Screen Sequence	Purpose
New User Onboarding	Splash → Register → OTP Verify → Home Feed (Student)	Core acquisition flow for new students
Student Subscribe & Watch	Home → Discover → Teacher Channel → Checkout → Video Player	Core monetisation & consumption flow
Teacher Onboarding	Profile → Become Teacher → Teacher Wizard → Dashboard	Creator acquisition flow
Teacher Upload Lesson	Teacher Dashboard → Upload Video → Quiz Builder → Published	Content creation flow
Mode Switch	Student Home → Profile → Switch Mode → Teacher Dashboard	Role switching (core UX differentiator)
AI Quiz Flow	Video Player (Summary tab) → AI Tutor Chat	AI feature demonstration flow
Live Class (Student)	Home (Live Banner) → Live Browser → Join Room	Live class student experience

6.3  Google Stitch-Specific Tips

•	Frame sizes: Create a custom frame size of 390 × 844 (pt) and use it for all mobile screens. Name it "ElimuTube Mobile Frame".
•	Color styles: Define every color from Section 1.1 as a named Stitch color style before starting screens. This enables global color updates.
•	Text styles: Define the 11 type styles from Section 2.1 as Stitch text styles. Apply them consistently — never set font size manually on individual text elements.
•	Component naming: Use slash notation — e.g., "Card/LessonThumbnail/Full-width", "Button/Primary/Default", "Nav/Student/Home-Active".
•	Prototype transitions: Use "Push Left" for forward navigation, "Push Right" for back navigation, "Slide Up" for bottom sheets and modals, "Fade" for mode switches.
•	Swahili text: Copy Swahili strings directly from this document — do not rely on auto-translate. All Swahili copy in this guide is verified for context.
•	AI content states: Always show an AI-generated state and a loading/skeleton state for screens with AI content (Quiz, Summary, AI Tutor).

6.4  Screen Annotation Standards
When annotating screens in Stitch, use this format for design notes:

•	📐 Layout: note grid alignment, spacing values, safe area considerations
•	🎨 Color: reference token name (e.g., "student.primary" not hex code)
•	✏️ Copy: note Swahili/English language, max character count for truncation
•	⚡ Interaction: describe tap targets, gestures, scroll directions
•	🤖 AI: flag any state driven by AI-generated content (summary, quiz, tutor)
•	📱 Platform: note Android vs iOS differences if any (status bar, safe areas)

 7.  Developer Handoff Checklist
Before handing the Stitch mockup to the Flutter development team, verify every item in this checklist:

7.1  Design Completeness
•	All 24 screens created at 390×844 frame size
•	Every screen has both a default state and at least one interaction state (loading, empty, error)
•	All components use named Stitch color styles — no hardcoded hex values on frames
•	All text uses named Stitch text styles — no manual font size overrides
•	Both Student Mode and Teacher Mode bottom navigation bars are distinct and labelled
•	Swahili and English copy verified on all screens (no placeholder "Lorem Ipsum")
•	AI-powered screens show loading/skeleton state
•	Mobile money checkout shows all 3 variants: Form / STK Push / Success

7.2  Prototype Completeness
•	All 7 flows from Section 6.2 are linked and tappable
•	Back navigation works on all screens that have a back button
•	Mode switch flow (Student ↔ Teacher) is demonstrated
•	Bottom navigation tabs are tappable within each mode

7.3  Annotations
•	Component names match the naming convention from Section 5.1
•	Spacing values annotated on at least one representative screen per section
•	Color tokens referenced by name in annotations (not just hex)
•	Any animation or transition intent noted in screen annotations

ElimuTube — Empowering Tanzanian Teachers. Educating Tanzania.
Google Stitch Mockup Design Guide  |  v2.0.0  |  June 2026  |  One App. Two Roles. One Platform.

