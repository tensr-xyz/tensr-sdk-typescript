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
 * Plugin category type
 * @public
 */
type PluginCategory = 'analysis' | 'visualization' | 'export' | 'utility';
/**
 * Core plugin interface
 * @public
 */
interface TensrPlugin {
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

export { type AnalysisResult, type Column, ColumnType, type DataSet, ErrorCode, FileType, type PluginCategory, type PluginComponentProps, PluginError, type TensrPlugin, cn, utils, validateDataSet };
