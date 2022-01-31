import { Action } from './action';
import { WorkspaceFeatures } from './workspace.interface';

export interface Releases {
    version: string;
    description: string;
    action: Action;
    emojiId: string;
    features: WorkspaceFeatures[];
}