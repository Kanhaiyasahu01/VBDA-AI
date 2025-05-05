# AI-Based Email Automation Dashboard for VBDA

## 📌 Introduction

This project is a full-stack web application designed to support the **Viksit Bharat Dialogues & Awards (VBDA) Initiative** by enabling automated, personalized email communication at scale. It allows BEF staff to upload recipient data, generate AI-powered emails, schedule or send them instantly, and track engagement through analytics—making the outreach process efficient, scalable, and intelligent.

---

## 🏗️ System Architecture

The application follows a modular client-server architecture:

- **Frontend (React)**: Handles CSV upload, email previews, template management, and analytics dashboard.
- **Backend (Node.js + Express)**: Manages email generation, scheduling, data storage, and analytics processing.
- **Database (MongoDB)**: Stores email templates, user data, and email delivery logs.
- **AI Integration**: Uses Gemini API for generating personalized emails based on templates and recipient data.
- **Email Service**: Integrated with SendGrid for email delivery and tracking.
- **Scheduler**: Uses `node-cron` for automated follow-up and reminder emails.

---

## 💻 Front-end

- Built using **React.js** and **Tailwind CSS**
- Features:
  - CSV upload with PapaParse
  - Email preview and manual editing interface
  - Template editing and persistence
  - Dashboard with real-time analytics (open rate, clicks, RSVPs, etc.)
- Routing handled with `react-router-dom`

---

## 🛠️ Back-end

- Developed using **Node.js** and **Express.js**
- Responsibilities:
  - Handles API requests for email generation and delivery
  - Integrates Gemini API using `p-limit` for rate-limited parallel processing
  - Schedules follow-up and final emails using `node-cron`
  - Stores and fetches data from MongoDB
  - Verifies template availability and handles fallbacks

---

## 🗃️ Database

- **MongoDB Atlas** is used as the cloud database
- Collections:
  - `emailTemplates`: Stores predefined and editable templates
  - `recipients`: Stores uploaded CSV data with generated email content

---

## 🚀 Deployment

- **Frontend**: Deployed on **Vercel**
- **Backend**: Hosted on **Render**
- **Database**: MongoDB Atlas
- **Environment variables** are securely managed for API keys and DB credentials.

---

## 🔮 Future Enhancements

- Add authentication for BEF staff
- Enable role-based access for multiple admin users
- Add retry logic for failed email deliveries
- Support regional language templates
- AI feedback loop to improve personalization quality
