import * as d3 from "d3";
import "./ModelSearch.scss";
import Utils from "../../utils";
import { Component } from "./../../interfaces/Component";
import "awesomplete";
import Hierarchy from "../Hierarchy/Hierarchy";
import ModelAutocomplete from "../ModelAutocomplete/ModelAutocomplete";

class ModelSearch extends Component {
  private hierarchies;
  private clickedInstance;
  private wrapper;
  private types;
  private instanceResults;
  private usedContinuationTokens = {};
  private contextMenu;
  private currentResultIndex = -1;

  constructor(renderTarget: Element) {
    super(renderTarget);
    d3.select("html").on("click." + Utils.guid(), (event) => {
      if (
        this.clickedInstance &&
        event.target != this.clickedInstance &&
        this.contextMenu
      ) {
        this.closeContextMenu();
        this.clickedInstance = null;
      }
    });
  }

  ModelSearch() { }

  public render(
    environmentFqdn: string,
    getToken: any,
    hierarchyData: any,
    chartOptions: any
  ) {
    this.chartOptions.setOptions(chartOptions);
    let self = this;
    let continuationToken, searchText;
    let targetElement = d3.select(this.renderTarget);
    targetElement.html("");
    this.wrapper = targetElement
      .append("div")
      .attr("class", "tsi-modelSearchWrapper");
    super.themify(this.wrapper, this.chartOptions.theme);
    let inputWrapper = this.wrapper
      .append("div")
      .attr("class", "tsi-modelSearchInputWrapper");

    let autocompleteOnInput = (st, event) => {
      self.usedContinuationTokens = {};

      // blow results away if no text
      if (st.length === 0) {
        searchText = st;
        self.instanceResults.html("");
        self.currentResultIndex = -1;
        (hierarchyElement.node() as any).style.display = "block";
        (showMore.node() as any).style.display = "none";
        noResults.style("display", "none");
      } else if (event.which === 13 || event.keyCode === 13) {
        (hierarchyElement.node() as any).style.display = "none";
        self.instanceResults.html("");
        self.currentResultIndex = -1;
        noResults.style("display", "none");
        searchInstances(st);
        searchText = st;
      }
    };

    let modelAutocomplete = new ModelAutocomplete(inputWrapper.node());
    modelAutocomplete.render(environmentFqdn, getToken, {
      onInput: autocompleteOnInput,
      onKeydown: (event, ap) => {
        this.handleKeydown(event, ap);
      },
      ...chartOptions,
    });
    var ap = modelAutocomplete.ap;

    let results = this.wrapper
      .append("div")
      .attr("class", "tsi-modelSearchResults")
      .on("scroll", function () {
        self.closeContextMenu();
        let that = this as any;
        if (
          that.scrollTop + that.clientHeight + 150 >
          (self.instanceResults.node() as any).clientHeight &&
          searchText.length !== 0
        ) {
          searchInstances(searchText, continuationToken);
        }
      });
    let noResults = results
      .append("div")
      .text(this.getString("No results"))
      .classed("tsi-noResults", true)
      .style("display", "none");
    let instanceResultsWrapper = results
      .append("div")
      .attr("class", "tsi-modelSearchInstancesWrapper");
    this.instanceResults = instanceResultsWrapper
      .append("div")
      .attr("class", "tsi-modelSearchInstances");
    let showMore = instanceResultsWrapper
      .append("div")
      .attr("class", "tsi-showMore")
      .text(this.getString("Show more") + "...")
      .on("click", () => searchInstances(searchText, continuationToken))
      .style("display", "none");

    let hierarchyElement = this.wrapper
      .append("div")
      .attr("class", "tsi-hierarchyWrapper");
    let hierarchy = new Hierarchy(hierarchyElement.node() as any);
    hierarchy.render(hierarchyData, {
      ...this.chartOptions,
      withContextMenu: true,
    });

    let searchInstances = (searchText, ct = null) => {
      var self = this;
      if (ct === "END") return;
      if (ct === null || !self.usedContinuationTokens[ct]) {
        self.usedContinuationTokens[ct] = true;
      }
    };

    getToken().then((token) => {

    });

    // get types
    getToken().then((token) => {

    });
  }

  public handleKeydown(event, ap) {
    if (!ap.isOpened) {
      let results = this.instanceResults.selectAll(".tsi-modelResultWrapper");
      if (results.size()) {
        if (
          event.keyCode === 40 &&
          this.currentResultIndex < results.nodes().length - 1
        ) {
          this.currentResultIndex++;
          results.nodes()[this.currentResultIndex].focus();
        } else if (event.keyCode === 38) {
          this.currentResultIndex--;
          if (this.currentResultIndex <= -1) {
            this.currentResultIndex = -1;
            ap.input.focus();
          } else {
            results.nodes()[this.currentResultIndex].focus();
          }
        }
      }
    }
  }

  private closeContextMenu() {
    if (this.contextMenu) {
      this.contextMenu.remove();
    }
    d3.selectAll(".tsi-resultSelected").classed("tsi-resultSelected", false);
  }

  private stripHits = (str) => {
    return str
      .split("<hit>")
      .map((h) =>
        h
          .split("</hit>")
          .map((h2) => Utils.strip(h2))
          .join("</hit>")
      )
      .join("<hit>");
  };

  private getInstanceHtml(i) {
    return `<div class="tsi-modelResult">
                    <div class="tsi-modelPK">
                        ${i.highlights.name
        ? this.stripHits(i.highlights.name)
        : this.stripHits(
          i.highlights.timeSeriesIds
            ? i.highlights.timeSeriesIds.join(" ")
            : i.highlights.timeSeriesId.join(" ")
        )
      }
                    </div>
                    <div class="tsi-modelHighlights">
                        ${this.stripHits(
        i.highlights.description &&
          i.highlights.description.length
          ? i.highlights.description
          : this.getString("No description")
      )}
                        <br/><table>
                        ${i.highlights.name
        ? "<tr><td>" +
        this.getString("Time Series ID") +
        "</td><td>" +
        this.stripHits(
          i.highlights.timeSeriesIds
            ? i.highlights.timeSeriesIds.join(" ")
            : i.highlights.timeSeriesId.join(" ")
        ) +
        "</td></tr>"
        : ""
      }                        
                        ${i.highlights.instanceFieldNames
        .map((ifn, idx) => {
          var val = i.highlights.instanceFieldValues[idx];
          if (
            ifn.indexOf("<hit>") !== -1 ||
            val.indexOf("<hit>") !== -1
          ) {
            return val.length === 0
              ? ""
              : "<tr><td>" +
              this.stripHits(ifn) +
              "</td><td>" +
              this.stripHits(val) +
              "</tr>";
          }
        })
        .join("")}
                        </table>
                    </div>
                </div>`;
  }
}

export default ModelSearch;
