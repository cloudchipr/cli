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

  private removeEmptyResourcesAndSortByPrice(resources: Array<Response<ProviderResource>>): Response<ProviderResource>[] {
    return resources.reduce((accumulator: Array<Response<ProviderResource>>, pilot: Response<ProviderResource>) => {
      if (pilot.count > 0) {
        pilot.items.sort((a: ProviderResource, b: ProviderResource) => b.pricePerMonth - a.pricePerMonth);
        accumulator.push(pilot);
      }
      return accumulator;
    }, []);
  }

  private eachItem (resource: Response<ProviderResource>, output: string) {
    switch (output) {
      case Output.DETAILED:
        return this.eachItemDetail(resource)
      case Output.SUMMARIZED:
        return this.eachItemSummary(resource)
    }
  }

  private eachItemDetail (resource: Response<ProviderResource>) {
    return resource.items.map((item: ProviderResource) => {
      const data = this[item.constructor.name.toLowerCase()](item)
      if (item.c8rRegion) {
        data.Region = item.c8rRegion
      }
      return data
    })
  }

  private eachItemSummary (resource: Response<ProviderResource>) {
    const totalPrice = resource.items.map(o => o.pricePerMonth).reduce((a, b) => a + b, 0)
    return [
      {
        Service: resource.items[0].constructor.name.toUpperCase(),
        'Cost per month': this.formatPrice(totalPrice)
      }
    ]
  }

  private ec2 (ec2: Ec2) {
    return {
      'Instance ID': ec2.id,
      'Instance type': ec2.type,
      'CPU %': NumberConvertHelper.toFixed(ec2.cpu),
      NetIn: SizeConvertHelper.fromBytes(ec2.networkIn),
      NetOut: SizeConvertHelper.fromBytes(ec2.networkOut),
      'Price Per Month': this.formatPrice(ec2.pricePerMonth),
      Age: DateTimeHelper.convertToWeeksDaysHours(ec2.age),
      'Name Tag': ec2.nameTag
    }
  }

  private ec2Clean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Ec2) => {
      price += item.pricePerMonth
      return item.id
    })
    const data = requestedIds.map((id: string) => this.clean('EC2', id, succeededIds.includes(id)))
    return {
      data: data,
      price: this.formatPrice(price)
    }
  }

  private ec2GetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Ec2) => item.id)
  }

  private ebs (ebs: Ebs) {
    return {
      'Instance ID': ebs.id,
      'Instance Type': ebs.type,
      State: ebs.state,
      Size: ebs.size,
      Age: DateTimeHelper.convertToWeeksDaysHours(ebs.age),
      'Price Per Month': this.formatPrice(ebs.pricePerMonth),
      'Name Tag': ebs.nameTag
    }
  }

  private ebsClean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Ebs) => {
      price += item.pricePerMonth
      return item.id
    })
    const data = requestedIds.map((id: string) => this.clean('EBS', id, succeededIds.includes(id)))
    return {
      data: data,
      price: this.formatPrice(price)
    }
  }

  private ebsGetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Ebs) => item.id)
  }

  private rds (rds: Rds) {
    return {
      'DB ID': rds.id,
      'Instance Type': rds.instanceType,
      'Average Connection': rds.averageConnections,
      'Price Per Month GB': this.formatPrice(rds.pricePerMonthGB),
      'DB Type': rds.dbType,
      'Name Tag': rds.nameTag
    }
  }

  private rdsClean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Rds) => {
      price += item.pricePerMonth
      return item.id
    })
    const data = requestedIds.map((id: string) => this.clean('RDS', id, succeededIds.includes(id)))
    return {
      data: data,
      price: this.formatPrice(price)
    }
  }

  private rdsGetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Rds) => item.id)
  }

  private eip (eip: Eip) {
    return {
      'IP Address': eip.ip,
      'Price Per Month': this.formatPrice(eip.pricePerMonth),
      'Name Tag': eip.nameTag
    }
  }

  private eipClean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Eip) => {
      price += item.pricePerMonth
      return item.ip
    })
    const data = requestedIds.map((id: string) => this.clean('EIP', id, succeededIds.includes(id)))
    return {
      data: data,
      price: this.formatPrice(price)
    }
  }

  private eipGetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Eip) => item.ip)
  }

  private elb (elb: Elb) {
    return {
      'Load Balancer Name': elb.loadBalancerName,
      'DNS Name': elb.dnsName,
      Age: DateTimeHelper.convertToWeeksDaysHours(elb.age),
      'Price Per Month': this.formatPrice(elb.pricePerMonth),
      'Name Tag': elb.nameTag
    }
  }

  private elbClean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Elb) => {
      price += item.pricePerMonth
      return item.loadBalancerName
    })
    const data = requestedIds.map((id: string) => this.clean('ELB', id, succeededIds.includes(id)))
    return {
      data: data,
      price: this.formatPrice(price)
    }
  }

  private elbGetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Elb) => item.loadBalancerName)
  }

  private nlb (nlb: Nlb) {
    return {
      'Load Balancer Name': nlb.loadBalancerName,
      'DNS Name': nlb.dnsName,
      Age: DateTimeHelper.convertToWeeksDaysHours(nlb.age),
      'Price Per Month': this.formatPrice(nlb.pricePerMonth),
      'Name Tag': nlb.nameTag
    }
  }

  private nlbClean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Nlb) => {
      price += item.pricePerMonth
      return item.loadBalancerName
    })
    const data = requestedIds.map((id: string) => this.clean('Nlb', id, succeededIds.includes(id)))
    return {
      data: data,
      price: this.formatPrice(price)
    }
  }

  private nlbGetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Nlb) => item.loadBalancerName)
  }

  private alb (alb: Alb) {
    return {
      'Load Balancer Name': alb.loadBalancerName,
      'DNS Name': alb.dnsName,
      Age: DateTimeHelper.convertToWeeksDaysHours(alb.age),
      'Price Per Month': this.formatPrice(alb.pricePerMonth),
      'Name Tag': alb.nameTag
    }
  }

  private albClean (resource: Response<ProviderResource>, requestedIds: string[]) {
    let price: number = 0
    const succeededIds = resource.items.map((item: Alb) => {
      price += item.pricePerMonth
      return item.loadBalancerName
    })
    const data = requestedIds.map((id: string) => this.clean('Alb', id, succeededIds.includes(id)))
    return {
      data: data,
      price: this.formatPrice(price)
    }
  }

  private albGetIds (resource: Response<ProviderResource>) {
    return resource.items.map((item: Alb) => item.loadBalancerName)
  }

  private clean (subcommand: string, id: string, success: boolean) {
    return {
      subcommand: subcommand,
      id: id,
      success: success
    }
  }

  private formatPrice (price: number): string {
    return '$' + price.toFixed(2)
  }
}