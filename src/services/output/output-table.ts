import Table from 'cli-table';

export class OutputTable implements OutputInterface {

    public print(data: any): void {
        const table = new Table({
            head: ['TH 1 label', 'TH 2 label']
        });
        table.push(
            ['First value', 'Second value'],
            ['First value', 'Second value']
        );
        console.log(table.toString());
    }
    
}
