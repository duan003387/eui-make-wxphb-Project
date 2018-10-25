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
var test = (function (_super) {
    __extends(test, _super);
    function test() {
        var _this = _super.call(this) || this;
        _this.arr = [];
        _this.btUpimgArr = [];
        _this.btDownimgArr = [];
        return _this;
    }
    test.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    test.prototype.childrenCreated = function () {
        var _this = this;
        _super.prototype.childrenCreated.call(this);
        this.width = this.stage.stageWidth;
        this.height = this.stage.stageHeight;
        this.InitBtnUrlArr();
        wx.onMessage(function (data) {
            console.log(data);
            // if (data.isDisplay) {
            //获取小游戏开放数据接口 --- 开始
            wx.getFriendCloudStorage({
                keyList: ["score"],
                success: function (res) {
                    console.log(res.data);
                    console.log("aaaaaaa");
                    _this.runGame(res.data);
                },
                fail: function (err) {
                    console.log(err);
                },
                complete: function () {
                }
            });
        });
    };
    test.prototype.runGame = function (data) {
        var _this = this;
        this.arr.splice(0, this.arr.length);
        data.forEach(function (value, index) {
            console.log(value);
            //arr为：any的数组
            //value["avatarUrl"]为微信头像图片地址
            _this.arr.push({ "img": value["avatarUrl"], "name": value["nickname"], "bgimg": "openDataContext/resource/rankingList/tongyonk_bg6.png" });
        });
        this.arr.forEach(function (value, index) {
            console.log(value);
        });
        this.list.dataProvider = new eui.ArrayCollection(this.arr);
        this.Init();
    };
    //初始化界面
    test.prototype.Init = function () {
        console.log(this.width, this.height);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.BtnClick, this);
        for (var i = 0; i < this.btngroup.numChildren; i++) {
            var img = this.btngroup.getChildAt(i);
            // this.btngroup.getChildAt(i).addEventListener(egret.TouchEvent.TOUCH_TAP,this.BtnClick,this)
            img.source = "openDataContext/resource/rankingList/" + this.btUpimgArr[i];
        }
        this.phb_bg.source = "openDataContext/resource/rankingList/tongyonk_bg.png";
        this.quanqiuphb_bg.source = "openDataContext/resource/rankingList/tiltle_qqphb.png";
        // this.scroll_bg.source = "openDataContext/resource/rankingList/tiltle_qqphb.png"
    };
    test.prototype.InitBtnUrlArr = function () {
        this.btUpimgArr.push("bun_bg3_hs.png");
        this.btUpimgArr.push("bun_bg3_hs_cf.png");
        this.btUpimgArr.push("bun_bg3_hs_dj.png");
        this.btDownimgArr.push("bun_bg3_ls.png");
        this.btDownimgArr.push("bun_bg3_ls_cf.png");
        this.btDownimgArr.push("bun_bg3_ls_dj.png");
    };
    test.prototype.BtnClick = function (evt) {
        console.log(evt.target);
    };
    return test;
}(eui.Component));
__reflect(test.prototype, "test", ["eui.UIComponent", "egret.DisplayObject"]);
