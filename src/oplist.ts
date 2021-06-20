import { fs } from 'doge-json';

const line_break_regex = /[\r\n]+/g

export class OpList {
	private __file: string;
	constructor (file: string) {
		this.__file = file;
	}
	get entries (): string[] {
		return (
			fs.existsSync(this.__file)
			? fs.readFileSync(this.__file, 'utf-8')
			.split(line_break_regex)
			.map(a => a.trim())
			.filter(a => a && a[0] !== '#')
			: []
		);
	}
	add (...entries: string[]) {
		const entry_set = new Set(this.entries);
		for (const entry of entries) {
			entry_set.add(entry);
		}
		this.write(entry_set);
	}
	remove (...entries: string[]) {
		const entry_set = new Set(this.entries);
		for (const entry of entries) {
			entry_set.delete(entry);
		}
		this.write(entry_set);
	}
	write (list: Set<string>) {
		const ar = [ ...list ].sort((a, b) => (
			a.replace(/^[^a-z]*/gi, '').toLowerCase() < b.replace(/^[^a-z]*/gi, '').toLowerCase())
			? -1
			: 1
		);
		ar.push('');
		fs.writeFileSync(this.__file, ar.join('\n'));
	}
}

export default OpList;
module.exports = OpList;

Object.assign(OpList, {
	default: OpList,
	OpList,
});
