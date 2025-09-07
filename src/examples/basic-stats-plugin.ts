import { TensrPlugin, DataSet, AnalysisResult, DataTable, Chart } from '../index';

/**
 * Example plugin: Basic Statistics Calculator
 * This plugin demonstrates how to create a simple statistical analysis plugin
 */
export const BasicStatsPlugin: TensrPlugin = {
  async analyze(data: DataSet): Promise<AnalysisResult> {
    const startTime = Date.now();
    
    // Get numeric columns
    const numericColumns = data.columns.filter(col => col.type === 'number');
    
    if (numericColumns.length === 0) {
      throw new Error('No numeric columns found in dataset');
    }

    const stats: Record<string, any> = {};
    
    // Calculate statistics for each numeric column
    numericColumns.forEach(column => {
      const values = data.rows
        .map(row => row[column.id])
        .filter(val => typeof val === 'number' && !isNaN(val as number))
        .map(val => val as number);

      if (values.length === 0) {
        stats[column.name] = { error: 'No valid numeric values' };
        return;
      }

      // Calculate basic statistics
      const sorted = [...values].sort((a, b) => a - b);
      const sum = values.reduce((a, b) => a + b, 0);
      const mean = sum / values.length;
      const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      stats[column.name] = {
        count: values.length,
        mean: Math.round(mean * 100) / 100,
        median: sorted.length % 2 === 0 
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)],
        min: Math.min(...values),
        max: Math.max(...values),
        stdDev: Math.round(stdDev * 100) / 100,
        variance: Math.round(variance * 100) / 100
      };
    });

    const executionTime = Date.now() - startTime;

    return {
      data: {
        statistics: stats,
        summary: {
          totalRows: data.totalRows,
          numericColumns: numericColumns.length,
          processedColumns: numericColumns.map(col => col.name)
        }
      },
      metadata: {
        executionTime,
        processedRows: data.totalRows,
        processedColumns: numericColumns.map(col => col.name)
      }
    };
  },

  Component({ result, onClose }) {
    const stats = result.data.statistics as Record<string, any>;
    const summary = result.data.summary as any;

    return (
      <div className="p-6 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Basic Statistics Results</h2>
          <p className="text-muted-foreground">
            Analyzed {summary.totalRows} rows across {summary.numericColumns} numeric columns
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(stats).map(([columnName, columnStats]) => (
            <div key={columnName} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">{columnName}</h3>
              
              {columnStats.error ? (
                <p className="text-red-500">{columnStats.error}</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{columnStats.count}</div>
                    <div className="text-sm text-muted-foreground">Count</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{columnStats.mean}</div>
                    <div className="text-sm text-muted-foreground">Mean</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{columnStats.median}</div>
                    <div className="text-sm text-muted-foreground">Median</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{columnStats.stdDev}</div>
                    <div className="text-sm text-muted-foreground">Std Dev</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Execution time: {result.metadata?.executionTime}ms
          </p>
        </div>
      </div>
    );
  }
};
