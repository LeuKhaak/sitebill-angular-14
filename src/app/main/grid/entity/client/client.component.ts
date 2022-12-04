import { Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'client-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    animations: fuseAnimations
})
export class ClientComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('client');
        this.entity.set_table_name('client');
        this.entity.primary_key = 'client_id';
        this.enable_coworker_button = true;
    }
}
