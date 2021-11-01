import {
  Ec2, Ebs, Elb, Nlb, Alb, Eip, Rds, ProviderResource
} from '@cloudchipr/cloudchipr-engine'

export default class CollectResponseDecorator {
  decorate (resources: ProviderResource[]) {
    return resources.map(resource => this.eachItem(resource))
  }

  decorateClean (succeededResources: ProviderResource[], requestedResources: ProviderResource[], subcommand: string) {
    return this[`${subcommand}Clean`](succeededResources, requestedResources)
  }

  eachItem (resource: ProviderResource) {
    return this[resource.constructor.name.toLowerCase()](resource)
  }

  ec2 (ec2: Ec2) {
    return {
      'Instance ID': ec2.id,
      'Instance type': ec2.type,
      'CPU %': ec2.cpu,
      'NetIn': ec2.networkIn,
      'NetOut': ec2.networkOut,
      'Price Per Month': CollectResponseDecorator.formatPrice(ec2.pricePerMonth),
      'Age': ec2.age,
      'Name Tag': ec2.nameTag
    }
  }

  ec2Clean (succeededResources: Ec2[], requestedResources: Ec2[]) {
    const data = succeededResources
      .map(r => this.clean('ec2', r.id.toString(), true))
      .concat(
        requestedResources
          .filter(r => succeededResources.findIndex(sr => sr.id === r.id) === -1)
          .map(r => this.clean('ec2', r.id.toString(), false))
      )
    const price = succeededResources.map(r => r.pricePerMonth).reduce((a, b) => a + b, 0)
    return {
      data: data,
      price: CollectResponseDecorator.formatPrice(price)
    }
  }

  ebs (ebs: Ebs) {
    return {
      'Instance ID': ebs.id,
      'Instance Type': ebs.type,
      'Size': ebs.size,
      'Age': ebs.size,
      'Price Per Month': CollectResponseDecorator.formatPrice(ebs.pricePerMonth),
      'Name Tag': ebs.nameTag
    }
  }

  ebsClean (succeededResources: Ebs[], requestedResources: Ebs[]) {
    const data = succeededResources
      .map(r => this.clean('ebs', r.id.toString(), true))
      .concat(
        requestedResources
          .filter(r => succeededResources.findIndex(sr => sr.id === r.id) === -1)
          .map(r => this.clean('ebs', r.id.toString(), false))
      )
    const price = succeededResources.map(r => r.pricePerMonth).reduce((a, b) => a + b, 0)
    return {
      data: data,
      price: CollectResponseDecorator.formatPrice(price)
    }
  }

  rds (rds: Rds) {
    return {
      'DB ID': rds.id,
      'Instance Type': rds.instanceType,
      'Average Connection': rds.averageConnections,
      'Price Per Month GB': CollectResponseDecorator.formatPrice(rds.pricePerMonthGB),
      'DB Type': rds.dbType,
      'Name Tag': rds.nameTag
    }
  }

  rdsClean (succeededResources: Rds[], requestedResources: Rds[]) {
    const data = succeededResources
      .map(r => this.clean('rds', r.id.toString(), true))
      .concat(
        requestedResources
          .filter(r => succeededResources.findIndex(sr => sr.id === r.id) === -1)
          .map(r => this.clean('rds', r.id.toString(), false))
      )
    const price = succeededResources.map(r => r.pricePerMonthGB).reduce((a, b) => a + b, 0)
    return {
      data: data,
      price: CollectResponseDecorator.formatPrice(price)
    }
  }

  eip (eip: Eip) {
    return {
      'IP Address': eip.ip,
      'Price Per Month': CollectResponseDecorator.formatPrice(eip.pricePerMonth),
      'Name Tag': eip.nameTag
    }
  }

  eipClean (succeededResources: Eip[], requestedResources: Eip[]) {
    const data = succeededResources
      .map(r => this.clean('eip', r.ip.toString(), true))
      .concat(
        requestedResources
          .filter(r => succeededResources.findIndex(sr => sr.ip === r.ip) === -1)
          .map(r => this.clean('eip', r.ip.toString(), false))
      )
    const price = succeededResources.map(r => r.pricePerMonth).reduce((a, b) => a + b, 0)
    return {
      data: data,
      price: CollectResponseDecorator.formatPrice(price)
    }
  }

  elb (elb: Elb) {
    return {
      'DNS Name': elb.dnsName,
      'Age': elb.age,
      'Price Per Month': CollectResponseDecorator.formatPrice(elb.pricePerMonth),
      'Name Tag': elb.nameTag
    }
  }

  elbClean (succeededResources: Elb[], requestedResources: Elb[]) {
    const data = succeededResources
      .map(r => this.clean('elb', r.dnsName.toString(), true))
      .concat(
        requestedResources
          .filter(r => succeededResources.findIndex(sr => sr.dnsName === r.dnsName) === -1)
          .map(r => this.clean('elb', r.dnsName.toString(), false))
      )
    const price = succeededResources.map(r => r.pricePerMonth).reduce((a, b) => a + b, 0)
    return {
      data: data,
      price: CollectResponseDecorator.formatPrice(price)
    }
  }

  nlb (nlb: Nlb) {
    return {
      'DNS Name': nlb.dnsName,
      'Age': nlb.age,
      'Price Per Month': CollectResponseDecorator.formatPrice(nlb.pricePerMonth),
      'Name Tag': nlb.nameTag
    }
  }

  nlbClean (succeededResources: Nlb[], requestedResources: Nlb[]) {
    const data = succeededResources
      .map(r => this.clean('nlb', r.dnsName.toString(), true))
      .concat(
        requestedResources
          .filter(r => succeededResources.findIndex(sr => sr.dnsName === r.dnsName) === -1)
          .map(r => this.clean('nlb', r.dnsName.toString(), false))
      )
    const price = succeededResources.map(r => r.pricePerMonth).reduce((a, b) => a + b, 0)
    return {
      data: data,
      price: CollectResponseDecorator.formatPrice(price)
    }
  }

  alb (alb: Alb) {
    return {
      'DNS Name': alb.dnsName,
      'Age': alb.age,
      'Price Per Month': CollectResponseDecorator.formatPrice(alb.pricePerMonth),
      'Name Tag': alb.nameTag
    }
  }

  albClean (succeededResources: Alb[], requestedResources: Alb[]) {
    const data = succeededResources
      .map(r => this.clean('alb', r.dnsName.toString(), true))
      .concat(
        requestedResources
          .filter(r => succeededResources.findIndex(sr => sr.dnsName === r.dnsName) === -1)
          .map(r => this.clean('alb', r.dnsName.toString(), false))
      )
    const price = succeededResources.map(r => r.pricePerMonth).reduce((a, b) => a + b, 0)
    return {
      data: data,
      price: CollectResponseDecorator.formatPrice(price)
    }
  }

  clean (subcommand: string, id: string, success: boolean) {
    return {
      'subcommand': subcommand,
      'id': id,
      'success': success
    }
  }

  private static formatPrice (price: number): string {
    return '$' + price.toFixed(2)
  }
}
