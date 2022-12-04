import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'function-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class FunctionComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('function');
        this.entity.set_table_name('function');
        this.entity.primary_key = 'function_id';
    }
}
