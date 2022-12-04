import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'parser-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class ParserComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('parser');
        this.entity.set_app_url('https://www.etown.ru');
        this.entity.set_app_session_key('nobody');
        this.entity.set_table_name('data');
        this.entity.primary_key = 'id';
        this.switch_collections(true);
        this.enable_date_range('date_added');
        this.disable_add_button = true;
        this.disable_delete_button = true;
        this.enable_collections = false;
        this.disable_wild_search = true;
        this.freeze_default_columns_list = true;
        this.enable_select_rows = false;
    }

    getRowClass(row): string {
        try {
            if (row['id'].collections != null) {
                return 'green-100-bg';
            }
        } catch {
        }

        try {
            if (row.active.value != 1) {
                return 'red-100-bg';
            }
            if (row.hot.value == 1) {
                return 'amber-100-bg';
            }
        } catch {
        }


    }
}
