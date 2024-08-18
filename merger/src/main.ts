import { ProjectItemDirectory } from './nod4japi/project';
import * as fs from 'fs';
import { argv, exit } from 'process';
import { ProjectVisitor } from './ddfileapi/projectVisitor';
import { VarListJsonData } from './nod4japi/varListData';
import { MethodListJsonData } from './nod4japi/methodListData';

const main = () => {
  if (process.argv.length != 9) {
    console.log(process.argv.length);
    exit(1);
  }

  const f1 = fs.readFileSync(argv[2], 'utf8');
  const ff1 = JSON.parse(f1, receiver) as ProjectItemDirectory;
  const f2 = fs.readFileSync(argv[3], 'utf8');
  const ff2 = JSON.parse(f2, receiver) as ProjectItemDirectory;

  const v1 = fs.readFileSync(argv[4], 'utf8');
  const vv1 = JSON.parse(v1, receiver) as VarListJsonData;
  const v2 = fs.readFileSync(argv[5], 'utf8');
  const vv2 = JSON.parse(v2, receiver) as VarListJsonData;

  const m1 = fs.readFileSync(argv[6], 'utf8');
  const mm1 = JSON.parse(m1, receiver) as MethodListJsonData;
  const m2 = fs.readFileSync(argv[7], 'utf8');
  const mm2 = JSON.parse(m2, receiver) as MethodListJsonData;

  const pv = new ProjectVisitor(ff1, ff2, vv1, vv2, mm1, mm2);
  const result = pv.visit();

  fs.writeFileSync(argv[8], JSON.stringify(result), 'utf8');
};

/**
 * Handle escaping double quotes of string, if the value is string.
 */
function receiver(key: any, value: any): any {
  if (typeof value === 'string') {
    return value.replace(/\\\"/g, '"');
  } else {
    return value;
  }
}

main();
