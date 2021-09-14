import prettyjson from 'prettyjson';

export class OutputYaml implements OutputInterface {

    public print(data: any): void {
        var testData = {
            username: 'rafeca',
            url: 'asdad',
            twitter_account: 'sssss',
            projects: ['prettyprint', 'connfu']
        };
           
        console.log(prettyjson.render(testData, {
            keysColor: 'green',
            dashColor: 'yellow',
            stringColor: 'white'
        }));
    }
    
}
