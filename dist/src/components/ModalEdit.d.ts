import { ServerComponent } from '@battis/jsx-components';
import { Nullable, Subset } from '@battis/typescript-tricks';
import Modal, { ModalConfig } from './Modal';
import './ModalEdit.scss';
export declare type ForeignKeyType = typeof ServerComponent | {
    label: string;
    type: typeof ServerComponent;
};
export declare type ForeignKeyLookupFunction = (key: Nullable<string>) => Nullable<ForeignKeyType>;
export declare type ModalEditConfig = Subset<{
    closeable?: any;
    open?: any;
    onClose?: any;
}, ModalConfig> & {
    title?: Nullable<string | HTMLElement>;
    body?: Nullable<string | HTMLElement>;
    target: ModalEditTarget;
    views?: Record<string, () => HTMLElement>;
    callback?: Nullable<(any: any) => any>;
    foreignKeyLookup?: ForeignKeyLookupFunction;
};
export interface ModalEditTarget {
    editableProperties(): object;
    editCallback(edits: object): void;
}
export default class ModalEdit extends Modal {
    constructor({ target, title, views, callback, foreignKeyLookup, ...params }: ModalEditConfig);
    private handleSubmit;
    private formatPropertyControls;
}
