import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { ModelService } from 'app/_services/model.service';
import {SearchStringParserComponent} from "../search-string-parser.component";
import {FilterService} from "../../../../_services/filter.service";
import {StringParserService} from "../../../../_services/string-parser.service";


@Component({
    selector   : 'search-string-parser-test',
    templateUrl: './search-string-parser-test.component.html',
    styleUrls  : ['./search-string-parser-test.component.scss'],
    animations : fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class SearchStringParserTestComponent extends SearchStringParserComponent
{
    test_complete = false;
    private test_result_hash: any[];
    /**
     * Constructor
     *
     */
    constructor(
        public modelService: ModelService,
        public filterService: FilterService,
        protected stringParserService: StringParserService
    )
    {
        super(
            modelService,
            filterService,
            stringParserService
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        const test_input = [
            {input: '200 1500 201', expected: 'Площадь, м: от 53 до 96 Этаж: от 8 до 11 Комнат: 3, 7 ID: 10348'},
            {input: '200 1500 3m 96 3 8-11 этаж #10348 3m 53 7', expected: 'Площадь, м: от 53 до 96 Этаж: от 8 до 11 Комнат: 3, 7 ID: 10348'},
            {input: '1-5 этаж -12 этаж -4 этаж', expected: 'Этаж: 1-12'},
            {input: '-4 этаж -12 этаж', expected: 'Этаж: до 12'},
            /*{input: '1 1', expected: 'Комнат: 1, 1'},
            {input: '1 1 1', expected: 'Комнат: 1, 1, 1'},
            {input: '1 1 50', expected: 'Комнат: 1, 1 Площадь, м: от 501'},*/
            {input: '№15323 3м 108 8 27 2 №6550 3m 183 1', expected: 'Площадь, м: от 27 до 183 Комнат: 8, 2, 1 ID: 15323, 6550'},{input: 'кухн 86 -23 этаж #18553 4м 182 7 #6644 4м 101 8', expected: 'Площадь, м: от 101 до 182 Кухня, м: от 86 Этаж: до 23 Комнат: 7, 8 ID: 18553, 6644'},{input: '3m 96 3 8-11 этаж #10348 3m 53 7', expected: 'Площадь, м: от 53 до 96 Этаж: от 11 до 11 Комнат: 3, 7 ID: 10348'},{input: '№10282 4м 145 7 4', expected: 'Площадь, м: от 145 Комнат: 7, 4 ID: 10282'},{input: '66 2 кухн 22 28- этаж №13167 3м 122 8', expected: 'Площадь, м: от 66 до 122 Кухня, м: от 22 Этаж: от 28 Комнат: 2, 8 ID: 13167'},{input: '7 кух 80 -26 этаж №5636 3m 93 8 4м 150 7', expected: 'Площадь, м: от 93 до 150 Кухня, м: от 80 Этаж: до 26 Комнат: 7, 8, 7 ID: 5636'},{input: '6 4м 51 8 4м 156 2', expected: 'Площадь, м: от 51 до 156 Комнат: 6, 8, 2'},{input: 'кух 26 №5870 3m 52 3', expected: 'Площадь, м: от 52 Кухня, м: от 26 Комнат: 3 ID: 5870'},{input: '№2918 3m 120 4 кухня 35 3- этаж №18176 3м 43 4 30-14 этаж №12923 3m 81 3', expected: 'Площадь, м: от 43 до 120 Кухня, м: от 35 Этаж: от 14 до 14 Комнат: 4, 4, 3 ID: 2918, 18176, 12923'},{input: '7 111 7', expected: 'Площадь, м: от 111 Комнат: 7, 7'},{input: '№4860 4м 155 5 154 7', expected: 'Площадь, м: от 154 до 155 Комнат: 5, 7 ID: 4860'},{input: '21 1 #11627 3м 19 3 №6719 3m 44 8', expected: 'Площадь, м: от 19 до 44 Комнат: 1, 3, 8 ID: 11627, 6719'},{input: '3m 129 7 #8946 4m 103 4', expected: 'Площадь, м: от 103 до 129 Комнат: 7, 4 ID: 8946'},{input: '#11898 4м 195 6', expected: 'Площадь, м: от 195 Комнат: 6 ID: 11898'},{input: '№2962 4м 196 2', expected: 'Площадь, м: от 196 Комнат: 2 ID: 2962'},{input: 'кух 81 23-11 этаж #15768 4м 88 5 121 4', expected: 'Площадь, м: от 88 до 121 Кухня, м: от 81 Этаж: от 11 до 11 Комнат: 5, 4 ID: 15768'},{input: '164 1 3м 15 2 6', expected: 'Площадь, м: от 15 до 164 Комнат: 1, 2, 6'},{input: '3 3 4m 42 8', expected: 'Площадь, м: от 42 Комнат: 3, 3, 8'},{input: '#2451 4m 49 8 кухня 86 #10299 3m 139 5 кух 25 30- этаж №12765 4м 199 4 №13683 4m 27 3', expected: 'Площадь, м: от 27 до 199 Кухня, м: от 25 до 86 Этаж: от 30 Комнат: 8, 5, 4, 3 ID: 2451, 10299, 12765, 13683'},{input: '12 4 6 -1 этаж #7047 4m 94 7', expected: 'Площадь, м: от 12 до 94 Этаж: до 1 Комнат: 4, 6, 7 ID: 7047'}
        ];

        /*let randomvariantscount = 10;

        var partstype = {
            'v1': 'kitchen',
            'v2': 'floor',
            'v3': 'id',
            'v4': 'cheight',
            'v5': 'area',
            'v6': 'rooms'
        }

        var variants = [];

        for(var i = 1; i < 21; i++){

            var variant = {
                'pcount': 0,
                'inputstring': [],
                'kitchen': [],
                'floor': [],
                'id': [],
                'cheight': [],
                'area': [],
                'rooms': []
            };

            var variantscount = Math.floor(Math.random() * Math.floor(randomvariantscount));

            for(var j = 1; j < variantscount; j++){

                var varianttypeid = Math.floor(Math.random() * Math.floor(6));
                var varianttype = partstype['v'+varianttypeid];

                switch(varianttype){
                    case 'kitchen' :  {
                        var cnt = Math.floor(Math.random() * (101 - 3) + 3);
                        variant['kitchen'].push(cnt);
                        variant['pcount'] += 1;

                        var pref = ['кух', 'кухн', 'кухня', 'кухни'];
                        var ind = Math.floor(Math.random() * (5 - 0) + 0);
                        variant['inputstring'].push(pref[ind] + ' ' + cnt);
                    }
                    case 'floor' :  {
                        var cnt = Math.floor(Math.random() * (30 - 0) + 0);
                        variant['floor'].push(cnt);
                        variant['pcount'] += 1;
                    }
                    case 'id' :  {
                        var cnt = Math.floor(Math.random() * (20000 - 1000) + 1000);
                        variant['id'].push(cnt);
                        variant['pcount'] += 1;
                    }
                    case 'cheight' :  {
                        var cnt = Math.floor(Math.random() * (4 - 3) + 3);
                        variant['cheight'].push(cnt);
                        variant['pcount'] += 1;
                    }
                    case 'area' :  {
                        var cnt = Math.floor(Math.random() * (199 - 9) + 9);
                        variant['area'].push(cnt);
                        variant['pcount'] += 1;
                    }
                    case 'rooms' :  {
                        var cnt = Math.floor(Math.random() * (8 - 1) + 8);
                        variant['rooms'].push(cnt);
                        variant['pcount'] += 1;
                    }
                }

            }
            variants.push(variant);
        }

        console.log(variants);*/

        let test_result;
        this.test_result_hash = [];
        test_input.forEach(
            (element) => {
                test_result = this.parse(element.input);
                this.test_result_hash.push({input:element.input, output: test_result, expected: element.expected, status: (element.expected === test_result ? true:false)});
                console.log('Input = ' + element + ', Output = ' + test_result)
            }
        );
        this.test_complete = true;
        console.log(this.test_result_hash);
        //this.parse('1 1');
    }

    get_test_class(status: boolean) {
        return (status?'green-800-fg':'red-800-fg');
    }

    get_status_message(status: boolean) {
        return (status?'OK':'Error');
    }
}
