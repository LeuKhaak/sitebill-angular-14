import {Component, Input} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'messages-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    animations: fuseAnimations
})
export class MessagesComponent extends GridComponent {

    @Input('client_id')
    client_id: number;

    setup_apps() {
        this.entity.set_app_name('messages');
        this.entity.set_table_name('messages');
        this.entity.primary_key = 'message_id';
        this.enable_select_rows = false;
        this.disable_add_button = true;
        this.disable_delete_button = true;
        this.disable_edit_button = true;

        const default_columns_list = [
            'message_id',
            'created_at',
            'client_id',
            'data_id',
            'content',
            'file_name'
        ];
        this.define_grid_fields(default_columns_list);
        if ( this.client_id ) {
            this.entity.set_default_params({client_id: this.client_id});
        }

    }
}
