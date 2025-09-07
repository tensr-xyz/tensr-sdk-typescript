import { DataSet, AnalysisResult } from './types';

/**
 * Plugin manifest structure for Tensr plugins
 * @public
 */
export interface TensrPluginManifest {
  /** Unique plugin identifier */
  id: string;
  /** Plugin name */
  name: string;
  /** Plugin version */
  version: string;
  /** Plugin description */
  description: string;
  /** Plugin author */
  author: string;
  /** Author email */
  authorEmail?: string;
  /** Plugin entry point file */
  entryPoint: string;
  /** UI file path */
  ui: string;
  /** Plugin capabilities */
  capabilities: {
    /** Supported input data types */
    inputTypes: string[];
    /** Supported output formats */
    outputTypes: string[];
  };
  /** Plugin configuration */
  config?: {
    /** Execution timeout in seconds */
    timeout?: number;
    /** Maximum memory usage in MB */
    maxMemory?: number;
    /** Maximum concurrency */
    concurrency?: number;
  };
  /** Plugin tags for categorization */
  tags?: string[];
  /** Plugin icon URL */
  icon?: string;
  /** Plugin license */
  license?: string;
  /** Plugin homepage URL */
  homepage?: string;
  /** Plugin repository URL */
  repository?: string;
}

/**
 * Plugin execution context
 * @public
 */
export interface PluginExecutionContext {
  /** Input dataset */
  data: DataSet;
  /** UI parameters from user */
  uiData: Record<string, unknown>;
  /** Plugin manifest */
  manifest: TensrPluginManifest;
  /** Result callback */
  setResult: (result: AnalysisResult) => void;
  /** Error callback */
  setError: (error: Error) => void;
}

/**
 * Plugin execution result
 * @public
 */
export interface PluginExecutionResult {
  /** Analysis result */
  result: AnalysisResult;
  /** Execution metadata */
  metadata: {
    executionTime: number;
    memoryUsed: number;
    warnings?: string[];
  };
}

/**
 * Plugin validation result
 * @public
 */
export interface PluginValidationResult {
  /** Whether plugin is valid */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
}

/**
 * Validate a plugin manifest
 * @public
 */
export function validatePluginManifest(manifest: TensrPluginManifest): PluginValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!manifest.id || manifest.id.trim() === '') {
    errors.push('Plugin ID cannot be empty');
  }

  if (!manifest.name || manifest.name.trim() === '') {
    errors.push('Plugin name cannot be empty');
  }

  if (!manifest.version || manifest.version.trim() === '') {
    errors.push('Plugin version cannot be empty');
  } else if (!/^\d+\.\d+\.\d+/.test(manifest.version)) {
    errors.push(`Invalid version format: ${manifest.version}`);
  }

  if (!manifest.description || manifest.description.trim() === '') {
    errors.push('Plugin description cannot be empty');
  }

  if (!manifest.author || manifest.author.trim() === '') {
    errors.push('Plugin author cannot be empty');
  }

  if (!manifest.entryPoint || manifest.entryPoint.trim() === '') {
    errors.push('Plugin entry point cannot be empty');
  }

  if (!manifest.ui || manifest.ui.trim() === '') {
    errors.push('Plugin UI file cannot be empty');
  }

  // Capabilities validation
  if (!manifest.capabilities) {
    errors.push('Plugin capabilities are required');
  } else {
    if (!manifest.capabilities.inputTypes || manifest.capabilities.inputTypes.length === 0) {
      errors.push('At least one input type is required');
    }

    if (!manifest.capabilities.outputTypes || manifest.capabilities.outputTypes.length === 0) {
      errors.push('At least one output type is required');
    }
  }

  // Tags validation
  if (!manifest.tags || manifest.tags.length === 0) {
    warnings.push('Consider adding tags for better discoverability');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
