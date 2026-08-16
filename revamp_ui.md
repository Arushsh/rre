# RRE — COMPLETE CINEMATIC UI/UX REVAMP

## React + TypeScript Production Frontend Transformation

---

# 0. EXECUTIVE OBJECTIVE

You are working inside the existing RRE (Rajat Raj Entertainment) production project.

The application already contains a functional frontend, backend, AI service, APIs, authentication, booking, payment, gallery, portfolio, talent-hunt, team, user-management, and administrative functionality.

Your task is to perform a COMPLETE FRONTEND UI/UX TRANSFORMATION.

This is NOT a request to build a new application.

This is NOT a request to rebuild the backend.

This is NOT a request to replace existing functionality.

This is a production frontend redesign of an already-working system.

The final result should feel like a premium:

* entertainment company
* photography studio
* film production company
* music production studio
* live-streaming company
* talent discovery platform
* AI-powered creative platform

combined into one coherent digital experience.

The visual direction should be inspired by the supplied Vantage landing-page specification:

* cinematic
* dark
* editorial
* premium
* minimal
* immersive
* glassmorphic
* media-first
* sophisticated
* motion-driven

However:

DO NOT COPY THE VANTAGE BRAND.

Do not copy Vantage branding, logo, company name, business claims, or identity.

Use the Vantage specification only as a visual/art-direction reference.

The final website must be branded completely as RRE.

---

# 1. MOST IMPORTANT RULE — PROTECT THE EXISTING SYSTEM

The existing backend and business functionality are PROTECTED.

The primary goal is to change the PRESENTATION LAYER without breaking the APPLICATION LAYER.

DO NOT unnecessarily modify:

* backend architecture
* backend routes
* database
* database models
* database schemas
* authentication
* authorization
* JWT/session handling
* OTP/email verification
* payment processing
* payment verification
* booking calculations
* booking business logic
* AI processing
* AI service
* AI scoring/analysis
* talent processing
* gallery storage
* Cloudinary/media processing
* user-management logic
* team-management logic
* service-management logic
* environment secrets
* API contracts

DO NOT delete working functionality simply because the current UI is being replaced.

DO NOT replace working APIs with mock APIs.

DO NOT introduce fake data where real backend data already exists.

DO NOT hardcode information that is currently fetched dynamically.

DO NOT reset databases.

DO NOT remove existing environment variables.

DO NOT expose API keys or secrets.

---

# 2. CURRENT TECHNOLOGY — PRESERVE IT

The existing frontend is already based around:

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS
* Framer Motion
* Lucide React
* existing API/service architecture

Use the existing stack.

DO NOT migrate the project to:

* vanilla HTML
* vanilla JavaScript
* Next.js
* another frontend framework
* another CSS framework
* another UI framework

unless the repository inspection proves that a specific migration is already required.

The Vantage specification requested a static HTML implementation only because it was a standalone landing-page reference.

For RRE, translate that visual language into the EXISTING React + TypeScript architecture.

---

# 3. FIRST ACTION — AUDIT BEFORE MODIFYING

Before changing any source file, inspect the complete repository.

Understand:

## Frontend

* src structure
* pages
* components
* layouts
* hooks
* contexts
* services
* API clients
* configuration
* assets
* CSS
* Tailwind configuration
* animations
* routing
* state management

## Backend

Understand the separation between frontend and backend.

Identify:

* backend directory
* routes
* controllers
* models
* services
* middleware
* authentication
* payment
* booking
* gallery
* users
* team
* services
* AI integration

## AI

Identify the AI service and determine:

* how the frontend communicates with it
* existing AI endpoints
* existing AI components
* existing response formats
* existing loading/error behavior

## Existing frontend routes

Inspect and preserve all existing routes.

The project currently contains functionality/pages around areas such as:

* Home
* About
* Photography
* Videography
* Audio Recording
* Music Production
* Live Streaming
* Portfolio
* Events
* Talent Hunt
* AI Hub
* Gallery
* Gallery View
* Booking
* Client Dashboard
* Client Onboarding
* Admin Login
* Admin Panel

Do not assume the exact implementation based only on this list.

Read the actual source code and treat the repository as the source of truth.

---

# 4. FILE CLASSIFICATION

Before modifying components, classify the project files into three categories.

## 🔴 PROTECTED

Files containing:

* backend logic
* database logic
* authentication logic
* authorization
* payment logic
* booking calculations
* AI processing
* API contracts
* security
* environment configuration
* secrets

Do not modify unless absolutely necessary.

## 🟡 MODIFY WITH CAUTION

Files containing:

* API hooks
* contexts
* state management
* API service wrappers
* authentication hooks
* business-aware components

Only change these when required for UI integration.

Preserve their behavior.

## 🟢 UI REDESIGN ZONE

Files/components containing primarily:

* JSX
* TSX presentation
* layout
* CSS
* Tailwind classes
* visual components
* animations
* page presentation

These are the primary redesign targets.

Do not assume a whole file is safe simply because it is located inside a `pages` or `components` folder.

Inspect the implementation first.

---

# 5. DO NOT BLINDLY DELETE THE CURRENT UI

The existing frontend already contains reusable components.

Inspect and reuse where appropriate:

* Navbar
* Hero
* Footer
* Services
* Portfolio
* Talent Hunt
* Testimonials
* AI Assistant
* AI Hub
* AI Features
* AI Photo Pay
* Event Management
* existing cards
* existing forms
* existing modals
* existing gallery components

Do not delete existing functionality simply to create visually cleaner components.

If a component contains useful business logic, separate the presentation from the logic instead of rewriting the logic.

---

# 6. DESIGN OBJECTIVE

Transform RRE into a premium cinematic digital experience.

The visual identity should communicate:

> CREATIVE ENTERTAINMENT + CINEMATIC PRODUCTION + TECHNOLOGY + AI

The interface should feel:

* expensive
* modern
* confident
* immersive
* minimal
* editorial
* cinematic
* highly intentional

Avoid:

* generic SaaS UI
* generic Bootstrap layouts
* generic dashboard templates
* excessive cards
* excessive rounded rectangles
* excessive gradients
* excessive animations
* childish colors
* purple startup aesthetics
* template-like layouts
* clutter

---

# 7. DESIGN PHILOSOPHY

Use:

## Large typography

Large editorial statements should establish hierarchy.

## Strong negative space

Do not fill every area.

## Cinematic media

Use existing real photography/video assets wherever available.

## Asymmetry

Not every section should be a centered card grid.

## Glass surfaces

Use glass strategically rather than everywhere.

## Motion

Motion should communicate hierarchy and interaction.

## Editorial layouts

Content should feel curated rather than dumped onto the page.

---

# 8. COLOR SYSTEM

Create centralized design tokens.

Primary background:

```
#000000
```

Supporting backgrounds:

```
#050708
#080C0E
#0D1113
#101719
```

Primary text:

```
#FFFFFF
```

Secondary text:

```
rgba(226,229,228,.84)
```

Muted text:

```
rgba(226,229,228,.60)
```

Very muted text:

```
rgba(226,229,228,.42)
```

Glass border:

```
rgba(255,255,255,.13)
```

Strong glass border:

```
rgba(255,255,255,.21)
```

White surface:

```
#FFFFFF
```

Dark surface text:

```
#101010
```

Use subtle RRE-appropriate accent colors only where existing brand assets require them.

Do not introduce random colors.

Do not introduce purple gradients.

---

# 9. TYPOGRAPHY SYSTEM

Create centralized typography roles.

## Display typography

For:

* hero headlines
* major page titles
* editorial statements
* section titles

Characteristics:

* medium/heavy visual presence
* tight letter spacing
* large scale
* editorial feel

## UI typography

For:

* navigation
* buttons
* labels
* forms
* metadata
* body text
* cards

Use the supplied Vantage typography direction as inspiration.

If the Reference Sans / Reference Display fonts are actually available in the project or can be legally included, use them.

Otherwise select the closest existing/project-compatible fonts rather than downloading arbitrary fonts.

DO NOT use Playfair Display.

Avoid default system-looking typography for major headlines.

---

# 10. TYPOGRAPHY BEHAVIOR

Large headings should use responsive sizing.

Use patterns such as:

```
clamp()
```

for major typography.

Headings should scale between:

* desktop
* laptop
* tablet
* mobile

Do not allow large headlines to overflow on mobile.

Use controlled line breaks where necessary.

---

# 11. GLOBAL GLASS SYSTEM

Create a reusable glass design system.

Base glass:

```css
border: 1px solid rgba(255,255,255,.13);

background:
  linear-gradient(
    145deg,
    rgba(24,22,20,.80),
    rgba(5,12,14,.86)
  );

box-shadow:
  0 2px 10px rgba(0,0,0,.44),
  0 0 0 3px rgba(255,255,255,.035) inset,
  0 0 0 1px rgba(0,0,0,.9);

backdrop-filter:
  blur(14px) saturate(108%);
```

Create reusable variants:

* GlassSubtle
* GlassDefault
* GlassStrong
* GlassFloating

Use glass for:

* navigation when appropriate
* demo/media cards
* floating controls
* AI assistant
* menus
* booking panels
* forms
* selected portfolio overlays
* modal dialogs

DO NOT make every component glass.

---

# 12. GLOBAL BUTTON SYSTEM

Create reusable buttons.

Variants:

* Primary
* Secondary
* Glass
* Ghost
* Icon
* Destructive

Primary:

* white background
* dark text
* subtle shadow
* clean radius
* subtle brightness hover

Glass:

* translucent
* subtle border
* backdrop blur

All buttons must support:

* hover
* focus-visible
* disabled
* loading
* optional icons

---

# 13. GLOBAL NAVIGATION

Redesign the existing Navbar.

Desktop direction:

```
RRE LOGO

WORK
SERVICES
TALENT
ABOUT

                     AI
                     BOOK NOW
```

Keep navigation minimal.

Use:

* transparent hero state
* subtle glass state when appropriate
* thin border
* white typography
* animated active indicator
* smooth transitions

Do not make the navbar consume too much screen space.

---

# 14. MOBILE NAVIGATION

Create a premium glass mobile menu.

Structure:

```
RRE LOGO                         MENU
```

When opened:

```
┌─────────────────────────────┐
│                             │
│ WORK                        │
│ SERVICES                    │
│ TALENT                      │
│ ABOUT                       │
│ PORTFOLIO                   │
│ BOOK NOW                    │
│ AI ASSISTANT                │
│                             │
└─────────────────────────────┘
```

Implement:

* aria-expanded
* keyboard support
* Escape
* outside click
* focus handling
* proper menu closing
* mobile scroll locking where required

---

# 15. GLOBAL PAGE TRANSITIONS

Use Framer Motion.

Pages should not feel like instant route replacement.

Create a subtle transition system.

Possible transitions:

* opacity
* clip reveal
* vertical reveal
* scale
* cinematic wipe

Keep transitions approximately within:

```
300ms – 800ms
```

Do not make navigation slow.

---

# 16. MOTION SYSTEM

Create reusable motion variants.

Examples:

* revealUp
* revealDown
* fade
* imageReveal
* textReveal
* stagger
* scaleIn
* pageTransition

Preferred easing:

```
cubic-bezier(.16,1,.3,1)
```

or:

```
cubic-bezier(.22,1,.36,1)
```

Favor:

```
transform
opacity
```

Avoid expensive layout animations whenever possible.

---

# 17. REDUCED MOTION

Respect:

```
prefers-reduced-motion: reduce
```

When enabled:

* remove large entrance animations
* minimize transforms
* make content immediately available
* keep interactions functional

---

# 18. HOMEPAGE — PRIMARY CINEMATIC EXPERIENCE

The homepage should be the most visually impressive page.

Use full-screen cinematic media where appropriate.

Preferred composition:

```
FULLSCREEN MEDIA

GLOBAL NAV

LARGE HERO STATEMENT

SUPPORTING COPY

PRIMARY CTA

GLASS FEATURE / REEL CARD
```

The composition should be inspired by the supplied Vantage page:

```
full-bleed cinematic background
+
left hero content
+
bottom/side CTA
+
floating glass media element
```

Adapt it to RRE.

Do not use Vantage's text.

Do not use Vantage's branding.

Use actual RRE content.

---

# 19. HOMEPAGE HERO

The hero should immediately communicate RRE's creative identity.

Possible direction:

```
STORIES
THAT LIVE
BEYOND
THE FRAME.
```

Use the company's actual positioning if stronger.

Include:

* hero statement
* short supporting text
* primary CTA
* secondary exploration action
* cinematic media
* optional reel/demo card

Do not overload the hero with every service.

---

# 20. HOMEPAGE SECTIONS

After the hero, selectively introduce:

## Creative Services

Photography
Videography
Music
Live Streaming

## Featured Work

Use real portfolio/gallery data.

## Talent Hunt

Introduce talent discovery.

## AI

Introduce actual AI capabilities.

## CTA

Book a project / work with RRE.

Do not create unnecessary marketing sections.

Use actual available content.

---

# 21. SERVICES PAGE

Create a cinematic services overview.

Instead of small repetitive cards, use large editorial sections.

Example:

```
01
PHOTOGRAPHY

STORIES
CAPTURED
WITH INTENTION.

EXPLORE →
```

Then:

```
02
VIDEOGRAPHY

EVERY FRAME
HAS A STORY.
```

And so on.

Use large imagery/video.

On hover:

* subtle media scale
* arrow movement
* text movement
* brightness change
* border highlight

---

# 22. PHOTOGRAPHY PAGE

Photography should be media-first.

Support existing categories such as:

* Wedding
* Fashion
* Maternity
* Portrait

and any additional categories actually present in the backend.

Use:

* editorial gallery
* asymmetric layout
* large images
* hover metadata
* smooth image reveal
* fullscreen lightbox
* keyboard navigation
* responsive mobile layout

Use real gallery API data.

Do not hardcode gallery content.

---

# 23. VIDEOGRAPHY PAGE

Make video the primary experience.

Show actual projects.

Use:

* cinematic thumbnails
* play controls
* project titles
* categories
* descriptions
* fullscreen viewing
* case-study presentation where data exists

Do not autoplay multiple videos.

Use lazy loading.

Use poster images.

---

# 24. AUDIO RECORDING PAGE

Create a premium recording-studio aesthetic.

Highlight existing capabilities such as:

* recording
* studio setup
* equipment
* production
* sound engineering

Use real data/assets.

Do not invent equipment specifications.

---

# 25. MUSIC PRODUCTION PAGE

Create a dark studio-inspired visual language.

Show actual services:

* arrangement
* beat production
* instrumentation
* live instruments
* sound design
* mixing
* mastering

If real audio previews exist, create an elegant audio player.

Use subtle waveform animation only where actual audio is available.

Do not create fake audio controls that do nothing.

---

# 26. LIVE STREAMING PAGE

Present live-streaming capabilities in a premium production style.

Use actual available features such as:

* HD streaming
* multi-camera production
* low latency
* worldwide audience support
* backup connectivity
* event landing pages
* recording

Do not claim capabilities that are not implemented.

---

# 27. PORTFOLIO

Create an immersive portfolio experience.

Use:

* large media
* category filters
* project cards
* editorial grids
* hover interactions
* fullscreen previews
* case studies

Portfolio should feel like a creative studio's work archive, not a standard product grid.

---

# 28. GALLERY

Redesign the existing gallery system while preserving its API and functionality.

Use:

* responsive masonry/editorial grid
* filters
* categories
* image/video previews
* fullscreen lightbox
* loading skeletons
* empty states
* error states

Preserve dynamic gallery data.

---

# 29. GALLERY VIEW / LIGHTBOX

Make fullscreen viewing premium.

Support:

* close
* next
* previous
* keyboard navigation
* mobile gestures if already supported
* metadata where available

Lock background scrolling while open.

Restore scrolling when closed.

---

# 30. TALENT HUNT

Treat Talent Hunt as a major RRE product.

Supported categories:

* Singer
* Actor
* Dancer

Create a premium three-step visual experience:

```
01 CATEGORY

02 INFORMATION

03 AUDITION
```

Use:

* progress indicator
* large typography
* glass form
* step transitions
* validation
* loading states
* success states
* error states

Do not modify the underlying talent registration logic.

---

# 31. AI AUDITION EXPERIENCE

If the existing AI system provides:

* pitch analysis
* expression analysis
* confidence analysis
* scoring
* shortlisting

create a premium results interface.

Example:

```
AI AUDITION ANALYSIS

PITCH
94%

EXPRESSION
89%

CONFIDENCE
91%

OVERALL
92%
```

Use actual backend values.

Never fabricate AI scores.

---

# 32. AI ASSISTANT

The existing AI Assistant should become a global premium experience.

Use a floating entry point:

```
✦ AI ASSISTANT
```

or:

```
✦ ASK RRE
```

Opening it should reveal a glass interface.

Example:

```
┌──────────────────────────────┐
│ RRE AI                   ×  │
│                              │
│ How can I help you?          │
│                              │
│ Services                     │
│ Booking                      │
│ Pricing                      │
│ Location                     │
│ Talent Hunt                  │
│                              │
│ ┌──────────────────────────┐ │
│ │ Ask something...       → │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

Continue using the EXISTING AI integration.

Do not replace it.

Do not create a second backend.

Support existing Hindi/English behavior where available.

Show:

* typing state
* error state
* retry
* message history if supported
* smooth transitions

---

# 33. AI HUB

Redesign the AI Hub as an actual part of RRE's technology identity.

Use:

* cinematic typography
* glass panels
* AI feature cards
* subtle motion
* real AI capabilities

Only display features that actually exist.

---

# 34. EVENTS

Redesign Events using the same visual language.

Use:

* event imagery
* event cards
* event details
* date
* location
* CTA

If event data comes from an API, preserve it.

---

# 35. BOOKING

Booking is a business-critical area.

DO NOT change booking logic.

Only redesign the interface.

Use a clear multi-step visual experience where supported:

```
01 SERVICE
02 DATE
03 DETAILS
04 REVIEW
05 PAYMENT
```

Preserve:

* validation
* customer data
* selected service
* availability
* pricing
* booking IDs
* API calls
* confirmation
* error handling

---

# 36. PAYMENT

Payment UI must prioritize trust.

Use:

```
BOOKING SUMMARY

SERVICE
DATE
PACKAGE
CUSTOMER

TOTAL

PAY SECURELY →
```

Include:

* processing state
* success state
* failure state
* retry
* clear confirmation

Do not modify payment processing.

Do not expose payment secrets.

Do not fake payment completion.

---

# 37. CLIENT ONBOARDING

Make onboarding feel premium but straightforward.

Use:

* progress
* clean forms
* large typography
* subtle glass surfaces
* clear validation
* animated transitions

Do not sacrifice usability for visual effects.

---

# 38. CLIENT DASHBOARD

The client dashboard should use the RRE visual identity but prioritize functionality.

Use:

* dark professional interface
* glass panels selectively
* booking overview
* gallery access
* account information
* status
* relevant actions

Do not make it unnecessarily cinematic.

Dashboard = functional premium UI.

---

# 39. USER AUTHENTICATION

Redesign:

* login
* registration
* authentication states
* profile/account pages

Preserve:

* authentication logic
* OAuth
* JWT/session
* validation
* backend calls

Do not rewrite authentication just for UI.

---

# 40. TEAM PAGE

Create an editorial team presentation.

Use actual team data.

Example:

```
THE PEOPLE
BEHIND THE WORK.

TEAM MEMBER
ROLE
```

Use:

* portrait images
* role
* subtle hover
* image reveal
* editorial layout

Do not hardcode team members if dynamic data already exists.

---

# 41. ADMIN LOGIN

Create a visually consistent but simple admin login.

Do not over-animate.

Prioritize:

* security perception
* clear form
* errors
* loading
* accessibility

---

# 42. ADMIN PANEL

Do NOT make the admin panel identical to the public cinematic website.

Use the same design system:

* black
* charcoal
* glass where appropriate
* typography
* borders

But prioritize:

* tables
* search
* filters
* forms
* CRUD
* readability
* productivity

Admin interface should feel like:

```
PREMIUM DARK MANAGEMENT SYSTEM
```

not a cinematic marketing page.

---

# 43. RESPONSIVE DESIGN

The complete website must work across:

```
1440px
1280px
1024px
768px
430px
390px
360px
```

Check:

* navbar
* hero
* typography
* gallery
* forms
* cards
* video
* booking
* AI
* talent registration
* dashboard
* admin

Do not simply shrink desktop layouts.

Create proper mobile compositions.

---

# 44. MOBILE DESIGN PRINCIPLE

Mobile should feel intentionally designed.

Do not:

* squeeze desktop layouts
* overflow text
* create tiny buttons
* stack huge cards unnecessarily
* allow horizontal scrolling

Hero media should be optimized.

Navigation should be simple.

Forms should be easy to use with one hand.

Touch targets should be appropriately sized.

---

# 45. MEDIA SYSTEM

Create reusable media components where beneficial:

* CinematicImage
* VideoBackground
* VideoCard
* MediaReveal
* PlayButton
* Lightbox
* MediaSkeleton

Support:

* lazy loading
* responsive images
* object-fit
* poster images
* loading states
* fallback states
* graceful errors

Do not load every large asset on initial page load.

---

# 46. PERFORMANCE

The redesign must remain production-ready.

Optimize:

* images
* videos
* route loading
* components
* animations
* unnecessary renders
* large DOM trees

Use lazy loading where appropriate.

Prefer transform/opacity animations.

Avoid unnecessary heavy effects.

Use backdrop-filter selectively because it can be expensive.

---

# 47. ACCESSIBILITY

Maintain professional accessibility.

Implement:

* semantic HTML
* keyboard navigation
* focus-visible
* ARIA where appropriate
* proper labels
* accessible dialogs
* accessible menus
* accessible buttons
* image alt text
* reduced motion
* sufficient contrast

Never make an interaction dependent solely on hover.

---

# 48. LOADING STATES

Replace generic loading text with intentional loading experiences.

Use:

* skeleton galleries
* skeleton cards
* skeleton dashboard sections
* AI typing state
* booking processing
* payment processing
* image loading

Loading UI must use the RRE design system.

---

# 49. ERROR STATES

Every major API-driven feature should have:

* understandable error
* retry
* graceful fallback

Do not show raw stack traces.

Do not expose backend internals.

---

# 50. EMPTY STATES

Create consistent empty states.

Example:

```
NOTHING HERE YET

New work is coming soon.
```

Only use appropriate messaging for the actual feature.

---

# 51. NO FAKE FUNCTIONALITY

ABSOLUTE RULE:

Never create UI that falsely implies functionality exists.

Do not fabricate:

* booking availability
* AI results
* payment status
* streaming status
* portfolio data
* team data
* talent scores
* user records

If the backend provides it, display it.

If the backend does not provide it, design the UI without pretending it works.

---

# 52. API PRESERVATION

Before modifying a component that communicates with an API:

1. identify the existing API call
2. identify request format
3. identify response format
4. identify loading behavior
5. identify error behavior
6. preserve all of the above

The redesign should consume existing APIs.

Do not rename routes.

Do not create duplicate endpoints.

Do not replace real APIs with static data.

---

# 53. ROUTE PRESERVATION

Preserve all currently working routes.

Do not unnecessarily rename routes.

Do not break direct navigation.

Do not break bookmarked URLs.

If a route genuinely needs to change:

* add a redirect
* preserve backward compatibility

---

# 54. STATE PRESERVATION

Preserve existing:

* authentication state
* user state
* booking state
* gallery state
* AI state
* admin state
* service state
* team state

Do not introduce a new state management library unless necessary.

---

# 55. DEPENDENCY RULE

Before adding a dependency:

1. determine whether the existing stack can already solve the problem
2. check whether the dependency is necessary
3. avoid unnecessary package growth

Do not remove an existing dependency without confirming it is unused.

---

# 56. CSS / TAILWIND MIGRATION

The existing project already has styling.

Do not simply delete the current stylesheet.

First audit:

* existing classes
* reusable patterns
* variables
* animations
* media queries
* duplicate styles

Then gradually migrate toward the new design system.

Remove obsolete styles only after verifying they are unused.

---

# 57. DESIGN TOKENS

Create centralized tokens for:

## Colors

* background
* surface
* glass
* text
* muted
* border
* accent

## Spacing

* xs
* sm
* md
* lg
* xl
* 2xl
* section

## Radius

* small
* medium
* large

## Motion

* fast
* normal
* slow

## Typography

* display
* heading
* body
* label
* caption

The exact implementation should follow the project's existing Tailwind architecture where practical.

---

# 58. COMPONENT ARCHITECTURE

Create reusable UI components only where they genuinely improve consistency.

Possible structure:

```
components/
    layout/
        Navbar
        Footer
        PageTransition

    ui/
        Button
        GlassCard
        Badge
        Modal
        Input
        Select
        Tabs

    media/
        CinematicImage
        VideoCard
        VideoBackground
        Lightbox
        PlayButton

    motion/
        Reveal
        Stagger
        TextReveal

    ai/
        AIAssistant
        ChatMessage
        ChatInput

    booking/
        BookingStepper
        BookingSummary

    talent/
        TalentStep
        AuditionResult
```

Do not create abstractions for components used only once unless there is a clear benefit.

---

# 59. PAGE-SPECIFIC DESIGN LANGUAGE

Do not make every page identical.

Use a common RRE design language but different visual compositions.

## Home

Cinematic and immersive.

## Photography

Editorial gallery.

## Videography

Film-first.

## Music

Studio/audio-first.

## Live Streaming

Production/control-room inspired.

## Talent Hunt

Human + AI + audition.

## Portfolio

Creative archive.

## AI

Technology-forward.

## Booking

Simple and trustworthy.

## Client Dashboard

Functional premium.

## Admin

Professional dark management UI.

---

# 60. SCROLLING RULE

The original Vantage landing page uses a no-scroll full-screen composition.

DO NOT apply that behavior to the entire RRE website.

Only the homepage hero may use a full-screen composition.

Other pages should scroll naturally.

Never globally set:

```
html, body {
    overflow: hidden;
}
```

Use scroll locking only for:

* modal
* mobile menu
* lightbox
* fullscreen media
* temporary interactive states

---

# 61. HOMEPAGE MEDIA

Use actual RRE assets wherever available.

If an existing hero video exists:

* use it
* optimize it
* provide poster/fallback
* lazy-load where appropriate

If no suitable video exists:

use a high-quality existing image or carefully designed dark media composition.

Do not introduce random stock media merely to fill space.

---

# 62. IMAGE AND VIDEO TREATMENT

Media should feel cinematic.

Use:

* subtle brightness adjustments
* subtle contrast
* dark overlays
* gradients
* vignettes

Do not heavily filter every image.

Do not make the actual content unrecognizable.

---

# 63. HOVER INTERACTIONS

Use subtle interactions such as:

* brightness
* scale 1.01–1.03
* arrow movement
* border highlight
* image reveal
* text shift

Do not use exaggerated:

* bounce
* rotation
* spinning
* flashing
* neon effects

---

# 64. CURSOR EFFECTS

Optional on desktop.

If implemented:

* keep subtle
* disable on touch
* don't interfere with accessibility
* don't make buttons difficult to click

A custom cursor should enhance the experience, not become the experience.

---

# 65. VISUAL HIERARCHY

Every page should answer these questions immediately:

1. Where am I?
2. What does RRE offer here?
3. What should I look at?
4. What can I do next?

Do not prioritize visual effects over navigation.

---

# 66. CONTENT RULE

Preserve existing real content.

Do not rewrite company claims unnecessarily.

Do not invent:

* statistics
* awards
* client counts
* revenue
* testimonials
* production numbers
* fake projects
* fake team members

If content is missing, build the visual structure around the actual available data.

---

# 67. DEVELOPMENT PROCESS

Work in the following order.

---

## PHASE 1 — AUDIT

Do not make major visual changes yet.

Inspect:

* repository
* frontend
* backend
* AI service
* routes
* components
* APIs
* CSS
* assets

Create an internal migration map.

---

## PHASE 2 — DESIGN FOUNDATION

Implement:

* colors
* typography
* spacing
* glass
* buttons
* inputs
* motion
* responsive tokens

Do not change business logic.

---

## PHASE 3 — GLOBAL SHELL

Redesign:

* Navbar
* mobile menu
* global layout
* Footer
* page transitions
* global AI assistant

Verify routing after completion.

---

## PHASE 4 — HOMEPAGE

Implement the cinematic RRE landing experience.

Verify:

* hero
* video/image
* navigation
* CTA
* animation
* responsiveness

---

## PHASE 5 — SERVICES

Redesign:

* Services
* Photography
* Videography
* Audio Recording
* Music Production
* Live Streaming

Verify API/data integration.

---

## PHASE 6 — PORTFOLIO/GALLERY

Redesign:

* Portfolio
* Gallery
* Gallery View
* lightbox
* filtering

Verify media functionality.

---

## PHASE 7 — TALENT

Redesign:

* Talent Hunt
* registration
* audition
* AI analysis
* results

Verify actual backend functionality.

---

## PHASE 8 — AI

Redesign:

* AI Hub
* AI Assistant
* AI Features
* AI Photo Pay

Verify AI requests and responses.

---

## PHASE 9 — BOOKING/PAYMENT

Redesign:

* Client Onboarding
* Booking
* Booking summary
* Payment
* confirmation

Verify every business-critical flow.

---

## PHASE 10 — CLIENT EXPERIENCE

Redesign:

* Login
* Registration
* Client Dashboard
* Profile
* Booking history
* Gallery access

Verify authentication.

---

## PHASE 11 — ADMIN

Redesign:

* Admin Login
* Admin Panel

Preserve all CRUD functionality.

---

## PHASE 12 — RESPONSIVE

Test:

* desktop
* laptop
* tablet
* mobile

Fix layout problems.

---

## PHASE 13 — PERFORMANCE

Optimize:

* media
* animations
* loading
* code splitting
* unnecessary renders

---

## PHASE 14 — FINAL QA

Run the complete application.

Verify:

* routes
* authentication
* APIs
* booking
* payment
* AI
* talent
* gallery
* portfolio
* team
* users
* admin
* responsive behavior
* accessibility
* console errors

---

# 68. VERIFICATION AFTER EACH PHASE

After every major phase:

1. run the frontend
2. inspect console
3. inspect network requests
4. test relevant routes
5. test API communication
6. test forms
7. test authentication where applicable
8. check desktop
9. check mobile
10. fix regressions
11. only then continue

Do not stack multiple unverified changes.

---

# 69. GIT / CHANGE SAFETY

Before major modifications:

* inspect git status
* preserve existing changes
* do not discard user work
* do not force-reset the repository
* do not delete untracked files
* do not rewrite unrelated history

Make changes incrementally.

Keep the codebase recoverable.

---

# 70. IMPORTANT ANTI-REGRESSION RULE

If a visual redesign causes a business function to stop working:

STOP.

Do not workaround it by replacing the business logic.

Determine why the UI integration broke.

Restore the original functional behavior.

Then redesign the presentation around it.

---

# 71. DO NOT "IMPROVE" BACKEND WHILE REDESIGNING

This is a UI task.

Do not use this opportunity to:

* refactor backend
* rename models
* redesign APIs
* change database structure
* rewrite authentication
* rewrite payment
* rewrite AI
* migrate frameworks

unless a genuine blocking issue is discovered.

If such an issue is discovered:

document it separately rather than silently changing architecture.

---

# 72. FINAL VISUAL QUALITY STANDARD

The result should feel closer to:

```
PREMIUM CINEMATIC ENTERTAINMENT BRAND
```

than:

```
STANDARD BUSINESS WEBSITE
```

The visual hierarchy should be strong enough that a user immediately understands that RRE works across:

* photography
* videography
* music
* live events
* talent
* AI

But the website must remain usable as a real production application.

---

# 73. FINAL ACCEPTANCE CRITERIA

The redesign is considered successful only if ALL of the following are true:

## UI

* premium cinematic aesthetic
* consistent design system
* responsive
* polished typography
* intentional spacing
* coherent glass language
* high-quality media presentation
* smooth animations

## Frontend

* React remains functional
* TypeScript remains functional
* routing works
* components work
* state works
* forms work

## Backend

* backend remains untouched unless absolutely necessary
* APIs remain functional
* database remains intact

## Authentication

* login works
* registration works
* OAuth works if currently implemented
* sessions/JWT work

## Booking

* booking works
* service selection works
* data submission works
* confirmation works

## Payment

* payment flow works
* payment status works
* failure handling works

## AI

* AI Assistant works
* AI Hub works
* AI API integration remains functional
* AI talent analysis works where implemented

## Talent

* registration works
* categories work
* audition works
* AI analysis works where implemented

## Gallery

* gallery loads
* filters work
* media opens
* lightbox works

## Portfolio

* projects display
* categories work
* media works

## Admin

* admin login works
* admin functionality works
* CRUD operations work

## Responsive

* desktop works
* tablet works
* mobile works

## Accessibility

* keyboard navigation
* focus states
* labels
* ARIA where appropriate
* reduced motion

## Performance

* optimized media
* reasonable animation performance
* no unnecessary heavy effects
* no major console errors

---

# 74. FINAL INSTRUCTION TO THE AGENT

Do not interpret this task as:

> "Create a new RRE website."

Interpret it as:

> "Take the existing working RRE application and transform its frontend into a premium cinematic entertainment platform without disturbing the underlying application."

The backend is not the target.

The database is not the target.

The business logic is not the target.

The API contracts are not the target.

The UI/UX is the target.

Preserve functionality.

Improve presentation.

Use the existing architecture.

Use real existing data.

Use real existing assets.

Use React + TypeScript.

Use Tailwind where appropriate.

Use Framer Motion for motion.

Use Lucide for icons.

Build reusable design primitives.

Create a coherent RRE design system.

Make every public-facing page feel like it belongs to the same premium entertainment brand.

Do not stop after creating a visually impressive homepage.

The COMPLETE existing application must receive the UI transformation.

Work incrementally.

Verify after every major phase.

Do not break working functionality.

Do not fabricate functionality.

Do not modify protected backend/business logic unnecessarily.

The final product must be a REAL, FUNCTIONAL, PRODUCTION-READY RRE application with a completely transformed visual experience.
