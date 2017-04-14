module.exports = function(p, cb) {
	if(p.parent.value.type === 'AssignmentExpression') {
		return cb(p);
	}
};
