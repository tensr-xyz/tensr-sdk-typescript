import { JSX } from 'react';

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
 * Column definition
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
 * Dataset structure for analysis
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
 * Analysis result structure
 * @public
 */
export interface AnalysisResult {
  /** Analysis output data */
  data: Record<string, unknown>;
  /** Metadata about the analysis */
  metadata?: {
    /** Time taken to execute analysis in ms */
    executionTime?: number;
    /** Number of rows processed */
    processedRows?: number;
    /** Names of columns that were processed */
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

/**
 * Plugin category type
 * @public
 */
export type PluginCategory = 'analysis' | 'visualization' | 'export' | 'utility';

/**
 * Core plugin interface
 * @public
 */
export interface TensrPlugin {
  /** Analyze the provided dataset */
  analyze(data: DataSet): Promise<AnalysisResult> | AnalysisResult;
  /** React component to display results */
  Component: (props: PluginComponentProps) => JSX.Element;
  /** Get plugin name */
  getName(): string;
  /** Get plugin version */
  getVersion(): string;
  /** Get plugin description */
  getDescription(): string;
  /** Get supported file types */
  getSupportedFileTypes(): FileType[];
  /** Get plugin category if defined */
  getCategory(): PluginCategory | null;
  /** Get plugin tags */
  getTags(): string[];
}
