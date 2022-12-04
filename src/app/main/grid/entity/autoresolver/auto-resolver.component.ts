import {Component, Input} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'auto-resolver-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    animations: fuseAnimations
})
export class AutoResolverComponent extends GridComponent {
    @Input('app_name')
    app_name: string;

    @Input('table_name')
    table_name: string;

    @Input('primary_key')
    primary_key: string;

    setup_apps() {
        this.entity.set_app_name(this.app_name);
        this.entity.set_table_name(this.table_name);
        this.entity.primary_key = this.primary_key;
    }
}
