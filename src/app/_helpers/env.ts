export enum SitebillModes {
    standalone,
    application,
    development
};
export function detect_mode () {
    if ( document.getElementById('app_root') ) {
        if ( document.getElementById('app_root').getAttribute('standalone_mode') === 'true' ) {
            return SitebillModes.standalone;
        }
    }
    return SitebillModes.application;
}
export function detect_dev_mode () {
    if ( document.getElementById('app_root') ) {
        if (document.getElementById('app_root').getAttribute('dev_mode') === 'true') {
            return true;
        }
    }
    return false;
}
