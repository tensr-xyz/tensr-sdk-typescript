export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from './components/index.cjs';
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
 * Represents a column in a dataset
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
 * Core dataset that plugins will analyze
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
 * Result of plugin analysis
 * @public
 */
interface AnalysisResult {
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
type PluginComponentType = (props: PluginComponentProps) => JSX.Element;
/**
 * Plugin configuration derived from package.json
 * @public
 */
interface PluginConfig {
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
interface AnalysisOptions {
    /** Columns to include in analysis */
    selectedColumns?: string[];
    /** Additional parameters */
    parameters?: Record<string, unknown>;
}
/**
 * Plugin error with additional context
 * @public
 */
declare class PluginError extends Error {
    code: string;
    details?: Record<string, unknown> | undefined;
    constructor(message: string, code: string, details?: Record<string, unknown> | undefined);
}
/**
 * Common error codes that can be thrown by plugins
 * @public
 */
declare const ErrorCode: {
    readonly INVALID_DATA: "INVALID_DATA";
    readonly UNSUPPORTED_FILE_TYPE: "UNSUPPORTED_FILE_TYPE";
    readonly MISSING_REQUIRED_COLUMNS: "MISSING_REQUIRED_COLUMNS";
    readonly ANALYSIS_FAILED: "ANALYSIS_FAILED";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
};
type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Base class for all plugins
 * @public
 */
declare abstract class Plugin {
    protected config: PluginConfig;
    constructor(config: PluginConfig);
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
    getId(): string;
    /**
     * Get plugin display name
     */
    getName(): string;
    /**
     * Get plugin description
     */
    getDescription(): string;
    /**
     * Check if plugin supports given file type
     */
    supportsFileType(fileType: FileType): boolean;
    /**
     * Get supported file types
     */
    getSupportedFileTypes(): FileType[];
    /**
     * Validate dataset before analysis
     * @throws {PluginError} When validation fails
     */
    protected validateDataSet(data: DataSet): void;
    private validateConfig;
}
/**
 * Registry for managing plugins
 * @public
 */
declare class PluginRegistry {
    private plugins;
    /**
     * Register a new plugin
     * @throws {Error} If plugin is already registered
     */
    registerPlugin(plugin: Plugin): void;
    /**
     * Unregister a plugin
     */
    unregisterPlugin(id: string): void;
    /**
     * Get a plugin by ID
     */
    getPlugin(id: string): Plugin | undefined;
    /**
     * Get all plugins that support a specific file type
     */
    getPluginsForFileType(fileType: FileType): Plugin[];
    /**
     * Get all registered plugins
     */
    getAllPlugins(): Plugin[];
}
/**
 * Execute plugin analysis with validation and error handling
 * @public
 */
declare function executePluginAnalysis(plugin: Plugin, data: DataSet, options?: AnalysisOptions): Promise<AnalysisResult>;

declare function cn(...inputs: ClassValue[]): string;

export { type AnalysisOptions, type AnalysisResult, type Column, ColumnType, type DataSet, ErrorCode, FileType, Plugin, type PluginComponentProps, type PluginComponentType, type PluginConfig, PluginError, PluginRegistry, cn, executePluginAnalysis };
