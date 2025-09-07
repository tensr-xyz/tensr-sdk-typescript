import { DataSet, FileType } from '@/core/types';
import { ErrorCode, PluginError } from './errors';

/**
 * Validates a dataset before analysis
 * @param data - Dataset to validate
 * @param supportedTypes - Supported file types
 * @throws {PluginError} When validation fails
 * @public
 */
export function validateDataSet(data: DataSet, supportedTypes: FileType[]): void {
  if (!data?.columns?.length || !data?.rows?.length) {
    throw new PluginError('Dataset must contain columns and rows', ErrorCode.INVALID_DATA);
  }

  if (!supportedTypes.includes(data.fileType)) {
    throw new PluginError(
      `Unsupported file type: ${data.fileType}`,
      ErrorCode.UNSUPPORTED_FILE_TYPE
    );
  }
}

/**
 * Utility functions for data analysis
 * @public
 */
export const utils = {
  /**
   * Check if a value is numeric
   */
  isNumeric(value: unknown): boolean {
    if (typeof value === 'number') return true;
    if (typeof value === 'string') {
      return !isNaN(Number(value)) && value.trim() !== '';
    }
    return false;
  },

  /**
   * Convert value to number
   */
  toNumber(value: unknown): number {
    if (typeof value === 'number') return value;
    return Number(value);
  },

  /**
   * Calculate mean of values
   */
  calculateMean(values: number[]): number {
    if (!values.length) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  },

  /**
   * Get numeric columns from dataset
   */
  getNumericColumns(data: DataSet) {
    return data.columns.filter((col) => {
      const sampleValue = data.rows[0]?.[col.id];
      return this.isNumeric(sampleValue);
    });
  },
};
