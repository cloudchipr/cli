import { Ebs, Eip, Elb, Response } from '@cloudchipr/cloudchipr-engine'
import ResponseDecorator from '../../src/responses/response-decorator'
import { Output } from '../../src/constants'

const getMockResponse = () => {
  const response: any = {}
  const ebs1 = new Ebs(
    'vol-046b9d273baf51150',
    15,
    'available',
    'gp2',
    'zone',
    '2021-11-10 10:11:04',
    'tag1, tag2',
    'us-east-1',
    '286342786 - current',
  )
  ebs1.pricePerMonthGB = 15
  const ebs2 = new Ebs(
    'vol-046b9d273baf51210',
    23,
    'available',
    'gp2',
    'zone',
    '2021-11-10 12:15:04',
    'tag3, tag4',
    'us-east-1',
    '286342786 - current'
  )
  ebs2.pricePerMonthGB = 20
  response.ebs = new Response<Ebs>([ebs1, ebs2])

  const elb = new Elb(
    'elb',
    'elb-1947694966.us-east-1.elb.amazonaws.com',
    '2021-11-10 10:11:04',
    'tag1, tag2',
    'us-east-1',
    '286342786 - current'
  )
  elb.pricePerHour = 13
  response.elb = new Response<Elb>([elb])

  const eip = new Eip(
    '44.196.89.0',
    'reg',
    'tag1, tag2',
    'us-east-1',
    '286342786 - current'
  )
  eip.pricePerHour = 3
  response.eip = new Response<Eip>([eip])

  return response
}

describe('ResponseDecorator', () => {
  const responseDecorator = new ResponseDecorator()

  test('decorate detailed output', () => {
    const data = responseDecorator.decorate([getMockResponse().ebs], Output.DETAILED)
    expect(data[0]['Instance ID']).toEqual('vol-046b9d273baf51210')
    expect(data[0]['Price Per Month']).toEqual('$460.00')
    expect(data[1]['Instance ID']).toEqual('vol-046b9d273baf51150')
    expect(data[1]['Price Per Month']).toEqual('$225.00')
  })

  test('decorate summarized output', () => {
    const data = responseDecorator.decorate(Object.values(getMockResponse()), Output.SUMMARIZED)
    expect(data).toEqual([
      {
        Service: 'ELB',
        'Cost Per Month': '$9360.00'
      },
      {
        Service: 'EIP',
        'Cost Per Month': '$2160.00'
      },
      {
        Service: 'EBS',
        'Cost Per Month': '$685.00'
      }
    ])
  })

  test('decorate clear', () => {
    const data = responseDecorator.decorateClean(getMockResponse().ebs, ['vol-046b9d273baf51150', 'vol-046b9d273baf51210', 'failed-ids'], 'ebs')
    expect(data).toEqual({
      data: [
        {
          subcommand: 'EBS',
          id: 'vol-046b9d273baf51150',
          success: true
        },
        {
          subcommand: 'EBS',
          id: 'vol-046b9d273baf51210',
          success: true
        },
        {
          subcommand: 'EBS',
          id: 'failed-ids',
          success: false
        }
      ],
      price: 685.00
    })
  })

  test('decorate get ids', () => {
    const data = responseDecorator.getIds(getMockResponse().ebs, 'ebs')
    expect(data).toEqual(['vol-046b9d273baf51150', 'vol-046b9d273baf51210'])
  })
})
