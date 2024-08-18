import { TokenWithValues, ValueListItemData } from 'merger';
import { DiffStatusLine, DiffStatusToken } from './diffStatus';

export class TokenWithTrace implements TokenWithValues {
  _token: TokenWithValues;
  diffStatuses: DiffStatusToken[];
  lineno1: number | undefined;
  lineno2: number | undefined;

  constructor(token: TokenWithValues, diffStatusLine: DiffStatusLine, lineno1?: number, lineno2?: number) {
    this._token = token;
    this.diffStatuses = diffStatuses(diffStatusLine, this.value1, this.value2);
    this.lineno1 = lineno1;
    this.lineno2 = lineno2;
  }
  get image() {
    return this._token.image;
  }
  get startColumn() {
    return this._token.startColumn;
  }
  get endColumn() {
    return this._token.endColumn;
  }
  get value1() {
    return this._token.value1;
  }
  get value2() {
    return this._token.value2;
  }
  get key() {
    const l1 = this.lineno1 ? this.lineno1 : 0;
    const l2 = this.lineno2 ? this.lineno2 : 0;
    return (l1 + '-' + l2 + '-' + this.startColumn + '-' + this.endColumn);
  }
}

function diffStatuses(
  diffStatusLine: DiffStatusLine,
  value1?: ValueListItemData[][],
  value2?: ValueListItemData[][]
): DiffStatusToken[] {
  let diffStatuses: DiffStatusToken[] = [];
  const v1Len = value1 ? value1.length : 0;
  const v2Len = value2 ? value2.length : 0;
  const numExe = Math.max(v1Len, v2Len);
  for(let i = 0; i < numExe; i++) {
    const v1 = (value1 && value1[i]?.length > 0) ? value1[i] : undefined;
    const v2 = (value2 && value2[i]?.length > 0) ? value2[i] : undefined;
    diffStatuses[i] = diffStatusToken(diffStatusLine, v1, v2);
  }
  return diffStatuses;
}

function diffStatusToken(
  diffStatusLine: DiffStatusLine,
  value1?: ValueListItemData[],
  value2?: ValueListItemData[]
): DiffStatusToken {
  if (!value1 && !value2) return 'noTrace';
  // we cannot compare traces if this line is in DIFF part so indicate as "no diff in trace
  if (!value1) return diffStatusLine === 'both' ? 'diffInLength' : 't2only';
  if (!value2) return diffStatusLine === 'both' ? 'diffInLength' : 't1only';
  // now we have two execution traces. compare them.
  if (value1.length !== value2.length) return 'diffInLength';
  if (value1.some(mightBeObject) || value2.some(mightBeObject)) {
    return 'sameLengthObject';
  } else {
    return diffValues(value1, value2) ? 'diffInContents' : 'noDiff';
  }
}

function valueList(value: ValueListItemData[]) {
  return value.map((v) => v.value);
}

/**
 * it might be object (... but not String)
 * @param value
 * @returns
 */
function mightBeObject(value: ValueListItemData) {
  return value.value.indexOf('@') >= 0 && value.value.indexOf('"') === -1;
}

function diffValues(value1: ValueListItemData[], value2: ValueListItemData[]): boolean {
  const vv1 = flatten(valueList(value1));
  const vv2 = flatten(valueList(value2));
  for (let i = 0; i < vv1.length; i++) {
    if (vv1[i] !== vv2[i]) {
      return true;
    }
  }
  return false;
}

function flatten(valueList: string[]) {
  const isString = (v: string) => v.startsWith('java.lang.String@');
  const result = valueList.map((v) => {
    if (isString(v)) {
      return v.substring(v.indexOf('"'), v.length);
    } else {
      return v;
    }
  });
  return result;
}
