export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, cn } from './chunk-MTGUA4MK.js';

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

export { ColumnType, ErrorCode, FileType, Plugin, PluginError, PluginRegistry, executePluginAnalysis };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map