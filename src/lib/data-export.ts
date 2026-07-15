interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  data: any[];
  filename?: string;
  headers?: string[];
}

class DataExportService {
  export(options: ExportOptions): void {
    switch (options.format) {
      case 'csv': return this.exportCSV(options);
      case 'json': return this.exportJSON(options);
      case 'pdf': return this.exportPDF(options);
    }
  }

  private exportCSV({ data, filename = 'export', headers }: ExportOptions): void {
    if (!data.length) return;

    const keys = headers || Object.keys(data[0]);
    const csvContent = [
      keys.join(','),
      ...data.map(row => keys.map(key => {
        const value = String(row[key] || '');
        return value.includes(',') ? `"${value}"` : value;
      }).join(',')),
    ].join('\n');

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  private exportJSON({ data, filename = 'export' }: ExportOptions): void {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }

  private exportPDF({ filename = 'export' }: ExportOptions): void {
    // Would integrate with jsPDF or similar
    console.log('PDF export:', filename);
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const exportService = new DataExportService();