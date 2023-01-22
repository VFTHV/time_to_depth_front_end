export class HeaderProcessor {
  static convertLasHeader(lasHeader: string, data: number[][]): string {
    let editHeader = lasHeader
      .replace(/TIME\.SEC/g, 'DEPT.FT')
      .replace(/SEC/g, 'FT')
      .replace('Elapsed Time', 'Depth')
      .replace(
        /STRT\.FT\s+(-\d+(\.\d+)?):/,
        `STRT.FT           ${data[0][0].toString()}:`
      )
      .replace(
        /STOP\.FT\s+(\d+(\.\d+)?):/,
        `STOP.FT           ${data[data.length - 1][0].toString()}:`
      );

    return editHeader;
  }
}
