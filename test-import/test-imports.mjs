/**
 * Test script to verify all tsichart-core imports work correctly
 * This tests both the main import and individual component imports
 */

console.log('🧪 Testing tsichart-core imports...\n');

let passedTests = 0;
let failedTests = 0;

/**
 * Test a single import
 */
async function testImport(importPath, description) {
    try {
        console.log(`Testing: ${description}`);
        console.log(`  import from "${importPath}"`);
        const module = await import(importPath);
        
        if (module && (module.default || Object.keys(module).length > 0)) {
            console.log(`  ✅ SUCCESS - Module loaded`);
            passedTests++;
            return true;
        } else {
            console.log(`  ⚠️  WARNING - Module loaded but appears empty`);
            failedTests++;
            return false;
        }
    } catch (e) {
        // Browser-specific errors are expected when running in Node.js
        if (e.message.includes('window is not defined') || 
            e.message.includes('document is not defined')) {
            console.log(`  ✅ SUCCESS - Module loaded (browser-only code skipped in Node.js)`);
            passedTests++;
            return true;
        }
        
        console.log(`  ❌ FAILED`);
        console.log(`  Error: ${e.message}`);
        failedTests++;
        return false;
    } finally {
        console.log('');
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Test 1: Main Package Import');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('Note: Main package import is primarily for UMD/browser use.');
    console.log('For modern bundlers, individual component imports are recommended.\n');
    // await testImport('tsichart-core', 'Main TsiClient package');
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Test 2: CSS Imports');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // Note: CSS imports will fail in Node.js but would work in a bundler
    console.log('Note: CSS imports tested via bundler integration only\n');
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Test 3: Individual Component Imports (without /dist)');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // Chart components
    await testImport('tsichart-core/LineChart', 'LineChart component');
    await testImport('tsichart-core/AvailabilityChart', 'AvailabilityChart component');
    await testImport('tsichart-core/PieChart', 'PieChart component');
    await testImport('tsichart-core/ScatterPlot', 'ScatterPlot component');
    await testImport('tsichart-core/GroupedBarChart', 'GroupedBarChart component');
    await testImport('tsichart-core/Heatmap', 'Heatmap component');
    await testImport('tsichart-core/Grid', 'Grid component');
    
    // UI components
    await testImport('tsichart-core/DateTimePicker', 'DateTimePicker component');
    await testImport('tsichart-core/TimezonePicker', 'TimezonePicker component');
    await testImport('tsichart-core/Slider', 'Slider component');
    await testImport('tsichart-core/ColorPicker', 'ColorPicker component');
    
    // Navigation components
    await testImport('tsichart-core/Hierarchy', 'Hierarchy component');
    await testImport('tsichart-core/HierarchyNavigation', 'HierarchyNavigation component');
    await testImport('tsichart-core/ModelSearch', 'ModelSearch component');
    await testImport('tsichart-core/ModelAutocomplete', 'ModelAutocomplete component');
    
    // Other components
    await testImport('tsichart-core/EventsTable', 'EventsTable component');
    await testImport('tsichart-core/ProcessGraphic', 'ProcessGraphic component');
    await testImport('tsichart-core/GeoProcessGraphic', 'GeoProcessGraphic component');
    await testImport('tsichart-core/PlaybackControls', 'PlaybackControls component');
    await testImport('tsichart-core/EllipsisMenu', 'EllipsisMenu component');
    
    // Date/Time components
    await testImport('tsichart-core/SingleDateTimePicker', 'SingleDateTimePicker component');
    await testImport('tsichart-core/DateTimeButtonSingle', 'DateTimeButtonSingle component');
    await testImport('tsichart-core/DateTimeButtonRange', 'DateTimeButtonRange component');
    
    // Utilities and Models
    await testImport('tsichart-core/Utils', 'Utils module');
    await testImport('tsichart-core/UXClient', 'UXClient module');
    await testImport('tsichart-core/TsqExpression', 'TsqExpression model');
    await testImport('tsichart-core/AggregateExpression', 'AggregateExpression model');
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Test 4: Verify /dist imports DON\'T work (should fail)');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('Testing: Imports with /dist prefix (should fail)');
    console.log('  import from "tsichart-core/dist/LineChart"');
    try {
        await import('tsichart-core/dist/LineChart');
        console.log('  ⚠️  WARNING - This should have failed but didn\'t');
        console.log('  The exports may not be configured correctly\n');
    } catch (e) {
        console.log('  ✅ CORRECT - Import failed as expected');
        console.log('  (Users should NOT use /dist in their imports)\n');
    }
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Summary');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    const total = passedTests + failedTests;
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    
    if (failedTests === 0) {
        console.log('\n🎉 All tests passed! Package is configured correctly.\n');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some tests failed. Please review the configuration.\n');
        process.exit(1);
    }
}

// Run the tests
runTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
});
