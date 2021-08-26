import { fs } from 'doge-json';

const line_break_regex = /[\r\n]+/g;

class OpList {
	private __file: string;
	/**
	 * Instanciate an OptionList handler
	 * @param file Absolute path to file, or relative to cwd
	 */
	constructor(file: string) {
		this.__file = file;
	}
	/**
	 * Get current entries
	 *
	 * Changing this array will not change the OpList
	 */
	get entries(): string[] {
		return fs.existsSync(this.__file)
			? fs
					.readFileSync(this.__file, 'utf-8')
					.split(line_break_regex)
					.map((a) => a.trim())
					.filter((a) => a && a[0] !== '#')
			: [];
	}
	/**
	 * Add entries to OptionList
	 * @param entries Entries to add
	 */
	add(...entries: string[]) {
		const entry_set = new Set(this.entries);
		for (const entry of entries) {
			entry_set.add(entry);
		}
		this.write(entry_set);
	}
	/**
	 * Remove entries from OptionList
	 * @param entries Entries to remove
	 */
	remove(...entries: string[]) {
		const entry_set = new Set(this.entries);
		for (const entry of entries) {
			entry_set.delete(entry);
		}
		this.write(entry_set);
	}
	/**
	 * Write a Set of options to disk
	 * Overwrites all current values.
	 * @param list The Set of options to write
	 */
	write(list: Set<string>) {
		const ar = [...list].sort((a, b) =>
			a.replace(/^[^a-z]*/gi, '').toLowerCase() <
			b.replace(/^[^a-z]*/gi, '').toLowerCase()
				? -1
				: 1
		);
		ar.push('');
		const to_write = ar.join('\n');
		const current = fs.readFileSync(this.__file, 'utf-8');
		if (to_write !== current) {
			fs.writeFileSync(this.__file, to_write);
		}
	}
	/**
	 * Get a mutable set
	 *
	 * Changing this set will overwrite the OpList
	 */
	get set() {
		const self = this;
		const set = new Set(this.entries);
		return new Proxy(set, {
			get: (target, key, receiver) => {
				setTimeout(() => {
					self.write(set);
				});
				const real = (set as any)[key];
				if (real) {
					return function () {
						return real.apply(set, arguments);
					};
				} else return undefined;
			},
		});
	}
}

export = OpList;

Object.defineProperties(OpList, {
	default: { get: () => OpList },
	OpList: { get: () => OpList },
});
