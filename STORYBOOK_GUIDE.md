# Storybook Setup Guide

This guide explains how to set up and use Storybook for developing and documenting TSIChart components.

## 🚀 Quick Start

### Local Development
```bash
# Start Storybook development server
pnpm storybook

# Build Storybook for production  
pnpm build-storybook
```

Storybook will be available at `http://localhost:6006`

## 📦 What's Included

### Stories
- **LineChart**: Interactive time series line charts with full feature demonstration
- **Introduction**: Overview and getting started guide

### Addons
- **Controls**: Real-time property editing
- **Docs**: Auto-generated documentation  
- **A11y**: Accessibility testing
- **Vitest**: Integration testing capabilities

## 🌐 GitHub Pages Deployment

Storybook automatically deploys to GitHub Pages when you:

1. Push changes to `main` or `refactor/monorepo-structure` branches
2. Modify files in `stories/`, `packages/core/src/`, or `.storybook/` directories
3. Manually trigger the workflow

**Live Storybook**: `https://aenas11.github.io/tsichart-core/` (after deployment)

### Manual Deployment
```bash
# Build and deploy manually
pnpm build-storybook
# Upload the storybook-static/ folder to your hosting service
```

## 🔧 Configuration

### Adding New Stories
Create `.stories.ts` files in the `stories/` directory:

```typescript
// stories/NewComponent.stories.ts
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import NewComponent from '../packages/core/src/components/NewComponent/NewComponent';

const meta: Meta = {
    title: 'Charts/NewComponent',
    parameters: {
        docs: {
            description: {
                component: 'Description of your component'
            }
        }
    },
    argTypes: {
        // Define controls for component properties
    }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: (args) => html`<div>Your component markup</div>`
};
```

### Customizing Configuration

- **`.storybook/main.ts`**: Main Storybook configuration
- **`.storybook/preview.ts`**: Global decorators, parameters, and styles
- **`.storybook/vitest.setup.ts`**: Testing configuration

## 🎨 Styling & Theming

The core TSIChart styles are automatically imported in `.storybook/preview.ts`:

```typescript
import '../packages/core/src/styles/index.scss';
```

### Background Options
Storybook includes predefined backgrounds:
- Light (`#ffffff`)
- Dark (`#1a1a1a`) 
- Gray (`#f5f5f5`)

## ♿ Accessibility Testing

The a11y addon automatically tests stories for accessibility violations:
- Violations appear in the "Accessibility" panel
- Set to "todo" mode (shows issues without failing CI)
- Can be configured to "error" mode for CI enforcement

## 🧪 Testing Integration

Stories can be used as test cases with the Vitest addon:
- Import stories in test files
- Use story args as test data
- Consistent component behavior across docs and tests

## 📝 Documentation Best Practices

1. **Rich Descriptions**: Use MDX for detailed component documentation
2. **Code Examples**: Include usage examples in the `docs.description.component`
3. **ArgTypes**: Define proper controls for interactive property testing
4. **Multiple Stories**: Show different use cases and configurations
5. **Accessibility**: Ensure all stories pass a11y checks

## 🔍 Debugging

### Common Issues

**Component not rendering**:
- Check import paths in stories
- Ensure core package is built (`pnpm build:core`)
- Verify dependencies are available globally (d3, moment)

**Styles not loading**:
- Check `.storybook/preview.ts` imports
- Ensure SCSS files are in the correct location
- Verify build tools can process styles

**TypeScript errors**:
- Run `pnpm build:core` before starting Storybook
- Check story file types match component interfaces
- Ensure proper imports and exports

## 🚀 Production Deployment

The GitHub Actions workflow automatically:
1. Installs dependencies with pnpm
2. Builds the core package
3. Builds Storybook static files
4. Deploys to GitHub Pages

**Manual deployment steps**:
```bash
pnpm install
pnpm build:core
pnpm build-storybook
# Deploy storybook-static/ folder
```

---

Happy documenting! 🎉
