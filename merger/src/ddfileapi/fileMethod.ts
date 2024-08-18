import { ProjectItemBase, ProjectItemFileModel } from '../nod4japi/project';
import { VarListJsonData } from '../nod4japi/varListData';
import { diffFile, Line } from './diffFile';
import { MethodInfo, MethodListDataModel, MethodListJsonData } from '../nod4japi/methodListData';
import { createDiffMethod, ProjectDiffMethod } from './methodVar';
import { SourceCodeToken, tokenize } from '../nod4japi/javaLexer';
import { createVarValueData } from '../nod4japi/varValueData';

export interface ProjectDiffFile extends ProjectItemBase {
  type: 'file';
  content: Line[];
  children?: ProjectDiffMethod[];
}

// f1 and f2 have the same file name.
export function createDiffFile(
  f1: ProjectItemFileModel,
  f2: ProjectItemFileModel,
  v1: VarListJsonData,
  v2: VarListJsonData,
  m1: MethodListJsonData,
  m2: MethodListJsonData,
  path: string[]
): ProjectDiffFile {
  const diff = diffFile(f1, f2);

  const tokens1 = tokenize(f1.joinedContent);
  const tokens2 = tokenize(f2.joinedContent);
  const lineToTokens1 = groupTokensByLine(tokens1);
  const lineToTokens2 = groupTokensByLine(tokens2);
  
  const filePath = getFilePath(path, f1.name);
  const tokenIdToData1 = createVarValueData(v1, filePath, tokens1);
  const tokenIdToData2 = createVarValueData(v2, filePath, tokens2);

  const { i1only, i2only, both } = methodAndOr(filePath, m1, m2);
  // ToDo: 片方にしか存在しないメソッドの処理
  const methodDiff = both.map(([ mBoth1, mBoth2 ]) => 
    createDiffMethod(mBoth1, mBoth2, diff, lineToTokens1, lineToTokens2, tokenIdToData1, tokenIdToData2)
  ).filter(m => m.content.length)

  return { type: 'file', name: f1.name, content: diff, children: methodDiff };
}

/**
 * This function returns the source code tokens grouped by line.
 */
 function groupTokensByLine(tokens: SourceCodeToken[]) {
  return tokens.flatMap(splitTokenWithMultipleLines).reduce((obj, value) => {
    const key = value.startLine!;
    (obj[key] || (obj[key] = [])).push(value);
    return obj;
  }, {} as Partial<Record<number, SourceCodeToken[]>>);
}

/**
 * 複数行トークン対策。というかコメント。最初の行はインデントがstartColumnに入っていて
 * imageは空白がない状態だが、2行目以降は改行で区切るのでimageのほうにインデントは入っているのでstartColumnを1にする。
 * @param token
 * @returns
 */
function splitTokenWithMultipleLines(token: SourceCodeToken) {
  let t = { ...token };
  let result: SourceCodeToken[] = [];
  if (t.image.match(/\n/g) === null) {
    result.push(t);
  } else {
    let index = 0;
    let tmpt;
    while (t.image.match(/\n/g) != null) {
      tmpt = { ...t };
      tmpt.image = t.image.slice(0, t.image.indexOf('\n'));
      tmpt.startColumn = index > 0 ? 1 : t.startColumn;
      tmpt.startLine = token.startLine! + index++;
      result.push(tmpt);
      t.image = t.image.slice(t.image.indexOf('\n') + 1);
    }
    t.startLine = token.startLine! + index;
    t.startColumn = 1;
    result.push(t);
  }
  return result;
}

interface AndOrResult {
  i1only: MethodInfo[];
  i2only: MethodInfo[];
  both: [ MethodInfo, MethodInfo ][];
}

/*
 * This function processes and return the file path for mathcing the file path of trace (varinfo.json)
 * we expect that the target system is under maven style directory structure (or simply under src directory)
 */
function getFilePath(dirs: string[], file: string): string {
  const srcDirPrefix = ['src', 'source', 'sources', 'test', 'tests'];
  const mvnDirPrefiix = ['src/main/java', 'src/test/java', 'test/main/java', 'tests/main/java'];

  const startPoint = dirs.findIndex((d) => srcDirPrefix.includes(d));
  if (startPoint != -1) {
    const srcDirs = dirs.slice(startPoint);
    if (srcDirs.length >= 3 && mvnDirPrefiix.includes(srcDirs.slice(0, 3).join('/'))) {
      return createFilePath(srcDirs.slice(3), file);
    } else if (srcDirs.length >= 2 && srcDirs.slice(0, 2).join('/') == 'src/java') {
      return createFilePath(srcDirs.slice(2), file);
    } else {
      return createFilePath(srcDirs.slice(1), file);
    }
  } else {
    return createFilePath(dirs, file);
  }
}

function createFilePath(dirs: string[], file: string): string {
  return dirs.join('/') + '/' + file;
}

function methodAndOr(path: string, m1: MethodListJsonData, m2: MethodListJsonData): AndOrResult {
  const i1 = new MethodListDataModel(m1).getDataOfFile(path);
  const i2 = new MethodListDataModel(m2).getDataOfFile(path);
  const i1only = i1.filter( m1 => i2.every(m2 => !equal(m1,m2)) );
  const i2only = i2.filter( m2 => i1.every(m1 => !equal(m1,m2)) );

  const both: [ MethodInfo, MethodInfo ][] = [];
  i1.forEach(m1 => i2.forEach(m2 => {
    if (equal(m1,m2)) both.push([m1,m2]);
  }));
  return { i1only, i2only, both };
}

function equal(m1: MethodInfo, m2: MethodInfo): boolean {
  return (m1.methodName === m2.methodName && m1.desc === m2.desc)
}
