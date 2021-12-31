import JSXFactory from '@battis/jsx-factory';
import { Text } from '@battis/jsx-lib';
import { ServerComponent } from '@battis/jsx-components';
import { _HTML } from '@battis/monkey-patches';
import { Nullable, Subset } from '@battis/typescript-tricks';
import Modal, { ModalConfig } from './Modal';
import './ModalEdit.scss';

export type ForeignKeyType =
    | typeof ServerComponent
    | { label: string; type: typeof ServerComponent };
export type ForeignKeyLookupFunction = (
    key: Nullable<string>
) => Nullable<ForeignKeyType>;

export type ModalEditConfig = Subset<
    { closeable?; open?; onClose? },
    ModalConfig
> & {
    title?: Nullable<string | HTMLElement>;
    body?: Nullable<string | HTMLElement>;

    target: ModalEditTarget;
    views?: Record<string, () => HTMLElement>;
    callback?: Nullable<(any) => any>;
    foreignKeyLookup?: ForeignKeyLookupFunction;
};

export interface ModalEditTarget {
    editableProperties(): object;

    editCallback(edits: object): void;
}

const foreignKeyGeneric: ForeignKeyLookupFunction = (): Nullable<
    typeof ServerComponent
> => {
    return null;
};

export default class ModalEdit extends Modal {
    public constructor({
        target,
        title,
        views = {},
        callback = null,
        foreignKeyLookup = foreignKeyGeneric,
        ...params
    }: ModalEditConfig) {
        // TODO add cancel button
        super({
            ...params,
            title: title || `Edit ${Text.titleCase(target.constructor.name)}`,
            body: <div />
        });

        this._body.element = (
            <form
                class="modal-edit form"
                onsubmit={this.handleSubmit.bind(
                    this,
                    callback || target.editCallback.bind(target)
                )}
            >
                <div class="form-controls">
                    {this.formatPropertyControls(
                        target,
                        views,
                        foreignKeyLookup
                    )}
                </div>
                <div class="buttons">
                    <button type="submit" class="default">
                        Save
                    </button>
                </div>
            </form>
        );
    }

    private handleSubmit(callback, event) {
        event.preventDefault();
        const edits = {};
        for (const control of event.target.elements) {
            control.name &&
                (edits[control.name] = control.value.length
                    ? control.value
                    : null);
        }
        callback(edits);
        this.close(undefined, false);
    }

    private formatPropertyControls(target, views, foreignKeyLookup) {
        const props = target.editableProperties();
        return Object.getOwnPropertyNames(props).map(key => {
            if (key in views) {
                return views[key]();
            }
            const componentType = foreignKeyLookup(key);
            if (componentType) {
                return (
                    <>
                        <label>
                            {Text.unCamelCase(
                                (componentType.label && componentType.label) ||
                                    componentType.name
                            ).toLowerCase()}
                        </label>
                        {_HTML.asyncSelectControl({
                            name: key,
                            value: target[key],
                            loader: () =>
                                (
                                    (componentType.type &&
                                        componentType.type) ||
                                    componentType
                                )
                                    .list()
                                    .then(options =>
                                        options.map(option => {
                                            return {
                                                id: option.id,
                                                name: (
                                                    option.inline() as HTMLElement
                                                ).innerText
                                            };
                                        })
                                    )
                        })}
                    </>
                );
            } else {
                return (
                    <>
                        <label>{Text.unCamelCase(key).toLowerCase()} </label>
                        <input
                            type="text"
                            name={key}
                            value={props[key] || ''}
                        />
                    </>
                );
            }
        });
    }
}
