import { describe, it, expect } from 'vitest';
import { 
  PluginExecutor, 
  createPlugin 
} from '../../src/core/plugin-executor';
import { TensrPluginManifest, validatePluginManifest } from '../../src/core/plugin-manifest';
import { DataSet } from '../../src/core/types';

describe('Plugin Lifecycle Integration', () => {
  const sampleDataSet: DataSet = {
    columns: [
      { id: 'value', name: 'Value', type: 'number' },
      { id: 'category', name: 'Category', type: 'string' }
    ],
    rows: [
      { value: 10, category: 'A' },
      { value: 20, category: 'B' },
      { value: 30, category: 'A' }
    ],
    totalRows: 3,
    totalColumns: 2,
    fileType: 'csv'
  };

  describe('Complete Plugin Lifecycle', () => {
    it('should handle full plugin lifecycle from manifest to execution', async () => {
      // 1. Create plugin manifest
      const manifest: TensrPluginManifest = {
        id: 'lifecycle-test',
        name: 'Lifecycle Test Plugin',
        version: '1.0.0',
        description: 'Tests complete plugin lifecycle',
        author: 'Test Author',
        entryPoint: 'dist/index.js',
        ui: 'ui.html',
        capabilities: {
          inputTypes: ['csv'],
          outputTypes: ['table']
        },
        config: {
          timeout: 30,
          maxMemory: 100
        },
        tags: ['test', 'lifecycle']
      };

      // 2. Validate manifest
      const validation = validatePluginManifest(manifest);
      expect(validation.isValid).toBe(true);

      // 3. Create plugin from code
      const pluginCode = `
        export const TestPlugin = {
          async analyze(data) {
            return {
              type: 'table',
              data: {
                title: 'Analysis Results',
                columns: ['Metric', 'Value'],
                rows: [
                  ['Total Rows', data.totalRows.toString()],
                  ['Total Columns', data.totalColumns.toString()],
                  ['File Type', data.fileType]
                ]
              },
              metadata: {
                executionTime: 50,
                pluginVersion: '1.0.0'
              }
            };
          }
        };
      `;

      const plugin = createPlugin(manifest, pluginCode);
      expect(plugin).toBeDefined();

      // 4. Execute plugin
      const executor = new PluginExecutor();
      const result = await executor.executePlugin(plugin, manifest, sampleDataSet);

      // 5. Verify results
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result?.type).toBe('table');
      expect(result.result?.data.title).toBe('Analysis Results');
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle plugin validation errors', () => {
      const invalidManifest = {
        id: '', // Invalid: empty ID
        name: 'Invalid Plugin',
        version: 'invalid-version', // Invalid version format
        description: 'This plugin has validation errors',
        author: 'Test Author',
        entryPoint: 'dist/index.js',
        ui: 'ui.html',
        capabilities: {
          inputTypes: [], // Invalid: empty input types
          outputTypes: ['table']
        },
        tags: ['test']
      } as TensrPluginManifest;

      const validation = validatePluginManifest(invalidManifest);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors).toContain('Plugin ID cannot be empty');
      expect(validation.errors).toContain('Invalid version format: invalid-version');
      expect(validation.errors).toContain('At least one input type is required');
    });

    it('should handle plugin execution errors', async () => {
      const manifest: TensrPluginManifest = {
        id: 'error-test',
        name: 'Error Test Plugin',
        version: '1.0.0',
        description: 'Tests error handling',
        author: 'Test Author',
        entryPoint: 'dist/index.js',
        ui: 'ui.html',
        capabilities: {
          inputTypes: ['csv'],
          outputTypes: ['table']
        },
        tags: ['test']
      };

      const errorPluginCode = `
        export const ErrorPlugin = {
          async analyze(data) {
            throw new Error('Intentional error for testing');
          }
        };
      `;

      const plugin = createPlugin(manifest, errorPluginCode);
      const executor = new PluginExecutor();
      const result = await executor.executePlugin(plugin, manifest, sampleDataSet);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Intentional error for testing');
    });
  });
});
