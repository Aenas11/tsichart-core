import { C as Component } from './Component-C2OFsACF.js';
import './Enums-CjbndcX3.js';
import './Interfaces-DBBnA26W.js';

declare class HierarchyNavigation extends Component {
    private searchFunction;
    private hierarchyElem;
    private path;
    selectedIds: Array<string>;
    searchEnabled: boolean;
    private searchWrapperElem;
    private hierarchyNavWrapper;
    ap: any;
    constructor(renderTarget: Element);
    render(searchF: Function, hierarchyNavOptions: any, preselectedIds: Array<string>): Promise<void>;
    private createHierarchyNavWrapper;
    private createResultsWrapper;
    private createHierarchyElem;
    private requestPayload;
    private renderTree;
    private renderSearchBox;
    private pathSearchAndRenderResult;
    private renderSearchResult;
    private filterTree;
    private fillDataRecursively;
    private createHierarchyItemElem;
    private getAriaLabel;
    private hierarchyNodeIdentifier;
    private instanceNodeIdentifier;
    private instanceNodeStringToDisplay;
    private instanceNodeString;
}

export { HierarchyNavigation as default };
