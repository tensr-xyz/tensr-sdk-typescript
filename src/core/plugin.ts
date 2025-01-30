// src/plugin.ts
import { PluginConfig, TensrPlugin, DataSet, PluginComponentProps } from './types';
import { validateDataSet } from '@/utils';

/**
 * Creates a new plugin instance
 * @param config - Plugin configuration
 * @returns Plugin instance
 * @public
 */
export function createPlugin(config: PluginConfig): TensrPlugin {
  return {
    getName: () => config.name,
    getVersion: () => config.version,
    getDescription: () => config.description,
    getSupportedFileTypes: () => config.supportedFileTypes,
    getCategory: () => config.category || null,
    getTags: () => config.tags || [],

    analyze: function(data: DataSet) {
      validateDataSet(data, config.supportedFileTypes);
      throw new Error('analyze() must be implemented');
    },

    Component: function(_props: PluginComponentProps) {
      throw new Error('Component() must be implemented');
    }
  };
}
