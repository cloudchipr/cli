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
}
