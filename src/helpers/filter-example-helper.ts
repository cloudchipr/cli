export class FilterExampleHelper {
  static getFilter (subcommand: string): object {
    return FilterExampleHelper[`get${subcommand.charAt(0).toUpperCase() + subcommand.slice(1)}Filter`]()
  }

  static getEbsFilter (): object {
    return {
      and: [
        {
          resource: '"attachments"',
          op: '"IsEmpty"'
        },
        {
          resource: '"volume-age"',
          op: '"GreaterThanEqualTo"',
          value: 0
        }
      ]
    }
  }

  static getEc2Filter (): object {
    return {
      and: [
        {
          resource: '"launch-time"',
          op: '"GreaterThanEqualTo"',
          value: 0
        },
        {
          resource: '"cpu"',
          op: '"LessThanEqualTo"',
          since: 1,
          value: 100
        },
        {
          resource: '"network-in"',
          op: '"LessThanEqualTo"',
          since: 1,
          value: 100000000000
        },
        {
          resource: '"network-out"',
          op: '"LessThanEqualTo"',
          since: 1,
          value: 100000000000
        }
      ]
    }
  }

  static getElbFilter (): object {
    return {
      and: [
        {
          resource: '"dns-name"',
          op: '"In"',
          value: '"ts-elb-268598981.us-east-1.elb.amazonaws.com"'
        }
      ]
    }
  }

  static getNlbFilter (): object {
    return {
      and: [
        {
          resource: '"dns-name"',
          op: '"In"',
          value: '"ts-nlb-268598981.us-east-1.elb.amazonaws.com"'
        }
      ]
    }
  }

  static getAlbFilter (): object {
    return {
      and: [
        {
          resource: '"dns-name"',
          op: '"In"',
          value: '"ts-alb-268598981.us-east-1.elb.amazonaws.com"'
        }
      ]
    }
  }

  static getEipFilter (): object {
    return {
      and: [
        {
          resource: '"InstanceId"',
          op: '"IsAbsent"'
        },
        {
          resource: '"AssociationId"',
          op: '"IsAbsent"'
        }
      ]
    }
  }

  static getRdsFilter (): object {
    return {
      and: [
        {
          resource: '"launch-time"',
          op: '"GreaterThanEqualTo"',
          value: 0
        },
        {
          resource: '"database-connections"',
          op: '"LessThanEqualTo"',
          value: 100000,
          since: 1
        }
      ]
    }
  }
}
