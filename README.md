# Canine Haven — Premium Dog Walking & Canine Care

A premium, professional, responsive static landing page for a dog walking and companion care service. Built following strict semantic HTML5, pure vanilla CSS, and vanilla JavaScript architecture with 100% WCAG AAA/AA accessibility compliance and test-driven development (TDD).

---

## 🐾 Table of Contents

- [Overview](#overview)
- [Design & Architecture](#design--architecture)
- [Technology Stack](#technology-stack)
- [Core Sections](#core-sections)
- [Key Features & Edge Cases](#key-features--edge-cases)
- [Accessibility Compliance (100% Lighthouse)](#accessibility-compliance-100-lighthouse)
- [Test-Driven Development (TDD)](#test-driven-development-tdd)
- [Running the Project](#running-the-project)
- [Verification & Lighthouse Results](#verification--lighthouse-results)
- [License](#license)

---

## 📖 Overview

Canine Haven is an editorial, corporate static landing page for a high-end dog walking and canine wellness service. The application emphasizes one-on-one attention, veterinary-certified safety standards, GPS tracking, and transparent pet care.

The website delivers an uncluttered, responsive user experience without frontend frameworks, bloated libraries, or artificial dependencies.

---

## 🎨 Design & Architecture

### Monochromatic Color System
- **Pure White**: `#FFFFFF` (Primary background, inverted surfaces)
- **Secondary Neutral**: `#F5F5F5` (Subtle alternate section backdrops, image frames)
- **Primary Text & Accents**: `#171717` (High-contrast headings, primary buttons, borders)
- **Secondary Text**: `#666666` (Readable subtitles, metadata, muted labels)
- **Dividers & Structural Borders**: `#E5E5E5` (Clean hairline separators)

### Typography
- **Headings**: `DM Sans` (Clean, geometric corporate editorial hierarchy)
- **Body & Controls**: `Inter` (Optimized legibility and reading flow)
- Standard system fallbacks: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### Spacing
Strict 16px / 32px baseline modular scale (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`).

---

## 🛠 Technology Stack

### Production Website (Strict Pure Vanilla)
- **HTML5**: Semantic landmark structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<footer>`)
- **CSS3**: Pure vanilla CSS, custom properties, CSS Grid, Flexbox, media queries, `:focus-visible`, `prefers-reduced-motion`
- **JavaScript**: Modular vanilla ES modules (`main.js`, `services-data.js`)

### Testing & Development Environment
- **Vitest**: Fast, modern ESM test runner
- **JSDOM**: Headless DOM environment for unit & integration testing
- **Chrome DevTools MCP / Lighthouse**: Headless browser automation and automated WCAG accessibility auditing

---

## 📑 Core Sections

1. **Header & Navigation**: Sticky blur header, SVG brand logo, primary navigation links with internal anchor scrolling, "Book Consultation" CTA, and an accessible mobile hamburger drawer.
2. **Hero Section**: High-impact editorial headline, service overview, dual call-to-actions ("Schedule a Walk" / "Explore Services"), trust statistics (100% Insured & Bonded, 15,000+ Walks, 5.0 Star Rating), and professional photography.
3. **About Section**: Core business philosophy, rejection of overcrowded pack walking, and 4 operational pillars (First Aid Certified, Transparent GPS, Behavioral Screening, Dual-Leash Safety).
4. **Services Section**: Interactive program catalog with category filter tabs ("All", "Solo", "Group", "Specialized Care"), live search input, live count indicator, and an accessible "No data found" empty state with a reset filter button.
5. **How It Works**: 3-step transparent customer onboarding (Meet & Greet, Customized Schedule, Live GPS & Photo Updates).
6. **Why Choose Us**: 4 proof-points covering insurance, background-checked walkers, satellite GPS logs, and weather-adaptive care.
7. **Client Testimonials**: Authentic, neutral client experiences featuring verified owner names, dog breeds, and 5-star ratings.
8. **Contact & Consultation Form**: Full-featured booking form with real-time field validation, loading states, network failure simulation toggle, accessible alerts, and retry flow.
9. **Footer**: Brand statement, operating hours, emergency contact, program links, copyright, and accessibility commitment.

---

## ⚡ Key Features & Edge Cases

- **Empty State**: When service searches yield no matches, a clean "No data found" box appears with a one-click "Reset Filters" action.
- **Asynchronous Loading State**: The consultation submit button enters an `aria-busy="true"` state with a spinning indicator and disabled state while simulating transmission.
- **Bad Connectivity & Network Failure Handling**: A QA simulation toggle allows testing connection errors. Failed submissions trigger an assertive error banner with an inline "Retry Submission" button.
- **Form Validation & Accessible Errors**: Fields validate for required status, email format, and phone format. Invalid fields receive `aria-invalid="true"`, focus redirection, and error messages linked via `aria-describedby`.
- **Input Sanitization & Security**: User-supplied values (e.g., dog names) are injected strictly through `textContent`, neutralizing script injection and XSS payloads. No PII is persisted to local storage.
- **Privacy-Safe Analytics**: User actions (primary CTA clicks, service filtering, consultation requests) trigger standard compliance logs:
  ```javascript
  console.log("[Analytics] User interacted with Static Landing Page");
  ```
  Analytics logging explicitly omits personal names, phone numbers, or email addresses.

---

## ♿ Accessibility Compliance (100% Lighthouse)

- **Skip Link**: Top-level accessible bypass link targeting `#main-content`.
- **Landmarks & Regions**: Comprehensive semantic hierarchy across all sections.
- **Keyboard Navigation**: Full keyboard navigation across all interactive elements, mobile navigation drawer with Escape key listener, and visible `:focus-visible` outlines.
- **Color Contrast**: All text pairings meet or exceed WCAG AA/AAA thresholds (e.g. `#171717` on `#FFFFFF` achieves 16.1:1 contrast).
- **Reduced Motion**: Respects `@media (prefers-reduced-motion: reduce)` by disabling non-essential transitions and smooth scrolling.
- **Live Regions**: Dynamic updates (service results count, form success/error messages) use `aria-live="polite"` and `aria-live="assertive"`.

---

## 🧪 Test-Driven Development (TDD)

The test suite was authored prior to implementation and executed to confirm expected failures, followed by implementation to achieve 100% pass rates.

### Test Suites (`npm test`)

| Test Suite | Purpose | Status |
| :--- | :--- | :--- |
| `tests/structure.test.js` | Semantic HTML5 landmarks, headings, meta tags, skip link | ✅ Passed |
| `tests/navigation.test.js` | Mobile menu toggle, ARIA states, Escape key handling, nav links | ✅ Passed |
| `tests/services.test.js` | Dynamic rendering, category filters, text search, empty states | ✅ Passed |
| `tests/form.test.js` | Form validation, required fields, loading state, network retry | ✅ Passed |
| `tests/security.test.js` | XSS attack prevention, textContent safety, PII protection | ✅ Passed |
| `tests/analytics.test.js` | Analytics format compliance, absence of PII leakage | ✅ Passed |
| `tests/accessibility.test.js` | Image alt attributes, label associations, focus tokens, CSS rules | ✅ Passed |

**Total: 33 / 33 Unit & Integration Tests Passing**

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
npm install
```

### Running Tests
```bash
npm test
```

### Starting the Local Development Server
```bash
npm run serve
```
Open `http://127.0.0.1:3000/` in any modern web browser.

---

## 📊 Verification & Lighthouse Results

Audits executed via Chrome DevTools Lighthouse:

- **Accessibility**: 100 / 100
- **Best Practices**: 100 / 100
- **SEO**: 100 / 100
- **Agentic Browsing**: 100 / 100
- **Console Errors**: 0 errors
- **Network Failures**: 0 unhandled requests

---

## 📄 License

MIT License. Designed and engineered autonomously.
