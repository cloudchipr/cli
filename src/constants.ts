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
        cleanDescription: 'Terminate EBS volumes specific information based on provided filters.',
    },
    [SubCommands.EC2]: {
        collectDescription: 'Collect EC2 instance specific information based on provided filters.',
        cleanDescription: 'Terminate EC2 instance specific information based on provided filters.',
    },
    [SubCommands.ELB]: {
        collectDescription: 'Collect ELB specific information based on provided filters.',
        cleanDescription: 'Terminate ELB specific information based on provided filters.',
    },
    [SubCommands.NLB]: {
        collectDescription: 'Collect NLB specific information based on provided filters.',
        cleanDescription: 'Terminate NLB specific information based on provided filters.',
    },
    [SubCommands.ALB]: {
        collectDescription: 'Collect ALB specific information based on provided filters.',
        cleanDescription: 'Terminate ALB specific information based on provided filters.',
    },
    [SubCommands.EIP]: {
        collectDescription: 'Collect EIP specific information based on provided filters.',
        cleanDescription: 'Terminate EIP specific information based on provided filters.',
    },
    [SubCommands.RDS]: {
        collectDescription: 'Collect RDS database specific information based on provided filters.',
        cleanDescription: 'Terminate RDS database specific information based on provided filters.',
    },
} as const;