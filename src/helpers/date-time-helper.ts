const HOURS_IN_A_DAY = 24
const HOURS_IN_A_WEEK = 168

export class DateTimeHelper {
  static convertToWeeksDaysHours (datetime?: string): string {
    if (datetime === undefined) {
      return 'N/A'
    }
    const now = new Date()
    const date = new Date(datetime)
    const totalHours = Math.ceil(Math.abs(now.valueOf() - date.valueOf()) / 36e5)

    if (totalHours < HOURS_IN_A_DAY) {
      return `${totalHours}h`
    } else if (totalHours < HOURS_IN_A_WEEK) {
      const days = Math.floor(totalHours / HOURS_IN_A_DAY)
      const hours = totalHours % HOURS_IN_A_DAY
      return `${days}d` + (hours > 0 ? ` ${hours}h` : '')
    } else {
      const weeks = Math.floor(totalHours / HOURS_IN_A_WEEK)
      const tempHours = totalHours % HOURS_IN_A_WEEK
      const days = Math.floor(tempHours / HOURS_IN_A_DAY)
      const hours = tempHours % HOURS_IN_A_DAY
      return `${weeks}w` + (tempHours == 0 ? '' : ` ${days}d` + (hours > 0 ? ` ${hours}h` : ''))
    }
  }
}
