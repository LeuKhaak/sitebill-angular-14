export class LevelLocationModel {
    id: number;
    title: string;
    description: string;
    category: string;
    x: number;
    y: number;
    realty_id: number;
    building_blocks_id: number;
    private label_id: number;

    constructor(item: any = clearLevelLocation) {
        this.id = item.id;
        this.title = item.title;
        this.description = item.description;
        this.category = item.category;
        this.x = item.x;
        this.y = item.y;
        this.realty_id = item.realty_id;
        this.building_blocks_id = item.building_blocks_id;
        this.label_id = item.label_id;
    }

    getTitle() {
        return this.title;
    }
    getId() {
        return this.id;
    }
    getRealtyId() {
        return this.realty_id;
    }
    setRealtyId(realty_id:number) {
        this.realty_id = realty_id;
    }
    getBuildingBlocksId() {
        return this.building_blocks_id;
    }
    setBuildingBlocksId(building_blocks_id:number) {
        this.building_blocks_id = building_blocks_id;
    }
    getColor() {
        if ( this.getLabelId() ) {
            if ( this.getBuildingBlocksId() ) {
                return labelColors.building_blocks;
            } else {
                return labelColors.realty;
            }
        }
        return labelColors.empty;
    }

    setLabelId(label_id:number) {
        this.label_id = label_id;
    }
    getLabelId() {
        return this.label_id;
    }
}
const clearLevelLocation = {
    id: 0,
    title: '',
    description: '',
    category: '',
    x: '',
    y: '',
    realty_id: 0,
    building_blocks_id: 0,
    label_id: null
};

export const labelColors = {
    empty: '#ff5722',
    realty: '#00e676',
    building_blocks: '#00a7fd'
}