parcelRequire=function(e,r,n,t){function i(n,t){function o(e){return i(o.resolve(e))}function c(r){return e[n][1][r]||r}if(!r[n]){if(!e[n]){var l="function"==typeof parcelRequire&&parcelRequire;if(!t&&l)return l(n,!0);if(u)return u(n,!0);if(f&&"string"==typeof n)return f(n);var p=new Error("Cannot find module '"+n+"'");throw p.code="MODULE_NOT_FOUND",p}o.resolve=c;var a=r[n]=new i.Module(n);e[n][0].call(a.exports,o,a,a.exports,this)}return r[n].exports}function o(e){this.id=e,this.bundle=i,this.exports={}}var u="function"==typeof parcelRequire&&parcelRequire,f="function"==typeof require&&require;i.isParcelRequire=!0,i.Module=o,i.modules=e,i.cache=r,i.parent=u;for(var c=0;c<n.length;c++)i(n[c]);if(n.length){var l=i(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):t&&(this[t]=l)}return i}({5:[function(require,module,exports) {
function e(){document.querySelector(".receipt-container").style.display="none",document.querySelector(".print-id").style.display="none",document.querySelector(".print-matches").style.display="none"}function t(t){console.log(t),e(),document.querySelector("#id-number").innerHTML=t,document.querySelector(".receipt-container").style.display="block",document.querySelector(".print-id").style.display="block"}function n(t){console.log("matches"+t),e(),document.querySelector(".receipt-container").style.display="block",document.querySelector(".print-matches").style.display="block";for(var n=0;n<t.length;n++)if(t[n]){var c=document.createElement("div");c.innerHTML="#"+t[n],document.querySelector(".print-matches").appendChild(c)}}
},{}]},{},[5], null)
//# sourceMappingURL=/printing-service.0ee83f6e.map