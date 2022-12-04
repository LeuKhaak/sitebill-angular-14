export class Realty {
    id: number;
    room_count: string;
    square: string;
    type: string;
    stair_id: number;
    section_id: number;

    constructor(id, room_count, square, type, stair_id, section_id) {
        this.id = id;
        this.room_count = room_count;
        this.square = square;
        this.type = type;
        this.stair_id = stair_id;
        this.section_id = section_id;
    }

    get_id () {
        return this.id;
    }

    get_type () {
        return this.type;
    }

    get_room_count () {
        return this.room_count;
    }

    get_square () {
        return this.square;
    }
}