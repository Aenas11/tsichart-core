# [Version] v1.2.1_27/02/2026_Architect

# Update: Remove 'Between' condition from backgroundBandCondition

## Enhancement


`backgroundBandCondition` now only supports:
- `condition: 'Greater Than' | 'Less Than'`
- `thresholdValue: number`
- For 'Greater Than', band covers y > thresholdValue.
- For 'Less Than', band covers y < thresholdValue.
- No 'Between' condition; to cover a range, use multiple bands or markers.

**Note:**
`thresholdValue` in `backgroundBandCondition` is equivalent to the value in `horizontalMarkers`. When using `horizontalMarkers`, the band boundaries are defined by marker values. For N markers, there are N-1 background bands, each spanning between adjacent marker values (plus chart min/max as boundaries).

**Example:**
```ts
swimLaneOptions: {
  0: {
    yAxisType: 'shared',
    showBackgroundBands: true,
    backgroundBandCondition: {
      condition: 'Greater Than',
      thresholdValue: 15,
      color: '#e0f7fa',
      opacity: 0.3
    }
  },
  1: {
    yAxisType: 'shared',
    showBackgroundBands: true,
    backgroundBandCondition: {
      condition: 'Less Than',
      thresholdValue: 5,
      color: '#ffe0b2',
      opacity: 0.3
    }
  }
}
```

**Interface Update:**
```ts
interface HorizontalMarker {
  value: number;
  color: string;
  condition: 'Greater Than' | 'Less Than';
  opacity?: number;
  label?: string;
}
interface BackgroundBandCondition {
  condition: 'Greater Than' | 'Less Than';
  thresholdValue: number;
  color: string;
  opacity?: number;
  label?: string;
}
interface swimLaneOption {
  yAxisType: YAxisStates;
  horizontalMarkers?: Array<HorizontalMarker>;
  showBackgroundBands?: boolean; // default false
  backgroundBands?: BackgroundBand[]; // optional, overrides auto bands
  backgroundBandCondition?: BackgroundBandCondition; // new
}
```

---

## Acceptance Criteria (Additions)
- Bands are rendered according to the new `condition` and `thresholdValue` shape.
- No 'Between' condition; range bands require explicit band definitions or marker logic.
- No regression to marker-based band logic.

---

## 1. Data Model & API

- **Background bands are now configured per swim lane** via the `swimLaneOption` object.
- **Bands are generated from `horizontalMarkers`** within each swim lane.
- **Enable/disable bands**: Add a boolean `showBackgroundBands` property to each `swimLaneOption`. Default: `false` (bands off).
- **No global `backgroundBands` or global toggle.** All configuration is per-lane.

**Example:**

### Visual Example

Below is a conceptual diagram of a line chart with horizontal background bands, separated by horizontal markers at y=10 and y=20:

```
Y ↑
  |         ┌───────────── Background Band 3 (e.g. y > 20, light blue) ─────────────┐
20|---------|---------------------------------------------------------------●-------|
  |         |                                                       .      /        |
  |         |                                                  .  /      ./         |
  |         |                                             .  /      .  /            |
  |         |                                        .  /      .  /                 |
10|---------|---------------- Background Band 2 (e.g. 10 < y < 20, yellow) ---------|
  |         |                              .      .  /                              |
  |         |                         .  /      .  /                                |
  |         |                    .  /      .  /                                     |
  |         |               .  /      .  /                                          |
  |         |          .  /      .  /                                               |
 0|---------|--- Background Band 1 (e.g. y < 10, teal) -----------------------------|
  |         |   .  /                                                                |
  |         |  /                                                                    |
  |         | /                                                                     |
  +---------+-----------------------------------------------------------------------→ X
           x0   x1   x2   x3   x4   x5   x6   x7   x8   x9

Legend:
- The horizontal dashed lines at y=10 and y=20 are horizontal markers.
- Each region between markers (or chart min/max) is filled with a different background color (band).
- The line (● and .) represents the time series data, always drawn above the background bands.
```
```ts
swimLaneOptions: {
  0: {
    yAxisType: 'shared',
    horizontalMarkers: [
      { value: 10, color: '#f44336', condition: 'Greater Than' },
      { value: 20, color: '#2196f3', condition: 'Greater Than' }
    ],
    showBackgroundBands: true // enables bands for this lane
  },
  1: {
    yAxisType: 'shared',
    horizontalMarkers: [],
    showBackgroundBands: false // default, bands off
  }
}
```



**Band Calculation:**
- If `showBackgroundBands` is `true` for a lane:
  - The number of background bands is one less than the number of horizontal markers (N markers → N-1 bands), except when there is only one marker: in that case, there should be one background band spanning from chart min to marker (or marker to chart max).
  - Each band spans from marker[i] to marker[i+1], for i = 0 to N-2 (where N is the number of markers). For a single marker, the band spans from chart min to marker (or marker to chart max).
  - The band boundaries are defined by marker values, which are equivalent to `thresholdValue` in `backgroundBandCondition`.
  - If only one marker is present, there is still one background band.
  - Colors: Use a palette or default, or derive from marker color if desired.
- If `showBackgroundBands` is `false` or missing: No bands rendered for that lane.

**Optional:**
- Allow a `backgroundBands` array in `swimLaneOption` for explicit band definitions (same as before).

---

## 2. Implementation Steps


### a. Extend swimLaneOption Interface

In `packages/core/src/components/LineChart/ILineChartOptions.ts`:
```ts
interface BackgroundBand {
  y0: number;
  y1: number;
  color: string;
  opacity?: number;
  label?: string;
}
interface BackgroundBandCondition {
  condition: 'Greater Than' | 'Less Than';
  thresholdValue: number;
  color: string;
  opacity?: number;
  label?: string;
}
interface swimLaneOption {
  yAxisType: YAxisStates;
  horizontalMarkers?: Array<HorizontalMarker>;
  showBackgroundBands?: boolean; // default false
  backgroundBands?: BackgroundBand[]; // optional, overrides auto bands
  backgroundBandCondition?: BackgroundBandCondition; // new
}
```


### b. Add Rendering Logic

In `LineChart.ts`, for each swim lane:
  - If `showBackgroundBands` is true:
    - If `backgroundBands` is present, use it.
    - Else, auto-calculate bands from `horizontalMarkers` and y-min/y-max.
    - Render bands in a dedicated SVG group below all chart elements for that lane.


### c. Storybook Example

- Add a story with multiple swim lanes, some with bands enabled, some without.

---


## 3. File List

- `packages/core/src/components/LineChart/ILineChartOptions.ts`
- `packages/core/src/components/LineChart/LineChart.ts`
- `packages/core/src/models/ChartOptions.ts`
- `packages/core/src/models/ChartComponentData.ts`
- `packages/core/src/models/LineChartData.ts`
- `packages/core/src/types/ChartData.ts`
- `stories/LineChart.stories.tsx` (optional, for demo)

---


## 4. Acceptance Criteria

- Bands are only rendered for swim lanes with `showBackgroundBands: true`.
- Bands update live as markers are added/removed/moved in that lane.
- Bands are always rendered behind all chart data and markers.
- Opacity and color can be customized per band.
- No regression to existing marker or line chart features.

---

**Builder agent:** Only modify the files listed above. Implement the logic as described.