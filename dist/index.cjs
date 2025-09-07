'use strict';

var chunk6AI3OWQO_cjs = require('./chunk-6AI3OWQO.cjs');

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

// src/core/plugin-executor.ts
var PluginExecutor = class {
  constructor() {
    this.result = null;
    this.error = null;
    this.startTime = 0;
  }
  /**
   * Execute a plugin with given data and UI parameters
   */
  async executePlugin(plugin, _manifest, data, _uiData = {}) {
    this.startTime = Date.now();
    this.result = null;
    this.error = null;
    try {
      const analysisResult = await plugin.analyze(data);
      if (!this.result) {
        this.result = analysisResult;
      }
      const executionTime = Date.now() - this.startTime;
      return {
        result: this.result,
        metadata: {
          executionTime,
          memoryUsed: this.getMemoryUsage(),
          warnings: this.getWarnings()
        }
      };
    } catch (error) {
      throw new Error(`Plugin execution failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  /**
   * Validate a plugin manifest
   */
  validateManifest(manifest) {
    const errors = [];
    const warnings = [];
    if (!manifest.id) errors.push("Plugin ID is required");
    if (!manifest.name) errors.push("Plugin name is required");
    if (!manifest.version) errors.push("Plugin version is required");
    if (!manifest.description) errors.push("Plugin description is required");
    if (!manifest.author) errors.push("Plugin author is required");
    if (!manifest.entryPoint) errors.push("Plugin entry point is required");
    if (!manifest.ui) errors.push("Plugin UI file is required");
    if (!manifest.capabilities) {
      errors.push("Plugin capabilities are required");
    } else {
      if (!manifest.capabilities.inputTypes || manifest.capabilities.inputTypes.length === 0) {
        errors.push("Plugin must specify at least one input type");
      }
      if (!manifest.capabilities.outputTypes || manifest.capabilities.outputTypes.length === 0) {
        errors.push("Plugin must specify at least one output type");
      }
    }
    if (manifest.version && !/^\d+\.\d+\.\d+/.test(manifest.version)) {
      warnings.push("Version should follow semantic versioning (e.g., 1.0.0)");
    }
    if (manifest.config) {
      if (manifest.config.timeout && manifest.config.timeout < 1) {
        warnings.push("Timeout should be at least 1 second");
      }
      if (manifest.config.maxMemory && manifest.config.maxMemory < 10) {
        warnings.push("Max memory should be at least 10MB");
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
  getMemoryUsage() {
    return 0;
  }
  /**
   * Get execution warnings
   */
  getWarnings() {
    const warnings = [];
    if (this.error) {
      warnings.push(`Plugin execution completed with errors: ${this.error.message}`);
    }
    return warnings;
  }
};
function createPlugin(_manifest, pluginCode) {
  try {
    const pluginFactory = new Function("TensrSDK", `
      ${pluginCode}
      return plugin;
    `);
    const plugin = pluginFactory({
      // Add other SDK exports here
    });
    if (!plugin || typeof plugin.analyze !== "function" || typeof plugin.Component !== "function") {
      throw new Error("Plugin must export an object with analyze and Component methods");
    }
    return plugin;
  } catch (error) {
    throw new Error(`Failed to create plugin: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// src/templates/index.ts
var basicStatsTemplate = {
  id: "basic-stats-template",
  name: "Basic Statistics",
  version: "1.0.0",
  description: "Calculate basic descriptive statistics for numeric data",
  author: "Tensr",
  entryPoint: "dist/index.js",
  ui: "ui.html",
  capabilities: {
    inputTypes: ["csv", "xlsx"],
    outputTypes: ["table", "chart"]
  },
  config: {
    timeout: 30,
    maxMemory: 100
  },
  tags: ["statistics", "descriptive", "basic"]
};
var correlationTemplate = {
  id: "correlation-template",
  name: "Correlation Analysis",
  version: "1.0.0",
  description: "Calculate correlation coefficients between numeric variables",
  author: "Tensr",
  entryPoint: "dist/index.js",
  ui: "ui.html",
  capabilities: {
    inputTypes: ["csv", "xlsx"],
    outputTypes: ["table", "chart"]
  },
  config: {
    timeout: 60,
    maxMemory: 200
  },
  tags: ["statistics", "correlation", "analysis"]
};
var visualizationTemplate = {
  id: "visualization-template",
  name: "Data Visualization",
  version: "1.0.0",
  description: "Create charts and graphs from your data",
  author: "Tensr",
  entryPoint: "dist/index.js",
  ui: "ui.html",
  capabilities: {
    inputTypes: ["csv", "xlsx", "json"],
    outputTypes: ["chart", "image"]
  },
  config: {
    timeout: 45,
    maxMemory: 150
  },
  tags: ["visualization", "charts", "graphs"]
};
function getPluginTemplates() {
  return [
    basicStatsTemplate,
    correlationTemplate,
    visualizationTemplate
  ];
}
function getPluginTemplate(id) {
  return getPluginTemplates().find((template) => template.id === id);
}

Object.defineProperty(exports, "Chart", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.Chart; }
});
Object.defineProperty(exports, "DataTable", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.DataTable; }
});
Object.defineProperty(exports, "Dialog", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.Dialog; }
});
Object.defineProperty(exports, "DialogClose", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.DialogClose; }
});
Object.defineProperty(exports, "DialogContent", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.DialogContent; }
});
Object.defineProperty(exports, "DialogDescription", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.DialogDescription; }
});
Object.defineProperty(exports, "DialogFooter", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.DialogFooter; }
});
Object.defineProperty(exports, "DialogHeader", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.DialogHeader; }
});
Object.defineProperty(exports, "DialogOverlay", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.DialogOverlay; }
});
Object.defineProperty(exports, "DialogPortal", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.DialogPortal; }
});
Object.defineProperty(exports, "DialogTitle", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.DialogTitle; }
});
Object.defineProperty(exports, "DialogTrigger", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.DialogTrigger; }
});
Object.defineProperty(exports, "cn", {
  enumerable: true,
  get: function () { return chunk6AI3OWQO_cjs.cn; }
});
exports.ColumnType = ColumnType;
exports.ErrorCode = ErrorCode;
exports.FileType = FileType;
exports.PluginError = PluginError;
exports.PluginExecutor = PluginExecutor;
exports.basicStatsTemplate = basicStatsTemplate;
exports.correlationTemplate = correlationTemplate;
exports.createPlugin = createPlugin;
exports.getPluginTemplate = getPluginTemplate;
exports.getPluginTemplates = getPluginTemplates;
exports.utils = utils;
exports.validateDataSet = validateDataSet;
exports.visualizationTemplate = visualizationTemplate;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map