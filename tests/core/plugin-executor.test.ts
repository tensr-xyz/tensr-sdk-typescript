import { describe, it, expect, vi } from 'vitest';
import { PluginExecutor } from '../../src/core/plugin-executor';
import { TensrPlugin, DataSet, AnalysisResult } from '../../src/core/types';
import { TensrPluginManifest } from '../../src/core/plugin-manifest';

describe('Plugin Executor', () => {
  const mockDataSet: DataSet = {
    columns: [
      { id: 'age', name: 'Age', type: 'number' },
      { id: 'name', name: 'Name', type: 'string' }
    ],
    rows: [
      { age: 25, name: 'John' },
      { age: 30, name: 'Jane' }
    ],
    totalRows: 2,
    totalColumns: 2,
    fileType: 'csv'
  };

  const mockManifest: TensrPluginManifest = {
    id: 'test-plugin',
    name: 'Test Plugin',
    version: '1.0.0',
    description: 'Test plugin',
    author: 'Test Author',
    entryPoint: 'dist/index.js',
    ui: 'ui.html',
    capabilities: {
      inputTypes: ['csv'],
      outputTypes: ['table']
    },
    tags: ['test']
  };

  describe('executePlugin', () => {
    it('should execute a valid plugin successfully', async () => {
      const mockPlugin: TensrPlugin = {
        async analyze(data: DataSet): Promise<AnalysisResult> {
          return {
            type: 'table',
            data: {
              title: 'Test Results',
              columns: ['Metric', 'Value'],
              rows: [
                ['Total Rows', data.totalRows.toString()],
                ['Total Columns', data.totalColumns.toString()]
              ]
            },
            metadata: {
              executionTime: 100,
              pluginVersion: '1.0.0'
            }
          };
        }
      };

      const executor = new PluginExecutor();
      const result = await executor.executePlugin(mockPlugin, mockManifest, mockDataSet);

      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result?.type).toBe('table');
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle plugin errors gracefully', async () => {
      const errorPlugin: TensrPlugin = {
        async analyze(_data: DataSet): Promise<AnalysisResult> {
          throw new Error('Plugin execution failed');
        }
      };

      const executor = new PluginExecutor();
      const result = await executor.executePlugin(errorPlugin, mockManifest, mockDataSet);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe('Plugin execution failed');
    });

    it('should timeout long-running plugins', async () => {
      const slowPlugin: TensrPlugin = {
        async analyze(_data: DataSet): Promise<AnalysisResult> {
          // Simulate slow execution
          await new Promise(resolve => setTimeout(resolve, 2000));
          return {
            type: 'table',
            data: { title: 'Slow Results', columns: [], rows: [] },
            metadata: { executionTime: 2000, pluginVersion: '1.0.0' }
          };
        }
      };

      const executor = new PluginExecutor();
      const result = await executor.executePlugin(slowPlugin, mockManifest, mockDataSet, {}, 100); // 100ms timeout

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('timeout');
    });
  });
});
