import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'group-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class GroupComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('group');
        this.entity.set_table_name('group');
        this.entity.primary_key = 'group_id';
    }
}
