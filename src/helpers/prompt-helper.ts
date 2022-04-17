import inquirer from 'inquirer'

export class PromptHelper {
  static async prompt (question: string): Promise<boolean> {
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        prefix: '',
        message: question
      }
    ])
    return !!confirm.proceed
  }

  static async promptToFill (message: string, defaultValue?: string, validList: string[] = []): Promise<boolean> {
    const confirm = await inquirer.prompt([
      {
        type: 'input',
        name: 'provider',
        prefix: '',
        default: defaultValue,
        validate: (input) => {
          if (validList.length === 0 || validList.includes(input)) {
            return true
          }
          return `Valid cloud providers are ${validList.join(', ')}`
        },
        message
      }
    ])
    return confirm.provider
  }
}
