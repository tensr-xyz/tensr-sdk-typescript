# Tenser SDK

A powerful TypeScript/React SDK for building extensible data analysis and visualization plugins.

## Features

- Plugin-based architecture for modular data analysis
- Built-in dialog system using Radix UI
- Support for multiple file types (CSV, XLSX, JSON)
- Type-safe plugin development with TypeScript
- Flexible data validation and error handling
- Customizable UI components for analysis results

## Installation

```bash
npm install @tenser/sdk
```

## Creating a plugin

First, create a package.json for your plugin:

```json
{
  "name": "@tensr/mean-plugin",
  "version": "1.0.0",
  "description": "Calculate means of numeric columns",
  "author": "Tensr",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.7",
    "tsup": "^8.0.0",
    "typescript": "^5.7.3"
  },
  "pluginMetadata": {
    "name": "mean-calculator",
    "description": "Calculates means for numeric columns",
    "supportedFileTypes": ["csv", "xlsx"],
    "category": "analysis",
    "tags": ["statistics", "mean", "average"]
  }
}
```

Create your plugin implementation:
```js
import {
    Plugin,
    AnalysisResult,
    DataSet,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    PluginComponentType
} from '@tensr/sdk';
import React from 'react';

export class MeanCalculatorPlugin extends Plugin {
    async analyze(data: DataSet): Promise<AnalysisResult> {
        // Your analysis logic here
    }

    get Component(): PluginComponentType {
        return function MeanCalculatorComponent({ result, data, onClose }) {
            // Your visualization component here
        };
    }
}
```
