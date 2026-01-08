# Flutter Website Replication Prompt

## Objective
Create a Flutter web application that is a **100% pixel-perfect replica** of the existing Django website. Every design element, feature, animation, and interaction must match exactly.

## Requirements

### 1. Complete Website Analysis
- Analyze all Django templates in `resumes/templates/` directory
- Extract all HTML structure, CSS classes, and styling from:
  - `resumes/templates/base.html`
  - `resumes/templates/resumes/home.html`
  - `resumes/templates/score_checker.html`
  - `resumes/templates/review_resume.html`
  - `resumes/templates/finder_list.html`
  - `resumes/templates/finder_detail.html`
  - All other template files
- Analyze all CSS files:
  - `resumes/static/css/marketing.css`
  - `resumes/static/css/styles.css`
- Extract all JavaScript functionality from:
  - `resumes/static/js/ux.js`
  - `resumes/static/js/theme_toggle.js`
  - `resumes/static/js/score_checker.js`
  - `resumes/static/js/review_resume.js`
  - `resumes/static/js/finder.js`
  - `resumes/static/js/finder_create.js`
  - `resumes/static/js/improve_resume.js`

### 2. Asset Extraction and Migration
- **Images**: Copy ALL images from `resumes/static/img/` to `resume_ai_flutter/assets/images/`
  - Template images: `resumes/static/img/templates/*.png`, `*.jpg`, `*.webp`
  - All other images in the static/img directory
- **Videos**: Copy ALL videos from `resumes/static/img/templates/*.mp4` to `resume_ai_flutter/assets/videos/`
- **Icons**: Extract and use Bootstrap Icons or equivalent Flutter icon set matching the Django site
- **Fonts**: Use the same fonts (Inter font family) as Django site
- Update `pubspec.yaml` to include all assets

### 3. Design System Replication
- **Color Palette**: Extract exact colors from CSS:
  - Background: `#0b0c10`, `#111827`
  - Text: `#e5e7eb`, `#c9d1d9`
  - Brand/CTA: `#16a34a`, `#22c55e`
  - Accent: `#7c3aed`, `#9333ea`
  - Borders: `rgba(255,255,255,.08)`
  - Cards: `rgba(255,255,255,.06)`
- **Typography**: Match exact font sizes, weights, line heights from CSS
- **Spacing**: Replicate exact padding, margins, gaps from CSS
- **Border Radius**: Match all border-radius values
- **Shadows**: Replicate all box-shadow effects
- **Glass Morphism**: Implement exact backdrop-filter and blur effects

### 4. Component-by-Component Replication

#### Home Page (`home_screen.dart`)
- **Hero Section**: 
  - Exact same layout with 3D background elements (floating cubes, spheres, pyramids)
  - Same heading text, description, and CTA buttons
  - Same star rating display
  - Same image preview with flip effect
- **Templates Auto-Scroll Section**:
  - Infinite scrolling template carousel
  - Same template images in same order
  - Same animation speed and direction
- **Black Band Section**: Exact same text and button
- **Resume Score Checker Section**: Same layout, text, features list, and image
- **Resume Review Section**: Same layout (image left, content right)
- **Improve Resume Section**: Same gradient background and layout
- **Visualization Section**: Same metric cards with icons
- **Value List Section**: Same 4-column grid with icons
- **Import Section**: Same step-by-step card design
- **Feature Grid Section**: Same 4-column service cards
- **Testimonials Section**: Same horizontal scrolling testimonials
- **Industries Section**: Same 4-column industry cards
- **FAQ Section**: Same accordion design with emojis
- **Footer**: Exact same footer structure with all links

#### Score Checker Page (`score_checker_screen.dart`)
- **Upload Section**: 
  - Same dropzone design with glass morphism
  - Same file input styling
  - Same "AI powered" badge
- **Results Section**:
  - Same donut chart with animated progress
  - Same subscore bars with exact colors
  - Same keyword chips (present/missing)
  - Same verdict emoji and text
  - Same insights list
- **AI Context Block**:
  - Same holographic cards
  - Same "Powered by AI" header with emoji
  - Same 4-card grid layout
  - Same formula display
  - Same privacy section

#### Review Resume Page (`review_resume_screen.dart`)
- **Sticky Video Section**: Same video player on left
- **Upload Form**: Same glass card design
- **Results Cards**:
  - Same 3D card styling with hover effects
  - Same health emoji and progress bar
  - Same mistake flip cards
  - Same section stepper
  - Same readability meter
  - Same "Fix this first" quest list
  - Same ATS parse display

#### Finder Pages (`finder_list_screen.dart`, `finder_detail_screen.dart`)
- **List Page**: Same hero, info cards, and modal design
- **Detail Page**: Same candidate ranking table, filters, and CSV export

### 5. Animations and Interactions
- **Scroll Animations**: Implement same "sa fade-up" scroll-in animations
- **3D Effects**: Replicate all 3D card hover effects
- **Floating Elements**: Same animated background cubes, spheres, pyramids
- **Confetti Effects**: Same celebration animations for good scores
- **Progress Animations**: Same animated donut charts and progress bars
- **Flip Cards**: Same 3D flip card effects for mistakes
- **Auto-scroll**: Same infinite scrolling for templates and testimonials
- **Smooth Scrolling**: Same scroll behavior and snap sections

### 6. JavaScript Functionality Port
- **Theme Toggle**: Port theme switching functionality
- **File Upload**: Same drag-and-drop and file handling
- **API Calls**: Port all API integration logic
- **Form Validation**: Same validation rules and error messages
- **Dynamic Content**: Same dynamic content generation
- **Copy to Clipboard**: Same copy functionality
- **Modal Dialogs**: Same modal behavior and animations

### 7. Navigation and Routing
- Create routes for all pages:
  - `/` - Home
  - `/score-checker` - Score Checker
  - `/review` - Review Resume
  - `/finder` - Candidate Finder
  - `/finder/:id` - Finder Detail
  - All other routes from Django URLs

### 8. Responsive Design
- Match exact breakpoints from Django CSS
- Same mobile, tablet, and desktop layouts
- Same responsive behavior for all sections

### 9. Performance
- Optimize images (use WebP where possible)
- Lazy load images and videos
- Implement same loading states
- Match page load performance

### 10. Accessibility
- Same ARIA labels
- Same keyboard navigation
- Same screen reader support
- Same focus indicators

## Implementation Checklist

### Phase 1: Setup and Assets
- [ ] Copy all images to Flutter assets
- [ ] Copy all videos to Flutter assets
- [ ] Set up asset references in pubspec.yaml
- [ ] Configure fonts (Inter)
- [ ] Set up color constants matching CSS

### Phase 2: Base Components
- [ ] Create base theme matching CSS
- [ ] Create glass morphism widget
- [ ] Create 3D card widget
- [ ] Create animated background elements
- [ ] Create scroll animation wrapper

### Phase 3: Home Page
- [ ] Hero section (100% match)
- [ ] Templates section (100% match)
- [ ] All feature sections (100% match)
- [ ] Footer (100% match)
- [ ] All animations (100% match)

### Phase 4: Feature Pages
- [ ] Score Checker page (100% match)
- [ ] Review Resume page (100% match)
- [ ] Finder pages (100% match)
- [ ] All interactions (100% match)

### Phase 5: Functionality
- [ ] File upload (100% match)
- [ ] API integration (100% match)
- [ ] Form handling (100% match)
- [ ] Data visualization (100% match)
- [ ] Export features (100% match)

### Phase 6: Polish
- [ ] All animations smooth
- [ ] All colors exact match
- [ ] All spacing exact match
- [ ] All typography exact match
- [ ] All interactions working
- [ ] Cross-browser testing
- [ ] Performance optimization

## Quality Assurance

### Visual Comparison
- Side-by-side comparison with Django site
- Pixel-perfect matching of:
  - Layouts
  - Colors
  - Typography
  - Spacing
  - Images
  - Animations

### Functional Comparison
- All features work identically
- All forms submit correctly
- All API calls work
- All navigation works
- All interactions feel the same

### Code Quality
- Clean, maintainable Flutter code
- Proper widget composition
- Reusable components
- Well-documented code
- Follow Flutter best practices

## Deliverables
1. Complete Flutter app matching Django site 100%
2. All assets properly organized
3. All pages implemented
4. All features working
5. Documentation of any differences (should be none)

## Success Criteria
- **100% visual match** - No visible differences
- **100% functional match** - All features work identically
- **100% asset match** - All images/videos included
- **100% animation match** - All animations feel the same
- **100% interaction match** - All user interactions identical

## Notes
- Do NOT skip any design element
- Do NOT simplify any animation
- Do NOT change any color, spacing, or typography
- Do NOT remove any feature
- The goal is a perfect clone, not an inspired redesign

