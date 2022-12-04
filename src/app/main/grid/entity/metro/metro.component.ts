import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'metro-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class MetroComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('metro');
        this.entity.set_table_name('metro');
        this.entity.primary_key = 'metro_id';
    }
}
