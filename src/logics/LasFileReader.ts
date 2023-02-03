import { DataProcessor } from './DataProcessor';
import { ResampleData } from './ResampleData';
import { HeaderProcessor } from './HeaderProcessor';
import { ReportGenerator } from './ReportGenerator';

export class LasFileReader {
  data: number[][] = [];
  columnHeader: string[] = [];
  lasHeader: string = '';

  constructor(
    public file: File,
    public fileName: string,
    public step: number
  ) {}

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

        // extracting las data
        const columnHeaderIndex = fullData.findIndex((line) =>
          line.includes('~A')
        );
        this.data = fullData
          .filter((_, i) => i > columnHeaderIndex)
          .map((row) => row.map((item) => parseFloat(item.toString())));

        this.data = DataProcessor.timeToDepth(this.data, this.columnHeader);

        //resample the data
        // this.data = ResampleData.resample(this.data, this.step);

        // extracting las header

        const end = fileReader.result.toString().lastIndexOf('~A');
        this.lasHeader = fileReader.result.toString().substring(0, end);

        this.lasHeader = HeaderProcessor.convertLasHeader(
          this.lasHeader,
          this.data
        );

        if (!this.fileName) {
          const nameNoExtension = this.file.name.slice(
            0,
            this.file.name.lastIndexOf('.')
          );
          this.fileName = `${nameNoExtension}_processed`;
        }

        ReportGenerator.report(
          this.data,
          this.columnHeader,
          this.lasHeader,
          this.fileName
        );
      }
    };
  }
}
