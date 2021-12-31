import { Component } from '@battis/jsx-components';
import './Modal.scss';
export declare type ModalConfig = {
    title: string | HTMLElement;
    body?: string | HTMLElement;
    closeable?: boolean;
    open?: boolean;
    onClose?: () => any;
};
export default class Modal extends Component {
    protected _title: Component;
    protected _body: Component;
    private readonly closeable;
    private readonly onClose;
    constructor({ title, body, closeable, open, onClose }: ModalConfig);
    render(children?: any): import("@battis/jsx-components/dist/src/Component").ComponentizedElement;
    open(): void;
    close(event?: Event, callHandler?: boolean): void;
}
