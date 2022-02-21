export interface VimeoAuthorize {
    access_token: string;
    token_type:   string;
    scope:        string;
    app:          App;
}

export interface App {
    name: string;
    uri:  string;
}

export interface VimeoVideoList {
    total:    number;
    page:     number;
    per_page: number;
    paging:   Paging;
    data:     Datum[];
}

export interface Datum {
    uri:                  string;
    name:                 string;
    description:          string;
    type:                 DatumType;
    link:                 string;
    player_embed_url:     string;
    duration:             number;
    width:                number;
    language:             null | string;
    height:               number;
    embed:                EmbedClass;
    created_time:         Date;
    modified_time:        Date;
    release_time:         Date;
    content_rating:       ContentRating[];
    content_rating_class: ContentRating;
    rating_mod_locked:    boolean;
    license:              null | string;
    privacy:              Privacy;
    pictures:             Pictures;
    tags:                 Tag[];
    stats:                Stats;
    categories:           Category[];
    uploader:             Uploader;
    metadata:             DatumMetadata;
    user:                 User;
    app:                  App | null;
    status:               Status;
    resource_key:         string;
    upload:               null;
    transcode:            null;
    is_playable:          boolean;
    has_audio:            boolean;
}

export interface App {
    name: string;
    uri:  string;
}

export interface Category {
    uri:                      string;
    name:                     string;
    link:                     string;
    top_level:                boolean;
    is_deprecated:            boolean;
    pictures:                 Pictures;
    last_video_featured_time: Date;
    parent:                   Parent | null;
    metadata:                 CategoryMetadata;
    subcategories?:           Parent[];
    icon?:                    Pictures;
    resource_key:             string;
}

export interface Pictures {
    uri:             null | string;
    active:          boolean;
    type:            PicturesType;
    base_link:       string;
    sizes:           Size[];
    resource_key:    string;
    default_picture: boolean;
}

export interface Size {
    width:                  number;
    height:                 number;
    link:                   string;
    link_with_play_button?: string;
}

export enum PicturesType {
    Custom = 'custom',
    Default = 'default',
}

export interface CategoryMetadata {
    connections: PurpleConnections;
}

export interface PurpleConnections {
    channels: CommentsClass;
    groups:   CommentsClass;
    users:    CommentsClass;
    videos:   CommentsClass;
}

export interface CommentsClass {
    uri:     string;
    options: CommentsOption[];
    total:   number;
}

export enum CommentsOption {
    Get = 'GET',
    Post = 'POST',
}

export interface Parent {
    uri:  string;
    name: string;
    link: string;
}

export enum ContentRating {
    Safe = 'safe',
    Unrated = 'unrated',
}

export interface EmbedClass {
    html:   null | string;
    badges: Badges;
}

export interface Badges {
    hdr:               boolean;
    live:              Live;
    staff_pick:        StaffPick;
    vod:               boolean;
    weekend_challenge: boolean;
}

export interface Live {
    streaming: boolean;
    archived:  boolean;
}

export interface StaffPick {
    normal:            boolean;
    best_of_the_month: boolean;
    best_of_the_year:  boolean;
    premiere:          boolean;
}

export interface DatumMetadata {
    connections:      FluffyConnections;
    interactions:     Interactions;
    is_vimeo_create:  boolean;
    is_screen_record: boolean;
}

export interface FluffyConnections {
    comments:        CommentsClass;
    credits:         CommentsClass;
    likes:           CommentsClass;
    pictures:        CommentsClass;
    texttracks:      CommentsClass;
    related:         Recommendations;
    recommendations: Recommendations;
}

export interface Recommendations {
    uri:     string;
    options: RecommendationsOption[];
}

export enum RecommendationsOption {
    Get = 'GET',
    Patch = 'PATCH',
}

export interface Interactions {
    report: Report;
}

export interface Report {
    uri:     string;
    options: CommentsOption[];
    reason:  Reason[];
}

export enum Reason {
    CausesHarm = 'causes harm',
    Csam = 'csam',
    Harassment = 'harassment',
    IncorrectRating = 'incorrect rating',
    Pornographic = 'pornographic',
    Ripoff = 'ripoff',
    Spam = 'spam',
}

export interface Privacy {
    view:     CommentsEnum;
    embed:    EmbedEnum;
    download: boolean;
    add:      boolean;
    comments: CommentsEnum;
}

export enum CommentsEnum {
    Anybody = 'anybody',
    Contacts = 'contacts',
}

export enum EmbedEnum {
    Private = 'private',
    Public = 'public',
}

export interface Stats {
    plays: null;
}

export enum Status {
    Available = 'available',
}

export interface Tag {
    uri:          string;
    name:         string;
    tag:          string;
    canonical:    string;
    metadata:     TagMetadata;
    resource_key: string;
}

export interface TagMetadata {
    connections: TentacledConnections;
}

export interface TentacledConnections {
    videos: CommentsClass;
}

export enum DatumType {
    Video = 'video',
}

export interface Uploader {
    pictures: Pictures;
}

export interface User {
    uri:                string;
    name:               string;
    link:               string;
    capabilities:       Capabilities;
    location:           string;
    gender:             string;
    bio:                null | string;
    short_bio:          null | string;
    created_time:       Date;
    pictures:           Pictures;
    websites:           Website[];
    metadata:           UserMetadata;
    location_details:   LocationDetails;
    skills:             App[];
    available_for_hire: boolean;
    can_work_remotely:  boolean;
    resource_key:       string;
    account:            Account;
}

export enum Account {
    Basic = 'basic',
    Plus = 'plus',
    Pro = 'pro',
}

export interface Capabilities {
    hasLiveSubscription:     boolean;
    hasEnterpriseLihp:       boolean;
    hasSvvTimecodedComments: boolean;
}

export interface LocationDetails {
    formatted_address: string;
    latitude:          number | null;
    longitude:         number | null;
    city:              null | string;
    state:             null | string;
    neighborhood:      null;
    sub_locality:      null;
    state_iso_code:    null;
    country:           null | string;
    country_iso_code:  null | string;
}

export interface UserMetadata {
    connections: StickyConnections;
}

export interface StickyConnections {
    albums:             CommentsClass;
    appearances:        CommentsClass;
    categories:         CommentsClass;
    channels:           CommentsClass;
    feed:               Recommendations;
    followers:          CommentsClass;
    following:          CommentsClass;
    groups:             CommentsClass;
    likes:              CommentsClass;
    membership:         Recommendations;
    moderated_channels: CommentsClass;
    portfolios:         CommentsClass;
    videos:             CommentsClass;
    watchlater:         CommentsClass;
    shared:             CommentsClass;
    pictures:           CommentsClass;
    folders_root:       Recommendations;
    teams:              CommentsClass;
}

export interface Website {
    uri:         string;
    name:        null | string;
    link:        string;
    type:        string;
    description: null | string;
}

export interface Paging {
    next:     string;
    previous: null;
    first:    string;
    last:     string;
}


export interface VimeoToken {
    access_token: string;
    token_type:   string;
    scope:        string;
    app:          App;
    user:         User;
}

export interface App {
    name: string;
    uri:  string;
}


export interface Capabilities {
    hasLiveSubscription:     boolean;
    hasEnterpriseLihp:       boolean;
    hasSvvTimecodedComments: boolean;
}

export interface Metadata {
    connections: Connections;
}

export interface Connections {
    albums:             Albums;
    appearances:        Albums;
    channels:           Albums;
    feed:               Feed;
    followers:          Albums;
    following:          Albums;
    groups:             Albums;
    likes:              Albums;
    membership:         Feed;
    moderated_channels: Albums;
    portfolios:         Albums;
    videos:             Albums;
    shared:             Albums;
    pictures:           Albums;
    folders_root:       Feed;
    teams:              Albums;
}

export interface Albums {
    uri:     string;
    options: Option[];
    total:   number;
}

export enum Option {
    Get = 'GET',
    Post = 'POST',
}

export interface Feed {
    uri:     string;
    options: string[];
}

export interface Size {
    width:  number;
    height: number;
    link:   string;
}

export interface VimeoMe {
    uri:                string;
    name:               string;
    link:               string;
    capabilities:       Capabilities;
    location:           string;
    gender:             string;
    bio:                null;
    short_bio:          null;
    created_time:       Date;
    pictures:           Pictures;
    websites:           any[];
    metadata:           Metadata;
    location_details:   LocationDetails;
    skills:             any[];
    available_for_hire: boolean;
    can_work_remotely:  boolean;
    resource_key:       string;
    account:            string;
}

export interface Capabilities {
    hasLiveSubscription:     boolean;
    hasEnterpriseLihp:       boolean;
    hasSvvTimecodedComments: boolean;
}

export interface Metadata {
    connections: Connections;
}

export interface Connections {
    albums:             Albums;
    appearances:        Albums;
    channels:           Albums;
    feed:               Feed;
    followers:          Albums;
    following:          Albums;
    groups:             Albums;
    likes:              Albums;
    membership:         Feed;
    moderated_channels: Albums;
    portfolios:         Albums;
    videos:             Albums;
    shared:             Albums;
    pictures:           Albums;
    folders_root:       Feed;
    teams:              Albums;
}

export interface Albums {
    uri:     string;
    options: Option[];
    total:   number;
}

export interface Feed {
    uri:     string;
    options: string[];
}

export interface Size {
    width:  number;
    height: number;
    link:   string;
}


