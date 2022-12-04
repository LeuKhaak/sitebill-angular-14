import {SectionModel} from "./section.model";

export class StairModel {
    _id: string;
    name: string;
    sections: SectionModel[];
    constructor(item: any = clearStair) {
        this._id = item._id;
        this.name = item.name;
        this.sections = item.sections
    }

    getName() {
        return this.name;
    }

    getId() {
        return this._id;
    }

    getSections():SectionModel[] {
        return this.sections;
    }
}

const clearStair = {
    _id: '',
    name: '',
    sections: [],
};
