# Files to Analyze and Copy for 100% Flutter Replication

## Django Templates (HTML Structure)
```
resumes/templates/
├── base.html                    → Flutter: Base layout, navbar, footer
├── resumes/
│   ├── home.html               → Flutter: home_screen.dart
│   ├── requirements.html       → Flutter: requirements_screen.dart
│   ├── upload.html             → Flutter: upload_screen.dart
│   ├── results.html            → Flutter: results_screen.dart
│   └── examples.html            → Flutter: examples_screen.dart
├── score_checker.html          → Flutter: score_checker_screen.dart
├── review_resume.html          → Flutter: review_resume_screen.dart
├── improve_resume.html          → Flutter: improve_resume_screen.dart
├── finder_list.html             → Flutter: finder_list_screen.dart
├── finder_detail.html           → Flutter: finder_detail_screen.dart
└── partials/
    └── navbar.html              → Flutter: app_bar widget
```

## CSS Files (Styling)
```
resumes/static/css/
├── marketing.css               → Flutter: app_theme.dart (extract all values)
└── styles.css                  → Flutter: additional_styles.dart
```

## JavaScript Files (Functionality)
```
resumes/static/js/
├── ux.js                       → Flutter: scroll animations, smooth scroll
├── theme_toggle.js             → Flutter: theme provider
├── score_checker.js            → Flutter: score_checker_logic.dart
├── review_resume.js            → Flutter: review_resume_logic.dart
├── finder.js                   → Flutter: finder_logic.dart
├── finder_create.js            → Flutter: finder_create_logic.dart
└── improve_resume.js           → Flutter: improve_resume_logic.dart
```

## Images (Assets)
```
resumes/static/img/
├── templates/
│   ├── first.png / first.jpg   → Flutter: assets/images/templates/first.png
│   ├── second.png / second.jpg → Flutter: assets/images/templates/second.png
│   ├── R-1.png through R-9.png → Flutter: assets/images/templates/R-1.png ... R-9.png
│   ├── Tailor.webp             → Flutter: assets/images/templates/Tailor.webp
│   ├── ATS.webp                → Flutter: assets/images/templates/ATS.webp
│   ├── highlight.webp          → Flutter: assets/images/templates/highlight.webp
│   └── *.mp4 (videos)          → Flutter: assets/videos/*.mp4
├── score-preview.png           → Flutter: assets/images/score-preview.png
└── Banner.png                  → Flutter: assets/images/Banner.png
```

## Videos
```
resumes/static/img/templates/
├── AI_Resume_Screener_Video_Generation.mp4 → Flutter: assets/videos/AI_Resume_Screener_Video_Generation.mp4
└── (any other .mp4 files)      → Flutter: assets/videos/
```

## Django Views (API Endpoints)
```
resumes/views.py                 → Flutter: API service classes
resumes/views_finder.py          → Flutter: finder_api_service.dart
resumes/views_review.py          → Flutter: review_api_service.dart
```

## Key CSS Values to Extract

### Colors
- `--bg: #0b0c10`
- `--surface: #111827`
- `--brand: #16a34a`
- `--accent: #7c3aed`
- `--text: #e5e7eb`
- `--muted: #9ca3af`
- `--border: rgba(255,255,255,.08)`
- `--card: rgba(255,255,255,.06)`

### Spacing
- Padding: 16px, 24px, 32px, 40px, 60px, 80px
- Margins: Same as padding
- Gaps: 8px, 12px, 16px, 20px

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px
- XL: 22px
- Full: 9999px

### Shadows
- Card: `0 10px 35px rgba(0,0,0,.35), 0 4px 14px rgba(0,0,0,.25)`
- 3D Card: `0 12px 32px rgba(124,58,237,.18), 0 2px 8px rgba(0,0,0,.18)`
- Hover: `0 24px 60px #7c3aed33, 0 2px 8px #0003`

### Typography
- Font: Inter
- Display: 48px, 36px, 32px
- Headings: 24px, 20px, 18px
- Body: 18px, 16px, 14px
- Line Height: 1.2, 1.5, 1.6

### Animations
- Scroll-in: `translateY(32px)` → `translateY(0)`, 0.8s cubic-bezier(.2,.8,.2,1)
- Hover: `translateY(-4px) scale(1.01)`, 0.25s
- Bounce: `scale(0.7)` → `scale(1.2)` → `scale(1)`, 0.7s

## Flutter File Structure to Create

```
lib/
├── main.dart
├── src/
│   ├── features/
│   │   ├── home/
│   │   │   └── presentation/
│   │   │       └── home_screen.dart
│   │   ├── score_checker/
│   │   │   └── presentation/
│   │   │       └── score_checker_screen.dart
│   │   ├── review/
│   │   │   └── presentation/
│   │   │       └── review_resume_screen.dart
│   │   ├── finder/
│   │   │   └── presentation/
│   │   │       ├── finder_list_screen.dart
│   │   │       └── finder_detail_screen.dart
│   │   └── ...
│   ├── shared/
│   │   ├── theme/
│   │   │   └── app_theme.dart
│   │   ├── widgets/
│   │   │   ├── glass_card.dart
│   │   │   ├── card_3d.dart
│   │   │   ├── floating_elements.dart
│   │   │   └── scroll_animation.dart
│   │   └── utils/
│   │       └── animations.dart
│   └── ...
└── assets/
    ├── images/
    │   └── templates/
    │       ├── first.png
    │       ├── second.png
    │       ├── R-1.png ... R-9.png
    │       └── ...
    └── videos/
        └── AI_Resume_Screener_Video_Generation.mp4
```

## Checklist

### Phase 1: Assets
- [ ] Copy all images from `resumes/static/img/` to `assets/images/`
- [ ] Copy all videos to `assets/videos/`
- [ ] Update `pubspec.yaml` with all assets
- [ ] Verify all images load correctly

### Phase 2: Theme
- [ ] Extract all colors from CSS
- [ ] Extract all spacing values
- [ ] Extract all typography
- [ ] Extract all shadows
- [ ] Create `app_theme.dart` with exact values
- [ ] Apply theme to MaterialApp

### Phase 3: Components
- [ ] Create glass morphism card widget
- [ ] Create 3D card widget with hover effects
- [ ] Create floating background elements
- [ ] Create scroll animation wrapper
- [ ] Create all button styles
- [ ] Create all form inputs

### Phase 4: Pages
- [ ] Home page - 100% match
- [ ] Score Checker - 100% match
- [ ] Review Resume - 100% match
- [ ] Finder List - 100% match
- [ ] Finder Detail - 100% match
- [ ] All other pages

### Phase 5: Animations
- [ ] Scroll-in animations
- [ ] 3D card hovers
- [ ] Floating elements animation
- [ ] Progress bar animations
- [ ] Confetti effects
- [ ] Flip card animations

### Phase 6: Functionality
- [ ] File upload
- [ ] API integration
- [ ] Form validation
- [ ] Data visualization
- [ ] CSV export
- [ ] All interactions

### Phase 7: Testing
- [ ] Side-by-side visual comparison
- [ ] Functional testing
- [ ] Performance testing
- [ ] Cross-browser testing
- [ ] Mobile responsive testing

