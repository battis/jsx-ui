import { Optional } from '@battis/typescript-tricks';

export type StatefulHTMLSelectElement = HTMLSelectElement & {
    states: string[];
    ignoreCurrentValue: () => void;
};
type PrivateStatefulHTMLSelectElement = StatefulHTMLSelectElement & {
    _value: Optional<string>;
};

const StatefulSelectElement = (
    select: HTMLSelectElement
): StatefulHTMLSelectElement => {
    const stateful = select as PrivateStatefulHTMLSelectElement;
    stateful.states = [];
    stateful.ignoreCurrentValue = () => {
        stateful._value = undefined;
    };

    // TODO this feels hack-tackular, surely there's a better way?
    //  The core issue is that the select value is unavailable until it is added
    //  to the DOM...
    const getCurrentValue = () => {
        if (!stateful.value) {
            setTimeout(getCurrentValue);
        } else {
            stateful._value = stateful.value;
        }
    };
    getCurrentValue();

    stateful.addEventListener('change', () => {
        if (stateful._value) {
            stateful.states.push(stateful._value);
        }
        stateful._value = stateful.value;
    });
    return stateful;
};

export default StatefulSelectElement;
