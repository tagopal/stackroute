import { Label } from './label';
export class LabelList {
    id:number
    name:string
    labels:Array<Label>
    constructor(){
        this.id=null
        this.name = null
        this.labels = []
    }
}
