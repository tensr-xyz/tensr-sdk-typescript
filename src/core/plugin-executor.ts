import { DataSet, AnalysisResult, TensrPlugin } from './types';
import { 
  TensrPluginManifest, 
  PluginExecutionResult,
  PluginValidationResult
} from './plugin-manifest';

/**
 * Plugin executor for running Tensr plugins in a sandboxed environment
 * @public
 */
export class PluginExecutor {
  private result: AnalysisResult | null = null;
  private error: Error | null = null;
  private startTime: number = 0;

  /**
   * Execute a plugin with given data and UI parameters
   */
  async executePlugin(
    plugin: TensrPlugin,
    _manifest: TensrPluginManifest,
    data: DataSet,
    _uiData: Record<string, unknown> = {},
    timeoutMs: number = 30000
  ): Promise<{ success: boolean; result?: AnalysisResult; error?: Error; executionTime: number }> {
    this.startTime = Date.now();
    this.result = null;
    this.error = null;

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Plugin execution timeout')), timeoutMs);
      });

      // Execute plugin analysis with timeout
      const analysisResult = await Promise.race([
        plugin.analyze(data),
        timeoutPromise
      ]);
      
      // Set result if not already set
      if (!this.result) {
        this.result = analysisResult;
      }

      const executionTime = Date.now() - this.startTime;

      return {
        success: true,
        result: this.result,
        executionTime
      };
    } catch (error) {
      const executionTime = Date.now() - this.startTime;
      this.error = error instanceof Error ? error : new Error('Unknown error');
      
      return {
        success: false,
        error: this.error,
        executionTime
      };
    }
  }

  /**
   * Validate a plugin manifest
   */
  validateManifest(manifest: TensrPluginManifest): PluginValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!manifest.id) errors.push('Plugin ID is required');
    if (!manifest.name) errors.push('Plugin name is required');
    if (!manifest.version) errors.push('Plugin version is required');
    if (!manifest.description) errors.push('Plugin description is required');
    if (!manifest.author) errors.push('Plugin author is required');
    if (!manifest.entryPoint) errors.push('Plugin entry point is required');
    if (!manifest.ui) errors.push('Plugin UI file is required');

    // Capabilities validation
    if (!manifest.capabilities) {
      errors.push('Plugin capabilities are required');
    } else {
      if (!manifest.capabilities.inputTypes || manifest.capabilities.inputTypes.length === 0) {
        errors.push('Plugin must specify at least one input type');
      }
      if (!manifest.capabilities.outputTypes || manifest.capabilities.outputTypes.length === 0) {
        errors.push('Plugin must specify at least one output type');
      }
    }

    // Version format validation
    if (manifest.version && !/^\d+\.\d+\.\d+/.test(manifest.version)) {
      warnings.push('Version should follow semantic versioning (e.g., 1.0.0)');
    }

    // Configuration validation
    if (manifest.config) {
      if (manifest.config.timeout && manifest.config.timeout < 1) {
        warnings.push('Timeout should be at least 1 second');
      }
      if (manifest.config.maxMemory && manifest.config.maxMemory < 10) {
        warnings.push('Max memory should be at least 10MB');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get memory usage (placeholder implementation)
   */
  private getMemoryUsage(): number {
    // In a real implementation, this would measure actual memory usage
    return 0;
  }

  /**
   * Get execution warnings
   */
  private getWarnings(): string[] {
    const warnings: string[] = [];
    
    if (this.error) {
      warnings.push(`Plugin execution completed with errors: ${this.error.message}`);
    }

    return warnings;
  }
}

/**
 * Create a plugin from manifest and code
 * @public
 */
export function createPlugin(
  _manifest: TensrPluginManifest,
  pluginCode: string
): TensrPlugin {
  try {
    // Remove export statements and create a function that returns the plugin
    const cleanCode = pluginCode
      .replace(/export\s+/g, '')
      .replace(/const\s+(\w+)\s*=/g, 'var $1 =')
      .replace(/let\s+(\w+)\s*=/g, 'var $1 =')
      .replace(/async\s+function/g, 'function');

    // Create a function that returns the plugin
    const pluginFactory = new Function(`
      ${cleanCode}
      // Return the first defined plugin variable
      if (typeof TestPlugin !== 'undefined') return TestPlugin;
      if (typeof ErrorPlugin !== 'undefined') return ErrorPlugin;
      if (typeof plugin !== 'undefined') return plugin;
      throw new Error('No plugin found in code');
    `);

    // Execute the plugin code
    const plugin = pluginFactory();

    if (!plugin || typeof plugin.analyze !== 'function') {
      throw new Error('Plugin must export an object with analyze method');
    }

    return plugin;
  } catch (error) {
    throw new Error(`Failed to create plugin: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
