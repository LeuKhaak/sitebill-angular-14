import {Component, OnInit} from '@angular/core';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {ReportType} from '../../../../apps/whatsapp/types/whatsapp.types';

@Component({
    selector: 'summary-report',
    templateUrl: './summary-report.component.html',
    styleUrls: ['./summary-report.component.scss'],
    animations: fuseAnimations
})
export class SummaryReportComponent implements OnInit {
    data_report_type: number;
    client_report_type: number;

    constructor() {
        this.data_report_type = ReportType.data;
        this.client_report_type = ReportType.client;
    }

    ngOnInit(): void {
    }

}
