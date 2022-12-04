import { Component } from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'memorylist-grid',
    templateUrl: '../grid/grid.component.html',
    styleUrls: ['../grid/grid.component.scss'],
    animations: fuseAnimations
})
export class MemoryListComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('memorylist');
        this.entity.set_table_name('data');
        this.entity.primary_key = 'id';
        this.enable_date_range('date_added');
    }
}
