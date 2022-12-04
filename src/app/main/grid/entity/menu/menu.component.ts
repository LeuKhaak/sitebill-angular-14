import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'menu-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class MenuComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('menu');
        this.entity.set_table_name('menu');
        this.entity.primary_key = 'menu_id';
    }
}
