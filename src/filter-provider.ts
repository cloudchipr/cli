import {readFileSync} from "fs";

export class FilterProvider {
    getFilter(filename: string) {
        return readFileSync(filename,'utf8')
    }
}