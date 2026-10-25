

> **CodeNova Internship Program · Batch 01 · App Development — Task 1**

A modern, responsive Progressive Web App (PWA) for creating, managing, and reviewing flashcards with smooth 3D flip animations and persistent local storage.





| Home / Quiz View | Card Flip Animation | Manage Cards Panel |
|:-:|:-:|:-:|
| *Flashcard question side* | *Smooth 3D flip to answer* | *Edit, delete, reorder cards* |

> *Replace the above with actual screenshots of your running app.*





- **Card Flip Interaction** — Smooth 3D CSS flip animation displaying questions and answers
- **Next/Previous Navigation** — Slide transitions between cards with keyboard arrow keys and swipe support
- **CRUD Management** — Create, read, update, and delete flashcards via intuitive modal forms
- **Manage Panel** — Slide-over panel listing all cards with quick edit/delete actions
- **Persistent Storage** — All cards saved to `localStorage`, surviving app restarts and browser refreshes
- **Progress Tracking** — Visual progress ring showing current position in the deck
- **Offline Support** — Service Worker caches all assets for complete offline functionality
- **PWA Installable** — Add to home screen on mobile devices for native-like experience
- **Responsive Design** — Adapts cleanly from 360px phones to large desktop screens
- **Keyboard Shortcuts** — Arrow keys for navigation, Space/Enter to flip
- **Touch/Swipe** — Swipe left/right on mobile to navigate between cards





| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure, accessibility attributes |
| **CSS3** | Custom properties, 3D transforms, glassmorphism, keyframe animations |
| **Vanilla JavaScript** | Application logic, DOM manipulation, localStorage API |
| **Service Worker** | Offline caching (Cache-first strategy) |
| **Web App Manifest** | PWA installability and metadata |
| **Google Fonts** | Inter + JetBrains Mono typography |


flashcard-quiz-app/
├── index.html          # Main HTML entry point
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker for offline support
├── css/
│   └── style.css       # Complete design system & styles
├── js/
│   └── app.js          # Application logic (CRUD, navigation, storage)
├── icons/
│   └── favicon.svg     # App icon
└── README.md           # This file
```

---

## 🚀 Setup & Running Locally

### Prerequisites
- A modern web browser (Chrome, Edge, Firefox, Safari)
- No build tools, frameworks, or npm packages required

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/flashcard-quiz-app.git
   cd flashcard-quiz-app
   ```

2. **Serve the files** (required for Service Worker)
   
   Option A — VS Code Live Server:
   - Install the "Live Server" extension in VS Code
   - Right-click `index.html` → "Open with Live Server"

   Option B — Python HTTP server:
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

   Option C — Node.js:
   ```bash
   npx serve .
   ```

3. **Use the app**
   - The app loads with 6 sample flashcards
   - Click the card to flip between question and answer
   - Use ← → arrows or swipe to navigate
   - Click **"New Card"** to add your own flashcards
   - Click the grid icon to open the **Manage Panel**

---



| Criteria | Status |
|---|---|
| Card flip interaction with Q&A display | ✅ |
| Next/Previous navigation with smooth transitions | ✅ |
| Create new flashcards | ✅ |
| Edit existing flashcards | ✅ |
| Delete flashcards | ✅ |
| Persistent on-device storage (localStorage) | ✅ |
| Cards persist across app restarts | ✅ |
| Smooth animations without layout glitching | ✅ |
| Responsive layout on different screen sizes | ✅ |
| Offline functionality (Service Worker) | ✅ |



- **Dark Glassmorphism Theme** — Premium feel with frosted glass cards and ambient gradient orbs
- **3D CSS Transforms** — Hardware-accelerated card flips for smooth 60fps animations
- **No External Dependencies** — Pure HTML/CSS/JS for zero bundle size and instant loading
- **Mobile-First Responsive** — Touch, swipe, and keyboard navigation all supported
- **Accessible** — ARIA labels, focus management, semantic HTML, keyboard navigable



This project is submitted as part of the CodeNova Internship Program (Batch 01). 
Open source for educational purposes.



*Built with ❤️ for CodeNova App Development Internship*
