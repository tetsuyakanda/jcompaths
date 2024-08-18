import { ProjectDiffMethod, LineWithValues } from "merger";
import { DiffStatus, DiffStatusLine, DiffStatusText, DiffStatusTrace } from './diffStatus';
import { LineModel } from "./file";

export class ProjectDiffMethodItem implements ProjectDiffMethod, DiffStatus {
  private _method: ProjectDiffMethod;
  content: LineModel[];
  numExe1: number;
  numExe2: number;
  exeDiffStatus: DiffStatusTrace[];
  diffStatusTrace: DiffStatusTrace;
  diffStatusText: DiffStatusText;

  constructor(method: ProjectDiffMethod) {
    this._method = method;
    this.content = method.content.map((l) => new LineModel(l));
    [this.numExe1, this.numExe2] = this.calcNumExe();
    this.exeDiffStatus = this.exeDiffStatusCalc();
    this.diffStatusTrace = this.diffStatusTraceCalc();
    this.diffStatusText = this.diffStatusTextCalc();
  }

  get type() {
    return this._method.type;
  }

  get name() {
    return this._method.name;
  }

  get desc() {
    return this._method.desc;
  }

  get class() {
    return this._method.class;
  }

  calcNumExe(): number[] {
    let n1 = 0, n2 = 0;
    for(const line of this._method.content) {
      if(line.tokens) {
        for(const token of line.tokens) {
          if(token.value1) n1 = token.value1.length;
          if(token.value2) n2 = token.value2.length;
          if(n1 && n2) return [n1, n2];
        }
      }
    }
    return [n1, n2];
  }

  getStatusFromLine(line: LineModel, numExe: number): DiffStatusTrace[] {
    const status: DiffStatusTrace[] = [];
    for(let i = 0; i < numExe; i++) {
      const c1 = (line.xCoord1 && line.xCoord1[i]) ? line.xCoord1[i] : [];
      const c2 = (line.xCoord2 && line.xCoord2[i]) ? line.xCoord2[i] : [];
      if(c1.length === 0 && c2.length === 0) {
        status.push('noTrace');
      } else if(c1.some((c) => !c2.includes(c)) && line.diffStatusLine !== 'l1only') {
        status.push('diff');
      } else if(c2.some((c) => !c1.includes(c)) && line.diffStatusLine !== 'l2only') {
        status.push('diff');
      } else {
        status.push('noDiff');
      }
    }
    console.log(line.lineno1 + ' ' + line.lineno2 + ' : ' + status);
    return status;
  }

  exeDiffStatusCalc(): DiffStatusTrace[] {
    const numExe = Math.max(this.numExe1, this.numExe2);
    const status: DiffStatusTrace[] = [];
    for(let i = 0; i < numExe; i++) {
      const ds = this.content.flatMap((l) => l.tokens).map((t) => t?.diffStatuses[i]);
      const xc = this.content.map((l) => [l.xCoord1, l.xCoord2]).flat(3);
      if(ds.includes('diffInContents') || ds.includes('diffInLength')) {
        status.push('diff');
      } else if(xc.some((x) => (typeof x) === 'number')) {
        status.push('noDiff');
      } else {
        status.push('noTrace');
      }
    }
    console.log(this.name + ': ' + status);
    return status;
  }

  diffStatusTraceCalc(): DiffStatusTrace {
    if (this.exeDiffStatus.some((t) => t === 'diff')) {
      return 'diff';
    } else if (this.exeDiffStatus.some((t) => t === 'noDiff')) {
      return 'noDiff';
    } else {
      return 'noTrace';
    }
  }

  diffStatusTextCalc(): boolean {
    return this.content.some((l) => l.diffStatusLine !== 'both');
  }
}

