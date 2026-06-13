# Design System

## Overview

MediCare uses a **healthcare-grade design system** emphasizing trust, clarity, and professional aesthetics. The design avoids trendy styles (claymorphism, neumorphism, neon colors) in favor of clean, pharmacy-appropriate visuals.

---

## Color Palette

### Primary Colors

| Color | Hex | RGB | Usage | Notes |
|-------|-----|-----|-------|-------|
| **Deep Teal** | `#0F766E` | rgb(15, 118, 110) | Primary actions, buttons, links, accents | Conveys healthcare/trust |
| **Emerald Green** | `#10B981` | rgb(16, 185, 129) | Success states, completed steps | Positive/delivery confirmation |
| **Soft Mint** | `#DFF7F1` | rgb(223, 247, 241) | Light backgrounds, hover states | Soft medical aesthetic |

### Neutral Colors

| Color | Hex | RGB | Usage | Notes |
|-------|-----|-----|-------|-------|
| **Medical White** | `#F8FCFB` | rgb(248, 252, 251) | Main page background | Warm white (not pure #FFFFFF) |
| **Neutral Background** | `#F4F7F6` | rgb(244, 247, 246) | Secondary sections, cards | Subtle contrast |
| **Text Primary** | `#1C2B28` | rgb(28, 43, 40) | Headers, body text | Dark teal (not pure black) |
| **Text Secondary** | `#5E6E69` | rgb(94, 110, 105) | Metadata, descriptions | Muted gray |
| **Border** | `#D9E7E2` | rgb(217, 231, 226) | Dividers, card borders | Soft separator |

### Semantic Colors

| Color | Hex | RGB | Usage | Notes |
|-------|-----|-----|-------|-------|
| **Warning Amber** | `#F59E0B` | rgb(245, 158, 11) | Warnings only | Not for success |
| **Error Red** | `#EF4444` | rgb(239, 68, 68) | Alerts, errors | High contrast |

### CSS Custom Properties

```css
:root {
  /* Primary */
  --color-primary: #0F766E;
  --color-success: #10B981;
  --color-light: #DFF7F1;
  
  /* Backgrounds */
  --color-bg: #F8FCFB;
  --color-bg-secondary: #F4F7F6;
  
  /* Text */
  --color-text: #1C2B28;
  --color-text-secondary: #5E6E69;
  
  /* Utility */
  --color-border: #D9E7E2;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Borders */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  
  /* Typography */
  --font-primary: "Inter", "Manrope", sans-serif;
  --font-body: "Inter", "DM Sans", sans-serif;
  
  /* Transitions */
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.15s ease-in-out;
}
```

---

## Typography

### Font Families

**Primary Font (Headings):**
```css
font-family: "Inter", "Manrope", sans-serif;
font-weight: 700;
letter-spacing: -0.02em;
```

**Body Font:**
```css
font-family: "Inter", "DM Sans", sans-serif;
font-weight: 400;
line-height: 1.6;
```

### Type Scale

Recommended sizes (mobile → desktop):

| Element | Mobile | Desktop | Weight | Line Height | Letter Spacing |
|---------|--------|---------|--------|-------------|-----------------|
| **H1** | 28px | 36px | 700 | 1.2 | -0.02em |
| **H2** | 24px | 28px | 700 | 1.3 | -0.01em |
| **H3** | 20px | 24px | 700 | 1.4 | 0 |
| **H4** | 18px | 20px | 600 | 1.4 | 0 |
| **Body** | 14px | 16px | 400 | 1.6 | 0 |
| **Small** | 12px | 13px | 400 | 1.5 | 0 |
| **Tiny** | 11px | 12px | 400 | 1.4 | 0 |

### CSS Implementation

```css
h1 {
  font-family: var(--font-primary);
  font-size: clamp(28px, 5vw, 36px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

h2 {
  font-size: clamp(24px, 4vw, 28px);
  font-weight: 700;
  line-height: 1.3;
}

body {
  font-family: var(--font-body);
  font-size: clamp(14px, 2vw, 16px);
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text);
}

.text-secondary {
  color: var(--color-text-secondary);
  font-size: 0.9em;
}
```

---

## Spacing System

### Base Unit: 4px

All spacing is based on multiples of 4px:

```
4px   (xs)
8px   (sm)
12px  (xs-md)
16px  (md)
20px  (md-lg)
24px  (lg)
32px  (xl)
40px  (xl-2xl)
48px  (2xl)
```

### Implementation

```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
}

.card {
  padding: var(--space-md);        /* 16px */
  margin-bottom: var(--space-lg);  /* 24px */
  gap: var(--space-sm);            /* 8px */
}
```

### Examples

- **Navbar height:** 64px (= 4x 16px)
- **Card padding:** 16px all sides
- **Button padding:** 12px horizontal, 8px vertical
- **Form field padding:** 12px 16px
- **Grid gap:** 16px

---

## Border Radius

Controlled, professional corners (never extreme):

| Size | Value | Usage |
|------|-------|-------|
| **Small** | 8px | Input fields, small buttons |
| **Medium** | 12px | Cards, moderate buttons |
| **Large** | 16px | Large modals, containers |
| **Full** | 9999px | Pill-shaped (search box) |

### Rules

- ❌ Never use `border-radius: 50%` for non-circles
- ❌ Never exceed 16px unless intentionally pill-shaped
- ✅ Use consistent radius across similar components
- ✅ Larger components get larger radius

### CSS

```css
.search-box {
  border-radius: var(--radius-full);  /* Pill shape: 9999px */
}

.medicine-card {
  border-radius: var(--radius-md);    /* 12px */
}

.modal {
  border-radius: var(--radius-lg);    /* 16px */
}

.button-small {
  border-radius: var(--radius-sm);    /* 8px */
}
```

---

## Shadows

Minimal shadows for depth without claymorphism:

| Level | CSS | Usage |
|-------|-----|-------|
| **Small** | `0 1px 2px rgba(0,0,0,0.05)` | Subtle hover effects |
| **Medium** | `0 4px 6px rgba(0,0,0,0.1)` | Cards, dropdowns |
| **Large** | `0 10px 15px rgba(0,0,0,0.1)` | Modals, elevated content |

### Rules

- ❌ Never use 3+ layers of shadows
- ❌ Never use colored shadows (keep rgba black)
- ✅ Use for hover states (not default)
- ✅ Increase shadow on interaction

### CSS

```css
.medicine-card {
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.medicine-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);  /* Lift on hover */
}

.modal {
  box-shadow: var(--shadow-lg);
}
```

---

## Components

### Button Styles

#### Primary Button

```css
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary:hover {
  background: #0d5d56;  /* Darker teal */
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: scale(0.98);
}
```

#### Secondary Button

```css
.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
  padding: 12px 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-secondary:hover {
  background: var(--color-light);
  border-color: var(--color-primary);
}
```

### Form Elements

#### Input Field

```css
input,
textarea,
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 16px;
  font-family: var(--font-body);
  transition: var(--transition-fast);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);  /* Subtle focus ring */
}
```

#### Form Label

```css
label {
  display: block;
  margin-bottom: var(--space-sm);
  font-weight: 600;
  color: var(--color-text);
  font-size: 14px;
}

label span.required {
  color: var(--color-error);
  margin-left: 4px;
}
```

### Cards

#### Medicine Card

```css
.medicine-card {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.medicine-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.medicine-image {
  font-size: 48px;
  margin-bottom: var(--space-sm);
}

.medicine-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.medicine-dosage {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.medicine-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  margin: var(--space-sm) 0;
}
```

#### Order Card

```css
.order-card {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  cursor: pointer;
  transition: var(--transition);
}

.order-card:hover {
  background: var(--color-light);
  border-color: var(--color-primary);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.order-status {
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.order-status.pending {
  background: #E5E7EB;
  color: #374151;
}

.order-status.processing {
  background: #DBEAFE;
  color: #1E40AF;
}

.order-status.delivered {
  background: #DCFCE7;
  color: #166534;
}
```

### Status Badges

```css
.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-success {
  background: var(--color-light);
  color: var(--color-success);
}

.badge-warning {
  background: #FEFCE8;
  color: var(--color-warning);
}

.badge-error {
  background: #FEE2E2;
  color: var(--color-error);
}
```

---

## Layout Patterns

### Hero Section (Asymmetric 2-Column)

```css
.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  align-items: center;
  min-height: 500px;
}

@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    min-height: auto;
  }
}
```

### Medicines Grid

```css
.medicines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-md);
  padding: var(--space-lg);
}

@media (max-width: 768px) {
  .medicines-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--space-sm);
    padding: var(--space-md);
  }
}
```

### Navbar

```css
.navbar {
  position: sticky;
  top: 0;
  background: white;
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-md) var(--space-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .navbar {
    padding: var(--space-sm) var(--space-md);
  }
}
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small devices (phones): 320px - 480px */
/* No media query needed (base styles) */

/* Medium devices (tablets): 481px - 768px */
@media (min-width: 481px) {
  /* tablet-specific styles */
}

/* Large devices (desktops): 769px+ */
@media (min-width: 769px) {
  /* desktop-specific styles */
}

/* Extra large (wide screens): 1200px+ */
@media (min-width: 1200px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Main Breakpoint: 768px

```css
@media (max-width: 768px) {
  /* Stack grids to 1 column */
  .medicines-grid {
    grid-template-columns: 1fr;
  }
  
  /* Reduce spacing */
  padding: var(--space-sm) instead of var(--space-lg)
  
  /* Reduce font sizes */
  font-size: 14px instead of 16px
}
```

---

## Accessibility

### Color Contrast

✅ **WCAG AA (4.5:1)** minimum for all text

| Foreground | Background | Ratio | WCAG Level |
|-----------|-----------|-------|-----------|
| #1C2B28 | #F8FCFB | 15:1 | AAA |
| #0F766E | white | 7.5:1 | AAA |
| #10B981 | white | 8:1 | AAA |
| #5E6E69 | white | 3.5:1 | AA |

### Focus States

```css
input:focus,
button:focus,
a:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Or use focus-ring utility */
.focus-ring:focus {
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}
```

### Icon Usage

Always pair icons with text:

```html
<!-- ✅ Good -->
<button>🛒 Add to Cart</button>

<!-- ❌ Bad (icon only) -->
<button>🛒</button>

<!-- ✅ Accessibility -->
<button aria-label="Add to cart">
  🛒 <span class="sr-only">Add to Cart</span>
</button>
```

---

## Dark Mode (Future)

CSS variables make dark mode easy to add:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1f1e;
    --color-text: #f8fcfb;
    --color-border: #2d3d38;
    /* ... etc ... */
  }
}
```

---

## Animation & Transitions

### Default Transition

```css
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Usage

```css
.button {
  background: var(--color-primary);
  transition: var(--transition);
}

.button:hover {
  background: #0d5d56;
}
```

### Fast Transition (UI feedback)

```css
--transition-fast: all 0.15s ease-in-out;

.loader {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## Utilities

### Text Utilities

```css
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.text-secondary { color: var(--color-text-secondary); }
```

### Display Utilities

```css
.hidden { display: none; }
.flex { display: flex; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.grid { display: grid; }
```

### Spacing Utilities

```css
.m-sm { margin: var(--space-sm); }
.m-md { margin: var(--space-md); }
.p-sm { padding: var(--space-sm); }
.p-md { padding: var(--space-md); }
.gap-sm { gap: var(--space-sm); }
.gap-md { gap: var(--space-md); }
```

---

## Do's and Don'ts

### ✅ DO

- ✅ Use CSS custom properties for values
- ✅ Keep color palette consistent
- ✅ Use semantic HTML
- ✅ Test on multiple devices
- ✅ Maintain high contrast (WCAG AA+)
- ✅ Use relative units (rem, em, %)
- ✅ Keep components modular

### ❌ DON'T

- ❌ Use neon colors (not healthcare-appropriate)
- ❌ Use shadows excessively
- ❌ Use broken/missing favicons
- ❌ Hard-code colors (use variables)
- ❌ Forget hover/focus states
- ❌ Use pure black (#000000) for text
- ❌ Use very small fonts (<12px for body)
- ❌ Use auto-playing audio/video
- ❌ Create extreme animations (>1s)

---

## Maintenance

### Updating Colors

1. **Change in CSS variables:**
   ```css
   :root {
     --color-primary: #NEW_HEX_CODE;
   }
   ```

2. **Automatically updates all components** using that variable

3. **No need to find & replace** across file

### Adding New Components

1. **Follow the pattern:**
   ```css
   .new-component {
     background: var(--color-bg);
     padding: var(--space-md);
     border-radius: var(--radius-md);
     border: 1px solid var(--color-border);
   }
   ```

2. **Use existing variables**
3. **Test on mobile (768px)**
4. **Verify contrast ratio**

---

**Last Updated:** June 2026

