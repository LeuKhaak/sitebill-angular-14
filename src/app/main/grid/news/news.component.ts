import {ChangeDetectionStrategy, Component} from '@angular/core';
import { GridComponent } from 'app/main/grid/grid.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'news-grid',
    templateUrl: '../grid.component.html',
    styleUrls: ['../grid.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class NewsComponent extends GridComponent {
    setup_apps() {
        this.entity.set_app_name('news');
        this.entity.set_table_name('news');
        this.entity.primary_key = 'news_id';
        this.enable_date_range('date');
    }
}
