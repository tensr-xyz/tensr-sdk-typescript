'use strict';

var chunkHZGV5JBS_cjs = require('./chunk-HZGV5JBS.cjs');

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
var PluginError = class extends Error {
  constructor(message, code, details) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "PluginError";
  }
};
var ErrorCode = {
  INVALID_DATA: "INVALID_DATA",
  UNSUPPORTED_FILE_TYPE: "UNSUPPORTED_FILE_TYPE",
  MISSING_REQUIRED_COLUMNS: "MISSING_REQUIRED_COLUMNS",
  ANALYSIS_FAILED: "ANALYSIS_FAILED",
  VALIDATION_ERROR: "VALIDATION_ERROR"
};

// src/core/plugin.ts
var Plugin = class {
  constructor(config) {
    this.validateConfig(config);
    this.config = config;
  }
  /**
   * Get plugin identifier
   */
  getId() {
    return this.config.name;
  }
  /**
   * Get plugin display name
   */
  getName() {
    return this.config.name;
  }
  /**
   * Get plugin description
   */
  getDescription() {
    return this.config.description;
  }
  /**
   * Check if plugin supports given file type
   */
  supportsFileType(fileType) {
    return this.config.supportedFileTypes.includes(fileType);
  }
  /**
   * Get supported file types
   */
  getSupportedFileTypes() {
    return this.config.supportedFileTypes;
  }
  /**
   * Validate dataset before analysis
   * @throws {PluginError} When validation fails
   */
  validateDataSet(data) {
    if (!data.columns?.length || !data.rows?.length) {
      throw new PluginError("Dataset must contain columns and rows", ErrorCode.INVALID_DATA);
    }
    if (!this.supportsFileType(data.fileType)) {
      throw new PluginError(
        `Unsupported file type: ${data.fileType}`,
        ErrorCode.UNSUPPORTED_FILE_TYPE
      );
    }
  }
  validateConfig(config) {
    if (!config.name || !config.version || !config.supportedFileTypes?.length) {
      throw new Error("Invalid plugin configuration");
    }
    config.supportedFileTypes.forEach((type) => {
      if (!Object.values(FileType).includes(type)) {
        throw new Error(`Invalid file type: ${type}`);
      }
    });
  }
};
var PluginRegistry = class {
  constructor() {
    this.plugins = /* @__PURE__ */ new Map();
  }
  /**
   * Register a new plugin
   * @throws {Error} If plugin is already registered
   */
  registerPlugin(plugin) {
    if (this.plugins.has(plugin.getId())) {
      throw new Error(`Plugin ${plugin.getId()} is already registered`);
    }
    this.plugins.set(plugin.getId(), plugin);
  }
  /**
   * Unregister a plugin
   */
  unregisterPlugin(id) {
    this.plugins.delete(id);
  }
  /**
   * Get a plugin by ID
   */
  getPlugin(id) {
    return this.plugins.get(id);
  }
  /**
   * Get all plugins that support a specific file type
   */
  getPluginsForFileType(fileType) {
    return Array.from(this.plugins.values()).filter((plugin) => plugin.supportsFileType(fileType));
  }
  /**
   * Get all registered plugins
   */
  getAllPlugins() {
    return Array.from(this.plugins.values());
  }
};
async function executePluginAnalysis(plugin, data, options) {
  try {
    plugin["validateDataSet"](data);
    return await plugin.analyze(data, options);
  } catch (error) {
    if (error instanceof PluginError) {
      throw error;
    }
    throw new PluginError(
      "Analysis failed: " + error.message,
      ErrorCode.ANALYSIS_FAILED,
      { originalError: error }
    );
  }
}

Object.defineProperty(exports, "Dialog", {
  enumerable: true,
  get: function () { return chunkHZGV5JBS_cjs.Dialog; }
});
Object.defineProperty(exports, "DialogClose", {
  enumerable: true,
  get: function () { return chunkHZGV5JBS_cjs.DialogClose; }
});
Object.defineProperty(exports, "DialogContent", {
  enumerable: true,
  get: function () { return chunkHZGV5JBS_cjs.DialogContent; }
});
Object.defineProperty(exports, "DialogDescription", {
  enumerable: true,
  get: function () { return chunkHZGV5JBS_cjs.DialogDescription; }
});
Object.defineProperty(exports, "DialogFooter", {
  enumerable: true,
  get: function () { return chunkHZGV5JBS_cjs.DialogFooter; }
});
Object.defineProperty(exports, "DialogHeader", {
  enumerable: true,
  get: function () { return chunkHZGV5JBS_cjs.DialogHeader; }
});
Object.defineProperty(exports, "DialogOverlay", {
  enumerable: true,
  get: function () { return chunkHZGV5JBS_cjs.DialogOverlay; }
});
Object.defineProperty(exports, "DialogPortal", {
  enumerable: true,
  get: function () { return chunkHZGV5JBS_cjs.DialogPortal; }
});
Object.defineProperty(exports, "DialogTitle", {
  enumerable: true,
  get: function () { return chunkHZGV5JBS_cjs.DialogTitle; }
});
Object.defineProperty(exports, "DialogTrigger", {
  enumerable: true,
  get: function () { return chunkHZGV5JBS_cjs.DialogTrigger; }
});
Object.defineProperty(exports, "cn", {
  enumerable: true,
  get: function () { return chunkHZGV5JBS_cjs.cn; }
});
exports.ColumnType = ColumnType;
exports.ErrorCode = ErrorCode;
exports.FileType = FileType;
exports.Plugin = Plugin;
exports.PluginError = PluginError;
exports.PluginRegistry = PluginRegistry;
exports.executePluginAnalysis = executePluginAnalysis;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map