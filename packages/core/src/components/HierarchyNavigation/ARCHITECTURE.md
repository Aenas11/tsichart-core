# Deep Search Architecture

## Component Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    HierarchyNavigation                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │            Search Input (debounced 250ms)                │  │
│  └────────────────────┬────────────────────────────────────┘  │
│                       │                                         │
│                       ▼                                         │
│              Empty / < 2 chars?                                │
│                       │                                         │
│         ┌─────────────┴─────────────┐                          │
│         │ YES                        │ NO                       │
│         ▼                            ▼                          │
│  ┌─────────────┐           ┌──────────────────┐               │
│  │exitSearchMode│           │performDeepSearch │               │
│  └──────┬──────┘           └────────┬─────────┘               │
│         │                            │                          │
│         │                            ▼                          │
│         │                   ┌─────────────────┐                │
│         │                   │ searchFunction  │                │
│         │                   │  (Server API)   │                │
│         │                   └────────┬────────┘                │
│         │                            │                          │
│         │                            ▼                          │
│         │                   Request Cancellation                │
│         │                   (latestRequestId)                  │
│         │                            │                          │
│         ▼                            ▼                          │
│  ┌──────────────────┐      ┌──────────────────┐               │
│  │ Navigation View  │      │renderSearchResults│               │
│  │  (Tree Mode)     │      │  (Flat List)      │               │
│  └──────────────────┘      └──────────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## State Machine

```
                    ┌──────────────────┐
                    │  NAVIGATION MODE │
                    │   (Tree View)    │
                    └────────┬─────────┘
                             │
                  User types search term
                    (≥ 2 characters)
                             │
                             ▼
                    ┌──────────────────┐
                    │   SEARCH MODE    │
                    │  (Flat Results)  │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
       User clears input              User clicks result
              │                             │
              ▼                             ▼
     ┌──────────────────┐          ┌──────────────┐
     │  NAVIGATION MODE │          │   Instance:  │
     │   (Tree View)    │          │   Toggle     │
     └──────────────────┘          │   Selection  │
                                   │              │
                                   │  Hierarchy:  │
                                   │  Navigate to │
                                   │    Path      │
                                   └──────────────┘
```

## Data Flow

### Search Request

```typescript
┌─────────────────┐
│  User Input     │
│  "temperature"  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Debounced (250ms)          │
└────────┬────────────────────┘
         │
         ▼
┌───────────────────────────────────────┐
│  performDeepSearch()                  │
│  • Increment requestCounter           │
│  • Set isSearchMode = true            │
└────────┬──────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────┐
│  Call searchFunction() with:          │
│  {                                    │
│    path: ['current', 'path'],         │
│    searchTerm: "temperature",         │
│    recursive: true,                   │
│    includeInstances: true             │
│  }                                    │
└────────┬──────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────┐
│  Server Response                      │
│  {                                    │
│    hierarchyNodes: { hits: [...] },   │
│    instances: { hits: [...] }         │
│  }                                    │
└────────┬──────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────┐
│  Check if request is stale:           │
│  if (requestId !== latestRequestId)   │
│    return; // Ignore                  │
└────────┬──────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────┐
│  renderSearchResults()                │
│  • Flatten hierarchy & instances      │
│  • Add breadcrumb paths               │
│  • Highlight search terms             │
│  • Render with D3 data binding        │
└───────────────────────────────────────┘
```

### Search Result Structure

```
Search Results Container
├── Results Header ("5 results found")
└── Result Items (flat list)
    ├── Hierarchy Node Result
    │   ├── Breadcrumb: "Factory > Building A"
    │   ├── Name: "<mark>Temp</mark>erature Sensors"
    │   └── Count: "12 instances"
    │
    ├── Instance Result
    │   ├── Breadcrumb: "Factory > Building A > Floor 1"
    │   ├── Name: "<mark>Temp</mark> Sensor 01"
    │   └── Description: "Main corridor sensor"
    │
    └── Instance Result (selected)
        ├── Breadcrumb: "Factory > Building C"
        ├── Name: "<mark>Temp</mark>erature Control"
        ├── Description: "HVAC system"
        └── [Selected State Indicator]
```

## Request Cancellation Pattern

```
User types: "t" → "te" → "tem" → "temp"
              │     │      │       │
              ▼     ▼      ▼       ▼
Request IDs:  1     2      3       4
              │     │      │       │
              └─────┴──────┴───────┴─→ latestRequestId = 4
              
When responses arrive:
• Response 1: requestId (1) !== latestRequestId (4) → IGNORED
• Response 2: requestId (2) !== latestRequestId (4) → IGNORED  
• Response 3: requestId (3) !== latestRequestId (4) → IGNORED
• Response 4: requestId (4) === latestRequestId (4) → RENDERED
```

## CSS Class Hierarchy

```
.tsi-hierarchy-nav-wrapper
└── .tsi-hierarchy-or-list-wrapper
    └── .tsi-hierarchy
        ├── [NAVIGATION MODE]
        │   └── ul
        │       └── li.tsi-hierarchyItem
        │
        └── [SEARCH MODE]
            └── .tsi-search-results
                ├── .tsi-search-results-header
                └── .tsi-search-result-item
                    ├── .tsi-search-breadcrumb
                    ├── .tsi-search-result-name
                    │   └── mark (highlight)
                    └── .tsi-search-result-description
                    └── .tsi-search-result-count
```

## Keyboard Navigation

```
Search Results:
┌─────────────────────────────────────┐
│  Result 1  ← Tab/Shift+Tab          │
│  Result 2  ← (focus moves)          │
│  Result 3  ← Enter/Space activates  │
└─────────────────────────────────────┘

Each result:
• tabindex="0" (focusable)
• role="option" (screen readers)
• aria-label="[full path] > [name]"
• Enter/Space: click handler
```

## Performance Optimizations

### Client-Side
1. **Debouncing**: 250ms delay → max ~4 API calls/second
2. **Request Cancellation**: Only latest request processed
3. **D3 Data Binding**: Efficient DOM updates
4. **Event Delegation**: Single listener per container

### Server-Side (Recommended)
1. **Indexing**: Full-text search on name fields
2. **Caching**: LRU cache for common queries
3. **Query Limits**: Cap at 100-200 results
4. **Timeouts**: 1-second limit per query

## Error Handling

```
try {
  const results = await searchFunction(payload);
  
  if (requestId !== latestRequestId) {
    return; // Stale request
  }
  
  if (results.error) {
    throw results.error;
  }
  
  renderSearchResults(results, searchText);
  
} catch (err) {
  if (requestId !== latestRequestId) {
    return; // Stale request error
  }
  
  chartOptions.onError(
    "Search failed",
    "Unable to search hierarchy",
    err instanceof XMLHttpRequest ? err : null
  );
}
```

## Theme Support

Search results automatically inherit theme from parent:

```scss
.tsi-hierarchy-nav-wrapper {
  &.tsi-dark {
    // Dark theme colors applied to:
    // - search results background
    // - text colors
    // - borders
    // - hover states
  }
  
  &.tsi-light {
    // Light theme colors applied
  }
}
```

High contrast mode also supported via CSS custom properties.
