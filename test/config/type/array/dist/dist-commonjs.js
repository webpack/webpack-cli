!(function(e, r) {
	for (var t in r) e[t] = r[t];
})(
	exports,
	(function(e) {
		var r = {};
		function t(n) {
			if (r[n]) return r[n].exports;
			var o = (r[n] = { i: n, l: !1, exports: {} });
			return e[n].call(o.exports, o, o.exports, t), (o.l = !0), o.exports;
		}
		return (
			(t.m = e),
			(t.c = r),
			(t.d = function(e, r, n) {
				t.o(e, r) || Object.defineProperty(e, r, { enumerable: !0, get: n });
			}),
			(t.r = function(e) {
				typeof Symbol !== "undefined" &&
					Symbol.toStringTag &&
					Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
					Object.defineProperty(e, "__esModule", { value: !0 });
			}),
			(t.t = function(e, r) {
				if ((1 & r && (e = t(e)), 8 & r)) return e;
				if (4 & r && typeof e === "object" && e && e.__esModule) return e;
				var n = Object.create(null);
				if (
					(t.r(n),
					Object.defineProperty(n, "default", { enumerable: !0, value: e }),
					2 & r && typeof e !== "string")
				)
					for (var o in e)
						t.d(
							n,
							o,
							function(r) {
								return e[r];
							}.bind(null, o)
						);
				return n;
			}),
			(t.n = function(e) {
				var r =
					e && e.__esModule
						? function() {
								return e.default;
						  }
						: function() {
								return e;
						  };
				return t.d(r, "a", r), r;
			}),
			(t.o = function(e, r) {
				return Object.prototype.hasOwnProperty.call(e, r);
			}),
			(t.p = ""),
			t((t.s = 0))
		);
	})([
		function(e, r) {
			e.exports = "a-array";
		}
	])
);
