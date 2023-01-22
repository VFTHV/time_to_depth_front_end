// import { Las } from '../../node_modules/las-js/dist/index';
import { DataProcessor } from './DataProcessor';
import { HeaderProcessor } from './HeaderProcessor';
import { ReportGenerator } from './ReportGenerator';

export class LasFileReader {
  data: number[][] = [];
  columnHeader: string[] = [];
  lasHeader: string = '';

  constructor(public file: File) {}

  async read(): Promise<void> {
    const fileReader = new FileReader();
    fileReader.readAsText(this.file);

    fileReader.onloadend = () => {
      if (fileReader.result !== null) {
        const fullData = fileReader.result
          .toString()
          .split('\n')
          .map((row: string): string[] => {
            return row.trim().split(/\s+/);
          });

        // curveHeader
        this.columnHeader = fullData.filter((row) => row.includes('~A')).flat();
        console.log('Column header before data Processor', this.columnHeader);

        // extracting las data
        const columnHeaderIndex = fullData.findIndex((line) =>
          line.includes('~A')
        );
        this.data = fullData
          .filter((_, i) => i > columnHeaderIndex)
          .map((row) => row.map((item) => parseFloat(item.toString())));

        this.data = DataProcessor.timeToDepth(this.data, this.columnHeader);

        console.log('Column header after data Processor', this.columnHeader);
        // extracting las header

        const end = fileReader.result.toString().lastIndexOf('~A');
        this.lasHeader = fileReader.result.toString().substring(0, end);

        this.lasHeader = HeaderProcessor.convertLasHeader(
          this.lasHeader,
          this.data
        );

        ReportGenerator.report(this.data, this.columnHeader, this.lasHeader);
      }
    };
  }
}
