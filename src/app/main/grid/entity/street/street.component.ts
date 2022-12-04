import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'street-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class StreetComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('street');
        this.entity.set_table_name('street');
        this.entity.primary_key = 'street_id';
    }
}
