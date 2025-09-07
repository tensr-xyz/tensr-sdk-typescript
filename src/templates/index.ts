import { TensrPluginManifest } from '../core/plugin-manifest';

/**
 * Plugin template for basic statistical analysis
 * @public
 */
export const basicStatsTemplate: TensrPluginManifest = {
  id: 'basic-stats-template',
  name: 'Basic Statistics',
  version: '1.0.0',
  description: 'Calculate basic descriptive statistics for numeric data',
  author: 'Tensr',
  entryPoint: 'dist/index.js',
  ui: 'ui.html',
  capabilities: {
    inputTypes: ['csv', 'xlsx'],
    outputTypes: ['table', 'chart']
  },
  config: {
    timeout: 30,
    maxMemory: 100
  },
  tags: ['statistics', 'descriptive', 'basic']
};

/**
 * Plugin template for correlation analysis
 * @public
 */
export const correlationTemplate: TensrPluginManifest = {
  id: 'correlation-template',
  name: 'Correlation Analysis',
  version: '1.0.0',
  description: 'Calculate correlation coefficients between numeric variables',
  author: 'Tensr',
  entryPoint: 'dist/index.js',
  ui: 'ui.html',
  capabilities: {
    inputTypes: ['csv', 'xlsx'],
    outputTypes: ['table', 'chart']
  },
  config: {
    timeout: 60,
    maxMemory: 200
  },
  tags: ['statistics', 'correlation', 'analysis']
};

/**
 * Plugin template for data visualization
 * @public
 */
export const visualizationTemplate: TensrPluginManifest = {
  id: 'visualization-template',
  name: 'Data Visualization',
  version: '1.0.0',
  description: 'Create charts and graphs from your data',
  author: 'Tensr',
  entryPoint: 'dist/index.js',
  ui: 'ui.html',
  capabilities: {
    inputTypes: ['csv', 'xlsx', 'json'],
    outputTypes: ['chart', 'image']
  },
  config: {
    timeout: 45,
    maxMemory: 150
  },
  tags: ['visualization', 'charts', 'graphs']
};

/**
 * Get all available plugin templates
 * @public
 */
export function getPluginTemplates(): TensrPluginManifest[] {
  return [
    basicStatsTemplate,
    correlationTemplate,
    visualizationTemplate
  ];
}

/**
 * Get plugin template by ID
 * @public
 */
export function getPluginTemplate(id: string): TensrPluginManifest | undefined {
  return getPluginTemplates().find(template => template.id === id);
}
