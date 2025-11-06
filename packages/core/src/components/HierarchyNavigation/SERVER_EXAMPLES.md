# Server-Side Implementation Examples

## Example 1: Node.js + Express with In-Memory Data

```javascript
const express = require('express');
const app = express();

// Sample hierarchy data structure
const hierarchyData = {
  'Factory': {
    children: {
      'Building A': {
        children: {
          'Floor 1': {
            instances: [
              { id: 'ts1', name: 'Temperature Sensor 01', timeSeriesId: ['Factory', 'BA', 'F1', 'TS1'] },
              { id: 'ts2', name: 'Pressure Sensor 01', timeSeriesId: ['Factory', 'BA', 'F1', 'PS1'] }
            ]
          },
          'Floor 2': {
            instances: [
              { id: 'ts3', name: 'Temperature Sensor 02', timeSeriesId: ['Factory', 'BA', 'F2', 'TS2'] }
            ]
          }
        }
      },
      'Building B': {
        children: {
          'Floor 1': {
            instances: [
              { id: 'ts4', name: 'Temperature Control Unit', timeSeriesId: ['Factory', 'BB', 'F1', 'TCU1'] }
            ]
          }
        }
      }
    }
  }
};

app.post('/api/hierarchy/search', express.json(), (req, res) => {
  const { path, searchTerm, recursive, includeInstances } = req.body;

  // Navigation mode (no search term)
  if (!searchTerm) {
    const level = getHierarchyLevel(hierarchyData, path);
    return res.json(level);
  }

  // Search mode
  if (recursive && searchTerm) {
    const results = deepSearch(hierarchyData, searchTerm, path);
    return res.json(results);
  }

  res.status(400).json({ error: 'Invalid request' });
});

function getHierarchyLevel(data, path) {
  let current = data;
  
  // Navigate to the specified path
  for (const segment of path) {
    if (current[segment]?.children) {
      current = current[segment].children;
    } else if (current[segment]) {
      current = current[segment];
    }
  }

  // Return hierarchy nodes at this level
  const hierarchyNodes = [];
  const instances = [];

  for (const [name, node] of Object.entries(current)) {
    if (node.children) {
      const instanceCount = countInstancesRecursive(node);
      hierarchyNodes.push({
        name,
        id: name,
        path: [...path, name],
        cumulativeInstanceCount: instanceCount
      });
    } else if (node.instances) {
      instances.push(...node.instances.map(inst => ({
        ...inst,
        hierarchyPath: path
      })));
    }
  }

  return {
    hierarchyNodes: {
      hitCount: hierarchyNodes.length,
      hits: hierarchyNodes
    },
    instances: {
      hitCount: instances.length,
      hits: instances
    }
  };
}

function deepSearch(data, searchTerm, basePath = []) {
  const term = searchTerm.toLowerCase();
  const hierarchyResults = [];
  const instanceResults = [];

  function searchRecursive(node, currentPath) {
    for (const [name, value] of Object.entries(node)) {
      const nodePath = [...currentPath, name];

      // Check if hierarchy node name matches
      if (name.toLowerCase().includes(term)) {
        if (value.children) {
          hierarchyResults.push({
            name,
            id: name,
            path: nodePath,
            cumulativeInstanceCount: countInstancesRecursive(value)
          });
        }
      }

      // Search instances
      if (value.instances) {
        for (const instance of value.instances) {
          if (instance.name.toLowerCase().includes(term)) {
            instanceResults.push({
              ...instance,
              hierarchyPath: currentPath
            });
          }
        }
      }

      // Recurse into children
      if (value.children) {
        searchRecursive(value.children, nodePath);
      }
    }
  }

  searchRecursive(data, basePath);

  return {
    hierarchyNodes: {
      hitCount: hierarchyResults.length,
      hits: hierarchyResults
    },
    instances: {
      hitCount: instanceResults.length,
      hits: instanceResults
    }
  };
}

function countInstancesRecursive(node) {
  let count = 0;
  
  if (node.instances) {
    count += node.instances.length;
  }
  
  if (node.children) {
    for (const child of Object.values(node.children)) {
      count += countInstancesRecursive(child);
    }
  }
  
  return count;
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Example 2: SQL Database with PostgreSQL

```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Database schema:
// CREATE TABLE hierarchy_nodes (
//   id UUID PRIMARY KEY,
//   name TEXT NOT NULL,
//   path TEXT[] NOT NULL,  -- Array of path segments
//   parent_id UUID REFERENCES hierarchy_nodes(id),
//   instance_count INTEGER DEFAULT 0
// );
// CREATE INDEX idx_hierarchy_name ON hierarchy_nodes USING gin(to_tsvector('english', name));
// CREATE INDEX idx_hierarchy_path ON hierarchy_nodes USING gin(path);
//
// CREATE TABLE instances (
//   id UUID PRIMARY KEY,
//   name TEXT NOT NULL,
//   time_series_id JSONB NOT NULL,
//   hierarchy_path TEXT[] NOT NULL,
//   description TEXT,
//   parent_node_id UUID REFERENCES hierarchy_nodes(id)
// );
// CREATE INDEX idx_instance_name ON instances USING gin(to_tsvector('english', name));

app.post('/api/hierarchy/search', express.json(), async (req, res) => {
  const { path, searchTerm, recursive, includeInstances } = req.body;

  try {
    if (!searchTerm) {
      // Navigation mode - get single level
      const result = await getHierarchyLevel(path);
      return res.json(result);
    }

    if (recursive && searchTerm) {
      // Search mode - full-text search
      const result = await deepSearchDatabase(searchTerm, path, includeInstances);
      return res.json(result);
    }

    res.status(400).json({ error: 'Invalid request' });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function getHierarchyLevel(path) {
  const client = await pool.connect();
  
  try {
    // Get hierarchy nodes at this level
    const hierarchyQuery = `
      SELECT 
        id,
        name,
        path,
        instance_count as "cumulativeInstanceCount"
      FROM hierarchy_nodes
      WHERE path[1:array_length($1::text[], 1)] = $1::text[]
        AND array_length(path, 1) = array_length($1::text[], 1) + 1
      ORDER BY name
    `;
    
    const hierarchyResult = await client.query(hierarchyQuery, [path]);

    // Get instances at this level
    const instanceQuery = `
      SELECT 
        id,
        name,
        time_series_id as "timeSeriesId",
        hierarchy_path as "hierarchyPath",
        description
      FROM instances
      WHERE hierarchy_path = $1::text[]
      ORDER BY name
    `;
    
    const instanceResult = await client.query(instanceQuery, [path]);

    return {
      hierarchyNodes: {
        hitCount: hierarchyResult.rows.length,
        hits: hierarchyResult.rows
      },
      instances: {
        hitCount: instanceResult.rows.length,
        hits: instanceResult.rows
      }
    };
  } finally {
    client.release();
  }
}

async function deepSearchDatabase(searchTerm, basePath, includeInstances) {
  const client = await pool.connect();
  
  try {
    // Full-text search on hierarchy nodes
    const hierarchyQuery = `
      SELECT 
        id,
        name,
        path,
        instance_count as "cumulativeInstanceCount",
        ts_rank(to_tsvector('english', name), plainto_tsquery('english', $1)) as rank
      FROM hierarchy_nodes
      WHERE to_tsvector('english', name) @@ plainto_tsquery('english', $1)
        AND path[1:array_length($2::text[], 1)] = $2::text[]
      ORDER BY rank DESC, name
      LIMIT 100
    `;
    
    const hierarchyResult = await client.query(hierarchyQuery, [searchTerm, basePath]);

    let instanceResult = { rows: [] };
    
    if (includeInstances) {
      // Full-text search on instances
      const instanceQuery = `
        SELECT 
          id,
          name,
          time_series_id as "timeSeriesId",
          hierarchy_path as "hierarchyPath",
          description,
          ts_rank(to_tsvector('english', name), plainto_tsquery('english', $1)) as rank
        FROM instances
        WHERE to_tsvector('english', name) @@ plainto_tsquery('english', $1)
          AND hierarchy_path[1:array_length($2::text[], 1)] = $2::text[]
        ORDER BY rank DESC, name
        LIMIT 100
      `;
      
      instanceResult = await client.query(instanceQuery, [searchTerm, basePath]);
    }

    return {
      hierarchyNodes: {
        hitCount: hierarchyResult.rows.length,
        hits: hierarchyResult.rows
      },
      instances: {
        hitCount: instanceResult.rows.length,
        hits: instanceResult.rows
      }
    };
  } finally {
    client.release();
  }
}
```

## Example 3: Azure Time Series Insights API Integration

```typescript
import axios from 'axios';

interface AzureTSIConfig {
  environmentId: string;
  clientId: string;
  clientSecret: string;
  tenantId: string;
}

class AzureTSISearchService {
  private accessToken: string | null = null;
  private config: AzureTSIConfig;

  constructor(config: AzureTSIConfig) {
    this.config = config;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    const tokenEndpoint = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`;
    
    const response = await axios.post(tokenEndpoint, new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      scope: 'https://api.timeseries.azure.com/.default',
      grant_type: 'client_credentials'
    }));

    this.accessToken = response.data.access_token;
    return this.accessToken;
  }

  async searchHierarchy(payload: {
    path: string[];
    searchTerm?: string;
    recursive?: boolean;
    includeInstances?: boolean;
  }) {
    const token = await this.getAccessToken();
    const baseUrl = `https://${this.config.environmentId}.env.timeseries.azure.com`;

    if (!payload.searchTerm) {
      // Navigation mode - get hierarchy level
      return this.getHierarchyLevel(baseUrl, token, payload.path);
    }

    if (payload.recursive && payload.searchTerm) {
      // Search mode
      return this.deepSearch(baseUrl, token, payload);
    }

    throw new Error('Invalid search parameters');
  }

  private async getHierarchyLevel(baseUrl: string, token: string, path: string[]) {
    const response = await axios.post(
      `${baseUrl}/timeseries/hierarchies/$batch`,
      {
        get: {
          path: path,
          hierarchies: {
            expand: 'OneLevel',
            pageSize: 100
          },
          instances: {
            pageSize: 100
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return this.transformAzureResponse(response.data);
  }

  private async deepSearch(baseUrl: string, token: string, payload: any) {
    const searchRequest = {
      searchString: payload.searchTerm,
      path: payload.path,
      hierarchies: {
        expand: 'UntilChildren',
        pageSize: 100
      },
      instances: payload.includeInstances ? {
        pageSize: 100
      } : undefined
    };

    const response = await axios.post(
      `${baseUrl}/timeseries/hierarchies/search`,
      searchRequest,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return this.transformAzureResponse(response.data);
  }

  private transformAzureResponse(azureData: any) {
    // Transform Azure TSI response format to component format
    const hierarchyNodes = (azureData.hierarchies?.hits || []).map((h: any) => ({
      name: h.name,
      id: h.id,
      path: h.path || [],
      cumulativeInstanceCount: h.cumulativeInstanceCount || 0
    }));

    const instances = (azureData.instances?.hits || []).map((i: any) => ({
      id: i.instanceId,
      name: i.name,
      timeSeriesId: i.timeSeriesId,
      hierarchyPath: i.hierarchyIds?.[0]?.path || [],
      description: i.description,
      highlights: i.highlights
    }));

    return {
      hierarchyNodes: {
        hitCount: azureData.hierarchies?.hitCount || 0,
        hits: hierarchyNodes
      },
      instances: {
        hitCount: azureData.instances?.hitCount || 0,
        hits: instances
      }
    };
  }
}

// Usage in Express app
const tsiService = new AzureTSISearchService({
  environmentId: process.env.TSI_ENV_ID!,
  clientId: process.env.AZURE_CLIENT_ID!,
  clientSecret: process.env.AZURE_CLIENT_SECRET!,
  tenantId: process.env.AZURE_TENANT_ID!
});

app.post('/api/hierarchy/search', express.json(), async (req, res) => {
  try {
    const result = await tsiService.searchHierarchy(req.body);
    res.json(result);
  } catch (error) {
    console.error('TSI Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});
```

## Example 4: Mock Implementation for Testing

```typescript
// For Storybook or unit testing
export function createMockSearchFunction() {
  const mockData = generateMockHierarchy();
  
  return async (payload: any): Promise<any> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!payload.searchTerm) {
      // Navigation mode
      return getMockLevel(mockData, payload.path);
    }

    if (payload.recursive && payload.searchTerm) {
      // Search mode
      return mockDeepSearch(mockData, payload.searchTerm);
    }

    return { error: 'Invalid request' };
  };
}

function generateMockHierarchy() {
  return {
    'Manufacturing': {
      'Building A': {
        instances: [
          { id: '1', name: 'Temperature Sensor A1', timeSeriesId: ['MFG', 'BA', 'TS1'] },
          { id: '2', name: 'Pressure Sensor A1', timeSeriesId: ['MFG', 'BA', 'PS1'] }
        ],
        children: {
          'Floor 1': {
            instances: [
              { id: '3', name: 'Temperature Control Unit', timeSeriesId: ['MFG', 'BA', 'F1', 'TCU1'] }
            ]
          }
        }
      },
      'Building B': {
        instances: [
          { id: '4', name: 'Temperature Sensor B1', timeSeriesId: ['MFG', 'BB', 'TS1'] }
        ]
      }
    },
    'Warehouse': {
      instances: [
        { id: '5', name: 'Climate Control', timeSeriesId: ['WH', 'CC1'] }
      ]
    }
  };
}

function getMockLevel(data: any, path: string[]) {
  let current = data;
  
  for (const segment of path) {
    if (current[segment]) {
      current = current[segment];
    }
  }

  const hierarchyNodes: any[] = [];
  const instances: any[] = [];

  for (const [name, node] of Object.entries(current)) {
    if (typeof node === 'object' && node !== null) {
      if ((node as any).children || (!((node as any).instances))) {
        hierarchyNodes.push({
          name,
          id: name,
          path: [...path, name],
          cumulativeInstanceCount: countMockInstances(node)
        });
      }
      
      if ((node as any).instances) {
        instances.push(...(node as any).instances.map((inst: any) => ({
          ...inst,
          hierarchyPath: path
        })));
      }
    }
  }

  return {
    hierarchyNodes: { hitCount: hierarchyNodes.length, hits: hierarchyNodes },
    instances: { hitCount: instances.length, hits: instances }
  };
}

function mockDeepSearch(data: any, searchTerm: string) {
  const term = searchTerm.toLowerCase();
  const results: any = {
    hierarchyNodes: { hitCount: 0, hits: [] },
    instances: { hitCount: 0, hits: [] }
  };

  function searchRecursive(node: any, path: string[]) {
    for (const [name, value] of Object.entries(node)) {
      const nodePath = [...path, name];

      if (name.toLowerCase().includes(term)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          results.hierarchyNodes.hits.push({
            name,
            id: name,
            path: nodePath,
            cumulativeInstanceCount: countMockInstances(value)
          });
        }
      }

      if (value && typeof value === 'object' && (value as any).instances) {
        for (const instance of (value as any).instances) {
          if (instance.name.toLowerCase().includes(term)) {
            results.instances.hits.push({
              ...instance,
              hierarchyPath: path
            });
          }
        }
      }

      if (value && typeof value === 'object' && (value as any).children) {
        searchRecursive((value as any).children, nodePath);
      }
    }
  }

  searchRecursive(data, []);

  results.hierarchyNodes.hitCount = results.hierarchyNodes.hits.length;
  results.instances.hitCount = results.instances.hits.length;

  return results;
}

function countMockInstances(node: any): number {
  let count = 0;
  
  if (node.instances) {
    count += node.instances.length;
  }
  
  if (node.children) {
    for (const child of Object.values(node.children)) {
      count += countMockInstances(child);
    }
  }
  
  return count;
}
```

## Performance Benchmarks

Expected performance characteristics:

| Data Size | Navigation | Search (No Index) | Search (Indexed) |
|-----------|-----------|-------------------|------------------|
| 100 nodes | < 50ms | 100-200ms | < 100ms |
| 1,000 nodes | < 50ms | 500ms-1s | < 200ms |
| 10,000 nodes | < 50ms | 5-10s | < 500ms |
| 100,000 nodes | < 50ms | 50-100s | < 1s |

**Recommendation**: Use database indexing for datasets > 1,000 nodes.
