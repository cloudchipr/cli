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
        }
      ]
    }
  }

  static getEc2Filter (): object {
    return {
      and: [
        {
          resource: '"attachments"',
          op: '"IsEmpty"'
        }
      ]
    }
  }

  static getElbFilter (): object {
    return {
      and: [
        {
          resource: '"attachments"',
          op: '"IsEmpty"'
        }
      ]
    }
  }

  static getNlbFilter (): object {
    return {
      and: [
        {
          resource: '"attachments"',
          op: '"IsEmpty"'
        }
      ]
    }
  }

  static getAlbFilter (): object {
    return {
      and: [
        {
          resource: '"attachments"',
          op: '"IsEmpty"'
        }
      ]
    }
  }

  static getEipFilter (): object {
    return {
      and: [
        {
          resource: '"attachments"',
          op: '"IsEmpty"'
        }
      ]
    }
  }

  static getRdsFilter (): object {
    return {
      and: [
        {
          resource: '"attachments"',
          op: '"IsEmpty"'
        }
      ]
    }
  }
}
