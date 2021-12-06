import {SubCommands} from '../constants'
import { Alb, Ebs, Ec2, Eip, Elb, Nlb, Rds } from '@cloudchipr/cloudchipr-engine'

export class AwsHelper {
  static getProviderResourceFromString (target: string) {
    switch (target) {
      case SubCommands.EBS:
        return Ebs
      case SubCommands.EC2:
        return Ec2
      case SubCommands.ELB:
        return Elb
      case SubCommands.NLB:
        return Nlb
      case SubCommands.ALB:
        return Alb
      case SubCommands.EIP:
        return Eip
      case SubCommands.RDS:
        return Rds
    }
  }
}
