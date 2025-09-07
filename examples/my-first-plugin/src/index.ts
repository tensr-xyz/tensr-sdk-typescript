import { TensrPlugin, DataSet, AnalysisResult, DataTable, Chart } from '@tensr/sdk';

/**
 * My First Plugin - Basic Statistics Calculator
 * 
 * This plugin demonstrates how to:
 * 1. Import the SDK components
 * 2. Create a plugin that analyzes data
 * 3. Return results in different formats
 * 4. Handle errors gracefully
 */
export const MyFirstPlugin: TensrPlugin = {
  async analyze(data: DataSet): Promise<AnalysisResult> {
    console.log('🚀 My First Plugin is running!');
    console.log(`📊 Analyzing ${data.totalRows} rows and ${data.totalColumns} columns`);
    
    // Get numeric columns for analysis
    const numericColumns = data.columns.filter(col => col.type === 'number');
    
    if (numericColumns.length === 0) {
      throw new Error('No numeric columns found in dataset');
    }

    // Calculate basic statistics for each numeric column
    const results: Record<string, any> = {};
    
    numericColumns.forEach(column => {
      const values = data.rows
        .map(row => row[column.id])
        .filter(val => typeof val === 'number' && !isNaN(val as number))
        .map(val => val as number);

      if (values.length === 0) {
        results[column.name] = { error: 'No valid numeric values found' };
        return;
      }

      // Calculate basic statistics
      const sorted = [...values].sort((a, b) => a - b);
      const sum = values.reduce((acc, val) => acc + val, 0);
      const mean = sum / values.length;
      const median = sorted.length % 2 === 0 
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
      
      const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      
      const min = Math.min(...values);
      const max = Math.max(...values);

      results[column.name] = {
        count: values.length,
        mean: Number(mean.toFixed(2)),
        median: Number(median.toFixed(2)),
        stdDev: Number(stdDev.toFixed(2)),
        variance: Number(variance.toFixed(2)),
        min: Number(min.toFixed(2)),
        max: Number(max.toFixed(2)),
        range: Number((max - min).toFixed(2))
      };
    });

    // Create table result
    const tableData = {
      title: 'Basic Statistics Summary',
      columns: ['Metric', ...numericColumns.map(col => col.name)],
      rows: [
        ['Count', ...numericColumns.map(col => results[col.name].count)],
        ['Mean', ...numericColumns.map(col => results[col.name].mean)],
        ['Median', ...numericColumns.map(col => results[col.name].median)],
        ['Std Dev', ...numericColumns.map(col => results[col.name].stdDev)],
        ['Variance', ...numericColumns.map(col => results[col.name].variance)],
        ['Min', ...numericColumns.map(col => results[col.name].min)],
        ['Max', ...numericColumns.map(col => results[col.name].max)],
        ['Range', ...numericColumns.map(col => results[col.name].range)]
      ]
    };

    // Create chart data for visualization
    const chartData = {
      labels: numericColumns.map(col => col.name),
      datasets: [
        {
          label: 'Mean Values',
          data: numericColumns.map(col => results[col.name].mean),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)'
        }
      ]
    };

    return {
      type: 'table',
      data: tableData,
      metadata: {
        executionTime: Date.now(),
        pluginVersion: '1.0.0',
        analysisType: 'descriptive_statistics',
        columnsAnalyzed: numericColumns.length,
        totalRows: data.totalRows
      }
    };
  }
};

// Export the plugin as default
export default MyFirstPlugin;
