var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var nima = (function (_super) {
    __extends(nima, _super);
    function nima() {
        return _super.call(this) || this;
    }
    nima.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    nima.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.nima.text = "从哪就是松松OS百度播放设备杀死不是变成翅膀程序成本形成V型自行车吧超喜欢VB的初步形成V型追是大V不是滴UIVB一份微薄预报上档次不是的ius卜上班VB三到四分部v女 9沙发斯蒂芬刷副本随便上 ";
    };
    return nima;
}(eui.Component));
__reflect(nima.prototype, "nima", ["eui.UIComponent", "egret.DisplayObject"]);
