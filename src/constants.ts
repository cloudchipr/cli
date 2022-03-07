export const OutputDirectory = `${__dirname}/../.c8r`

export enum CloudProvider {
    AWS = 'aws',
    GCP = 'gcp',
}

export enum Output {
    DETAILED = 'detailed',
    SUMMARIZED = 'summarized',
}

export enum OutputFormats {
    JSON = 'json',
    YAML = 'yaml',
    TABLE = 'table',
    TEXT = 'text',
    ROW_DELETE = 'row_delete',
}

export enum AwsSubCommands {
    EBS = 'ebs',
    EC2 = 'ec2',
    ELB = 'elb',
    NLB = 'nlb',
    ALB = 'alb',
    EIP = 'eip',
    RDS = 'rds',
}

export enum GcpSubCommands {
  VM = 'vm',
  DISKS = 'disks',
  EIP = 'eip',
  SQL = 'sql',
  LB = 'lb'
}

export const AwsAllRegions: Set<string> = new Set([
  'us-east-2',
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'ca-central-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'sa-east-1'
])

export const GcpAllRegions: Set<string> = new Set([
  'us-east-2',
  'us-east-1'
])

export const AwsSubCommandsDetail = {
  [AwsSubCommands.EBS]: {
    collectDescription: 'Collect EBS volumes specific information based on provided filters.',
    cleanDescription: 'Terminate EBS volumes specific information based on provided filters.'
  },
  [AwsSubCommands.EC2]: {
    collectDescription: 'Collect EC2 instance specific information based on provided filters.',
    cleanDescription: 'Terminate EC2 instance specific information based on provided filters.'
  },
  [AwsSubCommands.ELB]: {
    collectDescription: 'Collect ELB specific information based on provided filters.',
    cleanDescription: 'Terminate ELB specific information based on provided filters.'
  },
  [AwsSubCommands.NLB]: {
    collectDescription: 'Collect NLB specific information based on provided filters.',
    cleanDescription: 'Terminate NLB specific information based on provided filters.'
  },
  [AwsSubCommands.ALB]: {
    collectDescription: 'Collect ALB specific information based on provided filters.',
    cleanDescription: 'Terminate ALB specific information based on provided filters.'
  },
  [AwsSubCommands.EIP]: {
    collectDescription: 'Collect EIP specific information based on provided filters.',
    cleanDescription: 'Terminate EIP specific information based on provided filters.'
  },
  [AwsSubCommands.RDS]: {
    collectDescription: 'Collect RDS database specific information based on provided filters.',
    cleanDescription: 'Terminate RDS database specific information based on provided filters.'
  }
} as const

export const GcpSubCommandsDetail = {
  [GcpSubCommands.VM]: {
    collectDescription: 'Collect VM instance specific information based on provided filters.',
    cleanDescription: 'Terminate VM instance specific information based on provided filters.'
  },
  [GcpSubCommands.DISKS]: {
    collectDescription: 'Collect DISKS specific information based on provided filters.',
    cleanDescription: 'Terminate DISKS specific information based on provided filters.'
  },
  [GcpSubCommands.EIP]: {
    collectDescription: 'Collect EIP specific information based on provided filters.',
    cleanDescription: 'Terminate EIP specific information based on provided filters.'
  },
  [GcpSubCommands.SQL]: {
    collectDescription: 'Collect SQL database specific information based on provided filters.',
    cleanDescription: 'Terminate SQL database specific information based on provided filters.'
  },
  [GcpSubCommands.LB]: {
    collectDescription: 'Collect LB specific information based on provided filters.',
    cleanDescription: 'Terminate LB specific information based on provided filters.'
  },
} as const

export enum COLORS {
  GREEN = '#358D35',
  BLUE = '#03A9F4',
  YELLOW = '#FFC107',
  RED = '#CB3837',
  CYAN = '#009688',
  ORANGE = '#FF5722',
  RAZZMATAZZ = '#E91E63',
  ORCHID = '#9C27B0',
  SURF = '#00BCD4',
  PISTACHIO = '#93C47D',
  WUZZY = '#D16464',
  GREY = '#999999',
  LIGHT_BLUE = '#6D9EEB',
}
