**Prodesk Mission 5 – Kanban Task Board (Level 3)**

A modern Trello-style Task Management App built using React (Vite).
This project demonstrates core frontend engineering concepts like state management, component architecture, drag & drop interactions, and local persistence.

**Vercel Demo Link:**
https://prodesk-mission-5-szw8.vercel.app?_vercel_share=vfJohfdZHN03dd8gITDL9diTEES0oXhf

**Project Overview**

This project is part of the Prodesk Week 5 Internship Mission

The goal was to build a Kanban Board with increasing difficulty levels:

 Level 1 – Basic Task Management
 Level 2 – Enhanced Features
 Level 3 – Advanced UI & Interactions

**This repository implements Level 3 (Advanced).**

 **Features**
**Core Features (Level 1)**
Add new tasks
Delete tasks
Move tasks between:
To Do
In Progress
Done
** Enhanced Features (Level 2)**
 Edit tasks inline
 Priority system:
🔴 High
🟡 Medium
🟢 Low
LocalStorage persistence (tasks remain after refresh)
**Advanced Features (Level 3)**
Drag & Drop (Smooth interaction)
Task search / filter
Real-time UI updates using React state
Component-based architecture
**Tech Stack**
React (Vite)
JavaScript (ES6+)
CSS / Tailwind (if used)
LocalStorage API
Drag & Drop Library (dnd-kit / react-beautiful-dnd)
**Project Structure**
prodesk-app/
│── src/
│   ├── components/
│   │   ├── Column.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskForm.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│
│── public/
│── package.json
│── vite.config.js
**Installation & Setup**
1️ Clone the Repository
git clone https://github.com/Tejasya-2612/Prodesk-Mission-5.git
cd Prodesk-Mission-5
2️ Install Dependencies
npm install
3️ Run the Project
npm run dev
** Deployment
**
Deployed using Vercel

**Key Concepts Learned**
React useState
Component reusability
Props & state flow
Drag-and-drop implementation
LocalStorage handling
UI/UX structuring

**Demo**
https://drive.google.com/file/d/1vtiGwaOQJCrABdNFo7Lxdm98p1OJ1Qz3/view?usp=sharing

**Challenges Faced**
Managing state across multiple columns
Implementing drag-and-drop smoothly
Persisting data correctly using localStorage
Avoiding unnecessary re-renders

**Author:**
A TEJASYA
P/IL/26/NOIDA/M1299
KLH UNIVERSITY  


