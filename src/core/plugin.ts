import {
  AnalysisResult,
  PluginConfig,
  DataSet,
  AnalysisOptions,
  PluginError,
  ErrorCode,
  FileType, PluginComponentType,
} from './types';

/**
 * Base class for all plugins
 * @public
 */
export abstract class Plugin {
  protected config: PluginConfig;

  constructor(config: PluginConfig) {
    this.validateConfig(config);
    this.config = config;
  }

  /**
   * Analyze the provided dataset
   * @param data - Dataset to analyze
   * @param options - Optional analysis configuration
   * @throws {PluginError} When analysis fails
   */
  abstract analyze(data: DataSet, options?: AnalysisOptions): Promise<AnalysisResult>;

  /**
   * React component to display analysis results
   */
  abstract get Component(): PluginComponentType;

  /**
   * Get plugin identifier
   */
  getId(): string {
    return this.config.name;
  }

  /**
   * Get plugin display name
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * Get plugin description
   */
  getDescription(): string {
    return this.config.description;
  }

  /**
   * Check if plugin supports given file type
   */
  supportsFileType(fileType: FileType): boolean {
    return this.config.supportedFileTypes.includes(fileType);
  }

  /**
   * Get supported file types
   */
  getSupportedFileTypes(): FileType[] {
    return this.config.supportedFileTypes;
  }

  /**
   * Validate dataset before analysis
   * @throws {PluginError} When validation fails
   */
  protected validateDataSet(data: DataSet): void {
    if (!data.columns?.length || !data.rows?.length) {
      throw new PluginError('Dataset must contain columns and rows', ErrorCode.INVALID_DATA);
    }

    if (!this.supportsFileType(data.fileType)) {
      throw new PluginError(
        `Unsupported file type: ${data.fileType}`,
        ErrorCode.UNSUPPORTED_FILE_TYPE
      );
    }
  }

  private validateConfig(config: PluginConfig): void {
    if (!config.name || !config.version || !config.supportedFileTypes?.length) {
      throw new Error('Invalid plugin configuration');
    }

    // Validate all file types are supported
    config.supportedFileTypes.forEach((type) => {
      if (!Object.values(FileType).includes(type)) {
        throw new Error(`Invalid file type: ${type}`);
      }
    });
  }
}

/**
 * Registry for managing plugins
 * @public
 */
export class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();

  /**
   * Register a new plugin
   * @throws {Error} If plugin is already registered
   */
  registerPlugin(plugin: Plugin): void {
    if (this.plugins.has(plugin.getId())) {
      throw new Error(`Plugin ${plugin.getId()} is already registered`);
    }
    this.plugins.set(plugin.getId(), plugin);
  }

  /**
   * Unregister a plugin
   */
  unregisterPlugin(id: string): void {
    this.plugins.delete(id);
  }

  /**
   * Get a plugin by ID
   */
  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id);
  }

  /**
   * Get all plugins that support a specific file type
   */
  getPluginsForFileType(fileType: FileType): Plugin[] {
    return Array.from(this.plugins.values()).filter((plugin) => plugin.supportsFileType(fileType));
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}

/**
 * Execute plugin analysis with validation and error handling
 * @public
 */
export async function executePluginAnalysis(
  plugin: Plugin,
  data: DataSet,
  options?: AnalysisOptions
): Promise<AnalysisResult> {
  try {
    plugin['validateDataSet'](data);
    return await plugin.analyze(data, options);
  } catch (error) {
    if (error instanceof PluginError) {
      throw error;
    }
    throw new PluginError(
      'Analysis failed: ' + (error as Error).message,
      ErrorCode.ANALYSIS_FAILED,
      { originalError: error }
    );
  }
}
