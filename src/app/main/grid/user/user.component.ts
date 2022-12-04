import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';


@Component({
    selector: 'user-grid',
    templateUrl: '../grid.component.html',
    styleUrls: ['../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class UserComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('user');
        this.entity.set_table_name('user');
        this.entity.primary_key = 'user_id';
        this.enable_testimonials_button = true;
    }

}
