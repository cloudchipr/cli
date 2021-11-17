export class DateTimeHelper {
  static getAge (datetime: string): string {
    const now = new Date()
    const date = new Date(datetime)
    const diffHours = Math.round(((Math.abs(now.valueOf() - date.valueOf()) / 3600000) + Number.EPSILON) * 100) / 100
    const diffDays = Math.round(((Math.abs(now.valueOf() - date.valueOf()) / (3600000 * 24)) + Number.EPSILON) * 100) / 100
    if (diffHours <= 1) {
      return `1 h`
    } else if (diffHours <= 24) {
      return `${diffHours} h`
    } else if (diffHours <= 24 * 7) {
      return `${diffDays} d`
    } else {
      return `${Math.round(((diffDays / 7) + Number.EPSILON) * 100) / 100} w`
    }
  }
}
