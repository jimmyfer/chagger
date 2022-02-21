export interface GitHubRepoList {
    id:                number;
    node_id:           string;
    name:              string;
    full_name:         string;
    private:           boolean;
    owner:             Owner;
    html_url:          string;
    description:       null | string;
    fork:              boolean;
    url:               string;
    forks_url:         string;
    keys_url:          string;
    collaborators_url: string;
    teams_url:         string;
    hooks_url:         string;
    issue_events_url:  string;
    events_url:        string;
    assignees_url:     string;
    branches_url:      string;
    tags_url:          string;
    blobs_url:         string;
    git_tags_url:      string;
    git_refs_url:      string;
    trees_url:         string;
    statuses_url:      string;
    languages_url:     string;
    stargazers_url:    string;
    contributors_url:  string;
    subscribers_url:   string;
    subscription_url:  string;
    commits_url:       string;
    git_commits_url:   string;
    comments_url:      string;
    issue_comment_url: string;
    contents_url:      string;
    compare_url:       string;
    merges_url:        string;
    archive_url:       string;
    downloads_url:     string;
    issues_url:        string;
    pulls_url:         string;
    milestones_url:    string;
    notifications_url: string;
    labels_url:        string;
    releases_url:      string;
    deployments_url:   string;
    created_at:        Date;
    updated_at:        Date;
    pushed_at:         Date;
    git_url:           string;
    ssh_url:           string;
    clone_url:         string;
    svn_url:           string;
    homepage:          null | string;
    size:              number;
    stargazers_count:  number;
    watchers_count:    number;
    language:          null | string;
    has_issues:        boolean;
    has_projects:      boolean;
    has_downloads:     boolean;
    has_wiki:          boolean;
    has_pages:         boolean;
    forks_count:       number;
    mirror_url:        null;
    archived:          boolean;
    disabled:          boolean;
    open_issues_count: number;
    license:           License | null;
    allow_forking:     boolean;
    is_template:       boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    topics:            any[];
    visibility:        Visibility;
    forks:             number;
    open_issues:       number;
    watchers:          number;
    default_branch:    DefaultBranch;
    permissions:       Permissions;
}

export enum DefaultBranch {
    Main = 'main',
    Master = 'master',
}

export interface License {
    key:     string;
    name:    string;
    spdx_id: string;
    url:     null | string;
    node_id: string;
}

export interface Owner {
    login:               string;
    id:                  number;
    node_id:             string;
    avatar_url:          string;
    gravatar_id:         string;
    url:                 string;
    html_url:            string;
    followers_url:       string;
    following_url:       string;
    gists_url:           string;
    starred_url:         string;
    subscriptions_url:   string;
    organizations_url:   string;
    repos_url:           string;
    events_url:          string;
    received_events_url: string;
    type:                Type;
    site_admin:          boolean;
}

export enum Type {
    User = 'User',
}

export interface Permissions {
    admin:    boolean;
    maintain: boolean;
    push:     boolean;
    triage:   boolean;
    pull:     boolean;
}

export enum Visibility {
    Private = 'private',
    Public = 'public',
}

export interface GitHubUser {
    login:               string;
    id:                  number;
    node_id:             string;
    avatar_url:          string;
    gravatar_id:         string;
    url:                 string;
    html_url:            string;
    followers_url:       string;
    following_url:       string;
    gists_url:           string;
    starred_url:         string;
    subscriptions_url:   string;
    organizations_url:   string;
    repos_url:           string;
    events_url:          string;
    received_events_url: string;
    type:                string;
    site_admin:          boolean;
    name:                null;
    company:             null;
    blog:                string;
    location:            string;
    email:               string;
    hireable:            boolean;
    bio:                 null;
    twitter_username:    null;
    public_repos:        number;
    public_gists:        number;
    followers:           number;
    following:           number;
    created_at:          Date;
    updated_at:          Date;
}

export interface GitHubToken {
    access_token: string;
    token_type:   string;
    scope:        string;
}

export interface GitHubRepo {
    id:                     number;
    node_id:                string;
    name:                   string;
    full_name:              string;
    private:                boolean;
    owner:                  Owner;
    html_url:               string;
    description:            string;
    fork:                   boolean;
    url:                    string;
    forks_url:              string;
    keys_url:               string;
    collaborators_url:      string;
    teams_url:              string;
    hooks_url:              string;
    issue_events_url:       string;
    events_url:             string;
    assignees_url:          string;
    branches_url:           string;
    tags_url:               string;
    blobs_url:              string;
    git_tags_url:           string;
    git_refs_url:           string;
    trees_url:              string;
    statuses_url:           string;
    languages_url:          string;
    stargazers_url:         string;
    contributors_url:       string;
    subscribers_url:        string;
    subscription_url:       string;
    commits_url:            string;
    git_commits_url:        string;
    comments_url:           string;
    issue_comment_url:      string;
    contents_url:           string;
    compare_url:            string;
    merges_url:             string;
    archive_url:            string;
    downloads_url:          string;
    issues_url:             string;
    pulls_url:              string;
    milestones_url:         string;
    notifications_url:      string;
    labels_url:             string;
    releases_url:           string;
    deployments_url:        string;
    created_at:             Date;
    updated_at:             Date;
    pushed_at:              Date;
    git_url:                string;
    ssh_url:                string;
    clone_url:              string;
    svn_url:                string;
    homepage:               null;
    size:                   number;
    stargazers_count:       number;
    watchers_count:         number;
    language:               string;
    has_issues:             boolean;
    has_projects:           boolean;
    has_downloads:          boolean;
    has_wiki:               boolean;
    has_pages:              boolean;
    forks_count:            number;
    mirror_url:             null;
    archived:               boolean;
    disabled:               boolean;
    open_issues_count:      number;
    license:                License;
    allow_forking:          boolean;
    is_template:            boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    topics:                 any[];
    visibility:             string;
    forks:                  number;
    open_issues:            number;
    watchers:               number;
    default_branch:         string;
    permissions:            Permissions;
    temp_clone_token:       string;
    allow_squash_merge:     boolean;
    allow_merge_commit:     boolean;
    allow_rebase_merge:     boolean;
    allow_auto_merge:       boolean;
    delete_branch_on_merge: boolean;
    allow_update_branch:    boolean;
    network_count:          number;
    subscribers_count:      number;
}

export interface Permissions {
    admin:    boolean;
    maintain: boolean;
    push:     boolean;
    triage:   boolean;
    pull:     boolean;
}

export interface GitHubRepoClosedIssues {
    url:                      string;
    repository_url:           string;
    labels_url:               string;
    comments_url:             string;
    events_url:               string;
    html_url:                 string;
    id:                       number;
    node_id:                  string;
    number:                   number;
    title:                    string;
    user:                     User;
    labels:                   Label[];
    state:                    State;
    locked:                   boolean;
    assignee:                 User | null;
    assignees:                User[];
    milestone:                null;
    comments:                 number;
    created_at:               Date;
    updated_at:               Date;
    closed_at:                Date;
    author_association:       AuthorAssociation;
    active_lock_reason:       null;
    body:                     string;
    reactions:                Reactions;
    timeline_url:             string;
    performed_via_github_app: null;
}

export interface User {
    login:               string;
    id:                  number;
    node_id:             string;
    avatar_url:          string;
    gravatar_id:         string;
    url:                 string;
    html_url:            string;
    followers_url:       string;
    following_url:       string;
    gists_url:           string;
    starred_url:         string;
    subscriptions_url:   string;
    organizations_url:   string;
    repos_url:           string;
    events_url:          string;
    received_events_url: string;
    type:                Type;
    site_admin:          boolean;
}

export enum AuthorAssociation {
    Owner = 'OWNER',
}

export interface Label {
    id:          number;
    node_id:     string;
    url:         string;
    name:        string;
    color:       string;
    default:     boolean;
    description: string;
}

export interface Reactions {
    url:         string;
    total_count: number;
    '+1':        number;
    '-1':        number;
    laugh:       number;
    hooray:      number;
    confused:    number;
    heart:       number;
    rocket:      number;
    eyes:        number;
}

export enum State {
    Closed = 'closed',
}
