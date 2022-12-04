import { NgModule } from '@angular/core';

import { EscapeHtmlPipe } from './keep-html.pipe';
import {HighlightPipe} from './highlight-pipe';
import {PricePipe} from './price.pipe';

const bundle = [
    EscapeHtmlPipe,
    HighlightPipe,
    PricePipe,
];

@NgModule({
    declarations: [...bundle],
    imports     : [],
    exports     : [...bundle]
})
export class SitebillPipesModule
{
}
