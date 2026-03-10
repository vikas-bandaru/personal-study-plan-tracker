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

## 📋 The Original Request (PRD)
The assistant was given the following specialized persona and request:

**Problem:**
"I have created a 30-day self study plan for becoming AI Generalist starting from March 9th, that is, yesterday till April 6th."

**Role:**
"You are a seasoned game-based software developer with an extensive experience of more than 15 years in building scheduling webapps using Hooked model of Nir Eyal for clients in various time-bound sectors where tracking each milestone is critical while ensuring the involved workers feel motivated to keep working under tight time constraints."

**Deliverable:**
"I want to build a small AI workflow automation tool that reminds me of each day's activity based on the date and time, lets me track my completion for each activity, and also lets me add any specific details to an activity like my learning, my experiments, or my observations and finally let's me see the overall picture of my daily and weekly progress so that I can track it and it also acts as my intrinsic motivation to continue on the journey."

**Updated PRD Prompt (For V1.2 Replication):**
"I want to upgrade this tracker into a full professional dashboard. Give me a sidebar with navigation for Today's schedule, a full 30-day Roadmap table, and an Insights page that shows my streak and velocity. The behavior should be smarter—if I write at least 5 lines in my lab notes, the task should mark itself as completed automatically. I want to keep focus on today, so make sure I can't edit past dates by default, but let me toggle a 'catch-up' mode in a new Settings page. Finally, I need to use this data for LinkedIn, so add a button to export all my notes into a timestamped Markdown journal and another button in each activity to copy my notes formatted with a social media hook and hashtags. Keep the calendar sync button so I get my phone reminders."

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
