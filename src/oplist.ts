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
	add (entry: string) {
		const entries = new Set(this.entries);
		entries.add(entry);
		this.write(entries);
	}
	remove (entry: string) {
		const entries = new Set(this.entries);
		entries.delete(entry);
		this.write(entries);
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
