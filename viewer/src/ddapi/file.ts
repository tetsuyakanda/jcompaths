import { ProjectDiffFile, LineWithValues } from 'merger';
import { ProjectDiffMethodItem } from './method';
import { DiffStatus, DiffStatusLine, DiffStatusText, DiffStatusTrace } from './diffStatus';
import { TokenWithTrace } from './token';
import { MethodCtrlInfo } from 'App';

export class ProjectDiffFileItem implements ProjectDiffFile, DiffStatus {
  private _file: ProjectDiffFile;
  content: LineModel[];
  children: ProjectDiffMethodItem[] | undefined;
  diffStatusTrace: DiffStatusTrace;
  diffStatusText: DiffStatusText;

  constructor(file: ProjectDiffFile) {
    this._file = file;
    this.content = file.content.map((l) => new LineModel(l));
    this.children = file.children?.map((m) => new ProjectDiffMethodItem(m));
    this.diffStatusTrace = this.diffStatusTraceCalc();
    this.diffStatusText = this.diffStatusTextCalc();
  }

  get type() {
    return this._file.type;
  }

  get name() {
    return this._file.name;
  }

  diffStatusTraceCalc(): DiffStatusTrace {
    const ds = this.children?.map((m) => m.diffStatusTrace);
    if (ds?.some((t) => t === 'diff')) {
      return 'diff';
    } else if (ds?.some((t) => t === 'noDiff')) {
      return 'noDiff';
    } else {
      return 'noTrace';
    }
  }

  diffStatusTextCalc(): DiffStatusText {
    return this.content.some((l) => l.diffStatusLine !== 'both');
  }

  findMethod(method: MethodCtrlInfo): ProjectDiffMethodItem | undefined {
    return this.children?.find(
      (m) => m.name === method.name && m.desc === method.desc
    );
  }
}

export class LineModel implements LineWithValues {
  _line: LineWithValues;
  diffStatusLine: DiffStatusLine;
  tokens: TokenWithTrace[] | undefined;

  // ToDo: コンストラクタの引数としてLineも取れるようにする
  constructor(line: LineWithValues) {
    this._line = line;
    this.diffStatusLine = this.diffStatusLineCalc();
    this.tokens = line.tokens?.map((t) => new TokenWithTrace(t, this.diffStatusLine, this.lineno1, this.lineno2));
  }

  get value() {
    return this._line.value;
  }
  get lineno1() {
    return this._line.lineno1;
  }
  get lineno2() {
    return this._line.lineno2;
  }
  get xCoord1() {
    return this._line.xCoord1;
  }
  get xCoord2() {
    return this._line.xCoord2;
  }

  diffStatusLineCalc(): DiffStatusLine {
    return !this.lineno1 ? 'l2only' : !this.lineno2 ? 'l1only' : 'both';
  }
}
