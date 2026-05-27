// Levenshtein distance via Myers' bit-parallel algorithm.
// Inspired by fastest-levenshtein (MIT, https://github.com/ka-weihe/fastest-levenshtein).

// Allocated lazily on first `distance` call: the 256 KB buffer is only needed
// for "did you mean" suggestions, which run on error paths, not normal builds.
let peq: Uint32Array | undefined;

function myers32(a: string, b: string, peq: Uint32Array): number {
  const n = a.length;
  const m = b.length;
  const lst = 1 << (n - 1);
  let pv = -1;
  let mv = 0;
  let sc = n;
  let i = n;

  while (i--) {
    peq[a.charCodeAt(i)] |= 1 << i;
  }

  for (i = 0; i < m; i++) {
    let eq = peq[b.charCodeAt(i)];
    const xv = eq | mv;

    eq |= ((eq & pv) + pv) ^ pv;
    mv |= ~(eq | pv);
    pv &= eq;

    if (mv & lst) {
      sc++;
    }

    if (pv & lst) {
      sc--;
    }

    mv = (mv << 1) | 1;
    pv = (pv << 1) | ~(xv | mv);
    mv &= xv;
  }

  i = n;

  while (i--) {
    peq[a.charCodeAt(i)] = 0;
  }

  return sc;
}

function myersX(longer: string, shorter: string, peq: Uint32Array): number {
  const n = shorter.length;
  const m = longer.length;
  const mhc: number[] = [];
  const phc: number[] = [];
  const horizontalSize = Math.ceil(n / 32);
  const verticalSize = Math.ceil(m / 32);

  for (let i = 0; i < horizontalSize; i++) {
    phc[i] = -1;
    mhc[i] = 0;
  }

  let j = 0;

  for (; j < verticalSize - 1; j++) {
    let mv = 0;
    let pv = -1;
    const start = j * 32;
    const verticalLen = Math.min(32, m) + start;

    for (let k = start; k < verticalLen; k++) {
      peq[longer.charCodeAt(k)] |= 1 << k;
    }

    for (let i = 0; i < n; i++) {
      const eq = peq[shorter.charCodeAt(i)];
      const pb = (phc[(i / 32) | 0] >>> i) & 1;
      const mb = (mhc[(i / 32) | 0] >>> i) & 1;
      const xv = eq | mv;
      const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
      let ph = mv | ~(xh | pv);
      let mh = pv & xh;

      if ((ph >>> 31) ^ pb) {
        phc[(i / 32) | 0] ^= 1 << i;
      }

      if ((mh >>> 31) ^ mb) {
        mhc[(i / 32) | 0] ^= 1 << i;
      }

      ph = (ph << 1) | pb;
      mh = (mh << 1) | mb;
      pv = mh | ~(xv | ph);
      mv = ph & xv;
    }

    for (let k = start; k < verticalLen; k++) {
      peq[longer.charCodeAt(k)] = 0;
    }
  }

  let mv = 0;
  let pv = -1;
  const start = j * 32;
  const verticalLen = Math.min(32, m - start) + start;

  for (let k = start; k < verticalLen; k++) {
    peq[longer.charCodeAt(k)] |= 1 << k;
  }

  let score = m;

  for (let i = 0; i < n; i++) {
    const eq = peq[shorter.charCodeAt(i)];
    const pb = (phc[(i / 32) | 0] >>> i) & 1;
    const mb = (mhc[(i / 32) | 0] >>> i) & 1;
    const xv = eq | mv;
    const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
    let ph = mv | ~(xh | pv);
    let mh = pv & xh;

    score += (ph >>> (m - 1)) & 1;
    score -= (mh >>> (m - 1)) & 1;

    if ((ph >>> 31) ^ pb) {
      phc[(i / 32) | 0] ^= 1 << i;
    }

    if ((mh >>> 31) ^ mb) {
      mhc[(i / 32) | 0] ^= 1 << i;
    }

    ph = (ph << 1) | pb;
    mh = (mh << 1) | mb;
    pv = mh | ~(xv | ph);
    mv = ph & xv;
  }

  for (let k = start; k < verticalLen; k++) {
    peq[longer.charCodeAt(k)] = 0;
  }

  return score;
}

/**
 * Returns the Levenshtein edit distance between two strings.
 */
export function distance(first: string, second: string): number {
  let a = first;
  let b = second;

  if (a.length < b.length) {
    const tmp = b;

    b = a;
    a = tmp;
  }

  if (b.length === 0) {
    return a.length;
  }

  peq ??= new Uint32Array(0x10000);

  return a.length <= 32 ? myers32(a, b, peq) : myersX(a, b, peq);
}
