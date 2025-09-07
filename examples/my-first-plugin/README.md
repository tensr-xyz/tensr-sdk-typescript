# My First Plugin

A simple statistical analysis plugin built with the Tensr SDK that calculates basic descriptive statistics for numeric data.

## Features

- ✅ Calculates mean, median, standard deviation, variance
- ✅ Finds min, max, and range values
- ✅ Handles missing data gracefully
- ✅ Beautiful HTML UI with responsive design
- ✅ TypeScript support with full type safety

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Plugin

```bash
npm run build
```

### 3. Test the Plugin

```bash
npm test
```

## Plugin Structure

```
my-first-plugin/
├── src/
│   └── index.ts          # Main plugin logic
├── ui.html               # Plugin UI
├── manifest.json         # Plugin metadata
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md            # This file
```

## How It Works

### 1. Plugin Logic (`src/index.ts`)

The plugin implements the `TensrPlugin` interface:

```typescript
export const MyFirstPlugin: TensrPlugin = {
  async analyze(data: DataSet): Promise<AnalysisResult> {
    // Your analysis logic here
    return {
      type: 'table',
      data: { /* results */ },
      metadata: { /* execution info */ }
    };
  }
};
```

### 2. Plugin Manifest (`manifest.json`)

Defines plugin metadata and capabilities:

```json
{
  "id": "my-first-plugin",
  "name": "My First Plugin",
  "version": "1.0.0",
  "capabilities": {
    "inputTypes": ["csv", "xlsx"],
    "outputTypes": ["table", "chart"]
  }
}
```

### 3. Plugin UI (`ui.html`)

Interactive HTML interface that displays results:

- Responsive design
- Real-time data visualization
- Error handling
- Loading states

## SDK Usage

### Importing Components

```typescript
import { 
  TensrPlugin, 
  DataSet, 
  AnalysisResult,
  DataTable,
  Chart 
} from '@tensr/sdk';
```

### Data Analysis

```typescript
// Access dataset
const numericColumns = data.columns.filter(col => col.type === 'number');
const values = data.rows.map(row => row[column.id]);

// Calculate statistics
const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
const median = calculateMedian(values);
const stdDev = calculateStandardDeviation(values, mean);
```

### Returning Results

```typescript
return {
  type: 'table',
  data: {
    title: 'Analysis Results',
    columns: ['Metric', 'Value'],
    rows: [
      ['Mean', mean.toFixed(2)],
      ['Median', median.toFixed(2)],
      ['Std Dev', stdDev.toFixed(2)]
    ]
  },
  metadata: {
    executionTime: Date.now(),
    pluginVersion: '1.0.0'
  }
};
```

## Deployment

### 1. Build for Production

```bash
npm run build
```

### 2. Upload to Tensr Platform

1. Zip the entire plugin folder
2. Upload via Tensr platform UI
3. Set pricing and metadata
4. Publish to marketplace

### 3. Plugin Validation

The platform will automatically:
- ✅ Validate the manifest
- ✅ Test plugin execution
- ✅ Check for security issues
- ✅ Verify UI functionality

## Advanced Features

### Error Handling

```typescript
try {
  // Plugin logic
} catch (error) {
  throw new Error(`Analysis failed: ${error.message}`);
}
```

### Custom UI Components

```typescript
// Use SDK components in your UI
import { DataTable, Chart } from '@tensr/sdk';

// Render in your HTML
const table = new DataTable(results.data);
const chart = new Chart(results.chartData, 'bar');
```

### Configuration

```typescript
// Access plugin config from manifest
const timeout = manifest.config?.timeout || 30;
const maxMemory = manifest.config?.maxMemory || 100;
```

## Next Steps

1. **Add more statistics** - Correlation, regression, etc.
2. **Create visualizations** - Charts, graphs, plots
3. **Handle different data types** - Text, dates, categories
4. **Add user inputs** - Parameters, filters, options
5. **Implement caching** - Store results for performance

## Resources

- [Tensr SDK Documentation](https://docs.tensr.com/sdk)
- [Plugin Development Guide](https://docs.tensr.com/plugins)
- [Marketplace Guidelines](https://docs.tensr.com/marketplace)
- [Community Forum](https://community.tensr.com)

## License

MIT License - see LICENSE file for details.
