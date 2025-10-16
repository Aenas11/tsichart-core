import * as d3 from 'd3';
import './HierarchyNavigation.scss';
import Utils from "../../utils";
import { Component } from "./../../interfaces/Component";
import ModelAutocomplete from '../modelAutocomplete';

class HierarchyNavigation extends Component {

    private searchFunction;
    private hierarchyElem;
    private path: Array<string> = [];
    //selectedIds
    public selectedIds: Array<string> = [];
    public searchEnabled: boolean = true;
    private searchWrapperElem;
    private hierarchyNavWrapper;

    public ap: any; // awesomplete object

    constructor(renderTarget: Element) {
        super(renderTarget);
    }

    public async render(searchF: Function, hierarchyNavOptions: any = {}, preselectedIds: Array<string>): Promise<void> {
        this.chartOptions.setOptions(hierarchyNavOptions);
        this.searchFunction = searchF;

        const targetElement = d3.select(this.renderTarget).text('');
        this.hierarchyNavWrapper = this.createHierarchyNavWrapper(targetElement);

        this.selectedIds = preselectedIds;

        //render search wrapper
        //this.renderSearchBox()



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

    private createHierarchyElem(results: d3.Selection<d3.BaseType, unknown, HTMLElement, any>): d3.Selection<d3.BaseType, unknown, HTMLElement, any> {
        return results.append('div').classed('tsi-hierarchy', true).attr("role", "navigation").on('scroll', () => { });
    }

    // prepares the parameters for search request
    private requestPayload(hierarchy: any = null): { path: string, hierarchy: any } {
        const path = hierarchy?.path ?? this.path;
        return { path, hierarchy };
    }


    // renders tree for both 'Navigate' and 'Filter' mode (with Hierarchy View option selected), locInTarget refers to the 'show more' element -either hierarchy or instance- within the target
    private renderTree(data: any, target: any): void {

        let list = target.append('ul').attr("role", target === this.hierarchyElem ? "tree" : "group");

        Object.keys(data).forEach(el => {
            let nodeNameToCheckIfExists = data[el] instanceof InstanceNode ? this.instanceNodeString(data[el]) : el;
            let li;
            if (list.selectAll(".tsi-name").nodes().find(e => e.innerText === nodeNameToCheckIfExists)) {
                li = null;
            } else {
                li = list.append('li').classed('tsi-leaf', data[el].isLeaf);

                //if the node is already selected, we want to highlight it
                if (this.selectedIds && this.selectedIds.includes(data[el].id)) {
                    li.classed('tsi-selected', true);
                }
            }

            if (!li) return;

            li.attr("role", "none");
            let newListElem = this.createHierarchyItemElem(data[el], el);
            li.node().appendChild(newListElem.node());

            data[el].node = li;
            if (data[el].children) {
                data[el].isExpanded = true;
                data[el].node.classed('tsi-expanded', true);
                this.renderTree(data[el].children, data[el].node);
            }
        });

    }

    private renderSearchBox() {
        this.searchWrapperElem = this.hierarchyNavWrapper.append('div').classed('tsi-hierarchy-search', true);


        let inputWrapper = this.searchWrapperElem.append("div").attr("class", "tsi-search");
        inputWrapper.append("i").classed("tsi-search-icon", true);

        let input = inputWrapper
            .append("input")
            .attr("class", "tsi-searchInput")
            .attr("aria-label", this.getString("Search Time Series Instances"))
            .attr("aria-describedby", "tsi-search-desc")
            .attr("role", "combobox")
            .attr("aria-owns", "tsi-search-results")
            .attr("aria-expanded", "false")
            .attr("aria-haspopup", "listbox")
            .attr(
                "placeholder",
                this.getString("Search Time Series Instances") + "..."
            );

        let self = this;

        input.on("keydown", (event) => {
            this.chartOptions.onKeydown(event, this.ap);
        });

        var searchText;

        input.on("input", function (event) {
            searchText = (event.target as any).value;
            if (searchText.length === 0) {
                //clear the tree
                self.hierarchyElem.selectAll('ul').remove();
                self.pathSearchAndRenderResult({ search: { payload: self.requestPayload() }, render: { target: self.hierarchyElem } });


            } else {
                //filter the tree
                self.filterTree(searchText);

            }
        });

    }

    private async pathSearchAndRenderResult({ search: { payload, bubbleUpReject = false }, render: { target, locInTarget = null } }) {
        try {
            const result = await this.searchFunction(payload);
            if (result.error) {
                throw result.error;
            }
            this.renderSearchResult(result, payload, target);
        } catch (err) {
            this.chartOptions.onError("Error in hierarchy navigation", "Failed to complete search", err instanceof XMLHttpRequest ? err : null);
            if (bubbleUpReject) {
                throw err;
            }
        }
    }

    private renderSearchResult = (r, payload, target: any) => {

        const hierarchyData = r.hierarchyNodes?.hits?.length
            ? this.fillDataRecursively(r.hierarchyNodes, payload, payload)
            : {};

        const instancesData = r.instances?.hits?.length
            ? r.instances.hits.reduce((acc, i) => {
                acc[this.instanceNodeIdentifier(i)] = new InstanceNode(i.timeSeriesId, i.name, payload.path.length - this.path.length, i.id, i.description);
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

        this.renderTree({ ...hierarchyData, ...instancesData }, target);
    }

    private filterTree(searchText) {
        let tree = this.hierarchyElem.selectAll('ul').nodes()[0];
        let list = tree.querySelectorAll('li');
        list.forEach((li) => {
            let name = li.querySelector('.tsi-name').innerText;
            if (name.toLowerCase().includes(searchText.toLowerCase())) {
                li.style.display = 'block';
            } else {
                li.style.display = 'none';
            }
        }
        );


    }

    // creates in-depth data object using the server response for hierarchyNodes to show in the tree all expanded, considering UntilChildren
    private fillDataRecursively(hierarchyNodes, payload, payloadForContinuation = null) {
        let data = {};

        hierarchyNodes.hits.forEach((h) => {
            let hierarchy = new HierarchyNode(h.name, payload.path, payload.path.length - this.path.length, h.cumulativeInstanceCount, h.id);

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
            .attr('arialabel', isHierarchyNode ? key : self.getAriaLabel(hORi))
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

class HierarchyNode {
    name: string;
    id: string | null;
    path: string[];
    level: number;
    cumulativeInstanceCount: number | null;
    node: any;
    children: any;
    isExpanded: boolean;

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

class InstanceNode {
    timeSeriesId: any;
    name: string | null;
    suppressDrawContextMenu: boolean;
    isLeaf: boolean;
    level: any;
    node: any;
    id: string | null;
    description: string | null;

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