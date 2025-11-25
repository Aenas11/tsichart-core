#!/bin/bash

echo "========================================="
echo "Phase 1 Verification Script"
echo "========================================="
echo ""

# Check workspace structure
echo "✓ Checking workspace structure..."
if [ -d "packages/core" ] && [ -d "packages/react" ] && [ -d "packages/vue" ]; then
    echo "  ✅ All package directories exist"
else
    echo "  ❌ Missing package directories"
    exit 1
fi

# Check core package structure
echo ""
echo "✓ Checking core package structure..."
if [ -f "packages/core/package.json" ] && [ -f "packages/core/tsconfig.json" ] && [ -f "packages/core/rollup.config.mjs" ]; then
    echo "  ✅ Core package configuration files exist"
else
    echo "  ❌ Missing core package configuration"
    exit 1
fi

# Check source directories
echo ""
echo "✓ Checking source directories..."
DIRS=("components" "models" "utils" "constants" "interfaces" "icons" "styles")
for dir in "${DIRS[@]}"; do
    if [ -d "packages/core/src/$dir" ]; then
        echo "  ✅ packages/core/src/$dir exists"
    else
        echo "  ❌ Missing packages/core/src/$dir"
        exit 1
    fi
done

# Check test directories
echo ""
echo "✓ Checking test directories..."
if [ -d "packages/core/__tests__" ]; then
    echo "  ✅ Test directory structure created"
else
    echo "  ❌ Missing test directories"
    exit 1
fi

# Check pnpm workspace
echo ""
echo "✓ Checking pnpm workspace configuration..."
if [ -f "pnpm-workspace.yaml" ]; then
    echo "  ✅ pnpm-workspace.yaml exists"
else
    echo "  ❌ Missing pnpm-workspace.yaml"
    exit 1
fi

# Check node_modules
echo ""
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✅ Dependencies installed"
else
    echo "  ⚠️  Dependencies not installed - run 'pnpm install'"
fi

echo ""
echo "========================================="
echo "✅ Phase 1 Verification Complete!"
echo "========================================="
echo ""
echo "Next Steps:"
echo "1. Test build: pnpm build:core"
echo "2. Start Phase 2: Jest setup"
echo ""
