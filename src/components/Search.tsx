import { Browser } from '@battis/jsx-lib';
import { Component } from '@battis/jsx-components';
import JSXFactory from '@battis/jsx-factory';
import Visual from '../stylesheets/Visual';
import './Search.scss';

// TODO maybe use a Flyout to handle the drop-down? (or abstract the Flyout logic somewhere shared...)

export type SearchResult = object;
export type SearchResultList = SearchResult[];
type SearchResultCallable = (
    query: string
) => SearchResultList | Promise<SearchResultList>;
type SearchResultFormatted =
    | string
    | {
          display: Element | string;
          preview?: string;
          value?: string;
          handler: EventListener;
      };
type SearchResultFormatter = (
    query: string,
    result: SearchResult
) => string | Element | SearchResultFormatted | undefined;
type SearchSummarizer = (
    query: string,
    results: SearchResultList
) => string | Element | SearchResultFormatted | undefined;
type SearchConfig = {
    label?: string;
    minimumCharacters?: number;
    debounce?: number; // milliseconds
    search: SearchResultCallable;
    format?: SearchResultFormatter;
    prependToResults?: string | Element | SearchSummarizer;
    appendToResults?: string | Element | SearchSummarizer;
    name?: string;
};

export default class Search extends Component {
    private query = (
        <div
            class="search-query input"
            contentEditable={true} // FIXME this camelCase is really a JSXFactory.parseElement issue
            onkeydown={this.filterKeyStrokes.bind(this)}
            onblur={this.collapse.bind(this)}
            onfocus={this.triggerSearch.bind(this)}
        />
    );
    private input = Visual.hide(<input type="text" />);
    private searchResults: HTMLSelectElement = Visual.hide(
        <div class="search-results shadow down white" />
    ) as HTMLSelectElement;

    private readonly label?: string;
    private readonly minimumCharacters: number;
    private readonly debounce: number; // milliseconds
    private readonly search: SearchResultCallable;
    private readonly format: SearchResultFormatter;
    private readonly prependToResults?: string | Element | SearchSummarizer;
    private readonly appendToResults?: string | Element | SearchSummarizer;

    private debounceSequence = 0;

    private keyMapping: Map<string, Function> = new Map<string, Function>();

    public constructor({
        label = undefined,
        minimumCharacters = 2,
        debounce = 50, // milliseconds
        search = () => [],
        format = (query, result) => {
            return (
                <span>
                    {JSON.stringify(result).replace(
                        RegExp(`(${query})`, 'i'),
                        '<strong>$1</strong>'
                    )}
                </span>
            );
        },
        prependToResults = undefined,
        appendToResults = undefined,
        name = undefined
    }: SearchConfig) {
        super();
        this.label = label;
        this.minimumCharacters = minimumCharacters;
        this.debounce = debounce;
        this.search = search;
        this.format = format;
        this.prependToResults = prependToResults;
        this.appendToResults = appendToResults;
        if (name) {
            this.input.name = name;
        }

        this.keyMapping.set('Escape', this.collapse.bind(this));
        this.keyMapping.set('ArrowUp', this.moveSelectionUp.bind(this));
        this.keyMapping.set('ArrowDown', this.moveSelectionDown.bind(this));
        this.keyMapping.set('Enter', this.makeSelection.bind(this));
    }

    public render() {
        this.element = (
            <div class="search-wrapper">
                {this.input}
                {this.label && <label>{this.label}</label>}
                {this.query}
                {this.searchResults}
            </div>
        );

        Browser.allowSelectAndBlur(this.searchResults);
        document.addEventListener('keyup', this.captureKeyStrokes.bind(this));
        return this.element;
    }

    private filterKeyStrokes(event) {
        const handler = this.keyMapping.get(event.code);
        if (handler) {
            event.preventDefault();
            handler();
        }
    }

    private captureKeyStrokes(event) {
        if (event.target === this.query) {
            this.triggerSearch();
        }
    }

    public get selection(): HTMLElement | undefined {
        return this.searchResults.querySelector('.selected') as HTMLElement;
    }

    private moveSelection(next: string, wrap: string) {
        let selection = this.selection;
        if (selection) {
            selection.classList.remove('selected');
            if (selection[next]) {
                selection[next].classList.add('selected');
            } else {
                this.searchResults[wrap]?.classList.add('selected');
            }
        } else {
            this.searchResults[wrap]?.classList.add('selected');
        }
        if (this.selection instanceof HTMLHRElement) {
            this.moveSelection(next, wrap);
        }
        selection = this.selection;
        if (selection?.dataset.preview) {
            this.query.innerText = selection.dataset.preview;
            if (typeof this.query.selectionStart === 'number') {
                this.query.selectionStart = this.query.selectionEnd =
                    this.query.innerText.length;
            } else if (typeof this.query.createTextRange !== 'undefined') {
                this.query.focus();
                const range = this.query.createTextRange();
                range.collapse(false);
                range.select();
            }
        }
    }

    private moveSelectionUp = this.moveSelection.bind(
        this,
        'previousElementSibling',
        'lastElementChild'
    );
    private moveSelectionDown = this.moveSelection.bind(
        this,
        'nextElementSibling',
        'firstElementChild'
    );

    makeSelection() {
        const selected = this.searchResults.querySelector('.selected');
        if (selected) {
            selected.dispatchEvent(new MouseEvent('click'));
        }
    }

    private triggerSearch() {
        const debounceSequence = ++this.debounceSequence;
        if (this.query.innerText.length >= this.minimumCharacters) {
            window.setTimeout(async () => {
                if (debounceSequence === this.debounceSequence) {
                    const query = this.query.innerText;
                    const searchResult = await this.search(query);
                    if (debounceSequence === this.debounceSequence) {
                        this.displaySearchResults(query, searchResult);
                    }
                }
            }, this.debounce);
        } else {
            this.collapse();
        }
    }

    private reduceSummarizer(summarizer, query, results) {
        if (summarizer) {
            let prepend: string | Element;
            if (typeof summarizer === 'function') {
                return this.reduceFormattedResult(summarizer(query, results));
            } else {
                prepend = summarizer;
            }
            if (prepend) {
                return <div class="search-result">{prepend}</div>;
            }
        }
    }

    private reduceFormattedResult(formattedResult) {
        if (formattedResult === undefined) {
            return undefined;
        }
        let display: string | Element,
            preview: string | undefined = undefined,
            value: string | undefined = undefined,
            handler: Function | undefined = undefined;
        if (typeof formattedResult === 'string') {
            display = formattedResult;
            value = formattedResult;
        } else {
            display = formattedResult.display;
            value = formattedResult.value;
            preview = formattedResult.preview || value || display;
            handler = formattedResult.handler;
        }
        const wrapper: HTMLElement = <div class="search-result">{display}</div>;
        wrapper.dataset.preview = preview;
        if (handler) {
            wrapper.addEventListener('click', () => {
                this.input.value = value;
                this.query.innerText = preview;
                if (handler) {
                    handler();
                }
            });
        }
        return wrapper;
    }

    private appendSearchResult(result) {
        if (result) {
            this.searchResults.appendChild(result);
        }
    }

    private appendSearchResultDivider() {
        if (this.searchResults.childElementCount > 0) {
            this.searchResults.appendChild(<hr />);
        }
    }

    private displaySearchResults(query: string, results: SearchResultList) {
        const resultsList = this.searchResults;
        resultsList.innerHTML = '';
        this.appendSearchResult(
            this.reduceSummarizer(this.prependToResults, query, results)
        );
        if (results.length > 0) {
            this.appendSearchResultDivider();
            results.forEach(result => {
                this.appendSearchResult(
                    this.reduceFormattedResult(this.format(query, result))
                );
            });
        }
        if (this.appendToResults) {
            const append = this.reduceSummarizer(
                this.appendToResults,
                query,
                results
            );
            if (append) {
                this.appendSearchResultDivider();
                this.appendSearchResult(append);
            }
        }
        if (resultsList.childElementCount > 0) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    public clear() {
        this.collapse();
        this.searchResults.innerHTML = '';
        this.query.innerText = '';
        // FIXME clearing does not reset iOS autocorrect -- tried bluring/re-focusing
    }

    private expand() {
        Visual.unhide(this.searchResults);
        this.searchResults.style.maxHeight = `calc(${window.innerHeight}px - ${
            this.searchResults.getBoundingClientRect().y
        }px - ${this.searchResults.getBoundingClientRect().x}px)`;
    }

    private collapse() {
        Visual.hide(this.searchResults);
    }
}
