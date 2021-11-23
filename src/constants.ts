export enum CloudProvider {
    AWS = 'aws',
}

export enum Output {
    DETAILED = 'detailed',
    SUMMARIZED = 'summarized',
}

export enum Verbose {
    DISABLED = '0',
    ENABLED = '1',
}

export enum OutputFormats {
    JSON = 'json',
    YAML = 'yaml',
    TABLE = 'table',
    TEXT = 'text',
    ROW_DELETE = 'row_delete',
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

export const SubCommandsDetail = {
    [SubCommands.EBS]: {
        collectDescription: 'Collect EBS volumes specific information based on provided filters.',
        cleanDescription: '',
    },
    [SubCommands.EC2]: {
        collectDescription: 'Collect EC2 instance specific information based on provided filters.',
        cleanDescription: '',
    },
    [SubCommands.ELB]: {
        collectDescription: 'Collect ELB specific information based on provided filters.',
        cleanDescription: '',
    },
    [SubCommands.NLB]: {
        collectDescription: 'Collect NLB specific information based on provided filters.',
        cleanDescription: '',
    },
    [SubCommands.ALB]: {
        collectDescription: 'Collect ALB specific information based on provided filters.',
        cleanDescription: '',
    },
    [SubCommands.EIP]: {
        collectDescription: 'Collect EIP specific information based on provided filters.',
        cleanDescription: '',
    },
    [SubCommands.RDS]: {
        collectDescription: 'Collect RDS database specific information based on provided filters.',
        cleanDescription: '',
    },
} as const;