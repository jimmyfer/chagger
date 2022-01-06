
export interface ActionVideo {
    type: string,
    link: string,
    options: {
        autoplay: boolean,
        muted: boolean,
        startOn: {
            hour: number,
            minute: number,
            second: number
        },
        thumbnail?: string
    }
}

export interface ActionLink {
    link: string;
}

export declare type Action = ActionVideo | ActionLink;