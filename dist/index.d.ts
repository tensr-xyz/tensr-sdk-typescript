export { Chart, ChartData, ChartProps, DataTable, DataTableProps, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from './components/index.js';
import { JSX } from 'react';
import { ClassValue } from 'clsx';
import 'react/jsx-runtime';
import '@radix-ui/react-dialog';

/**
 * Supported file types for analysis
 * @public
 */
declare const FileType: {
    readonly CSV: "csv";
    readonly XLSX: "xlsx";
    readonly JSON: "json";
};
type FileType = (typeof FileType)[keyof typeof FileType];
/**
 * Column data type definitions
 * @public
 */
declare const ColumnType: {
    readonly STRING: "string";
    readonly NUMBER: "number";
    readonly BOOLEAN: "boolean";
    readonly DATE: "date";
};
type ColumnType = (typeof ColumnType)[keyof typeof ColumnType];
/**
 * Column definition
 * @public
 */
interface Column {
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
interface DataSet {
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
interface AnalysisResult {
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
interface PluginComponentProps {
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
 * Core plugin interface
 * @public
 */
interface TensrPlugin {
    /** Analyze the provided dataset */
    analyze(data: DataSet): Promise<AnalysisResult> | AnalysisResult;
    /** React component to display results */
    Component(props: PluginComponentProps): JSX.Element;
}

/**
 * Plugin manifest structure for Tensr plugins
 * @public
 */
interface TensrPluginManifest {
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
interface PluginExecutionContext {
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
interface PluginExecutionResult {
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
interface PluginValidationResult {
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
declare function validatePluginManifest(manifest: TensrPluginManifest): PluginValidationResult;

/**
 * Plugin executor for running Tensr plugins in a sandboxed environment
 * @public
 */
declare class PluginExecutor {
    private result;
    private error;
    private startTime;
    /**
     * Execute a plugin with given data and UI parameters
     */
    executePlugin(plugin: TensrPlugin, _manifest: TensrPluginManifest, data: DataSet, _uiData?: Record<string, unknown>, timeoutMs?: number): Promise<{
        success: boolean;
        result?: AnalysisResult;
        error?: Error;
        executionTime: number;
    }>;
    /**
     * Validate a plugin manifest
     */
    validateManifest(manifest: TensrPluginManifest): PluginValidationResult;
}
/**
 * Create a plugin from manifest and code
 * @public
 */
declare function createPlugin(_manifest: TensrPluginManifest, pluginCode: string): TensrPlugin;

/**
 * Plugin template for basic statistical analysis
 * @public
 */
declare const basicStatsTemplate: TensrPluginManifest;
/**
 * Plugin template for correlation analysis
 * @public
 */
declare const correlationTemplate: TensrPluginManifest;
/**
 * Plugin template for data visualization
 * @public
 */
declare const visualizationTemplate: TensrPluginManifest;
/**
 * Get all available plugin templates
 * @public
 */
declare function getPluginTemplates(): TensrPluginManifest[];
/**
 * Get plugin template by ID
 * @public
 */
declare function getPluginTemplate(id: string): TensrPluginManifest | undefined;

declare function cn(...inputs: ClassValue[]): string;

/**
 * Validates a dataset before analysis
 * @param data - Dataset to validate
 * @param supportedTypes - Supported file types
 * @throws {PluginError} When validation fails
 * @public
 */
declare function validateDataSet(data: DataSet, supportedTypes: FileType[]): void;
/**
 * Utility functions for data analysis
 * @public
 */
declare const utils: {
    /**
     * Check if a value is numeric
     */
    isNumeric(value: unknown): boolean;
    /**
     * Convert value to number
     */
    toNumber(value: unknown): number;
    /**
     * Calculate mean of values
     */
    calculateMean(values: number[]): number;
    /**
     * Get numeric columns from dataset
     */
    getNumericColumns(data: DataSet): Column[];
};

/**
 * Error codes for plugin operations
 * @public
 */
declare const ErrorCode: {
    readonly INVALID_DATA: "INVALID_DATA";
    readonly UNSUPPORTED_FILE_TYPE: "UNSUPPORTED_FILE_TYPE";
    readonly MISSING_REQUIRED_COLUMNS: "MISSING_REQUIRED_COLUMNS";
    readonly ANALYSIS_FAILED: "ANALYSIS_FAILED";
};
type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
/**
 * Custom error class for plugin operations
 * @public
 */
declare class PluginError extends Error {
    code: ErrorCode;
    details?: Record<string, unknown> | undefined;
    constructor(message: string, code: ErrorCode, details?: Record<string, unknown> | undefined);
}

export { type AnalysisResult, type Column, ColumnType, type DataSet, ErrorCode, FileType, type PluginComponentProps, PluginError, type PluginExecutionContext, type PluginExecutionResult, PluginExecutor, type PluginValidationResult, type TensrPlugin, type TensrPluginManifest, basicStatsTemplate, cn, correlationTemplate, createPlugin, getPluginTemplate, getPluginTemplates, utils, validateDataSet, validatePluginManifest, visualizationTemplate };
