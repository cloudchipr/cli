import { Commands } from '../constants'

export class LoadingMessageHelper {
  static getLoadingMessage (command: string, subcommand: string): string {
    let message = ''
    switch (command) {
      case Commands.COLLECT:
        message = 'Collecting '
        break
      case Commands.CLEAN:
        message = 'Cleaning '
        break
      default:
        return ''
    }
    switch (subcommand) {
      case 'ebs':
        message += 'EBS volumes'
        break
      case 'ec2':
        message += 'EC2 instances'
        break
      case 'elb':
        message += 'ELB specific information'
        break
      case 'nlb':
        message += 'NLB specific information'
        break
      case 'alb':
        message += 'ALB specific information'
        break
      case 'eip':
        message += 'EIP specific information'
        break
      case 'rds':
        message += 'RDS database specific information'
        break
      default:
        return ''
    }
    return `${message}. It might take a while, please be patient.`
  }
}
