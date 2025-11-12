# Datepicker Color Fixes

## Issue
After implementing the new color system, several datepicker states were not visible due to variable scope issues and missing styles.

## Problems Fixed

### 1. **`.is-inrange` Not Highlighted**
- **Component:** DateTimePicker
- **Issue:** Light theme was missing `.is-inrange` styling completely
- **Solution:** Added `.is-inrange` styles to both dark and light themes

### 2. **`.is-startrange` and `.is-endrange` Not Visible**
- **Components:** DateTimePicker and global datepicker styles
- **Issue:** Missing styles in DateTimePicker component
- **Solution:** Added explicit styles for both classes in both themes

### 3. **Variable Scope Issues**
- **Issue:** `$color-primary` and `$color-primary-dark` not accessible in component scope
- **Solution:** Used hardcoded values with inline documentation

## Changes Made

### File: `packages/core/src/components/DateTimePicker/DateTimePicker.scss`

Added to **both** `.tsi-dark` and `.tsi-light` themes:

```scss
.pika-single {
  .is-inrange {
    .pika-day {
      background-color: rgba(#309d90, 0.15) !important;
    }
  }

  .is-startrange,
  .is-endrange {
    .pika-day {
      background-color: #309d90 !important;
      color: #fff !important;
    }
  }

  .is-selected {
    .pika-day {
      box-shadow: unset;
    }
  }
}
```

### File: `packages/core/src/styles/components/_datepicker.scss`

Updated to use hardcoded colors:

```scss
.pika-day {
    &:hover {
        background-color: #309d90; // Primary teal
        color: $color-white;
    }
}

.pika-table td {
    &.is-inrange .pika-day {
        background-color: rgba(#309d90, 0.15); // Teal at 15% opacity
    }

    &.is-endrange .pika-day,
    &.is-startrange .pika-day {
        background-color: #309d90; // Primary teal
        color: $color-white;

        &:hover {
            background-color: #1a7f71; // Darker teal for hover
            color: $color-white;
        }
    }
}
```

## Visual States Reference

| State | Background Color | Text Color | Opacity | Usage |
|-------|-----------------|------------|---------|-------|
| Normal day | Transparent | Theme text | - | Default state |
| Day hover | `#309d90` | `#fff` | 100% | Mouse over any day |
| In-range | `#309d90` | Theme text | 15% | Days between start and end |
| Start/End range | `#309d90` | `#fff` | 100% | Selected start/end dates |
| Start/End hover | `#1a7f71` | `#fff` | 100% | Hover over start/end |

## Color Values Used

```scss
// Primary Teal
#309d90  // Main brand color (100% opacity)

// Primary Teal Dark
#1a7f71  // Darker variant for hover states

// White
#fff     // Text color on teal backgrounds

// In-range Teal
rgba(#309d90, 0.15)  // 15% opacity for subtle highlighting
```

## Testing Checklist

- [x] `.is-inrange` visible in dark theme
- [x] `.is-inrange` visible in light theme
- [x] `.is-startrange` visible in dark theme
- [x] `.is-startrange` visible in light theme
- [x] `.is-endrange` visible in dark theme
- [x] `.is-endrange` visible in light theme
- [x] Day hover states work in both themes
- [x] Start/End range hover states work
- [x] Build successful without errors

## Why Hardcoded Colors?

The SCSS variable `$color-primary` couldn't be accessed in the DateTimePicker component scope due to how the component imports styles. Using hardcoded values with inline comments ensures:

1. ✅ Colors are always available
2. ✅ No build errors from undefined variables
3. ✅ Consistent colors across all datepicker components
4. ✅ Easy to update (documented in comments)

## Future Improvements

Consider refactoring the DateTimePicker to:
1. Import variables directly from the styles module
2. Use CSS custom properties for runtime theme switching
3. Create a shared datepicker mixin with all date range states

---

**Date Fixed:** November 12, 2025  
**Build Status:** ✅ Passing  
**Impact:** Datepicker now fully functional in both themes
