/**
 * Error codes for plugin operations
 * @public
 */
export const ErrorCode = {
    INVALID_DATA: 'INVALID_DATA',
    UNSUPPORTED_FILE_TYPE: 'UNSUPPORTED_FILE_TYPE',
    MISSING_REQUIRED_COLUMNS: 'MISSING_REQUIRED_COLUMNS',
    ANALYSIS_FAILED: 'ANALYSIS_FAILED',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Custom error class for plugin operations
 * @public
 */
export class PluginError extends Error {
    constructor(
        message: string,
        public code: ErrorCode,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'PluginError';
    }
}
