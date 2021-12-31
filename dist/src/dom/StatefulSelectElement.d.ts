export declare type StatefulHTMLSelectElement = HTMLSelectElement & {
    states: string[];
    ignoreCurrentValue: () => void;
};
declare const StatefulSelectElement: (select: HTMLSelectElement) => StatefulHTMLSelectElement;
export default StatefulSelectElement;
