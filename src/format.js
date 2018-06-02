/* eslint no-nested-ternary: "off" */

const ONEH = 10 * 10; // eslint-disable-line
const ONEK = 10 * 10 * 10;
const ONEM = ONEK * ONEK;
const ONEB = ONEM * ONEK; // short scale (9 zeros)

export default (n) => (n >= ONEB) ? `${n / ONEB}B` : (n >= ONEM) ? `${n / ONEM}M` : (n >= ONEK) ? `${n / ONEK}K` : n.toString();
