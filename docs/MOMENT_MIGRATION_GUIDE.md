# Moment.js to Luxon Migration Guide

## Overview
This guide outlines the migration from Moment.js (deprecated) to Luxon for the TSIClient library.

## Timeline
- **Phase 1 **: Setup and parallel implementation
- **Phase 2 **: Gradual migration of core utilities
- **Phase 3 **: Date picker replacement

## Installation

```bash
npm install luxon
npm install --save-dev @types/luxon
```

## Key Concept Differences

| Concept | Moment.js | Luxon |
|---------|-----------|-------|
| Object | Mutable | **Immutable** |
| Locale | Global + instance | Instance only |
| Timezone | moment-timezone plugin | Built-in |
| Formatting | String tokens | String tokens + Intl |
| Parsing | Flexible | Stricter |

## Common Migration Patterns

### 1. Creating Date Objects

```typescript
// BEFORE (Moment)
import moment from 'moment';
const now = moment();
const specific = moment('2023-01-01');
const fromMs = moment(1234567890);

// AFTER (Luxon)
import { DateTime } from 'luxon';
const now = DateTime.now();
const specific = DateTime.fromISO('2023-01-01');
const fromMs = DateTime.fromMillis(1234567890);
```

### 2. Formatting

```typescript
// BEFORE (Moment)
moment().format('YYYY-MM-DD HH:mm:ss');
moment().format('L LT'); // Locale-aware

// AFTER (Luxon)
DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss');
DateTime.now().toLocaleString(DateTime.DATETIME_SHORT); // Locale-aware
```

### 3. Timezone Handling

```typescript
// BEFORE (Moment + moment-timezone)
import moment from 'moment-timezone';
const ny = moment.tz('America/New_York');
const utc = moment.utc();
const offset = moment().utcOffset(-300); // offset in minutes

// AFTER (Luxon)
import { DateTime } from 'luxon';
const ny = DateTime.now().setZone('America/New_York');
const utc = DateTime.utc();
const offset = DateTime.now().setZone('UTC-5');
```

### 4. Date Arithmetic

```typescript
// BEFORE (Moment) - MUTABLE!
const m = moment();
m.add(1, 'day');  // Mutates m
m.subtract(2, 'hours');  // Mutates m

// AFTER (Luxon) - IMMUTABLE
const dt = DateTime.now();
const tomorrow = dt.plus({ days: 1 });  // Returns new object
const earlier = dt.minus({ hours: 2 }); // Returns new object
```

### 5. Locale Support

```typescript
// BEFORE (Moment)
moment.locale('fr');
moment().format('LLLL');

// AFTER (Luxon)
DateTime.now()
  .setLocale('fr')
  .toLocaleString(DateTime.DATETIME_HUGE);
```

### 6. Parsing User Input

```typescript
// BEFORE (Moment)
moment('2023-01-01', 'YYYY-MM-DD');
moment('01/01/2023', 'MM/DD/YYYY');

// AFTER (Luxon)
DateTime.fromFormat('2023-01-01', 'yyyy-MM-dd');
DateTime.fromFormat('01/01/2023', 'MM/dd/yyyy');
```

## Migration Checklist for TSIClient

### Utils.ts Functions to Migrate

- [ ] `timeFormat()` - Main formatting function
- [ ] `getOffsetMinutes()` - Timezone offset calculation
- [ ] `offsetFromUTC()` - UTC to timezone conversion
- [ ] `offsetToUTC()` - Timezone to UTC conversion
- [ ] `createTimezoneAbbreviation()` - Timezone abbreviation
- [ ] `timezoneAbbreviation()` - Get timezone abbr
- [ ] `parseTimezoneName()` - Parse timezone string
- [ ] `convertTimezoneToLabel()` - Display timezone label
- [ ] `parseUserInputDateTime()` - Parse user input
- [ ] `rangeTimeFormat()` - Format time ranges
- [ ] `adjustDateFromTimezoneOffset()` - Timezone adjustment

### Component Files to Update

#### High Priority
- [ ] `/packages/core/src/utils/Utils.ts` - Core utilities
- [ ] `/packages/core/src/components/DateTimePicker/DateTimePicker.ts`
- [ ] `/packages/core/src/components/SingleDateTimePicker/SingleDateTimePicker.ts`
- [ ] `/packages/core/src/components/DateTimeButtonSingle/DateTimeButtonSingle.ts`
- [ ] `/packages/core/src/components/TimezonePicker/TimezonePicker.ts`

#### Medium Priority
- [ ] `/packages/core/src/interfaces/ChartComponent.ts`
- [ ] `/packages/core/src/interfaces/TemporalXAxisComponent.ts`
- [ ] `/packages/core/src/models/ChartComponentData.ts`

#### Low Priority
- [ ] `/packages/core/src/components/AvailabilityChart/AvailabilityChart.ts`
- [ ] `/packages/core/src/components/Marker/Marker.ts`
- [ ] `/packages/core/src/components/ScatterPlot/ScatterPlot.ts`

## Pikaday Replacement Options

### Option 1: Flatpickr (Recommended)
**Pros:**
- No dependencies (no jQuery, no Moment)
- Lightweight (~15KB gzipped)
- Modern, actively maintained
- Extensive configuration options
- Built-in timezone plugin

**Installation:**
```bash
npm install flatpickr
```

**Basic Usage:**
```typescript
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

flatpickr('#datetime-input', {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  time_24hr: true
});
```

### Option 2: Tempus Dominus
**Pros:**
- Bootstrap 5 compatible
- Rich feature set
- No jQuery dependency (v6+)

**Cons:**
- Larger bundle size
- Requires Bootstrap

### Option 3: Litepicker
**Pros:**
- Very lightweight (~7KB)
- No dependencies
- Date ranges support

**Cons:**
- Less feature-rich
- Smaller community

## Testing Strategy

### Unit Tests
Create parallel test suite for Luxon utils:

```typescript
describe('LuxonUtils', () => {
  describe('timeFormat', () => {
    it('should format date with timezone', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      const result = LuxonUtils.timeFormat({
        offset: 'America/New_York',
        is24HourTime: true,
        locale: 'en-US'
      })(date);
      // Assert result
    });
  });
});
```

### Integration Tests
- Test timezone conversions end-to-end
- Verify date picker integrations
- Check locale-specific formatting

### Visual Regression Tests
- Ensure date pickers render correctly
- Verify timezone labels display properly

## Performance Considerations

### Bundle Size Comparison
- **Moment.js**: ~71KB (minified + gzipped)
- **Moment.js + moment-timezone**: ~99KB
- **Luxon**: ~29KB (minified + gzipped)

**Savings: ~70KB** (70% reduction!)

### Runtime Performance
- Luxon uses native `Intl` API (faster for formatting)
- Immutability prevents accidental bugs
- Better tree-shaking support

## Rollback Plan

1. Keep Moment.js as peer dependency during migration
2. Feature flag for Luxon/Moment toggle
3. Comprehensive test coverage before removing Moment
4. Document breaking changes for library consumers

## Breaking Changes for Consumers

### 1. Date Input/Output Format Changes
```typescript
// May need to update if consuming libraries expect Moment objects
// Before: Returns Moment object
getDate(): Moment

// After: Returns Luxon DateTime or JS Date
getDate(): DateTime | Date
```

### 2. Locale Loading
```typescript
// Before: Global locale setting
moment.locale('fr');

// After: Per-instance locale
DateTime.now().setLocale('fr');
```

### 3. Mutable vs Immutable
```typescript
// Before: Mutations work
const date = getDate();
date.add(1, 'day'); // Mutates in place

// After: Must reassign
let date = getDate();
date = date.plus({ days: 1 }); // Returns new object
```

## Resources

- [Luxon Documentation](https://moment.github.io/luxon/)
- [Luxon for Moment Users](https://moment.github.io/luxon/#/moment)
- [Why Luxon Exists](https://moment.github.io/luxon/#/why)
- [Flatpickr Documentation](https://flatpickr.js.org/)

## Post-Migration Benefits

✅ **70% smaller bundle size**
✅ **Immutable, safer date operations**
✅ **Better timezone support**
✅ **Future-proof (actively maintained)**
✅ **Better TypeScript support**
✅ **Modern browser API usage**

