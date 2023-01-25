export class ResampleData {
  static resample(data: number[][], step: number): number[][] {
    if (!step) return data;
    data = data.sort((rowA, rowB) => rowA[0] - rowB[0]);
    const interpolatedData = [];
    // resample to step of number step argument to this function

    for (let i = 0; i < data.length - 1; i++) {
      let currentDepth = data[i][0];
      let nextDepth = data[i + 1][0];
      currentDepth = Math.round(currentDepth / step) * step;
      nextDepth = Math.round(nextDepth / step) * step;
      const currentCurves = data[i].slice(1);
      const nextCurves = data[i + 1].slice(1);

      const totalSteps = (nextDepth - currentDepth) / step;

      const depths = [];
      for (let j = 0; j < totalSteps; j++) {
        depths.push(currentDepth + j * step);
      }

      depths.push(nextDepth);

      for (let j = 0; j < depths.length; j++) {
        const interpolatedCurves = [];
        for (let k = 0; k < currentCurves.length; k++) {
          let curveValue =
            currentCurves[k] +
            ((nextCurves[k] - currentCurves[k]) * j) / totalSteps;
          curveValue = Number(curveValue.toFixed(4));
          interpolatedCurves.push(curveValue);
        }
        interpolatedData.push([depths[j], ...interpolatedCurves]);
      }
    }

    // remove duplicates of same depth
    const uniqueData = [];
    const seen = new Set();

    for (let i = 0; i < interpolatedData.length; i++) {
      const current = interpolatedData[i];
      const firstValue = current[0];
      if (!seen.has(firstValue)) {
        seen.add(firstValue);
        uniqueData.push(current);
      }
    }
    // remove last line with NaN
    return uniqueData;
  }
}
