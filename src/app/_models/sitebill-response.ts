export class SitebillResponse {
    state: string;
    message: string;
    data: any;
    public static state: string;

    constructor(state?:string, message?:string, data?:any) {
        this.state = state;
        this.message = message;
        this.data = data;
    }

    public success() {
        return this.state === 'success';
    }
}

export enum ResponseState {
    success = 'success',
    error = 'error'
}
