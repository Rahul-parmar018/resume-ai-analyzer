# JavaScript to Flutter Behavior Mapping

## Overview
This document maps all JavaScript behaviors from the Django site to Flutter implementations.

## 1. UX Enhancements (ux.js)

### Scroll Animations
- **JS**: IntersectionObserver for `.sa` elements
- **Flutter**: `ScrollAnimation` widget (already implemented)
- **Status**: ✅ Complete

### Tilt Effects
- **JS**: Mouse move tracking for `.preview-tilt`, `.tilt-on-cursor`
- **Flutter**: MouseRegion + Transform in Card3D
- **Status**: ✅ Complete (Card3D widget)

### Industry Pills
- **JS**: Click handlers to show/hide previews
- **Flutter**: State management + conditional rendering
- **Status**: ⚠️ Needs implementation

### FAQ Helpers
- **JS**: Auto-scroll on expand, add 'open' class
- **Flutter**: ExpansionTile with scroll controller
- **Status**: ⚠️ Needs implementation

### Hero Flip
- **JS**: Auto-flip every 2s, pause on hover
- **Flutter**: AnimationController with Timer
- **Status**: ⚠️ Needs implementation

### Templates Auto-Scroll
- **JS**: Infinite scroll animation
- **Flutter**: AnimationController with ListView
- **Status**: ✅ Complete (Home screen)

### Testimonials Auto-Scroll
- **JS**: Horizontal infinite scroll
- **Flutter**: AnimationController with ListView
- **Status**: ✅ Complete (Home screen)

### Smooth Scrolling
- **JS**: Anchor link smooth scroll
- **Flutter**: ScrollController.animateTo
- **Status**: ⚠️ Needs implementation

### Button Loading States
- **JS**: Disable + spinner on click
- **Flutter**: State management + CircularProgressIndicator
- **Status**: ⚠️ Partial (needs consistent pattern)

### Keyboard Navigation
- **JS**: Focus outline styles
- **Flutter**: FocusNode + Focus widgets
- **Status**: ⚠️ Needs implementation

## 2. Theme Toggle (theme_toggle.js)

### Theme Switching
- **JS**: localStorage + class toggle
- **Flutter**: SharedPreferences + ThemeProvider
- **Status**: ⚠️ Needs implementation

## 3. Score Checker (score_checker.html inline JS)

### File Upload
- **JS**: Drag & drop + file input
- **Flutter**: FilePicker + DragTarget
- **Status**: ✅ Complete

### Score Calculation
- **JS**: API call + result rendering
- **Flutter**: API service + state management
- **Status**: ⚠️ Needs API integration

### Donut/Bars Animation
- **JS**: animateDonut, animateBar functions
- **Flutter**: AnimationController in widgets
- **Status**: ✅ Complete (DonutChart, _SubscoreBar)

### Verdict Display
- **JS**: Dynamic emoji + text based on score
- **Flutter**: Conditional rendering
- **Status**: ✅ Complete

### New Score Reset
- **JS**: Reset all UI elements
- **Flutter**: State reset method
- **Status**: ⚠️ Needs implementation

## 4. Review Resume (review_resume.js)

### Form Submission
- **JS**: FormData + fetch API
- **Flutter**: HTTP client + FormData
- **Status**: ⚠️ Needs API integration

### Result Rendering
- **JS**: Dynamic HTML generation
- **Flutter**: State-based widget building
- **Status**: ✅ Complete (UI structure)

### Flip Cards
- **JS**: Toggle 'flipped' class
- **Flutter**: FlipCard widget with AnimationController
- **Status**: ✅ Complete

### Quest Checkboxes
- **JS**: Toggle 'completed' class
- **Flutter**: QuestList widget with state
- **Status**: ✅ Complete

### Confetti
- **JS**: confetti.js library
- **Flutter**: confetti package
- **Status**: ⚠️ Needs implementation

## 5. Finder (finder.js)

### Requisition Creation
- **JS**: Form validation + API call
- **Flutter**: Form validation + API service
- **Status**: ⚠️ Needs API integration

### Metrics Loading
- **JS**: Fetch metrics + render charts
- **Flutter**: API service + chart library
- **Status**: ⚠️ Needs chart library integration

### Table Rendering
- **JS**: Dynamic row generation
- **Flutter**: DataTable with state
- **Status**: ✅ Complete (structure)

### Filters
- **JS**: Filter rows by criteria
- **Flutter**: State filtering logic
- **Status**: ⚠️ Needs implementation

### Compare Functionality
- **JS**: Multi-select + compare modal
- **Flutter**: Selection state + compare modal
- **Status**: ⚠️ Needs implementation

### Export CSV
- **JS**: Download link
- **Flutter**: File download service
- **Status**: ⚠️ Needs implementation

## 6. Finder Create (finder_create.js)

### Form Validation
- **JS**: Field validation + error display
- **Flutter**: Form validation + error messages
- **Status**: ⚠️ Needs implementation

### API Integration
- **JS**: Fetch with CSRF token
- **Flutter**: HTTP client with auth
- **Status**: ⚠️ Needs implementation

## Implementation Priority

### High Priority (Core Functionality)
1. ✅ Scroll animations (done)
2. ✅ File upload (done)
3. ⚠️ Form validation
4. ⚠️ API integration
5. ⚠️ State management for all pages

### Medium Priority (UX Enhancements)
1. ⚠️ Theme toggle
2. ⚠️ Smooth scrolling
3. ⚠️ Button loading states
4. ⚠️ Keyboard navigation

### Low Priority (Nice-to-Have)
1. ⚠️ Confetti effects
2. ⚠️ Industry pills
3. ⚠️ Hero flip animation

