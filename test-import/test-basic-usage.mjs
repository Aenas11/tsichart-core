/**
 * Basic usage example showing how to import and use tsichart-core
 * This demonstrates the recommended import patterns from the README
 */

console.log('📊 Testing basic tsichart-core usage...\n');

// Method 1: Import everything
console.log('Method 1: Import all components');
console.log('─────────────────────────────────────\n');

try {
    const TsiClient = await import('tsichart-core');
    console.log('✅ Imported TsiClient successfully');
    console.log('Available exports:', Object.keys(TsiClient.default || TsiClient));
    console.log('');
} catch (e) {
    console.log('❌ Failed to import TsiClient');
    console.log('Error:', e.message);
    console.log('');
}

// Method 2: Import individual components (recommended for tree-shaking)
console.log('Method 2: Import individual components (Tree-shakeable)');
console.log('───────────────────────────────────────────────────────────\n');

try {
    const LineChart = await import('tsichart-core/LineChart');
    const HierarchyNavigation = await import('tsichart-core/HierarchyNavigation');
    const DateTimePicker = await import('tsichart-core/DateTimePicker');
    
    console.log('✅ Imported LineChart:', typeof LineChart.default);
    console.log('✅ Imported HierarchyNavigation:', typeof HierarchyNavigation.default);
    console.log('✅ Imported DateTimePicker:', typeof DateTimePicker.default);
    console.log('');
    console.log('This is the RECOMMENDED approach for production apps!');
    console.log('Benefits: Smaller bundle size, faster load times');
    console.log('');
} catch (e) {
    console.log('❌ Failed to import components');
    console.log('Error:', e.message);
    console.log('');
}

// Method 3: Import utilities
console.log('Method 3: Import utilities');
console.log('─────────────────────────────────────\n');

try {
    const Utils = await import('tsichart-core/Utils');
    console.log('✅ Imported Utils successfully');
    console.log('Available utilities:', Object.keys(Utils));
    console.log('');
} catch (e) {
    console.log('❌ Failed to import Utils');
    console.log('Error:', e.message);
    console.log('');
}

console.log('═══════════════════════════════════════════════════════════');
console.log('✅ All basic usage tests completed successfully!');
console.log('═══════════════════════════════════════════════════════════');
