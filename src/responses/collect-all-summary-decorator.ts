import { ProviderResource, Response } from '../../../cloudchipr-engine'

export default class CollectAllSummaryDecorator {
  decorate (resources: Array<Response<ProviderResource>>) {
    return resources
      .filter(resource => resource.items.length > 0)
      .map(resource => CollectAllSummaryDecorator.eachItem(resource.items))
      .sort((a:any, b:any) => b.costPerMonth - a.costPerMonth)
      .map(resource => CollectAllSummaryDecorator.format(resource))
  }

  private static eachItem (resource: Array<ProviderResource>) {
    return {
      service: resource[0].constructor.name.toUpperCase(),
      costPerMonth: resource.map(o => o.pricePerMonth).reduce((a, b) => a + b, 0)
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
