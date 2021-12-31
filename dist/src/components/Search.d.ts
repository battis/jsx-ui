import { Component } from '@battis/jsx-components';
import './Search.scss';
export declare type SearchResult = object;
export declare type SearchResultList = SearchResult[];
declare type SearchResultCallable = (query: string) => SearchResultList | Promise<SearchResultList>;
declare type SearchResultFormatted = string | {
    display: Element | string;
    preview?: string;
    value?: string;
    handler: EventListener;
};
declare type SearchResultFormatter = (query: string, result: SearchResult) => string | Element | SearchResultFormatted | undefined;
declare type SearchSummarizer = (query: string, results: SearchResultList) => string | Element | SearchResultFormatted | undefined;
declare type SearchConfig = {
    label?: string;
    minimumCharacters?: number;
    debounce?: number;
    search: SearchResultCallable;
    format?: SearchResultFormatter;
    prependToResults?: string | Element | SearchSummarizer;
    appendToResults?: string | Element | SearchSummarizer;
    name?: string;
};
export default class Search extends Component {
    private query;
    private input;
    private searchResults;
    private readonly label?;
    private readonly minimumCharacters;
    private readonly debounce;
    private readonly search;
    private readonly format;
    private readonly prependToResults?;
    private readonly appendToResults?;
    private debounceSequence;
    private keyMapping;
    constructor({ label, minimumCharacters, debounce, // milliseconds
    search, format, prependToResults, appendToResults, name }: SearchConfig);
    render(): import("@battis/jsx-components/dist/src/Component").ComponentizedElement;
    private filterKeyStrokes;
    private captureKeyStrokes;
    get selection(): HTMLElement | undefined;
    private moveSelection;
    private moveSelectionUp;
    private moveSelectionDown;
    makeSelection(): void;
    private triggerSearch;
    private reduceSummarizer;
    private reduceFormattedResult;
    private appendSearchResult;
    private appendSearchResultDivider;
    private displaySearchResults;
    clear(): void;
    private expand;
    private collapse;
}
export {};
