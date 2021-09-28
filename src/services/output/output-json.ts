export class OutputJson implements OutputInterface {

    public print(data: any): void {

        console.log(JSON.stringify(data, null, 4));
    }
    
}
