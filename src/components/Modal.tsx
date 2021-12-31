import { Component } from '@battis/jsx-components';
import JSXFactory from '@battis/jsx-factory';
import Icon from './Icon';
import './Modal.scss';
import Scrim from './Scrim';

export type ModalConfig = {
    title: string | HTMLElement;
    body?: string | HTMLElement;
    closeable?: boolean;
    open?: boolean;
    onClose?: () => any;
};

// TODO settle down resizing https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
export default class Modal extends Component {
    protected _title = new Component();
    protected _body = new Component();
    private readonly closeable: boolean;
    private readonly onClose;

    // TODO ModalConfig type
    public constructor({
        title,
        body,
        closeable = true,
        open = true,
        onClose
    }: ModalConfig) {
        super();
        this._title.element =
            title instanceof HTMLElement ? (
                title
            ) : (
                <h2 class="title">{title}</h2>
            );
        this._body.element =
            body instanceof HTMLElement ? body : <div>{body}</div>;
        this.closeable = closeable;
        this.onClose = onClose;
        open && this.open();
    }

    public render(children?) {
        this.element = (
            <div class="modal">
                <div
                    class="content shadow white"
                    onclick={e => e.stopPropagation()}
                >
                    <div class="header">
                        {this._title.element}
                        {this.closeable && (
                            <span class="close" onclick={this.close.bind(this)}>
                                <Icon.Close />
                            </span>
                        )}
                    </div>
                    <div class="body">{children || this._body.element}</div>
                </div>
                <Scrim
                    style="z-index: -1"
                    class="dark gray transparent"
                    onclick={this.closeable && this.close.bind(this)}
                />
            </div>
        );
        return this.element || <></>;
    }

    public open() {
        if (!this.element?.isConnected) {
            document.body.appendChild(this.element);
        }
    }

    public close(event?: Event, callHandler = true) {
        if (event) {
            event.stopPropagation();
        }
        this.element && this.element.remove();
        callHandler && this.onClose && this.onClose();
    }
}
