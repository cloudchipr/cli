import inquirer from 'inquirer'

export class InquirerHelper {
  static prompt (question: string) {
    const confirm = inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        prefix: '',
        message: `${question}? `
      }
    ])
    return !!confirm
  }
}
