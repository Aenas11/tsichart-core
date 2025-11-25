# HierarchyNavigation Search API

## Overview

The HierarchyNavigation component now supports **deep search** functionality that searches across the entire hierarchy tree, not just currently visible nodes. This is implemented using a server-side search approach for optimal performance with large hierarchies.

## Implementation Details

### Client-Side Changes

The component now has two distinct search modes:

1. **Navigation Mode** (default): Shows the hierarchical tree structure with expand/collapse functionality
2. **Search Mode**: Shows a flat list of search results with breadcrumb paths

When a user types in the search box:
- Input is debounced (250ms) to reduce API calls
- Queries less than 2 characters exit search mode and return to navigation
- Empty input clears search and returns to navigation view
- Valid search terms trigger `performDeepSearch()`

### Server-Side API Requirements

Your `searchFunction` prop must support the following enhanced payload:

```typescript
interface SearchPayload {
    path: string[];              // Current path context (e.g., ['Factory', 'Building A'])
    searchTerm?: string;         // Search query string
    recursive?: boolean;         // If true, search entire subtree
    includeInstances?: boolean;  // If true, include instance results
}
```

### Expected Response Format

The server should return results in this format:

```typescript
interface SearchResponse {
    hierarchyNodes: {
        hitCount: number;
        hits: Array<{
            name: string;
            id: string;
            path: string[];                  // Full path from root (e.g., ['Factory', 'Building A', 'Floor 1'])
            cumulativeInstanceCount: number;
            hierarchyNodes?: SearchResponse['hierarchyNodes']; // Nested children (optional)
        }>;
    };
    instances: {
        hitCount: number;
        hits: Array<{
            name: string;
            id: string;
            timeSeriesId: any;
            description: string;
            hierarchyPath: string[];         // Full path to parent hierarchy
            highlights?: {                   // Optional highlighted fields
                name?: string;
            };
        }>;
    };
    error?: any;  // Error object if search failed
}
```

## User Experience

### Search Results Display

When search is active, results are shown in a flat list with:

1. **Breadcrumb Path**: Shows the full hierarchy path to help users understand context
   - Example: `Factory > Building A > Floor 1`

2. **Highlighted Match**: The search term is highlighted in yellow (`<mark>` tags)
   - Example: **Temp**erature Sensor (when searching for "temp")

3. **Additional Context**:
   - For hierarchy nodes: Shows instance count (e.g., "42 instances")
   - For instances: Shows description if available

4. **Selection State**: Selected instances are visually indicated with:
   - Background color change
   - Left border accent
   - Maintained across search/navigation mode switches

### Keyboard Navigation

Search results support full keyboard navigation:
- `Tab` / `Shift+Tab`: Navigate between results
- `Enter` / `Space`: Select instance or navigate to hierarchy node
- Results maintain focus management for accessibility

### Interaction Behavior

**Clicking an Instance Result:**
- Toggles selection state
- Calls `onInstanceClick` callback with InstanceNode object
- Visual feedback with selection styling

**Clicking a Hierarchy Node Result:**
- Exits search mode
- Returns to navigation view at root level
- (Future enhancement: Could expand path to show the selected node)

## Migration Guide

### For Existing Implementations

If your current `searchFunction` only supports basic path-based navigation:

1. **Minimal Change** (falls back gracefully):
   ```typescript
   searchFunction: async (payload) => {
       // If searchTerm is present but you don't support it,
       // just return results for the path
       return await fetchHierarchyLevel(payload.path);
   }
   ```

2. **Full Implementation** (enables deep search):
   ```typescript
   searchFunction: async (payload) => {
       if (payload.searchTerm && payload.recursive) {
           // Perform server-side search across entire tree
           return await searchHierarchy({
               path: payload.path,
               query: payload.searchTerm,
               recursive: true,
               includeInstances: payload.includeInstances
           });
       } else {
           // Standard navigation - return single level
           return await fetchHierarchyLevel(payload.path);
       }
   }
   ```

### Server-Side Implementation Tips

1. **Indexing**: Pre-index hierarchy names and instance metadata for fast full-text search
2. **Path Storage**: Store full path arrays with each node for efficient breadcrumb display
3. **Relevance Ranking**: Return most relevant results first (e.g., exact matches before partial)
4. **Pagination**: Consider limiting results to top 100-200 matches for performance
5. **Highlighting**: Optionally return pre-highlighted text in the `highlights` field

## Performance Considerations

### Client-Side
- **Debouncing**: 250ms delay prevents excessive API calls while typing
- **Request Cancellation**: Uses request IDs to ignore stale responses
- **DOM Efficiency**: Search results use D3 data binding for optimal rendering

### Server-Side
- Search should complete in < 1 second for good UX
- Consider caching frequently searched terms
- Use database indexes on name/path fields
- Implement query timeouts to prevent long-running searches

## Future Enhancements

Potential improvements for consideration:

1. **Progressive Path Navigation**: When clicking a hierarchy result, progressively expand nodes to reveal it
2. **Search History**: Remember recent searches
3. **Advanced Filters**: Filter by node type, instance count, etc.
4. **Fuzzy Search**: Tolerate typos in search terms
5. **Search Analytics**: Track popular searches to optimize indexing

## Example Usage

```typescript
const hierarchyNav = new HierarchyNavigation(targetElement);

await hierarchyNav.render(
    // Search function with deep search support
    async (payload) => {
        const response = await fetch('/api/hierarchy/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await response.json();
    },
    // Options
    {
        theme: 'light',
        onInstanceClick: (instance) => {
            console.log('Selected:', instance);
        }
    },
    // Pre-selected IDs
    []
);
```
