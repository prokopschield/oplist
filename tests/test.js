const OPList = require('..');

module.exports = function () {
	const o = new OPList('.gitignore');
	o.add('config/');
	o.set.add('node_modules/');
	o.add('lib/');
};
