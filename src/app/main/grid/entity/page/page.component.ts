import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'page-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class PageComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('page');
        this.entity.set_table_name('page');
        this.entity.primary_key = 'page_id';
    }
}
