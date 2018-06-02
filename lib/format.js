"use strict";Object.defineProperty(exports,"__esModule",{value:true});/* eslint no-nested-ternary: "off" */var ONEH=10*10;// eslint-disable-line
var ONEK=10*10*10;var ONEM=ONEK*ONEK;var ONEB=ONEM*ONEK;// short scale (9 zeros)
exports.default=function(n){return n>=ONEB?n/ONEB+"B":n>=ONEM?n/ONEM+"M":n>=ONEK?n/ONEK+"K":n.toString();};