import {Item, Column} from './column';

export class Model {
  id: number;
  name: string;
  columns:  Column[]=[];
}
