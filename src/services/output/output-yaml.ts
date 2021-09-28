import prettyjson from 'prettyjson';

export class OutputYaml implements OutputInterface {

    public print(data: any): void {
        console.log(prettyjson.render(data, {
            keysColor: 'green',
            dashColor: 'yellow',
            stringColor: 'white'
        }));
    }
    
}
