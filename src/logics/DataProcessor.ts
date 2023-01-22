export class DataProcessor {
  static timeToDepth(data: number[][], columnHeader: string[]): number[][] {
    const depthIndex = columnHeader.findIndex((h) => h === 'ADPTH') - 1;
    const lspdIndex = columnHeader.findIndex((h) => h === 'LSPD') - 1;

    // trim data from non-zero speed, leaving only stations
    // replacing first column with ADPTH curve

    columnHeader[1] = 'Depth';

    data = data
      .map((row: number[]): number[] => {
        row[0] = row[depthIndex];
        return row;
      })
      .filter((row: number[]): boolean => {
        return row[lspdIndex] === 0;
      });

    // make average values on same depth
    let sameDepth: number[][] = [];
    let averages: number[][] = [];

    data.forEach((row: number[], index: number): void => {
      if (
        (sameDepth.length === 0 ||
          Math.floor(row[0]) ===
            Math.floor(sameDepth[sameDepth.length - 1][0])) &&
        index + 1 !== data.length
      ) {
        // push same depth items into sameDepth
        sameDepth.push(row);
      } else {
        // create average for one depth
        const averAtSameDepth: number[] = sameDepth[0].map((_, i) => {
          const avNum: number =
            sameDepth.reduce((acc, arr) => acc + arr[i], 0) / sameDepth.length;
          return Number(avNum.toFixed(4));
        });
        if (sameDepth.length > 50) {
          averages.push(averAtSameDepth);
        }

        sameDepth = [];
        sameDepth.push(row);
      }
    });
    averages = averages.sort((rowA, rowB) => rowA[0] - rowB[0]);
    return averages;
  }
}
