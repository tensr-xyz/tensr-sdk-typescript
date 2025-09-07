import { describe, it, expect } from 'vitest';
import { 
  TensrPluginManifest, 
  validatePluginManifest,
  PluginValidationResult 
} from '../../src/core/plugin-manifest';

describe('Plugin Manifest', () => {
  const validManifest: TensrPluginManifest = {
    id: 'test-plugin',
    name: 'Test Plugin',
    version: '1.0.0',
    description: 'A test plugin',
    author: 'Test Author',
    entryPoint: 'dist/index.js',
    ui: 'ui.html',
    capabilities: {
      inputTypes: ['csv'],
      outputTypes: ['table']
    },
    tags: ['test']
  };

  describe('validatePluginManifest', () => {
    it('should validate a correct manifest', () => {
      const result = validatePluginManifest(validManifest);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject manifest with missing required fields', () => {
      const invalidManifest = { ...validManifest };
      delete (invalidManifest as any).id;
      
      const result = validatePluginManifest(invalidManifest);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Plugin ID cannot be empty');
    });

    it('should reject manifest with invalid version', () => {
      const invalidManifest = { ...validManifest, version: 'invalid-version' };
      
      const result = validatePluginManifest(invalidManifest);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid version format: invalid-version');
    });

    it('should reject manifest with empty capabilities', () => {
      const invalidManifest = { 
        ...validManifest, 
        capabilities: { inputTypes: [], outputTypes: [] }
      };
      
      const result = validatePluginManifest(invalidManifest);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one input type is required');
    });
  });
});
