import { saveAs } from 'file-saver';

export class ReportGenerator {
  static report(
    data: number[][],
    columnHeader: string[],
    lasHeader: string,
    fileName: string
  ): void {
    // convert averages to string with 4 decimals
    let averagesToString = data.map((row) =>
      row.map((item) => item.toFixed(4))
    );

    // aligning columns
    let maxChars = averagesToString.flat().reduce(function (a, b) {
      return a.length > b.length ? a : b;
    }).length;

    averagesToString = averagesToString.map((row) =>
      row.map((item) => item.padStart(maxChars + 3, ' '))
    );

    // add column headers
    columnHeader = columnHeader.map((item, i) => {
      if (item === '~A') return item;
      if (i === 1) return item.padStart(maxChars + 1, ' ');
      return item.padStart(maxChars + 3, ' ');
    });
    averagesToString.unshift(columnHeader);

    const stringData = averagesToString.map((row) => row.join('')).join('\n');
    const final = lasHeader + stringData;

    saveAs(
      new Blob([final], { type: 'text/plain;charset=utf-8' }),
      `${fileName}.LAS`
    );
  }
}
