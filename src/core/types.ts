import { JSX } from "react";

/**
 * Supported file types for analysis
 * @public
 */
export const FileType = {
  CSV: 'csv',
  XLSX: 'xlsx',
  JSON: 'json',
} as const;

export type FileType = (typeof FileType)[keyof typeof FileType];

/**
 * Column data type definitions
 * @public
 */
export const ColumnType = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date',
} as const;

export type ColumnType = (typeof ColumnType)[keyof typeof ColumnType];

/**
 * Represents a column in a dataset
 * @public
 */
export interface Column {
  /** Unique identifier for the column */
  id: string;
  /** Display name of the column */
  name: string;
  /** Data type of the column */
  type: ColumnType;
  /** Additional metadata about the column */
  metadata?: Record<string, unknown>;
}

/**
 * Core dataset that plugins will analyze
 * @public
 */
export interface DataSet {
  /** Array of column definitions */
  columns: Column[];
  /** Array of data rows */
  rows: Record<string, unknown>[];
  /** Total number of rows in the dataset */
  totalRows: number;
  /** Total number of columns in the dataset */
  totalColumns: number;
  /** Type of file the data came from */
  fileType: FileType;
  /** Additional metadata about the dataset */
  metadata?: Record<string, unknown>;
}

/**
 * Result of plugin analysis
 * @public
 */
export interface AnalysisResult {
  /** Analysis output data */
  data: Record<string, unknown>;
  /** Optional error message */
  error?: string;
  /** Optional warning messages */
  warnings?: string[];
  /** Metadata about the analysis */
  metadata?: {
    executionTime?: number;
    processedRows?: number;
    processedColumns?: string[];
  };
}

/**
 * Props passed to plugin's UI component
 * @public
 */
export interface PluginComponentProps {
  /** Analysis results to display */
  result: AnalysisResult;
  /** Dataset that was analyzed */
  data: DataSet;
  /** Callback when component should close */
  onClose?: () => void;
  /** Optional className for styling */
  className?: string;
}

export type PluginComponentType = (props: PluginComponentProps) => JSX.Element;

/**
 * Plugin configuration derived from package.json
 * @public
 */
export interface PluginConfig {
  /** Plugin name */
  name: string;
  /** Plugin version */
  version: string;
  /** Plugin description */
  description: string;
  /** Plugin author */
  author: string;
  /** Entry point file */
  main: string;
  /** Supported file types */
  supportedFileTypes: FileType[];
  /** Plugin category */
  category?: 'analysis' | 'visualization' | 'export' | 'utility';
  /** Search tags */
  tags?: string[];
}

/**
 * Options for analysis execution
 * @public
 */
export interface AnalysisOptions {
  /** Columns to include in analysis */
  selectedColumns?: string[];
  /** Additional parameters */
  parameters?: Record<string, unknown>;
}

/**
 * Plugin error with additional context
 * @public
 */
export class PluginError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'PluginError';
  }
}

/**
 * Common error codes that can be thrown by plugins
 * @public
 */
export const ErrorCode = {
  INVALID_DATA: 'INVALID_DATA',
  UNSUPPORTED_FILE_TYPE: 'UNSUPPORTED_FILE_TYPE',
  MISSING_REQUIRED_COLUMNS: 'MISSING_REQUIRED_COLUMNS',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
