export { Chart, DataTable, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, cn } from './chunk-Y34N6R6U.js';

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

// src/core/plugin-manifest.ts
function validatePluginManifest(manifest) {
  const errors = [];
  const warnings = [];
  if (!manifest.id || manifest.id.trim() === "") {
    errors.push("Plugin ID cannot be empty");
  }
  if (!manifest.name || manifest.name.trim() === "") {
    errors.push("Plugin name cannot be empty");
  }
  if (!manifest.version || manifest.version.trim() === "") {
    errors.push("Plugin version cannot be empty");
  } else if (!/^\d+\.\d+\.\d+/.test(manifest.version)) {
    errors.push(`Invalid version format: ${manifest.version}`);
  }
  if (!manifest.description || manifest.description.trim() === "") {
    errors.push("Plugin description cannot be empty");
  }
  if (!manifest.author || manifest.author.trim() === "") {
    errors.push("Plugin author cannot be empty");
  }
  if (!manifest.entryPoint || manifest.entryPoint.trim() === "") {
    errors.push("Plugin entry point cannot be empty");
  }
  if (!manifest.ui || manifest.ui.trim() === "") {
    errors.push("Plugin UI file cannot be empty");
  }
  if (!manifest.capabilities) {
    errors.push("Plugin capabilities are required");
  } else {
    if (!manifest.capabilities.inputTypes || manifest.capabilities.inputTypes.length === 0) {
      errors.push("At least one input type is required");
    }
    if (!manifest.capabilities.outputTypes || manifest.capabilities.outputTypes.length === 0) {
      errors.push("At least one output type is required");
    }
  }
  if (!manifest.tags || manifest.tags.length === 0) {
    warnings.push("Consider adding tags for better discoverability");
  }
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

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
  async executePlugin(plugin, _manifest, data, _uiData = {}, timeoutMs = 3e4) {
    this.startTime = Date.now();
    this.result = null;
    this.error = null;
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Plugin execution timeout")), timeoutMs);
      });
      const analysisResult = await Promise.race([
        plugin.analyze(data),
        timeoutPromise
      ]);
      if (!this.result) {
        this.result = analysisResult;
      }
      const executionTime = Date.now() - this.startTime;
      return {
        success: true,
        result: this.result,
        executionTime
      };
    } catch (error) {
      const executionTime = Date.now() - this.startTime;
      this.error = error instanceof Error ? error : new Error("Unknown error");
      return {
        success: false,
        error: this.error,
        executionTime
      };
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
};
function createPlugin(_manifest, pluginCode) {
  try {
    const cleanCode = pluginCode.replace(/export\s+/g, "").replace(/const\s+(\w+)\s*=/g, "var $1 =").replace(/let\s+(\w+)\s*=/g, "var $1 =").replace(/async\s+function/g, "function");
    const pluginFactory = new Function(`
      ${cleanCode}
      // Return the first defined plugin variable
      if (typeof TestPlugin !== 'undefined') return TestPlugin;
      if (typeof ErrorPlugin !== 'undefined') return ErrorPlugin;
      if (typeof plugin !== 'undefined') return plugin;
      throw new Error('No plugin found in code');
    `);
    const plugin = pluginFactory();
    if (!plugin || typeof plugin.analyze !== "function") {
      throw new Error("Plugin must export an object with analyze method");
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

export { ColumnType, ErrorCode, FileType, PluginError, PluginExecutor, basicStatsTemplate, correlationTemplate, createPlugin, getPluginTemplate, getPluginTemplates, utils, validateDataSet, validatePluginManifest, visualizationTemplate };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map