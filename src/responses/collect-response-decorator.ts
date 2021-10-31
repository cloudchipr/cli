import ProviderResource from '../../../cloudchipr-engine/lib/domain/types/provider-resource'
import { Ebs, Ec2, Eip, Rds } from '../../../cloudchipr-engine'

export default class CollectResponseDecorator {
  decorate (resources: ProviderResource[]) {
    return resources.map(resource => this.eachItem(resource))
  }

  eachItem (resource: ProviderResource) {
    return this[resource.constructor.name.toLowerCase()](resource)
  }

  ec2 (ec2: Ec2) {
    return {
      InstanceID: ec2.id,
      'Instance type': ec2.type,
      'Price per month': CollectResponseDecorator.formatPrice(ec2.pricePerMonth),
      Age: ec2.age,
      'Name Tag': ec2.nameTag
    }
  }

  ebs (ebs: Ebs) {
    return {
      ID: ebs.id,
      Type: ebs.type,
      Size: ebs.size,
      Age: ebs.size,
      'Price per month': CollectResponseDecorator.formatPrice(ebs.pricePerMonth),
      'Name Tag': ebs.nameTag
    }
  }

  rds (rds: Rds) {
    return {
      ID: rds.id,
      Type: rds.instanceType,
      'Average connection': rds.averageConnections,
      Age: rds.age,
      'Price per month GB': CollectResponseDecorator.formatPrice(rds.pricePerMonthGB),
      'DB Tag': rds.dbType,
      'Name Tag': rds.nameTag
    }
  }

  eip (eip: Eip) {
    return {
      'IP address': eip.ip,
      'Price per month': CollectResponseDecorator.formatPrice(eip.pricePerMonth),
      'Name Tag': eip.nameTag
    }
  }

  private static formatPrice (price: number): string {
    return '$' + price.toFixed(2)
  }
}
