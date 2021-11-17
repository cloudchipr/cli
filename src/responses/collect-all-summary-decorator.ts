import { Alb, Ebs, Ec2, Eip, Elb, Nlb, ProviderResource, Rds, Response } from '../../../cloudchipr-engine'

export default class CollectAllSummaryDecorator {
  decorate (resources: Array<Response<ProviderResource>>) {
    return resources
      .filter(resource => resource.items.length > 0)
      .map(resource => CollectAllSummaryDecorator.eachItem(resource.items))
      .sort((a:any, b:any) => b.costPerMonth - a.costPerMonth)
      .map(resource => CollectAllSummaryDecorator.format(resource))
  }

  private static eachItem (resource: Array<ProviderResource>) {
    return CollectAllSummaryDecorator[resource[0].constructor.name.toLowerCase()](resource)
  }

  private static ec2 (ec2: Array<Ec2>) {
    return {
      service: 'EC2',
      costPerMonth: ec2.map(o => o.pricePerMonth).reduce((a, b) => a + b, 0)
    }
  }

  private static ebs (ebs: Array<Ebs>) {
    return {
      service: 'EBS',
      costPerMonth: ebs.map(o => o.pricePerMonth).reduce((a, b) => a + b, 0)
    }
  }

  private static rds (rds: Array<Rds>) {
    return {
      service: 'RDS',
      costPerMonth: rds.map(o => o.pricePerMonth).reduce((a, b) => a + b, 0)
    }
  }

  private static eip (eip: Array<Eip>) {
    return {
      service: 'EIP',
      costPerMonth: eip.map(o => o.pricePerMonth).reduce((a, b) => a + b, 0)
    }
  }

  private static elb (elb: Array<Elb>) {
    return {
      service: 'ELB',
      costPerMonth: elb.map(o => o.pricePerMonth).reduce((a, b) => a + b, 0)
    }
  }

  private static nlb (nlb: Array<Nlb>) {
    return {
      service: 'NLB',
      costPerMonth: nlb.map(o => o.pricePerMonth).reduce((a, b) => a + b, 0)
    }
  }

  private static alb (alb: Array<Alb>) {
    return {
      service: 'ALB',
      costPerMonth: alb.map(o => o.pricePerMonth).reduce((a, b) => a + b, 0)
    }
  }

  private static format (record: any) {
    return {
      Service: record.service,
      'Cost per month': CollectAllSummaryDecorator.formatPrice(record.costPerMonth)
    }
  }

  private static formatPrice (price: number): string {
    return '$' + price.toFixed(2)
  }
}
