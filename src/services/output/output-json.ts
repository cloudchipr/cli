export class OutputJson implements OutputInterface {

    public print(data: any): void {
        const testData = {
            aaa: 12,
            bb: 'dasdasd',
            c: {
              d: 213123
            }
        };
        console.log(JSON.stringify(testData, null, 4));
    }
    
}
