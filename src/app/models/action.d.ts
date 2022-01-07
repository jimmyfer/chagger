
export interface Action {
    type: string;
    link: string;
    options: {
        title: string;
        autoplay: boolean;
        muted: boolean;
        startOn: {
            hour: number;
            minute: number;
            second: number;
        },
        thumbnail?: string
    }
}
