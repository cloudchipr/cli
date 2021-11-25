import {
  Ec2, Ebs, Elb, Nlb, Alb, Eip, Rds, ProviderResource, Response
} from '@cloudchipr/cloudchipr-engine'
import { DateTimeHelper } from '../helpers/date-time-helper'
import { SizeConvertHelper } from '../helpers/size-convert-helper'
import { NumberConvertHelper } from '../helpers/number-convert-helper'
import { Output } from '../constants'

export default class ResponseDecorator {
  decorate (resources: Response<ProviderResource>[], output: string): any[] {
    resources = this.removeEmptyResourcesAndSortByPrice(resources)
    let data = []
    resources.forEach((resource: Response<ProviderResource>) => {
      data = [...data, ...this.eachItem(resource, output)]
    })
    return data
  }

  decorateClean (resource: Response<ProviderResource>, requestedIds: string[], subcommand: string) {
    return this[`${subcommand}Clean`](resource, requestedIds)
  }

  getIds (resource: Response<ProviderResource>, subcommand: string) {
    return this[`${subcommand}GetIds`](resource)
  }

  removeEmptyResourcesAndSortByPrice(resources: Array<Response<ProviderResource>>): Response<ProviderResource>[] {
    return resources.reduce((accumulator: Array<Response<ProviderResource>>, pilot: Response<ProviderResource>) => {
      if (pilot.count > 0) {
        pilot.items.sort((a: ProviderResource, b: ProviderResource) => b.pricePerMonth - a.pricePerMonth);
        accumulator.push(pilot);
      }
      return accumulator;
    }, []);
  }

  eachItem (resource: Response<ProviderResource>, output: string) {
    switch (output) {
      case Output.DETAILED:
        return this.eachItemDetail(resource)
      case Output.SUMMARIZED:
        return this.eachItemSummary(resource)
    }
  }

  eachItemDetail (resource: Response<ProviderResource>) {
    return resource.items.map((item: ProviderResource) => {
      const data = this[item.constructor.name.toLowerCase()](item)
      if (item.c8rRegion) {
        data.Region = item.c8rRegion
      }
      return data
    })
  }

  eachItemSummary (resource: Response<ProviderResource>) {
    const totalPrice = resource.items.map(o => o.pricePerMonth).reduce((a, b) => a + b, 0)
    return [
      {
        Service: resource.items[0].constructor.name.toUpperCase(),
        'Cost per month': ResponseDecorator.formatPrice(totalPrice)
      }
    ]
  }

  ec2 (ec2: Ec2) {
    return {
      'Instance ID': ec2.id,
      'Instance type': ec2.type,
      'CPU %': NumberConvertHelper.toFixed(ec2.cpu),
      NetIn: SizeConvertHelper.fromBytes(ec2.networkIn),
      NetOut: SizeConvertHelper.fromBytes(ec2.networkOut),
      'Price Per Month': ResponseDecorator.formatPrice(ec2.pricePerMonth),
      Age: DateTimeHelper.convertToWeeksDaysHours(ec2.age),
      'Name Tag': ec2.nameTag
    }
  }

  ec2Clean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Ec2) => {
      price += item.pricePerMonth
      return item.id
    })
    const data = requestedIds.map((id: string) => this.clean('EC2', id, succeededIds.includes(id)))
    return {
      data: data,
      price: ResponseDecorator.formatPrice(price)
    }
  }

  ec2GetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Ec2) => item.id)
  }

  ebs (ebs: Ebs) {
    return {
      'Instance ID': ebs.id,
      'Instance Type': ebs.type,
      State: ebs.state,
      Size: ebs.size,
      Age: DateTimeHelper.convertToWeeksDaysHours(ebs.age),
      'Price Per Month': ResponseDecorator.formatPrice(ebs.pricePerMonth),
      'Name Tag': ebs.nameTag
    }
  }

  ebsClean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Ebs) => {
      price += item.pricePerMonth
      return item.id
    })
    const data = requestedIds.map((id: string) => this.clean('EBS', id, succeededIds.includes(id)))
    return {
      data: data,
      price: ResponseDecorator.formatPrice(price)
    }
  }

  ebsGetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Ebs) => item.id)
  }

  rds (rds: Rds) {
    return {
      'DB ID': rds.id,
      'Instance Type': rds.instanceType,
      'Average Connection': rds.averageConnections,
      'Price Per Month GB': ResponseDecorator.formatPrice(rds.pricePerMonthGB),
      'DB Type': rds.dbType,
      'Name Tag': rds.nameTag
    }
  }

  rdsClean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Rds) => {
      price += item.pricePerMonth
      return item.id
    })
    const data = requestedIds.map((id: string) => this.clean('RDS', id, succeededIds.includes(id)))
    return {
      data: data,
      price: ResponseDecorator.formatPrice(price)
    }
  }

  rdsGetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Rds) => item.id)
  }

  eip (eip: Eip) {
    return {
      'IP Address': eip.ip,
      'Price Per Month': ResponseDecorator.formatPrice(eip.pricePerMonth),
      'Name Tag': eip.nameTag
    }
  }

  eipClean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Eip) => {
      price += item.pricePerMonth
      return item.ip
    })
    const data = requestedIds.map((id: string) => this.clean('EIP', id, succeededIds.includes(id)))
    return {
      data: data,
      price: ResponseDecorator.formatPrice(price)
    }
  }

  eipGetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Eip) => item.ip)
  }

  elb (elb: Elb) {
    return {
      'DNS Name': elb.dnsName,
      Age: DateTimeHelper.convertToWeeksDaysHours(elb.age),
      'Price Per Month': ResponseDecorator.formatPrice(elb.pricePerMonth),
      'Name Tag': elb.nameTag
    }
  }

  elbClean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Elb) => {
      price += item.pricePerMonth
      return item.dnsName
    })
    const data = requestedIds.map((id: string) => this.clean('ELB', id, succeededIds.includes(id)))
    return {
      data: data,
      price: ResponseDecorator.formatPrice(price)
    }
  }

  elbGetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Elb) => item.dnsName)
  }

  nlb (nlb: Nlb) {
    return {
      'DNS Name': nlb.dnsName,
      Age: DateTimeHelper.convertToWeeksDaysHours(nlb.age),
      'Price Per Month': ResponseDecorator.formatPrice(nlb.pricePerMonth),
      'Name Tag': nlb.nameTag
    }
  }

  nlbClean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Nlb) => {
      price += item.pricePerMonth
      return item.dnsName
    })
    const data = requestedIds.map((id: string) => this.clean('Nlb', id, succeededIds.includes(id)))
    return {
      data: data,
      price: ResponseDecorator.formatPrice(price)
    }
  }

  nlbGetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Nlb) => item.dnsName)
  }

  alb (alb: Alb) {
    return {
      'DNS Name': alb.dnsName,
      Age: DateTimeHelper.convertToWeeksDaysHours(alb.age),
      'Price Per Month': ResponseDecorator.formatPrice(alb.pricePerMonth),
      'Name Tag': alb.nameTag
    }
  }

  albClean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Alb) => {
      price += item.pricePerMonth
      return item.dnsName
    })
    const data = requestedIds.map((id: string) => this.clean('Alb', id, succeededIds.includes(id)))
    return {
      data: data,
      price: ResponseDecorator.formatPrice(price)
    }
  }

  albGetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Alb) => item.dnsName)
  }

  clean (subcommand: string, id: string, success: boolean) {
    return {
      subcommand: subcommand,
      id: id,
      success: success
    }
  }

  private static formatPrice (price: number): string {
    return '$' + price.toFixed(2)
  }
}
