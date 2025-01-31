export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, cn } from './chunk-MTGUA4MK.js';

// src/utils/errors.ts
var ErrorCode = {
  INVALID_DATA: "INVALID_DATA",
  UNSUPPORTED_FILE_TYPE: "UNSUPPORTED_FILE_TYPE",
  MISSING_REQUIRED_COLUMNS: "MISSING_REQUIRED_COLUMNS",
  ANALYSIS_FAILED: "ANALYSIS_FAILED"
};
var PluginError = class extends Error {
  constructor(message, code, details) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "PluginError";
  }
};

// src/utils/plugin.ts
function validateDataSet(data, supportedTypes) {
  if (!data?.columns?.length || !data?.rows?.length) {
    throw new PluginError("Dataset must contain columns and rows", ErrorCode.INVALID_DATA);
  }
  if (!supportedTypes.includes(data.fileType)) {
    throw new PluginError(
      `Unsupported file type: ${data.fileType}`,
      ErrorCode.UNSUPPORTED_FILE_TYPE
    );
  }
}
var utils = {
  /**
   * Check if a value is numeric
   */
  isNumeric(value) {
    if (typeof value === "number") return true;
    if (typeof value === "string") {
      return !isNaN(Number(value)) && value.trim() !== "";
    }
    return false;
  },
  /**
   * Convert value to number
   */
  toNumber(value) {
    if (typeof value === "number") return value;
    return Number(value);
  },
  /**
   * Calculate mean of values
   */
  calculateMean(values) {
    if (!values.length) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  },
  /**
   * Get numeric columns from dataset
   */
  getNumericColumns(data) {
    return data.columns.filter((col) => {
      const sampleValue = data.rows[0]?.[col.id];
      return this.isNumeric(sampleValue);
    });
  }
};

// src/core/types.ts
var FileType = {
  CSV: "csv",
  XLSX: "xlsx",
  JSON: "json"
};
var ColumnType = {
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  DATE: "date"
};

// src/core/plugin.ts
function createPlugin(config) {
  return {
    getName: () => config.name,
    getVersion: () => config.version,
    getDescription: () => config.description,
    getSupportedFileTypes: () => config.supportedFileTypes,
    getCategory: () => config.category || null,
    getTags: () => config.tags || [],
    analyze: function(data) {
      validateDataSet(data, config.supportedFileTypes);
      throw new Error("analyze() must be implemented");
    },
    Component: function(_props) {
      throw new Error("Component() must be implemented");
    }
  };
}

export { ColumnType, ErrorCode, FileType, PluginError, createPlugin, utils, validateDataSet };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map