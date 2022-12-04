import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'district-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class DistrictComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('district');
        this.entity.set_table_name('district');
        this.entity.primary_key = 'id';
    }
}
