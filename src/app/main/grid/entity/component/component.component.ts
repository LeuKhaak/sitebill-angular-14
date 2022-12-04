import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'component-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class ComponentComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('component');
        this.entity.set_table_name('component');
        this.entity.primary_key = 'component_id';
    }
}
