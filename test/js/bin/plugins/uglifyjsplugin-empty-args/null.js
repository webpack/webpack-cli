!(function(r) {
	function t(n) {
		if (e[n]) return e[n].exports;
		var o = (e[n] = { i: n, l: !1, exports: {} });
		return r[n].call(o.exports, o, o.exports, t), (o.l = !0), o.exports;
	}
	var e = {};
	(t.m = r),
	(t.c = e),
	(t.d = function(r, e, n) {
		t.o(r, e) ||
				Object.defineProperty(r, e, {
					configurable: !1,
					enumerable: !0,
					get: n
				});
	}),
	(t.n = function(r) {
		var e =
				r && r.__esModule
					? function() {
						return r.default;
					}
					: function() {
						return r;
					};
		return t.d(e, "a", e), e;
	}),
	(t.o = function(r, t) {
		return Object.prototype.hasOwnProperty.call(r, t);
	}),
	(t.p = ""),
	t((t.s = 0));
})([
	function(r, t) {
		r.exports = "foo";
	}
]);
