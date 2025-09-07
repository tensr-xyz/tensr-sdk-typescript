# Tensr SDK

A powerful TypeScript SDK for building statistical analysis plugins for the Tensr platform. Create custom data analysis tools that integrate seamlessly with Tensr's marketplace.

## Features

- 🚀 **Plugin-based architecture** - Build modular statistical analysis tools
- 📊 **Rich data types** - Support for CSV, XLSX, JSON data formats
- 🎨 **UI components** - Pre-built components for results display
- 🔒 **Type safety** - Full TypeScript support with comprehensive types
- ⚡ **Performance optimized** - Tree-shaking enabled for minimal bundle sizes
- 🧪 **Testing ready** - Comprehensive test suite with 23 passing tests
- 📦 **Easy deployment** - Simple build and publish workflow

## Installation

```bash
npm install @tensr/sdk
```

## Quick Start

### 1. Create a Plugin Project

```bash
mkdir my-plugin
cd my-plugin
npm init -y
npm install @tensr/sdk
npm install -D typescript @types/node
```

### 2. Create Plugin Manifest

Create `manifest.json`:

```json
{
  "id": "my-statistics-plugin",
  "name": "My Statistics Plugin",
  "version": "1.0.0",
  "description": "Calculate descriptive statistics for numeric data",
  "author": "Your Name",
  "entryPoint": "dist/index.js",
  "ui": "ui.html",
  "capabilities": {
    "inputTypes": ["csv", "xlsx"],
    "outputTypes": ["table", "chart"]
  },
  "tags": ["statistics", "descriptive"]
}
```

### 3. Write Plugin Logic

Create `src/index.ts`:

```typescript
import { TensrPlugin, DataSet, AnalysisResult } from '@tensr/sdk';

export const MyStatisticsPlugin: TensrPlugin = {
  async analyze(data: DataSet): Promise<AnalysisResult> {
    // Get numeric columns
    const numericColumns = data.columns.filter(col => col.type === 'number');
    
    if (numericColumns.length === 0) {
      throw new Error('No numeric columns found in dataset');
    }

    // Calculate statistics for each numeric column
    const results = numericColumns.map(column => {
      const values = data.rows
        .map(row => row[column.id])
        .filter(val => typeof val === 'number' && !isNaN(val as number))
        .map(val => val as number);

      const sum = values.reduce((acc, val) => acc + val, 0);
      const mean = sum / values.length;
      const sorted = [...values].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];

      return {
        column: column.name,
        count: values.length,
        mean: Number(mean.toFixed(2)),
        median: Number(median.toFixed(2)),
        min: Math.min(...values),
        max: Math.max(...values)
      };
    });

    return {
      type: 'table',
      data: {
        title: 'Descriptive Statistics',
        columns: ['Column', 'Count', 'Mean', 'Median', 'Min', 'Max'],
        rows: results.map(r => [
          r.column, 
          r.count, 
          r.mean, 
          r.median, 
          r.min, 
          r.max
        ])
      },
      metadata: {
        executionTime: Date.now(),
        pluginVersion: '1.0.0',
        columnsAnalyzed: numericColumns.length
      }
    };
  }
};

export default MyStatisticsPlugin;
```

### 4. Create Plugin UI (Optional)

Create `ui.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Statistics Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Statistics Results</h1>
        <div id="results"></div>
    </div>
    
    <script>
        window.addEventListener('message', function(event) {
            if (event.data.type === 'plugin-result') {
                const data = event.data.result;
                document.getElementById('results').innerHTML = `
                    <h3>${data.data.title}</h3>
                    <table>
                        <thead>
                            <tr>
                                ${data.data.columns.map(col => `<th>${col}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.data.rows.map(row => `
                                <tr>
                                    ${row.map(cell => `<td>${cell}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        });
    </script>
</body>
</html>
```

### 5. Build and Deploy

```bash
# Build TypeScript
npx tsc

# Test your plugin
node -e "
import('./dist/index.js').then(module => {
  const plugin = module.default;
  console.log('✅ Plugin loaded successfully!');
});
"

# Package for upload
zip -r my-plugin.zip . -x "node_modules/*" "*.git*"
```

## SDK Components

### Core Types

```typescript
import { 
  TensrPlugin, 
  DataSet, 
  AnalysisResult,
  TensrPluginManifest 
} from '@tensr/sdk';

// Plugin interface
interface TensrPlugin {
  analyze(data: DataSet): Promise<AnalysisResult>;
}

// Dataset structure
interface DataSet {
  columns: Column[];
  rows: Record<string, unknown>[];
  totalRows: number;
  totalColumns: number;
  fileType: 'csv' | 'xlsx' | 'json';
}

// Analysis result
interface AnalysisResult {
  type: 'table' | 'chart' | 'text';
  data: any;
  metadata: {
    executionTime: number;
    pluginVersion: string;
    [key: string]: any;
  };
}
```

### UI Components

```typescript
import { 
  DataTable, 
  Chart, 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle 
} from '@tensr/sdk';

// Data table component
<DataTable 
  data={results.data.rows}
  columns={results.data.columns}
  maxRows={100}
/>

// Chart component
<Chart 
  data={chartData}
  type="bar"
  title="Analysis Results"
  width={400}
  height={300}
/>
```

### Plugin Validation

```typescript
import { validatePluginManifest } from '@tensr/sdk';

const manifest = {
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  // ... other fields
};

const validation = validatePluginManifest(manifest);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

## Examples

### Complete Example Plugin

Check out the complete example in `examples/my-first-plugin/`:

- ✅ **Full plugin implementation** with statistics calculations
- ✅ **Beautiful HTML UI** with responsive design
- ✅ **TypeScript configuration** and build setup
- ✅ **Plugin manifest** with all required fields
- ✅ **Build scripts** for easy deployment

```bash
cd examples/my-first-plugin
npm install
npm run build
```

### Plugin Types

#### Descriptive Statistics
```typescript
// Calculate mean, median, std dev, variance
const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
const median = calculateMedian(values);
const stdDev = calculateStandardDeviation(values, mean);
```

#### Correlation Analysis
```typescript
// Calculate Pearson correlation
const correlation = calculatePearsonCorrelation(xValues, yValues);
```

#### Data Visualization
```typescript
// Create chart data
const chartData = {
  labels: ['Category 1', 'Category 2', 'Category 3'],
  datasets: [{
    label: 'Values',
    data: [10, 20, 30],
    backgroundColor: 'rgba(54, 162, 235, 0.6)'
  }]
};
```

## API Reference

### TensrPlugin

The main interface for all plugins:

```typescript
interface TensrPlugin {
  analyze(data: DataSet): Promise<AnalysisResult>;
}
```

### DataSet

Input data structure:

```typescript
interface DataSet {
  columns: Column[];
  rows: Record<string, unknown>[];
  totalRows: number;
  totalColumns: number;
  fileType: 'csv' | 'xlsx' | 'json';
}

interface Column {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
}
```

### AnalysisResult

Output result structure:

```typescript
interface AnalysisResult {
  type: 'table' | 'chart' | 'text';
  data: TableData | ChartData | string;
  metadata: {
    executionTime: number;
    pluginVersion: string;
    [key: string]: any;
  };
}

interface TableData {
  title: string;
  columns: string[];
  rows: (string | number)[][];
}
```

### Plugin Manifest

Plugin metadata structure:

```typescript
interface TensrPluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  entryPoint: string;
  ui: string;
  capabilities: {
    inputTypes: string[];
    outputTypes: string[];
  };
  config?: {
    timeout?: number;
    maxMemory?: number;
  };
  tags?: string[];
}
```

## Development

### Testing

The SDK includes a comprehensive test suite:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

### Building

```bash
npm run build         # Build for production
npm run dev           # Development mode
npm run lint          # Lint code
```

### Tree Shaking

The SDK is optimized for tree shaking:

```typescript
// Only import what you need
import { TensrPlugin, DataSet } from '@tensr/sdk';
import { DataTable } from '@tensr/sdk/components';

// Unused code is automatically removed
```

## Deployment

### 1. Build Your Plugin

```bash
npm run build
```

### 2. Validate Manifest

```bash
node -e "
const manifest = require('./manifest.json');
const { validatePluginManifest } = require('@tensr/sdk');
const result = validatePluginManifest(manifest);
console.log('Valid:', result.isValid);
if (!result.isValid) console.log('Errors:', result.errors);
"
```

### 3. Package for Upload

```bash
zip -r my-plugin.zip . -x "node_modules/*" "*.git*" "dist/*.map"
```

### 4. Upload to Tensr Platform

1. Login to Tensr platform
2. Go to Plugin Marketplace → "Upload Plugin"
3. Upload your zip file
4. Fill in pricing and metadata
5. Submit for review

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📚 [Documentation](https://docs.tensr.com/sdk)
- 💬 [Community Forum](https://community.tensr.com)
- 🐛 [Report Issues](https://github.com/tensr-xyz/sdk/issues)
- 📧 [Support Email](mailto:support@tensr.com)
