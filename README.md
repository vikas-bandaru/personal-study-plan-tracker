# AI Generalist 30-Day Study Tracker 🚀

This project is a high-end, game-based scheduling and tracking tool designed for a 30-day intensive self-study plan to become an AI Generalist. 

## 🎯 Purpose
The purpose of this project is to provide a visual and interactive "Hooked" (by Nir Eyal) experience to stay motivated over a tight 30-day learning sprint. It helps manage deep work blocks, provides lab notes for investment, and offers variable rewards through progress visualization.

---

## 🛠️ Deep Building: Day 2 Practice Exercise
This project was built during the **11:30 AM – 1:30 PM: Deep Building** activity of **Day 2 (March 10, 2026)**. 
> *Activity Task: Turn 3–5 real tasks (resume tweak, workshop design, email, etc.) into polished PRD prompts; run them on an LLM and compare outputs.*

This tracker itself is the output of one of these "polished PRD prompts" translated into a working software deliverable.

---

# PRD: AI Generalist Dashboard (Vanilla V1.2)

```
Problem
I am executing a 30-day AI Generalist study sprint (March 9 - April 6). I need a lightweight, high-performance local dashboard to track my daily activities without the overhead of heavy frameworks. The system must store all curriculum data in a structured JSON file and use simple HTML/CSS/JS for the interface. It must automate progress tracking based on "Lab Notes" length and maintain the discipline of my schedule while enabling social media sharing.

Role
You are a Senior Frontend Developer and UI/UX Specialist. Your goal is to write clean, modular Vanilla JavaScript and CSS (via Tailwind CDN) to create a professional, game-inspired single-page application.

Deliverable
Build a single-page web application using HTML5, Tailwind CSS, and Vanilla JavaScript, supported by a schedule.json file.

1. Data Structure (schedule.json)
The schedule.json must contain an array of objects representing each time block from the 30-day plan. Use this exact format:
- time: String ("9–11am", "11:30–1:30", or "3-4:30")
- title: String (Category: e.g., "Deep Learning", "Deep Building", or "Trends & Outreach")
- description: String (The specific task content from the .md file)
- status: Boolean (Default: false)
- notes: String (Default: "")

2. Sidebar & Navigation
- Today’s Focus: The default view, showing only the 3 tasks for the current date.
- Full Roadmap: A scrollable table/grid of all 90 tasks with status indicators.
- Insights: Displays "Current Streak" and "Total Completion %."
- Settings: A toggle for "Catch-up Mode" to allow editing of past dates (which are read-only by default).

3. Application Logic
- Smart Completion: Automatically toggle status to true once the notes field reaches 5 lines of text (~250 characters).
- Persistence: Use localStorage to save and load status and notes so data persists on refresh.
- LinkedIn Export: A "Copy for Social" button for each task that formats notes with a day-specific hook (e.g., "Day X of my AI Generalist Journey") and hashtags like #AIGenerist.
- Markdown Export: A button to download a timestamped .md file containing all tasks and your recorded notes.

4. Implementation Instructions
- Aesthetic: Use a sleek "Dark Mode" dashboard (Tailwind slate-900 background).
- Schedule Population: Populate the JSON using the provided 30-day table.
- Calendar Sync: Include a button to download a static .ics file for the 30-day schedule blocks.
```

---

## ✨ Latest Features (V1.2)

### 📊 Advanced Analytics & Navigation
- **Multi-View Dashboard**: Switch seamlessly between **Dashboard**, **Roadmap**, **Insights**, and **Settings**.
- **The "Hot" Roadmap**: A scrollable 30-day curriculum table to see your entire trajectory.
- **Intrinsic Motivation Hub**: Track your **Streak**, **Learning Velocity**, and revisit **Recent Lab Notes** in the Insights view.

### 🧠 Intelligent Automation ("Investment" Loop)
- **Auto-Completion**: Write a detailed lab note of **5+ lines**, and the system automatically marks the activity as **Completed** ✅. It rewards deep reflection over simple ticking.
- **Dynamic Trigger**: The dashboard hero card automatically prioritizes your current time-block based on the system clock.

### 🛡️ Focus & Security
- **Strict Future Lockdown**: Future dates are visually dimmed and functionally locked to prevent distraction. Stay in the "Now".
- **Past-Date Security**: Editing past sessions is disabled by default but can be toggled via the **Settings override** for catch-up sessions.

### 📱 Content Creation & Export
- **LinkedIn Social Helper**: A dedicated "Copy to Social" tool that formats your notes into polished LinkedIn posts with hooks and hashtags.
- **Timestamped Lab Journal**: Export your entire 30-day growth into a single, timestamped **Markdown file** for long-term archiving and tool-building.

### 📅 Native Reminders
- **GCal Integration**: Generates a custom `.ics` calendar file to give you native mobile and desktop notifications 15 minutes before every block starts.

---

## 🚀 How to Run
1. Navigate to the `src` folder.
2. Open `index.html` in any modern browser.
3. Your data is automatically persisted in `localStorage`.
