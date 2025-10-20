

<h2 align="center">💬 LLM Parameter Console (Frontend)</h2>
<p align="center">
  A sleek and interactive frontend interface for real-time <b>LLM response streaming</b> and <b>parameter experimentation</b>.
  <br/>
  Built with <b>Next.js</b>, <b>Tailwind CSS</b>, <b>Framer Motion</b>, and <b>React Markdown</b>.
</p>

<p align="center">
  <a href="https://nextjs.org" target="_blank"><img src="https://img.shields.io/badge/Frontend-Next.js-000000?style=for-the-badge&logo=next.js" /></a>
  <a href="https://tailwindcss.com" target="_blank"><img src="https://img.shields.io/badge/UI-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss" /></a>
  <a href="https://www.framer.com/motion/" target="_blank"><img src="https://img.shields.io/badge/Animation-Framer%20Motion-ff4088?style=for-the-badge&logo=framer" /></a>
  <a href="https://react.dev" target="_blank"><img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react" /></a>
</p>

---

## 🚀 Overview

The **LLM Parameter Console (Frontend)** is the user interface of the *LLM Parameter Lab*, allowing you to:

- Stream responses from the backend in real time  
- Adjust parameters like **Temperature** and **Top-P** dynamically  
- Compare model behaviors visually  
- View and export experiments  
- Auto-scroll and animate chat like ChatGPT  

It’s designed with a focus on developer experience, responsive layout, and smooth UI interactions.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Animation** | Framer Motion |
| **Markdown Rendering** | React Markdown + Remark GFM |
| **State Management** | Zustand Store |
| **Data Fetching** | Fetch API with SSE (Server-Sent Events) |

---

## ⚙️ Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
---

## 🌐 Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

