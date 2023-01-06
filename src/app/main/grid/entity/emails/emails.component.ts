import {Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'emails-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    animations: fuseAnimations
})
export class EmailsComponent extends GridComponent {
    setup_apps(): void {
        this.entity.set_app_name('emails');
        this.entity.set_table_name('emails');
        this.entity.primary_key = 'id';
        this.entity.set_default_params({ user_id: this.getSessionKeyService.get_user_id() });
        this.disable_add_button = true;
        this.disable_delete_button = true;
        this.disable_edit_button = true;

        const grid_fields = ['id', 'date', 'subject', 'message'];
        this.define_grid_fields(grid_fields);

    }
}
