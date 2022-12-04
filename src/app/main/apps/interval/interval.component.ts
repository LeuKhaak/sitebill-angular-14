import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {LocaleConfig} from 'ngx-daterangepicker-material';
import {FilterService} from '../../../_services/filter.service';
import {SitebillEntity} from 'app/_models';

@Component({
  selector: 'app-interval',
  templateUrl: './interval.component.html',
  styleUrls: ['./interval.component.scss']
})
export class IntervalComponent implements OnInit {

  // @Input() filterName;
  @Input() entity: SitebillEntity;
  calendarHidden = false;
  date_range_enable = true;
  date_range_key: string;
  selected_date_filter;
  selected_date_filter_has_values = false;

  ranges: any = {
        'Сегодня': [moment(), moment()],
        'Вчера': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'За 7 дней': [moment().subtract(6, 'days'), moment()],
        'За 30 дней': [moment().subtract(29, 'days'), moment()],
        'Этот месяц': [moment().startOf('month'), moment().endOf('month')],
        'Прошлый месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  };
  date_range_locale: LocaleConfig = {
        format: 'DD.MM.YYYY',
        separator: ' - ', // default is ' - '
        cancelLabel: 'Отмена', // detault is 'Cancel'
        applyLabel: 'Применить', // detault is 'Apply'
        firstDay: 1, // first day is monday
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.months()
  };

    constructor(
        private filterService: FilterService,
    ) {
    }

  ngOnInit(): void {

  }

    date_range_change(event, column_name) {
      this.selected_date_filter_has_values = true;
    }

    goToSelectDate() {

    }

    clear_selected_date_filter(key) {
      this.selected_date_filter = null;
      this.selected_date_filter_has_values = false;
    }

    selectItem(value): void {
        if (value) {
            const val = JSON.parse(JSON.stringify(value));
            const start = val.startDate.slice(0, 10);
            const end = val.endDate.slice(0, 10);
            delete val.endDate;
            val.startDate = start;
            val.endDate = end;
            this.filterService.share_data(this.entity, 'date_added', val);
        }
    }

}
