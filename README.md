# 💡 Insights Discovery — AI-Powered Email Communication Platform

An intelligent full-stack application that reveals your **personality energy profile** through a psychometric assessment, then uses **AI (Groq LLaMA)** to automatically rewrite your emails in a tone that resonates with the recipient's communication style — and optionally sends them via SMTP.

---

## 📋 Table of Contents

- [What It Does](#what-it-does)
- [The Four Energy Types](#the-four-energy-types)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [Frontend Flow](#frontend-flow)
- [Security Notes](#security-notes)
- [Known Issues & Notes](#known-issues--notes)

---

## What It Does

The platform has **two distinct parts** that work together:

**Part A — Energy Assessment**
Users register, complete a 30-question psychometric quiz, and receive a personality energy profile with percentage scores across four energy types. Results are saved to the database permanently.

**Part B — AI Email Drafter**
Users enter their email (to link their profile) and the recipient's email (to look up *their* profile). They draft a raw message — the AI rewrites it in a tone tailored to the **recipient's** dominant energy type. The rewritten email can be copied or sent directly via Gmail SMTP.

---

## The Four Energy Types

| Energy | Color | Traits | Communication Style |
|---|---|---|---|
| **Cool Blue** | 🔵 | Analytical, precise, systematic | Formal, data-driven, structured |
| **Earth Green** | 🟢 | Empathetic, collaborative, loyal | Warm, patient, consensus-seeking |
| **Sunshine Yellow** | 🟡 | Enthusiastic, creative, sociable | Upbeat, optimistic, emoji-friendly |
| **Fiery Red** | 🔴 | Decisive, assertive, results-driven | Direct, concise, action-oriented |

When you write an email to someone with Cool Blue energy, the AI rewrites it to be precise and structured. Writing to a Fiery Red personality? It becomes punchy and outcome-focused. This is the core value of the platform.

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Core language |
| Spring Boot | 4.0.5 | Application framework |
| Spring Data JPA | (via Boot) | ORM / database layer |
| Spring WebFlux | (via Boot) | Non-blocking HTTP client for Groq API calls |
| Spring Mail | (via Boot) | SMTP email sending via Gmail |
| MySQL | 8.x | Relational database |
| Lombok | latest | Boilerplate reduction |
| SpringDoc OpenAPI | 3.0.0 | Swagger UI at `/swagger-ui.html` |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| Vite | 5.0.8 | Build tool & dev server |
| Tailwind CSS | 3.4.1 | Utility-first styling |
| Fetch API | native | Backend communication |

### External Services
| Service | Purpose |
|---|---|
| Groq API (LLaMA 3.3 70B) | AI email rewriting |
| Gmail SMTP | Email delivery |

---

## Project Structure

```
emailEnergy/
├── Insights.sql                        # Database schema + seed data (30 questions)
│
├── insights/                           # Spring Boot Backend
│   ├── pom.xml
│   └── src/main/java/com/insights/insights/
│       ├── InsightsApplication.java
│       ├── controller/
│       │   ├── AuthController.java     # POST /api/auth/register, GET /api/auth/{id}
│       │   ├── UserController.java     # GET /api/user?email=, POST /api/user/energy
│       │   ├── QuestionController.java # GET /api/questions
│       │   ├── AssessmentController.java # POST /api/assessment/submit
│       │   └── EmailController.java    # POST /api/email/analyze, /api/email/send
│       ├── service/
│       │   ├── UserService.java        # User registration and lookup
│       │   ├── AssessmentService.java  # Assessment processing logic
│       │   ├── EnergyCalculatorService.java # Scores calculation algorithm
│       │   ├── EmailService.java       # Groq AI integration + email orchestration
│       │   ├── MailSenderService.java  # SMTP email delivery via JavaMailSender
│       │   └── QuestionService.java    # Question data access
│       ├── model/
│       │   ├── User.java               # id, name, email
│       │   ├── Question.java           # id, text, energyType
│       │   ├── Answer.java             # userId, questionId, value, type
│       │   ├── AssessmentResult.java   # energy scores + dominantEnergy
│       │   └── EnergyType.java         # Enum: FIERY_RED, EARTH_GREEN, SUNSHINE_YELLOW, COOL_BLUE
│       ├── dto/
│       │   ├── AnswerRequest.java      # questionId, value, type
│       │   ├── AssessmentResponse.java # energy percentages + dominantEnergy
│       │   ├── EmailRequest.java       # all email fields
│       │   ├── EmailResponse.java      # rewrittenEmail, sent, message
│       │   └── UserEmailRequest.java   # email field
│       ├── repository/                 # JPA repositories for each entity
│       └── exception/
│           ├── AssessmentAlreadySubmittedException.java
│           └── GlobalExceptionHandler.java
│
└── insights-app/                       # React Frontend
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                     # Root — toggles between Assessment (A) and Email (B) parts
        ├── api.js                      # All backend API calls + energy mapping helpers
        ├── data/questions.js           # Local energy profile definitions + display metadata
        └── components/
            ├── Register.jsx            # User registration form (Part A, Step 1)
            ├── Evaluator.jsx           # 30-question paginated quiz (Part A, Step 2)
            ├── ProfileResult.jsx       # Diamond chart + energy breakdown (Part A, Step 3)
            ├── MessageDrafter.jsx      # Sender + recipient lookup + draft (Part B, Step 1)
            ├── EnergyAudit.jsx         # Rewritten email + send button (Part B, Step 2)
            └── Stepper.jsx             # Progress indicator component
```

---

## Prerequisites

- **Java 17+** — [Download](https://adoptium.net/)
- **Node.js 18+** and **npm** — [Download](https://nodejs.org/)
- **MySQL 8.0+** — [Download](https://dev.mysql.com/downloads/)
- A **Groq API key** — [Get one free at console.groq.com](https://console.groq.com)
- A **Gmail account** with an App Password — [Generate App Password](https://myaccount.google.com/apppasswords)

---

## Database Setup

Run the provided SQL file to create the database and seed all 30 questions:

```bash
mysql -u root -p < Insights.sql
```

Or log in to MySQL and run:
```sql
SOURCE /path/to/Insights.sql;
```

The file creates four tables (`user`, `question`, `answer`, `assessment_result`) and inserts 30 psychometric questions covering all four energy types.

Also create a dedicated database user:
```sql
CREATE USER 'springstudent'@'localhost' IDENTIFIED BY 'springstudent';
GRANT ALL PRIVILEGES ON insights_db.* TO 'springstudent'@'localhost';
FLUSH PRIVILEGES;
```

---

## Getting Started

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd insights
   ```

2. **Update `src/main/resources/application.properties`** with your own credentials:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/insights_db
   spring.datasource.username=springstudent
   spring.datasource.password=springstudent

   # Replace with your own Groq API key
   groq.api.key=YOUR_GROQ_API_KEY
   groq.api.url=https://api.groq.com/openai/v1/chat/completions

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true

   # Replace with your Gmail and App Password
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your_gmail@gmail.com
   spring.mail.password=your_gmail_app_password
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   spring.mail.properties.mail.smtp.starttls.required=true
   ```

3. **Build and run:**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```
   > On Windows use `mvnw.cmd` instead of `./mvnw`

   The backend starts on **http://localhost:8080**
   Swagger UI: **http://localhost:8080/swagger-ui.html**

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd insights-app
   ```

2. **Install dependencies and start:**
   ```bash
   npm install
   npm run dev
   ```

   The frontend starts on **http://localhost:5173**

> The API base URL is set to `http://localhost:8080/api` in `src/api.js`. Change this if your backend runs elsewhere.

---

## Configuration

| Property | Default | Description |
|---|---|---|
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/insights_db` | MySQL connection |
| `groq.api.key` | *(must be set)* | Your Groq API key |
| `spring.mail.username` | *(must be set)* | Gmail address for SMTP |
| `spring.mail.password` | *(must be set)* | Gmail App Password |
| `app.display.name` | `Insights Discovery` | Display name in sent emails |
| `spring.jpa.hibernate.ddl-auto` | `update` | Auto-manages schema |

---

## How It Works

### Assessment Scoring Algorithm

Each answer has a `value` (1–5), a `type` (MOST, LEAST, NORMAL), and is linked to a question with an `energyType`.

```
MOST  answer: final_score = value + 2
LEAST answer: final_score = 6 - value  (inverted — high value = low score)
NORMAL answer: final_score = value
```

Scores per energy type are summed, then each is divided by the total and multiplied by 100 to get percentages. The energy with the highest raw score becomes the `dominantEnergy`.

### Email Rewriting Logic

```
1. Recipient's email → look up User in DB
2. User → look up AssessmentResult → get dominantEnergy
3. Build LLaMA prompt:
   - System: "Rewrite to match RECIPIENT's communication style"
   - Energy instructions: tone guidelines per energy type
   - Original email + rules (keep intent, adjust only tone, return only the email)
4. Call Groq API (llama-3.3-70b-versatile)
5. Return rewritten text
```

### Email Delivery

Gmail SMTP limitation prevents changing the `From` address, but the service customises:
- **From display name:** `"Ayush via Insights Discovery <gmail@gmail.com>"`
- **Reply-To:** set to the real sender's email so replies go to them, not the Gmail account

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/api/auth/register` | `{ "name": "Ayush", "email": "a@x.com" }` | `{ id, name, email }` |
| GET | `/api/auth/{id}` | — | `{ id, name, email }` |

### Users — `/api/user`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user?email=x` | Returns `{ id, name, email }` |
| POST | `/api/user/energy` | Body: `{ "email": "x" }` → returns full AssessmentResponse |

### Questions — `/api/questions`

| Method | Endpoint | Response |
|---|---|---|
| GET | `/api/questions` | Array of 30 question objects with `id`, `text`, `energyType` |

### Assessment — `/api/assessment`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/assessment/submit?userId={id}` | Submits answers, returns energy scores |

**Request body:**
```json
[
  { "questionId": 1, "value": 4, "type": "NORMAL" },
  { "questionId": 2, "value": 5, "type": "MOST" },
  { "questionId": 3, "value": 1, "type": "LEAST" }
]
```

**Response:**
```json
{
  "fieryRed": 28.5,
  "earthGreen": 22.1,
  "sunshineYellow": 31.4,
  "coolBlue": 18.0,
  "dominantEnergy": "SUNSHINE_YELLOW"
}
```

### Email — `/api/email`

| Method | Endpoint | Returns |
|---|---|---|
| POST | `/api/email/analyze` | Plain text rewritten email string |
| POST | `/api/email/send` | `{ rewrittenEmail, sent, message }` |

**Request body:**
```json
{
  "userId": 1,
  "recipientName": "Priya",
  "recipientEmail": "priya@example.com",
  "emailContent": "Hey, can you send me the report by Friday?",
  "senderName": "Ayush",
  "senderEmail": "ayush@college.edu"
}
```

---

## Frontend Flow

```
App Landing → Email Drafter (Part B — default landing)
  │
  ├── Enter YOUR email → profile linked via GET /api/user?email + POST /api/user/energy
  ├── Enter RECIPIENT email → their energy profile fetched
  ├── Write draft message (textarea enabled only after recipient found)
  └── "Analyze & Rewrite" →
        │
        └── Energy Audit Page
            ├── Original draft  |  Recipient diamond chart
            ├── AI-rewritten version (copyable)
            ├── "Why rewritten this way" explanation
            └── Send button → POST /api/email/send → email delivered

Header "Take Assessment" → Assessment Tool (Part A)
  │
  ├── Register (name + email)
  │   └── Checks if user already has results → redirects to profile
  ├── 30 questions, 8 pages, 4 per page
  │   ├── Rate each: L | 1 | 2 | 3 | 4 | 5 | M
  │   └── Each page requires 1 Most + 1 Least selection
  └── Profile Result
      ├── Diamond chart (4 energy axes)
      ├── Percentage bars for each energy
      ├── Key traits + working style
      └── "Draft a Message" → returns to Part B with user pre-filled
```

---

## Security Notes

> **Review these before deploying or sharing:**

1. **API keys are hardcoded** in `application.properties` — move to environment variables before any deployment.

2. **No authentication** — any caller can submit answers for any `userId`. Add JWT-based auth for production.

3. **No duplicate email constraint** — registering the same email creates a second user record. Add `UNIQUE` constraint to `user.email`.

4. **CORS is `@CrossOrigin(origins = "*")`** on all controllers — restrict to your frontend's domain in production.

5. **Assessment can only be submitted once per user** — the service throws `AssessmentAlreadySubmittedException` on re-submission. There is no admin endpoint to reset a user's assessment.

---

## Known Issues & Notes

1. **Much of `EmailService.java` is commented-out** — the file contains the full evolution history of the service through several iterations. Only the bottom (active) implementation runs. Earlier versions are preserved as comments for reference.

2. **Local questions vs. DB questions** — `data/questions.js` in the frontend contains 10 older question sets used only for display metadata (energy profile descriptions, traits, etc.). The actual 30-question assessment is always fetched from the backend API.

3. **Gmail SMTP sender restriction** — emails are technically sent from the configured Gmail address. The display name in the `From` field is customised but the underlying address cannot be changed. Recipients who hit "Reply" will correctly reach the real sender via `Reply-To`.

4. **Groq rate limits** — the free Groq tier has request limits. If the AI rewrite fails, check the Groq console for rate limit errors.

5. **Swagger UI** — full interactive API documentation is available at `http://localhost:8080/swagger-ui.html` once the backend is running.
