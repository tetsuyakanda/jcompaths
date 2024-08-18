import { SourceCodeToken } from './javaLexer';
import { VarInfo, VarListDataModel, VarListJsonData } from './varListData';

/**
 * array with index refers the its contents (values, timestamps..)
 * index is tokenID which every SourceCodeToken object has
 */
export type VarValueDataInner = { [tokenId: string]: ValueListItemData[] | undefined };

/**
 * create the set of each data (token ID, token value, token timestamp) for visualization
 */
export interface ValueListItemData {
  id: string;
  value: string;
  rwvalue?: string;
  timestamp: string;
  inst: string;
}

/**
 * @param data is the all variable and value data of the target source file.
 * @param path is the path to the source file.
 * @param tokens are the tokens in the source file.
 * This function appends the value information to each token and return all tokens with values.
 */
export function createVarValueData(data: VarListJsonData, path: string, tokens: SourceCodeToken[]): VarValueDataInner {
  const fileData = new VarListDataModel(data).getDataOfFile(path);
  const result: VarValueDataInner = {};

  for (const d of fileData) {
    let tokenId: string;
    try {
      tokenId = computeTokenId(d, fileData, tokens);
    } catch (e) {
      // in the case of RETURNVALUE
      continue;
    }

    if (d.dataid == '39535') {
      console.log(d);
      console.log('tokenid: ' + tokenId);
    }

    const oldData = result[tokenId];
    const nInst = d.inst.toString();
    const newData: ValueListItemData[] = d.valueList.map((x, index) => 
    {
      const nId = index.toString();
      const { data: nValue, timestamp: nTimestamp } = x;

      if (oldData && oldData[index]) {

        if (d.dataid == '39535') {
          console.log(x);
          console.log(index);
        }

        const { id: oId, value: oValue, rwvalue: oRwvalue, timestamp: oTimestamp, inst: oInst } = oldData[index]; 
        if (d.var.indexOf('@') === -1) {
          return { id: nId, value: nValue, rwvalue: oRwvalue, timestamp: nTimestamp, inst: nInst };
        } else {
          // in the case of ARRAYLOAD, ARRAYSTORE, and AEEAYLENGTH
          return { id: oId, value: oValue, rwvalue: nValue, timestamp: oTimestamp, inst: oInst };
        }
      } else {
        if (d.var.indexOf('@') === -1) {
          return { id: nId, value: nValue, timestamp: nTimestamp, inst: nInst };
        } else {
          return { id: '', value: '', rwvalue: nValue, timestamp: '', inst: '' };
        }
      }
    })
    result[tokenId] = newData;
  }
  //console.log(result);
  return result;
}

/**
 * @param variable is the target variable got from the recorded log.
 * @param data is the all variable and value data of the target source file.
 * @param tokens are the tokens in the source code.
 * This function computes the token id (property of SourceCodeToken) of the variable 
 * whose line number and variable name match with the token in the source.
 * (To identify a token, you need linenum, varName, and count)
 */
function computeTokenId(variable: VarInfo, data: VarInfo[], tokens: SourceCodeToken[]): string {
  const { linenum, count, var: varName } = variable;
  let matchTokens: SourceCodeToken[];
  
  if (varName.indexOf('@') == -1) {
    matchTokens = tokens.filter(t => t.startLine === Number(linenum) && t.image === varName);
  } else {
    // in the case of ARRAYLOAD, ARRAYSTORE, and AEEAYLENGTH
    const matchVarName = data.filter(v => v.linenum === linenum && v.valueList[0].data === varName)
                             .map(v => v.var);
    matchTokens = tokens.filter(t => t.startLine === Number(linenum) && matchVarName.includes(t.image));
  }

  if (count > matchTokens.length) {
    throw new Error('Impossible');
  }
  //console.log(variable.className + '::' + variable.methodName + ' ' + variable.var);
  return matchTokens[count - 1].id;
}

