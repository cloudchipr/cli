export enum CloudProvider {
    AWS = 'aws',
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
    ROW_FAILURE = 'row_failure',
}

export enum SubCommands {
    EBS = 'ebs',
    EC2 = 'ec2',
    ELB = 'elb',
    NLB = 'nlb',
    ALB = 'alb',
    EIP = 'eip',
    RDS = 'rds',
}

export const AllRegions: Set<string> = new Set([
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

export const SubCommandsDetail = {
  [SubCommands.EBS]: {
    collectDescription: 'Collect EBS volumes specific information based on provided filters.',
    cleanDescription: 'Terminate EBS volumes specific information based on provided filters.'
  },
  [SubCommands.EC2]: {
    collectDescription: 'Collect EC2 instance specific information based on provided filters.',
    cleanDescription: 'Terminate EC2 instance specific information based on provided filters.'
  },
  [SubCommands.ELB]: {
    collectDescription: 'Collect ELB specific information based on provided filters.',
    cleanDescription: 'Terminate ELB specific information based on provided filters.'
  },
  [SubCommands.NLB]: {
    collectDescription: 'Collect NLB specific information based on provided filters.',
    cleanDescription: 'Terminate NLB specific information based on provided filters.'
  },
  [SubCommands.ALB]: {
    collectDescription: 'Collect ALB specific information based on provided filters.',
    cleanDescription: 'Terminate ALB specific information based on provided filters.'
  },
  [SubCommands.EIP]: {
    collectDescription: 'Collect EIP specific information based on provided filters.',
    cleanDescription: 'Terminate EIP specific information based on provided filters.'
  },
  [SubCommands.RDS]: {
    collectDescription: 'Collect RDS database specific information based on provided filters.',
    cleanDescription: 'Terminate RDS database specific information based on provided filters.'
  }
} as const

export const CleanChunkSize = 5
