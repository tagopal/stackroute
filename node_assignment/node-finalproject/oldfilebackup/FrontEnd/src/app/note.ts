export class Note {
    _id:Number;
  id: Number;
  title: string;
  text: string;
  state: string;
    favorite: boolean;
    labels: Array<string>;
  constructor() {
    this._id = null;
    this.title = '';
    this.text = '';
    this.state = 'not-started';
    this.favorite = false;
    this.labels = [];
  }
}
