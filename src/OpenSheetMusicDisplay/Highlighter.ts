import {OpenSheetMusicDisplay} from "./OpenSheetMusicDisplay";
import {GraphicalMusicSheet} from "../MusicalScore/Graphical/GraphicalMusicSheet";
import {GraphicalMeasure} from "../MusicalScore/Graphical/GraphicalMeasure";

/**
 * A highlighter which can color measures and measure stacks of the music sheet.
 */
export class Highlighter {
  constructor(container: HTMLElement, openSheetMusicDisplay: OpenSheetMusicDisplay) {
    this.container = container;
    this.openSheetMusicDisplay = openSheetMusicDisplay;
    this.highlighterElements = {};
  }

  private container: HTMLElement;
  private openSheetMusicDisplay: OpenSheetMusicDisplay;
  private graphic: GraphicalMusicSheet;
  private hidden: boolean = true;
  private highlighterElements: {[measureIndex: number]: {[staffIndex: number]: {color: string, highlighterElement: HTMLImageElement}}};


  /** Initialize the highlighter. Necessary before using functions like show() and next(). */
  public init(graphic: GraphicalMusicSheet): void {
    this.graphic = graphic;
    this.hidden = true;
    this.hide();
  }

  /**
   * Make the highlighter visible
   */
  public show(): void {
    this.hidden = false;
    this.update();
  }

  private isValidMeasure(measureIndex, staffIndex) {
    let numMeasures: number = this.graphic.MeasureList.length
    let numStaves: number = 0
    if (measureIndex < numMeasures) {
      numStaves = this.graphic.MeasureList[measureIndex].length
    }

    return measureIndex < numMeasures && staffIndex < numStaves && numStaves != 0 // must be at least one stave to highlight
  }

  private createHighligherElement(measureIndex, staffIndex, color): HTMLImageElement {
    // create highlighter element
    const hlter: HTMLElement = document.createElement("img");
    hlter.style.position = "absolute";

    if (staffIndex < 0) { // highlighters for whole measure stacks should render underneath highlighters for individual measures
      hlter.style.zIndex = "-2";
    }
    else {
      hlter.style.zIndex = "-1";
    }

    this.container.appendChild(hlter);

    const highlighterElement = <HTMLImageElement>hlter;

    if (!this.highlighterElements[measureIndex]) {
      this.highlighterElements[measureIndex] = {}
    }

    this.highlighterElements[measureIndex][staffIndex] = {
      highlighterElement: highlighterElement,
      color: color
    };
    return highlighterElement;
  }

  /**
   * Highlights the measure at zero-indexed measureIndex and staffIndex with the given hex color string.
   * note: staffIndex of -1 highlights the whole measure stack
   */ 
  public highlightMeasure(measureIndex: number, staffIndex: number, color: string = "#33e02f"): void {
    if (!this.isValidMeasure(measureIndex, staffIndex)) {
      return;
    }

    let highlighterElement: HTMLImageElement;
    // check if that highlighter already exists, else create a new one
    if (this.highlighterElements[measureIndex] && this.highlighterElements[measureIndex][staffIndex]) {
      highlighterElement = this.highlighterElements[measureIndex][staffIndex].highlighterElement;
    }
    else {
      highlighterElement = this.createHighligherElement(measureIndex, staffIndex, color);
    }

    this.updateHighlighter(highlighterElement, measureIndex, staffIndex, color)
  }

  private updateHighlighter(highlighterElement: HTMLImageElement, measureIndex: number, staffIndex: number, color: string): void {
    if (!this.isValidMeasure(measureIndex, staffIndex)) {
      return;
    }

    if (staffIndex >= 0) {
      const measure: GraphicalMeasure = this.graphic.MeasureList[measureIndex][staffIndex];
      this.updateMeasureHighlighter(measure, highlighterElement, color)
    }
    else { // staffIndex of -1 denotes highlighting the whole measure stack (all staves)
      const topMeasure: GraphicalMeasure = this.graphic.MeasureList[measureIndex][0]; // ok because isValidMeasure confirms at least one stave exists
      const numStaves = this.graphic.MeasureList[measureIndex].length
      const bottomMeasure: GraphicalMeasure = this.graphic.MeasureList[measureIndex][numStaves - 1]
      this.updateMeasureStackHighlighter(topMeasure, bottomMeasure, highlighterElement, color)
    }

  }

  private updateMeasureStackHighlighter(topMeasure: GraphicalMeasure, bottomMeasure: GraphicalMeasure, highlighterElement: HTMLImageElement, color: string): void {
    // (x,y) is the top left corner of the measure
    const x: number = topMeasure.PositionAndShape.AbsolutePosition.x
    const y: number = topMeasure.ParentStaffLine.PositionAndShape.AbsolutePosition.y

    const width: number = topMeasure.PositionAndShape.BorderRight

    const deltaY: number = bottomMeasure.ParentStaffLine.PositionAndShape.AbsolutePosition.y - y
    const height: number = deltaY + 4 // 1 is the distance of one staff space, so a single staff is 4

    this.drawHighlighter(highlighterElement, x, y, height, width, color)
  }

  private updateMeasureHighlighter(measure: GraphicalMeasure, highlighterElement: HTMLImageElement, color: string): void {
    // (x,y) is the top left corner of the measure
    const x: number = measure.PositionAndShape.AbsolutePosition.x
    const y: number = measure.ParentStaffLine.PositionAndShape.AbsolutePosition.y

    const width: number = measure.PositionAndShape.BorderRight
    
    const height: number = 4 // 1 is the distance of one staff space, so a single staff is 4

    this.drawHighlighter(highlighterElement, x, y, height, width, color)
  }

  private drawHighlighter(highlighterElement: HTMLImageElement, x: number, y: number, height: number, width: number, color: string) {
    highlighterElement.style.top = (y * 10.0 * this.openSheetMusicDisplay.zoom) + "px"; // 10.0 converts vexflow units to openSheetMusicDisplay units
    highlighterElement.style.left = (x * 10.0 * this.openSheetMusicDisplay.zoom) + "px";
    highlighterElement.height = (height * 10.0 * this.openSheetMusicDisplay.zoom);
    const newWidth: number = width * 10.0 * this.openSheetMusicDisplay.zoom;
    if (newWidth !== highlighterElement.width) {
      highlighterElement.width = newWidth;
      this.updateStyle(highlighterElement, newWidth, color);
    }

    if (this.openSheetMusicDisplay.FollowCursor) { // TODO
      highlighterElement.scrollIntoView({behavior: "smooth", block: "center"}); 
    }
    // Show highlighter
    highlighterElement.style.display = "";
  }

  public update(): void {
    // Warning! This should NEVER call this.openSheetMusicDisplay.render()
    if (this.hidden) {
      return;
    }

    Object.keys(this.highlighterElements).forEach(measureIndex => {
      Object.keys(this.highlighterElements[measureIndex]).forEach(staffIndex => {
        if (this.isValidMeasure(measureIndex, staffIndex)) {
          const highlighterElement: HTMLImageElement = this.highlighterElements[measureIndex][staffIndex].highlighterElement
          const color: string = this.highlighterElements[measureIndex][staffIndex].color
          this.updateHighlighter(highlighterElement, parseInt(measureIndex), parseInt(staffIndex), color)
        }
      })
    })
  }

  /**
   * Hide the highlighters
   */
  public hide(): void {
    Object.keys(this.highlighterElements).forEach(measureIndex => {
      Object.keys(this.highlighterElements[measureIndex]).forEach(staffIndex => {
        if (this.isValidMeasure(measureIndex, staffIndex)) {
          const highlighterElement: HTMLImageElement = this.highlighterElements[measureIndex][staffIndex].highlighterElement
          // Hide the actual highlighter element
          highlighterElement.style.display = "none";
        }
      })
    })

    this.hidden = true;
  }

  private updateStyle(highlighterElement: HTMLImageElement, width: number, color: string): void {
    const c: HTMLCanvasElement = document.createElement("canvas");
    c.width = highlighterElement.width;
    c.height = 1;
    const ctx: CanvasRenderingContext2D = c.getContext("2d");
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, 1);
    // Set the actual image
    highlighterElement.src = c.toDataURL("image/png");
  }

  public get Hidden(): boolean {
    return this.hidden;
  }
}
