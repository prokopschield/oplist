#!/usr/bin/env node

import fs from 'fs';
import OpList from './oplist';

let oplist: OpList | null = null;
let mode = '';

function proc(arg: string) {
	if (arg[0] === '+') {
		oplist && oplist.add(arg.substr(1));
	} else if (arg[0] === '-') {
		oplist && oplist.remove(arg.substr(1));
	} else if (mode) {
		proc(mode + arg);
	}
}

for (const arg of process.argv.slice(2)) {
	if (!oplist && fs.existsSync(arg)) {
		oplist = new OpList(arg);
	} else if (!mode && arg === 'add') {
		mode = '+';
	} else if (!mode && (arg === 'rem' || arg === 'remove')) {
		mode = '+';
	} else if (oplist) {
		proc(arg);
	}
}
