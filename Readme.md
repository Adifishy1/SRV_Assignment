Frontend Task
Please find attached the assignment for your reference.
Design Link: Click here
Development Guidelines: zzzzhere
The Deadline for submission is 2 days

Landing Page – Development Guidelines
Stack & Structure: Use semantic HTML5 + custom CSS (no frameworks). Follow BEM naming and W3C validation.
Accessibility: WCAG 2.2 AA compliant, ARIA roles for sliders, skip-to-content, keyboard + screen reader support.
Responsiveness: It should be properly responsive to all the browsers and devices
Cross-browser: Ensure compatibility with Chrome, Firefox, Safari, Edge (latest 2 versions) + iOS/Android browsers.
Hero Section: Dual-axis slider (horizontal & vertical), auto-play, swipe, pause on hover, and accessible controls.
Participating School Logos: Continuous sling animation with alternating left–right and right–left flow; pause on hover/focus.
Choose the School: Four cards on desktop; convert to mobile slider with swipe + pagination dots.
Exhibition Section: Entire section as a slider with 3–6 highlight cards; accessible, consistent height, auto-play optional.
QA Criteria: Validate HTML/CSS, accessibility via axe, test on key devices, animations honor prefers-reduced-motion.
Design Link: https://www.figma.com/proto/uZ4DJ3er9xPeKYeb80VdMG/Premier-Schools-Exhibition--PSE--LP--12-06-2025-?node-id=1376-1295&t=74eHMUDVIk1mpqEO-1&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=749%3A1439
Once done share the zip file of source code to review

https://www.figma.com/design/uZ4DJ3er9xPeKYeb80VdMG/Premier-Schools-Exhibition--PSE--LP--12-06-2025-?node-id=0-1&p=f&t=dSEl67vk8fp6hvQm-0

Premier Schools Exhibition – Landing Page
Static HTML/CSS/JS landing page. No build step required — open index.html directly in any browser.
File structure
pse/
├── index.html
├── css/style.css
├── js/main.js
└── assets/
    └── img/
        ├── wreath.svg          ← included
        ├── logo.png            ← ADD YOUR FILE
        ├── hero1–8.jpg         ← ADD: mosaic children photos
        ├── preschedule-bg.jpg  ← ADD: exhibition crowd photo
        ├── school-type1–4.jpg  ← ADD: school category photos
        ├── school-harrow.png   ← ADD: school logos
        ├── school-shrewsbury.png
        ├── school-kings.png
        ├── school-woodstock.png
        ├── school-agakhan.png
        └── school-tisb.png
Features

Fixed navbar with logo + Register CTA
Hero: mosaic image grid + enquire form with validation
Stats: 4 wreath badges (1M+ Parents, 22+ Years, 500+ Schools, 17 Cities)
Participating Schools: dual-row infinite marquee (LTR + RTL), pauses on hover/focus
Choose the School: 4-card grid on desktop → swipeable slider on mobile with dots
Pre-Schedule: full-bleed section with background image
Exhibition Highlights: accessible slider, 4 visible cards, auto-play, prev/next controls
Footer: offices, phone, social icons
WCAG 2.2 AA: skip link, aria-labels, focus rings, reduced-motion support
Scroll reveal animations (IntersectionObserver, skipped if prefers-reduced-motion)
ShareContent# Frontend Developer Task - Test Management Application

## Overview

Build a test management application that allows users to create tests, add questions, and publish them. This is a 5-page flow application focusing on CRUD operations and API integration.

---

## Application Flow

### Papasted