
export interface ActionVideo {
    link: string,
    options: {
        autoplay: boolean,
        muted: boolean,
        start_on: number,
        thumbnail?: string
    }
}

export interface ActionLink {
    link: string;
}

export declare type Action = ActionVideo | ActionLink;