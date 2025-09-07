#!/bin/bash

# My First Plugin - Build Script
echo "🚀 Building My First Plugin..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Validate manifest
echo "✅ Validating plugin manifest..."
node -e "
const manifest = require('./manifest.json');
console.log('Plugin ID:', manifest.id);
console.log('Version:', manifest.version);
console.log('Input Types:', manifest.capabilities.inputTypes.join(', '));
console.log('Output Types:', manifest.capabilities.outputTypes.join(', '));
"

# Check build output
echo "📋 Build output:"
ls -la dist/

echo "✅ Build complete! Your plugin is ready to upload to Tensr."
echo ""
echo "Next steps:"
echo "1. Test your plugin: npm test"
echo "2. Zip the entire folder"
echo "3. Upload to Tensr platform"
echo "4. Set pricing and publish!"
