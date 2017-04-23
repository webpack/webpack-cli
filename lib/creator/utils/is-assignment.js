module.exports = function(j, p, cb, identifier, property) {
	if(p.parent.value.type === 'AssignmentExpression') {
		if(j) {
			return cb(j, p, identifier, property);
		}
		else {
			return cb(p);
		}
	}
};
