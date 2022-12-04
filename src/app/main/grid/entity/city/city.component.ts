import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'city-grid',
    templateUrl: '../../grid.component.html',
    styleUrls: ['../../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class CityComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('city');
        this.entity.set_table_name('city');
        this.entity.primary_key = 'city_id';
        this.enable_coworker_button = true;
    }
}
