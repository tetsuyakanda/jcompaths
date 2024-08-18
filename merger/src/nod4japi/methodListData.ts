/**
 * This file is not included in original nod4j.
 * It is the data for methodinfo.json.
 * author: y-hasimt 
 */

/**
 * The infromation about all methods in the project.
 */
export interface MethodListJsonData {
  method: MethodInfo[];
}

/**
 * The infroamtion about a method in methodinfo.json.
 */
export interface MethodInfo {
  id: string;
  methodName: string;
  className: string;
  desc: string;
  lineno: {
    begin: string;
    end: string;
  }
  timeline: ExeInfo[];
}

/**
 * The information about one execution of a method.
 */
export interface ExeInfo {
  begin: string;
  end: string;
  thread: string;
  lines: ExeLineInfo[];
}

/**
 * The information about one line execution of a method.
 */
export interface ExeLineInfo {
  lineno: string;
  begin: string;
}

/**
 * The model of project method information
 */
 export class MethodListDataModel {
  private _data: MethodListJsonData;

  constructor(data: MethodListJsonData) {
    this._data = data;
  }

  /**
   * Return the variable information of the specified classname
   */
  getDataOfFile(file: string): MethodInfo[] {
    return this._data.method.filter((x) => x.className === file);
  }
}