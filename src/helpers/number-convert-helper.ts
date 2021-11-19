export class NumberConvertHelper {
  static toFixed (value: number, decimals: number = 2): number {
    if (decimals < 0) {
      return value
    }
    return Math.trunc(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
}
