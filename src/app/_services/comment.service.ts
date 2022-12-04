import { Injectable, isDevMode, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {currentUser} from 'app/_models/currentuser';
import { APP_CONFIG, AppConfig } from 'app/app.config.module';
import { ModelService } from './model.service';

@Injectable()
export class CommentService implements Resolve<any>
{
    timeline: any;
    about: any;
    photosVideos: any;
    object_id: any;

    api_url: string;

    timelineOnChanged: BehaviorSubject<any>;
    aboutOnChanged: BehaviorSubject<any>;
    photosVideosOnChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private modelService: ModelService,
        @Inject(APP_CONFIG) private config: AppConfig
    )
    {
        this.api_url = this.modelService.get_api_url();

        // Set the defaults
        this.timelineOnChanged = new BehaviorSubject({});
        this.aboutOnChanged = new BehaviorSubject({});
        this.photosVideosOnChanged = new BehaviorSubject({});

    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        console.log('object_id r ' + this.object_id);

        return new Promise((resolve, reject) => {
            Promise.all([
                this.getTimeline(),
                console.log('object_id r ' + this.object_id),
                //this.getPhotosVideos()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get timeline
     */
    getTimeline(): Promise<any[]>
    {
        const app_name = 'client';
        console.log('timeline');
        console.log('object_id get ' + this.object_id);

        const body = { action: 'comment', do: 'get', model_name: app_name, session_key: this.modelService.get_session_key() };

        return new Promise((resolve, reject) => {

            this._httpClient.post(`${this.api_url}/apps/api/rest.php`, body)
                .subscribe((timeline: any) => {
                    console.log(timeline);
                    this.timeline = timeline;
                    this.timelineOnChanged.next(this.timeline);
                    resolve(this.timeline);
                }, reject);
        });
    }

    /**
     * Get about
     */
    getAbout(): Promise<any[]>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.get('api/profile-about')
                .subscribe((about: any) => {
                    this.about = about;
                    this.aboutOnChanged.next(this.about);
                    resolve(this.about);
                }, reject);
        });
    }

    /**
     * Get photos & videos
     */
    getPhotosVideos(): Promise<any[]>
    {
        return new Promise((resolve, reject) => {

            this._httpClient.get('api/profile-photos-videos')
                .subscribe((photosVideos: any) => {
                    this.photosVideos = photosVideos;
                    this.photosVideosOnChanged.next(this.photosVideos);
                    resolve(this.photosVideos);
                }, reject);
        });
    }

}
