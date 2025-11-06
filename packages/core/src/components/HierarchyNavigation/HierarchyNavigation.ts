import * as d3 from 'd3';
import './HierarchyNavigation.scss';
import Utils from "../../utils";
import { Component } from "./../../interfaces/Component";
import ModelAutocomplete from '../ModelAutocomplete';
import TreeRenderer from './TreeRenderer';
// ensure runtime fallback for environments where TS extensions aren't resolved by bundler
try { /* noop, allows static import for bundlers */ } catch (e) { /* noop */ }

// Lightweight interfaces to describe the tree data model used by the component
export interface ITreeItem {
    node?: any;
    children?: Record<string, ITreeItem> | null;
    isLeaf?: boolean;
    id?: string | null;
    displayName?: string;
    level?: number;
    cumulativeInstanceCount?: number | null;
    path?: string[];
    name?: string;
    isExpanded?: boolean;
}

export interface IHierarchyNode extends ITreeItem {
    name: string;
    id?: string | null;
    path: string[];
    level: number;
    cumulativeInstanceCount?: number | null;
    node?: any;
    children?: Record<string, IHierarchyNode> | null;
    isExpanded?: boolean;
    expand?: () => Promise<any> | any;
    collapse?: () => void;
}

export interface IInstanceNode extends ITreeItem {
    timeSeriesId: any;
    name?: string | null;
    description?: string | null;
    suppressDrawContextMenu?: boolean;
    isLeaf?: boolean;
    level?: number;
    node?: any;
    id?: string | null;
}

class HierarchyNavigation extends Component {
    private searchFunction: (payload: any) => Promise<any>;
    private hierarchyElem: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
    private path: Array<string> = [];
    // debounce + request cancellation fields
    private debounceTimer: ReturnType<typeof setTimeout> | null = null;
    private debounceDelay: number = 250; // ms
    private requestCounter: number = 0; // increments for each outgoing request
    private latestRequestId: number = 0; // id of the most recent request
    //selectedIds
    public selectedIds: Array<string> = [];
    public searchEnabled: boolean = true;
    private searchWrapperElem;
    private hierarchyNavWrapper;
    // Search mode state
    private isSearchMode: boolean = false;

    public ap: any; // awesomplete object

    constructor(renderTarget: Element) {
        super(renderTarget);
    }

    public async render(searchF: (payload: any) => Promise<any>, hierarchyNavOptions: any = {}, preselectedIds: Array<string>): Promise<void> {
        this.chartOptions.setOptions(hierarchyNavOptions);
        this.searchFunction = searchF;

        const targetElement = d3.select(this.renderTarget).text('');
        this.hierarchyNavWrapper = this.createHierarchyNavWrapper(targetElement);

        this.selectedIds = preselectedIds;

        //render search wrapper
        this.renderSearchBox()



        super.themify(this.hierarchyNavWrapper, this.chartOptions.theme);

        const results = this.createResultsWrapper(this.hierarchyNavWrapper);
        this.hierarchyElem = this.createHierarchyElem(results);

        this.pathSearchAndRenderResult({ search: { payload: this.requestPayload() }, render: { target: this.hierarchyElem } });


    }

    private createHierarchyNavWrapper(targetElement: d3.Selection<d3.BaseType, unknown, HTMLElement, any>): d3.Selection<d3.BaseType, unknown, HTMLElement, any> {
        return targetElement.append('div').attr('class', 'tsi-hierarchy-nav-wrapper');
    }

    private createResultsWrapper(hierarchyNavWrapper: d3.Selection<d3.BaseType, unknown, HTMLElement, any>): d3.Selection<d3.BaseType, unknown, HTMLElement, any> {
        return hierarchyNavWrapper.append('div').classed('tsi-hierarchy-or-list-wrapper', true);
    }

    // create hierarchy container and attach keyboard handler
    private createHierarchyElem(results: d3.Selection<d3.BaseType, unknown, HTMLElement, any>): d3.Selection<d3.BaseType, unknown, HTMLElement, any> {
        const sel = results.append('div').classed('tsi-hierarchy', true).attr("role", "navigation").on('scroll', () => { });
        // attach keydown listener for keyboard navigation (delegated)
        // use native event to preserve focus handling
        const node = sel.node();
        if (node) {
            node.addEventListener('keydown', (ev: KeyboardEvent) => this.onKeyDown(ev));
        }
        return sel;
    }

    // Keyboard navigation handlers and helpers
    private onKeyDown(ev: KeyboardEvent) {
        const key = ev.key;
        const active = document.activeElement as HTMLElement | null;
        const container = this.hierarchyElem?.node() as HTMLElement | null;
        if (!container) return;

        const isInside = active && container.contains(active);
        if (!isInside && (key === 'ArrowDown' || key === 'ArrowUp')) {
            // focus first visible item on navigation keys
            const visible = this.getVisibleItemElems();
            if (visible.length) {
                this.focusItem(visible[0]);
                ev.preventDefault();
            }
            return;
        }

        if (!active) return;
        const current = active.classList && active.classList.contains('tsi-hierarchyItem') ? active : active.closest('.tsi-hierarchyItem') as HTMLElement;
        if (!current) return;

        switch (key) {
            case 'ArrowDown':
                this.focusNext(current);
                ev.preventDefault();
                break;
            case 'ArrowUp':
                this.focusPrev(current);
                ev.preventDefault();
                break;
            case 'ArrowRight':
                this.handleArrowRight(current);
                ev.preventDefault();
                break;
            case 'ArrowLeft':
                this.handleArrowLeft(current);
                ev.preventDefault();
                break;
            case 'Enter':
            case ' ':
                // activate (toggle expand or select)
                (current as HTMLElement).click();
                ev.preventDefault();
                break;
            default:
                break;
        }
    }

    private getVisibleItemElems(): HTMLElement[] {
        if (!this.hierarchyElem) return [];
        const root = this.hierarchyElem.node() as unknown as HTMLElement;
        if (!root) return [];
        const items = Array.from(root.querySelectorAll('.tsi-hierarchyItem')) as HTMLElement[];
        return items.filter(i => i.offsetParent !== null && getComputedStyle(i).display !== 'none');
    }

    private focusItem(elem: HTMLElement) {
        if (!this.hierarchyElem) return;
        const root = this.hierarchyElem.node() as unknown as HTMLElement;
        if (!root) return;
        const items = Array.from(root.querySelectorAll('.tsi-hierarchyItem')) as HTMLElement[];
        items.forEach(i => i.setAttribute('tabindex', '-1'));
        elem.setAttribute('tabindex', '0');
        elem.focus();
    }

    private focusNext(current: HTMLElement) {
        const visible = this.getVisibleItemElems();
        const idx = visible.indexOf(current);
        if (idx >= 0 && idx < visible.length - 1) {
            this.focusItem(visible[idx + 1]);
        }
    }

    private focusPrev(current: HTMLElement) {
        const visible = this.getVisibleItemElems();
        const idx = visible.indexOf(current);
        if (idx > 0) {
            this.focusItem(visible[idx - 1]);
        }
    }

    private handleArrowRight(current: HTMLElement) {
        const caret = current.querySelector('.tsi-caret-icon');
        const expanded = current.getAttribute('aria-expanded') === 'true';
        if (caret && !expanded) {
            // expand
            current.click();
            return;
        }
        // if already expanded, move to first child
        if (caret && expanded) {
            const li = current.closest('li');
            const childLi = li?.querySelector('ul > li');
            const childItem = childLi?.querySelector('.tsi-hierarchyItem') as HTMLElement | null;
            if (childItem) this.focusItem(childItem);
        }
    }

    private handleArrowLeft(current: HTMLElement) {
        const caret = current.querySelector('.tsi-caret-icon');
        const expanded = current.getAttribute('aria-expanded') === 'true';
        if (caret && expanded) {
            // collapse
            current.click();
            return;
        }
        // move focus to parent
        const li = current.closest('li');
        const parentLi = li?.parentElement?.closest('li');
        const parentItem = parentLi?.querySelector('.tsi-hierarchyItem') as HTMLElement | null;
        if (parentItem) this.focusItem(parentItem);
    }

    // prepares the parameters for search request
    private requestPayload(hierarchy: any = null): { path: string, hierarchy: any } {
        const path = hierarchy?.path ?? this.path;
        return { path, hierarchy };
    }


    // renders tree for both 'Navigate' and 'Filter' mode (with Hierarchy View option selected), locInTarget refers to the 'show more' element -either hierarchy or instance- within the target
    private renderTree(data: Record<string, IHierarchyNode | IInstanceNode>, target: d3.Selection<any, any, any, any>): void {
        TreeRenderer.render(this, data, target);
    }

    private renderSearchBox() {
        this.searchWrapperElem = this.hierarchyNavWrapper.append('div').classed('tsi-hierarchy-search', true);

        let inputWrapper = this.searchWrapperElem.append("div").attr("class", "tsi-search");
        inputWrapper.append("i").classed("tsi-search-icon", true);

        let input = inputWrapper
            .append("input")
            .attr("class", "tsi-searchInput")
            .attr("aria-label", this.getString("Search"))
            .attr("aria-describedby", "tsi-search-desc")
            .attr("role", "combobox")
            .attr("aria-owns", "tsi-search-results")
            .attr("aria-expanded", "false")
            .attr("aria-haspopup", "listbox")
            .attr(
                "placeholder",
                this.getString("Search") + "..."
            );

        let self = this;

        input.on("keydown", (event) => {
            this.chartOptions.onKeydown(event, this.ap);
        });

        // Debounced input handler to reduce work while typing
        input.on("input", function (event) {
            const val = (event.target as any).value;
            // always clear existing timer
            if (self.debounceTimer) {
                clearTimeout(self.debounceTimer);
                self.debounceTimer = null;
            }

            if (!val || val.length === 0) {
                // Exit search mode and restore navigation view
                self.exitSearchMode();
                return;
            }

            // Use deep search for comprehensive results
            self.debounceTimer = setTimeout(() => {
                self.performDeepSearch(val);
            }, self.debounceDelay);
        });

    }

    private async pathSearchAndRenderResult({ search: { payload, bubbleUpReject = false }, render: { target, locInTarget = null } }: any) {
        const requestId = ++this.requestCounter;
        this.latestRequestId = requestId;
        try {
            const result = await this.searchFunction(payload);
            if (requestId !== this.latestRequestId) {
                return;
            }
            if (result.error) {
                throw result.error;
            }
            this.renderSearchResult(result, payload, target);
        } catch (err) {
            if (requestId !== this.latestRequestId) {
                return;
            }
            this.chartOptions.onError("Error in hierarchy navigation", "Failed to complete search", err instanceof XMLHttpRequest ? err : null);
            if (bubbleUpReject) {
                throw err;
            }
        }
    }

    private renderSearchResult = (r: any, payload: any, target: d3.Selection<any, any, any, any>) => {
        const hierarchyData: Record<string, IHierarchyNode> = r.hierarchyNodes?.hits?.length
            ? this.fillDataRecursively(r.hierarchyNodes, payload, payload)
            : {} as Record<string, IHierarchyNode>;

        const instancesData: Record<string, InstanceNode> = r.instances?.hits?.length
            ? r.instances.hits.reduce((acc: Record<string, InstanceNode>, i: any) => {
                const inst = new InstanceNode(i.timeSeriesId, i.name, payload.path.length - this.path.length, i.id, i.description);
                inst.displayName = this.instanceNodeStringToDisplay(i) || '';
                acc[this.instanceNodeIdentifier(i)] = inst;
                return acc;
            }, {})
            : {};

        if (r.hierarchyNodes?.hits?.length) {
            let hitCountElem = target.select(".tsi-hitCount");
            if (hitCountElem.size() === 0) {
                hitCountElem = target.append('span').classed('tsi-hitCount', true).text('');
            }
            hitCountElem.text(r.hierarchyNodes.hitCount);
        }

        const merged: Record<string, IHierarchyNode | IInstanceNode> = { ...hierarchyData, ...(instancesData as any) };
        this.renderTree(merged, target);
    }

    private filterTree(searchText: string) {
        const nodes = this.hierarchyElem.selectAll('ul').nodes();
        if (!nodes || !nodes.length) return;
        const tree = nodes[0] as unknown as HTMLElement;
        if (!tree) return;
        const list = tree.querySelectorAll('li');
        const needle = searchText.toLowerCase();
        list.forEach((li) => {
            const attrName = li.getAttribute('data-display-name');
            let name = attrName && attrName.length ? attrName : (li.querySelector('.tsi-name')?.textContent || '');
            if (name.toLowerCase().includes(needle)) {
                (li as HTMLElement).style.display = 'block';
            } else {
                (li as HTMLElement).style.display = 'none';
            }
        });
    }

    // Perform deep search across entire hierarchy using server-side search
    private async performDeepSearch(searchText: string) {
        if (!searchText || searchText.length < 2) {
            this.exitSearchMode();
            return;
        }

        this.isSearchMode = true;
        const requestId = ++this.requestCounter;
        this.latestRequestId = requestId;

        try {
            // Call server search with recursive flag
            const payload = {
                path: this.path,
                searchTerm: searchText,
                recursive: true,  // Search entire subtree
                includeInstances: true
            };

            const results = await this.searchFunction(payload);

            if (requestId !== this.latestRequestId) return; // Stale request

            if (results.error) {
                throw results.error;
            }

            // Render search results in flat list view
            this.renderSearchResults(results, searchText);

        } catch (err) {
            if (requestId !== this.latestRequestId) return;
            this.chartOptions.onError(
                "Search failed",
                "Unable to search hierarchy",
                err instanceof XMLHttpRequest ? err : null
            );
        }
    }

    // Render search results with breadcrumb paths
    private renderSearchResults(results: any, searchText: string) {
        this.hierarchyElem.selectAll('*').remove();

        const flatResults: Array<any> = [];

        // Flatten hierarchy results with full paths
        if (results.hierarchyNodes?.hits) {
            results.hierarchyNodes.hits.forEach((h: any) => {
                flatResults.push({
                    type: 'hierarchy',
                    name: h.name,
                    path: h.path || [],
                    id: h.id,
                    cumulativeInstanceCount: h.cumulativeInstanceCount,
                    highlightedName: this.highlightMatch(h.name, searchText),
                    node: h
                });
            });
        }

        // Flatten instance results with full paths
        if (results.instances?.hits) {
            results.instances.hits.forEach((i: any) => {
                const displayName = this.instanceNodeStringToDisplay(i);
                flatResults.push({
                    type: 'instance',
                    name: i.name,
                    path: i.hierarchyPath || [],
                    id: i.id,
                    timeSeriesId: i.timeSeriesId,
                    description: i.description,
                    highlightedName: this.highlightMatch(displayName, searchText),
                    node: i
                });
            });
        }

        // Render flat list with breadcrumbs
        const searchList = this.hierarchyElem
            .append('div')
            .classed('tsi-search-results', true);

        if (flatResults.length === 0) {
            searchList.append('div')
                .classed('tsi-noResults', true)
                .text(this.getString('No results'));
            return;
        }

        searchList.append('div')
            .classed('tsi-search-results-header', true)
            .html(`<strong>${flatResults.length}</strong> ${this.getString('results found') || 'results found'}`);

        const resultItems = searchList.selectAll('.tsi-search-result-item')
            .data(flatResults)
            .enter()
            .append('div')
            .classed('tsi-search-result-item', true)
            .attr('tabindex', '0')
            .attr('role', 'option')
            .attr('aria-label', (d: any) => {
                const pathStr = d.path.length > 0 ? d.path.join(' > ') + ' > ' : '';
                return pathStr + d.name;
            });

        const self = this;
        resultItems.each(function (d: any) {
            const item = d3.select(this);

            // Breadcrumb path
            if (d.path.length > 0) {
                item.append('div')
                    .classed('tsi-search-breadcrumb', true)
                    .text(d.path.join(' > '));
            }

            // Highlighted name
            item.append('div')
                .classed('tsi-search-result-name', true)
                .html(d.highlightedName);

            // Instance description or count
            if (d.type === 'instance' && d.description) {
                item.append('div')
                    .classed('tsi-search-result-description', true)
                    .text(d.description);
            } else if (d.type === 'hierarchy') {
                item.append('div')
                    .classed('tsi-search-result-count', true)
                    .text(`${d.cumulativeInstanceCount || 0} instances`);
            }
        });

        // Click handlers
        resultItems.on('click keydown', function (event, d: any) {
            if (Utils.isKeyDownAndNotEnter(event)) return;

            if (d.type === 'instance') {
                // Handle instance selection
                if (self.chartOptions.onInstanceClick) {
                    const inst = new InstanceNode(
                        d.timeSeriesId,
                        d.name,
                        d.path.length,
                        d.id,
                        d.description
                    );

                    // Update selection state
                    if (self.selectedIds && self.selectedIds.includes(d.id)) {
                        self.selectedIds = self.selectedIds.filter(id => id !== d.id);
                        d3.select(this).classed('tsi-selected', false);
                    } else {
                        self.selectedIds.push(d.id);
                        d3.select(this).classed('tsi-selected', true);
                    }

                    self.chartOptions.onInstanceClick(inst);
                }
            } else {
                // Navigate to hierarchy node - exit search and expand to that path
                self.navigateToPath(d.path);
            }
        });

        // Apply selection state to already-selected instances
        resultItems.each(function (d: any) {
            if (d.type === 'instance' && self.selectedIds && self.selectedIds.includes(d.id)) {
                d3.select(this).classed('tsi-selected', true);
            }
        });
    }

    // Exit search mode and restore tree
    private exitSearchMode() {
        this.isSearchMode = false;
        this.hierarchyElem.selectAll('*').remove();
        this.pathSearchAndRenderResult({
            search: { payload: this.requestPayload() },
            render: { target: this.hierarchyElem }
        });
    }

    // Navigate to a specific path in the hierarchy
    private async navigateToPath(targetPath: string[]) {
        this.exitSearchMode();

        // For now, just exit search mode and return to root
        // In a more advanced implementation, this would progressively
        // expand nodes along the path to reveal the target
        // This would require waiting for each level to load before expanding the next
    }

    // Highlight search term in text
    private highlightMatch(text: string, searchTerm: string): string {
        if (!text) return '';
        const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // creates in-depth data object using the server response for hierarchyNodes to show in the tree all expanded, considering UntilChildren
    private fillDataRecursively(hierarchyNodes: any, payload: any, payloadForContinuation: any = null): Record<string, IHierarchyNode> {
        let data: Record<string, IHierarchyNode> = {};

        hierarchyNodes.hits.forEach((h) => {
            let hierarchy = new HierarchyNode(h.name, payload.path, payload.path.length - this.path.length, h.cumulativeInstanceCount, h.id);

            // cache display name on node for client-side filtering
            hierarchy.displayName = h.name || '';

            hierarchy.expand = () => {
                hierarchy.isExpanded = true;
                hierarchy.node.classed('tsi-expanded', true);
                return this.pathSearchAndRenderResult({
                    search: { payload: this.requestPayload(hierarchy), bubbleUpReject: true },
                    render: { target: hierarchy.node }
                });
            };

            data[this.hierarchyNodeIdentifier(h.name)] = hierarchy;

            if (h.hierarchyNodes?.hits.length) {
                hierarchy.children = this.fillDataRecursively(h.hierarchyNodes, this.requestPayload(hierarchy), payloadForContinuation);
            }
        });

        return data;
    }

    //returns the dom element of one hierarchy level item for tree rendering
    private createHierarchyItemElem(hORi, key) {
        let self = this;
        let isHierarchyNode = hORi instanceof HierarchyNode;
        let hierarchyItemElem = d3.create('div').classed('tsi-hierarchyItem', true)
            .attr('style', `padding-left: ${hORi.isLeaf ? hORi.level * 18 + 20 : (hORi.level + 1) * 18 + 20}px`)
            .attr('tabindex', 0)
            //.attr('arialabel', isHierarchyNode ? key : Utils.getTimeSeriesIdString(hORi))
            .attr('aria-label', isHierarchyNode ? key : self.getAriaLabel(hORi))
            .attr('title', isHierarchyNode ? key : self.getAriaLabel(hORi))
            .attr("role", "treeitem").attr('aria-expanded', hORi.isExpanded)
            .on('click keydown', async function (event) {
                if (Utils.isKeyDownAndNotEnter(event)) { return; }
                if (!isHierarchyNode) { // means it is an instance
                    event.stopPropagation();

                    //we want to store clicked instance and hightlight it in the hierarchy
                    //if the instance is already selected, we want to deselect it
                    if (self.chartOptions.onInstanceClick) {
                        if (self.selectedIds && self.selectedIds.includes(hORi.id)) {
                            self.selectedIds = self.selectedIds.filter(id => id !== hORi.id);
                            hORi.node.classed('tsi-selected', false);
                        }
                        else {
                            self.selectedIds.push(hORi.id);
                            hORi.node.classed('tsi-selected', true);
                        }
                    }

                    self.chartOptions.onInstanceClick(hORi);
                } else {
                    if (hORi.isExpanded) {
                        hORi.collapse();
                    } else {
                        await hORi.expand();
                    }
                }
            })

        if (isHierarchyNode) {
            hierarchyItemElem.append('span').classed('tsi-caret-icon', true).attr('style', `left: ${(hORi.level) * 18 + 20}px`);
            hierarchyItemElem.append('span').classed('tsi-name', true).text(key);
            hierarchyItemElem.append('span').classed('tsi-instanceCount', true).text(hORi.cumulativeInstanceCount);
            hierarchyItemElem.append('span').classed('tsi-hitCount', true).text(''); // hit count is the number of hierarchy nodes below, it is filled after expand is clicked for this node (after search is done for this path)


        } else {
            let spanElem = hierarchyItemElem.append('span').classed('tsi-name', true);
            Utils.appendFormattedElementsFromString(spanElem, this.instanceNodeStringToDisplay(hORi));
        }

        return hierarchyItemElem;
    }

    private getAriaLabel(hORi) {
        if (hORi instanceof HierarchyNode) {
            return hORi.name;
        }

        //check description first then name then id
        return hORi.description || hORi.name || hORi.id || Utils.getTimeSeriesIdString(hORi);
    }

    private hierarchyNodeIdentifier = (hName) => {
        return hName ? hName : '(' + this.getString("Empty") + ')';
    }

    private instanceNodeIdentifier = (instance) => {
        return `instance-${Utils.getInstanceKey(instance)}`;
    }

    private instanceNodeStringToDisplay = (instance) => {
        return instance.highlights?.name || Utils.getHighlightedTimeSeriesIdToDisplay(instance)
            || instance.name || Utils.getTimeSeriesIdToDisplay(instance, this.getString('Empty'));
    }

    private instanceNodeString = (instance) => {
        return instance.name || Utils.getTimeSeriesIdString(instance);
    }
}

// TreeRenderer has been moved to its own module: ./TreeRenderer
// The rendering logic was extracted to reduce file size and improve testability.

export class HierarchyNode implements IHierarchyNode {
    name: string;
    id: string | null;
    path: string[];
    level: number;
    cumulativeInstanceCount: number | null;
    node: any;
    children: any;
    isExpanded: boolean;
    displayName?: string;

    constructor(name: string, parentPath: string[], level: number, cumulativeInstanceCount: number | null = null, id: string | null = null) {
        this.name = name;
        this.id = id;
        this.path = parentPath.concat([name]);
        this.level = level;
        this.cumulativeInstanceCount = cumulativeInstanceCount;
        this.node = null;
        this.children = null;
        this.isExpanded = false;
    }

    expand() { }

    collapse() {
        this.isExpanded = false;
        this.node.classed('tsi-expanded', false);
        this.node.selectAll('ul').remove();
    }
}

export class InstanceNode implements IInstanceNode {
    timeSeriesId: any;
    name: string | null;
    suppressDrawContextMenu: boolean;
    isLeaf: boolean;
    level: any;
    node: any;
    id: string | null;
    description: string | null;
    displayName?: string;

    constructor(tsId: any, name: string | null = null, level: any, id: string | null = null, description: string | null = null) {
        this.timeSeriesId = tsId;
        this.name = name;
        this.suppressDrawContextMenu = false;
        this.isLeaf = true;
        this.level = level;
        this.node = null;
        this.id = id;
        this.description = description;
    }
}

export enum HierarchySelectionValues { All = "0", Unparented = "-1" };
export enum ViewType { Hierarchy, List };
export enum State { Navigate, Search, Filter };

export default HierarchyNavigation