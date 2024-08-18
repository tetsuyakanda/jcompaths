import { ValueListItemData, VarValueDataInner } from "../nod4japi";
import { SourceCodeToken } from "../nod4japi/javaLexer";
import { ExeLineInfo, MethodInfo } from "../nod4japi/methodListData";
import { ProjectItemBase } from "../nod4japi/project";
import { Line } from "./diffFile";
import { createTokenWithValues, TokenWithValues } from "./token";

export interface ProjectDiffMethod extends ProjectItemBase {
  type: 'method';
  desc: string;
  class: string;
  content: LineWithValues[];
}
export interface LineWithValues extends Line {
  xCoord1?: number[][];
  xCoord2?: number[][];
  tokens?: TokenWithValues[];
}

export function createDiffMethod(
  m1: MethodInfo,
  m2: MethodInfo,
  diff: Line[],
  tokens1: Partial<Record<number, SourceCodeToken[]>>,
  tokens2: Partial<Record<number, SourceCodeToken[]>>,
  varData1: VarValueDataInner,
  varData2: VarValueDataInner,
): ProjectDiffMethod {
  const methodDiff = extractMethodDiff(diff, m1, m2);
  const xCoord1 = createXcoords(m1);
  const xCoord2 = createXcoords(m2);

  const result: LineWithValues[] = methodDiff.map(l => {
    const t1 = l.lineno1 ? createTempTokens(m1, tokens1[l.lineno1], varData1) : undefined;
    const t2 = l.lineno2 ? createTempTokens(m2, tokens2[l.lineno2], varData2) : undefined;
    const t = mergeTempTokens(t1, t2);
    const x1 = l.lineno1 ? xCoord1[l.lineno1] : undefined;
    const x2 = l.lineno2 ? xCoord2[l.lineno2] : undefined;

    return { ...l, xCoord1: x1, xCoord2: x2, tokens: t };
  })
  return { type: 'method', name: m1.methodName, desc: m1.desc, class: m1.className, content: result }
}

// extract the part of method from file diff
function extractMethodDiff(diff: Line[], m1: MethodInfo, m2: MethodInfo): Line[] {
  const ml1 = { begin: Number(m1.lineno.begin), end: Number(m1.lineno.end) }
  const ml2 = { begin: Number(m2.lineno.begin), end: Number(m2.lineno.end) }
  return diff.filter(l => {
    const c1 = l.lineno1 ? (ml1.begin <= l.lineno1 && l.lineno1 <= ml1.end) : false;
    const c2 = l.lineno2 ? (ml2.begin <= l.lineno2 && l.lineno2 <= ml2.end) : false;
    return c1 || c2;
  });
}

interface TemporalToken {
  token: SourceCodeToken;
  value?: ValueListItemData[][];
}

// slice variable data for each execution of method and bind the data to tokens
function createTempTokens(
  method: MethodInfo, 
  tokens: SourceCodeToken[] | undefined, 
  varData: VarValueDataInner
): TemporalToken[] | undefined {
  const tempTokens = tokens?.map(t => 
  {
    const data = varData[t.id];
    if (!data) return { token: t }
    else {
      let i = 0;
      const slicedData: ValueListItemData[][] = method.timeline.map(e => {
        const tmpData: ValueListItemData[] = [];
        while (i < data.length &&
                Number(e.begin) <= Number(data[i].timestamp) && 
                Number(data[i].timestamp) <= Number(e.end)) {
          tmpData.push(data[i]);
          i++;
        }
        return tmpData;
      })
      //console.log(t.image + ': ');
      //slicedData.forEach(x => console.log(x));
      return { token: t, value: slicedData }
    }    
  })
  return tempTokens;
}


// check if we have two token list in a line
function mergeTempTokens(tokens1?: TemporalToken[], tokens2?: TemporalToken[]) {
  if (!tokens2 && !tokens1) {
    return [];
  } else if (!tokens2) {
    return tokens1?.map((t) => createTokenWithValues(t.token, t.value, undefined));
  } else if (!tokens1) {
    return tokens2?.map((t) => createTokenWithValues(t.token, undefined, t.value));
  } else {
    return mergeTmpTokens2(tokens1, tokens2);
  }
}

// concat two token list
function mergeTmpTokens2(tokens1: TemporalToken[], tokens2: TemporalToken[]) {
  const result: TokenWithValues[] = [];
  for (let i = 0; i < tokens1.length; i++) {
    const tv = createTokenWithValues(tokens1[i].token, tokens1[i].value, tokens2[i].value);
    result.push(tv);
  }
  return result;
}

// merge some xCoords each execution has
function createXcoords(method: MethodInfo): { [lineno: number]: number[][] } {
  const beginLineno = Number(method.lineno.begin);
  const endLineno = Number(method.lineno.end);
  const allXcoords: { [lineno: number]: number[][] } = {};

  method.timeline.forEach(exe => {
    const xcoords = exeToXcoord(exe.lines);
    for (let lineno = beginLineno; lineno <= endLineno; lineno++) {
      ( allXcoords[lineno] || (allXcoords[lineno] = []) ).push(xcoords[lineno] || []);
    }
  });
  //console.log(allXcoords);
  return allXcoords;
}

// translate timeline in MethodInfo to a chain of xCoords in LineWithValues
function exeToXcoord(exe: ExeLineInfo[]): { [lineno: number]: number[] } {
  let x = 0;
  let preLineno = 0;
  const xcoords = exe.reduce(
    (xcoords, line) => {
      const lineno = Number(line.lineno);
      if (lineno < preLineno) { 
        x++; 
      }
      ( xcoords[lineno] || (xcoords[lineno] = []) ).push(x);
      preLineno = lineno;
      return xcoords;
    }, 
    {} as { [lineno: number]: number[] }
  );
  return xcoords;
}