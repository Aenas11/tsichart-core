#!/bin/bash

# Setup script for linking tsichart-core to the React test app
# This allows testing local changes without publishing

echo "🔗 Setting up local package link for tsichart-core..."

# Step 1: Build the core package
echo ""
echo "📦 Building tsichart-core package..."
cd /workspaces/TSIClient/packages/core
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix build errors first."
    exit 1
fi

# Step 2: Create npm link
echo ""
echo "🔗 Creating npm link for tsichart-core..."
npm link

# Step 3: Link in test app
echo ""
echo "🔗 Linking tsichart-core in React test app..."
cd /workspaces/TSIClient/test-apps/react/reacttest
npm link tsichart-core

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Restart the TypeScript server in VS Code:"
echo "      - Press Ctrl/Cmd + Shift + P"
echo "      - Type 'TypeScript: Restart TS Server'"
echo "      - Press Enter"
echo ""
echo "   2. Start the dev server:"
echo "      cd /workspaces/TSIClient/test-apps/react/reacttest"
echo "      npm run dev"
echo ""
echo "💡 To unlink later, run:"
echo "   cd /workspaces/TSIClient/test-apps/react/reacttest"
echo "   npm unlink tsichart-core"
echo "   npm install"
