# SageSocial Design System

## Overview
A comprehensive design system for the SageSocial Instagram Analytics platform, featuring a dark-first aesthetic with purple and blue gradients, modern glass-morphism effects, and a complete component library.

## 🎨 Color Palette

### Primary Brand Colors
```css
/* SageSocial Brand Colors */
--sage-purple: 263 70% 50%;    /* #7C3AED */
--sage-blue: 217 91% 60%;      /* #3B82F6 */
--sage-violet: 258 90% 66%;    /* #8B5CF6 */
--sage-cyan: 199 89% 48%;      /* #06B6D4 */
```

### Core Semantic Colors (Dark Theme)
```css
/* Background & Foreground */
--background: 240 10% 3.9%;        /* Deep dark blue-gray */
--foreground: 0 0% 98%;            /* Near white */

/* Cards & Surfaces */
--card: 240 10% 3.9%;              /* Same as background */
--card-foreground: 0 0% 98%;       /* Near white */

/* Primary Actions */
--primary: 263 70% 50%;            /* Sage purple */
--primary-foreground: 0 0% 98%;    /* Near white */
--primary-glow: 263 70% 65%;       /* Lighter purple for glow effects */

/* Secondary Elements */
--secondary: 240 3.7% 15.9%;       /* Dark gray */
--secondary-foreground: 0 0% 98%;  /* Near white */

/* Muted Content */
--muted: 240 3.7% 15.9%;           /* Dark gray */
--muted-foreground: 240 5% 64.9%;  /* Light gray */

/* Destructive Actions */
--destructive: 0 62.8% 30.6%;      /* Dark red */
--destructive-foreground: 0 0% 98%; /* Near white */

/* Borders & Inputs */
--border: 240 3.7% 15.9%;          /* Dark gray */
--input: 240 3.7% 15.9%;           /* Dark gray */
--ring: 263 70% 50%;               /* Sage purple for focus rings */
```

### Light Theme Override
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... additional light theme overrides */
}
```

## 📐 Spacing & Layout

### Container System
```css
.container {
  center: true;
  padding: 2rem;
  max-width: 1400px; /* 2xl breakpoint */
}
```

### Border Radius
```css
--radius: 0.5rem;           /* Base radius */
border-radius: {
  lg: var(--radius);        /* 8px */
  md: calc(var(--radius) - 2px); /* 6px */
  sm: calc(var(--radius) - 4px); /* 4px */
}
```

## 🎭 Visual Effects

### Gradients
```css
/* Primary brand gradient */
--gradient-primary: linear-gradient(135deg, hsl(263 70% 50%), hsl(217 91% 60%));

/* Secondary accent gradient */
--gradient-secondary: linear-gradient(135deg, hsl(258 90% 66%), hsl(199 89% 48%));

/* Subtle accent overlay */
--gradient-accent: linear-gradient(90deg, hsl(263 70% 50% / 0.1), hsl(217 91% 60% / 0.1));
```

### Shadows & Glows
```css
/* Purple glow effect for highlights */
--shadow-glow: 0 0 40px hsl(263 70% 50% / 0.3);

/* Soft depth shadow */
--shadow-soft: 0 10px 40px -10px hsl(0 0% 0% / 0.3);
```

### Transitions
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

## 🧩 Component System

### Button Variants
```tsx
// Primary button with gradient
className="bg-gradient-primary text-primary-foreground hover:opacity-90"

// Outline button
className="border border-input bg-background hover:bg-accent"

// Ghost button
className="hover:bg-accent hover:text-accent-foreground"

// Destructive button
className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
```

### Card Components
```tsx
// Glass-morphism card
className="bg-gradient-card border border-forest-700 backdrop-blur-glass shadow-glass rounded-xl"

// Standard card
className="rounded-lg border bg-card text-card-foreground shadow-sm"
```

### Input Styling
```tsx
// Form input with focus states
className="w-full p-4 bg-input border border-forest-700 text-foreground rounded-lg
           focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2
           transition-all duration-300"
```

## 🎨 Tailwind Configuration

### Extended Colors
```javascript
colors: {
  // Semantic colors
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  
  // Brand colors
  sage: {
    purple: 'hsl(var(--sage-purple))',
    blue: 'hsl(var(--sage-blue))',
    violet: 'hsl(var(--sage-violet))',
    cyan: 'hsl(var(--sage-cyan))'
  },
  
  // Sidebar specific
  sidebar: {
    DEFAULT: 'hsl(var(--sidebar-background))',
    foreground: 'hsl(var(--sidebar-foreground))',
    primary: 'hsl(var(--sidebar-primary))',
    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    accent: 'hsl(var(--sidebar-accent))',
    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    border: 'hsl(var(--sidebar-border))',
    ring: 'hsl(var(--sidebar-ring))'
  }
}
```

### Extended Background Images
```javascript
backgroundImage: {
  'gradient-primary': 'var(--gradient-primary)',
  'gradient-secondary': 'var(--gradient-secondary)',
  'gradient-accent': 'var(--gradient-accent)'
}
```

### Extended Shadows
```javascript
boxShadow: {
  'glow': 'var(--shadow-glow)',
  'soft': 'var(--shadow-soft)'
}
```

## 🔤 Typography Scale

### Font Weights
- `font-medium` - 500 (default for most text)
- `font-semibold` - 600 (headings, buttons)
- `font-bold` - 700 (emphasis)

### Text Sizes
- `text-xs` - 12px (small labels, captions)
- `text-sm` - 14px (body text, form inputs)
- `text-base` - 16px (default body)
- `text-lg` - 18px (large body text)
- `text-xl` - 20px (section headings)
- `text-2xl` - 24px (page headings)

## 🎯 Component Patterns

### Glass-morphism Card
```tsx
<div className="bg-gradient-card border border-forest-700 backdrop-blur-glass shadow-glass p-6 rounded-xl">
  <div className="space-y-6">
    {/* Card content */}
  </div>
</div>
```

### Gradient Button
```tsx
<button className="w-full p-4 bg-gradient-primary text-primary-foreground border-none rounded-lg 
                   text-sm font-semibold cursor-pointer hover:opacity-90 disabled:opacity-50 
                   transition-all duration-300 hover:scale-105 hover:shadow-elevated">
  Button Text
</button>
```

### Form Input
```tsx
<input className="w-full p-4 bg-input border border-forest-700 text-foreground rounded-lg 
                  text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 
                  focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-forest-950 
                  transition-all duration-300" />
```

### Error Message
```tsx
<div className="text-red-400 text-xs text-center p-3 bg-red-400/10 border 
                border-red-400/30 rounded-lg backdrop-blur-sm">
  Error message text
</div>
```

## 🎨 Special Effect Classes

### Custom Classes (defined in globals.css)
```css
/* Forest theme variants (used in forms) */
.border-forest-700 { /* Custom dark green border */ }
.bg-forest-500 { /* Custom green background */ }
.text-forest-400 { /* Custom green text */ }
.focus:ring-forest-500 { /* Custom green focus ring */ }

/* Glass-morphism effects */
.backdrop-blur-glass { backdrop-filter: blur(12px); }
.bg-gradient-card { /* Subtle gradient background for cards */ }
.shadow-glass { /* Soft glass-like shadow */ }
.shadow-elevated { /* Elevated hover shadow */ }
```

## 📱 Responsive Breakpoints

### Tailwind Breakpoints
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px (custom max-width: 1400px)

## 🎨 Usage Guidelines

### Do's
- Use the gradient backgrounds for primary actions and highlights
- Apply glass-morphism effects sparingly for premium feel
- Maintain consistent spacing using Tailwind's spacing scale
- Use semantic color tokens instead of hardcoded values
- Follow the established component patterns

### Don'ts
- Don't mix different design systems or conflicting color schemes
- Avoid overusing glow effects - they should highlight important elements
- Don't break the established typography hierarchy
- Avoid creating custom colors outside the established palette

## 🔧 Implementation

### CSS Variables Import
```css
@import '@tailwind/base';
@import '@tailwind/components'; 
@import '@tailwind/utilities';
```

### Dark Mode Configuration
```javascript
// tailwind.config.ts
darkMode: ["class"]
```

### Component Library
All UI components are located in `/src/components/ui/` and follow the established design patterns using class-variance-authority for consistent variants.

---

This design system provides a cohesive, modern aesthetic perfect for a premium Instagram analytics platform with dark themes, subtle gradients, and glass-morphism effects that create a sophisticated user experience.