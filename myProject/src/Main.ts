
class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }


    private bitmap: egret.Bitmap;
    private isdisplay = false;
    private rankingListMask: egret.Shape;
    private closeBtn: eui.Image;
    /**
     * 创建场景界面
     * Create scene interface
     */
    private button: any;
    protected createGameScene(): void {

        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        this.button = new eui.Button();
        this.button.label = "排行榜!";
        this.button.horizontalCenter = 0;
        this.button.verticalCenter = 0;
        this.addChild(this.button);
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);

        this.closeBtn = new eui.Image();
        this.closeBtn.source = "resource/884123855432430447.png"
        this.addChild(this.closeBtn);
        this.closeBtn.anchorOffsetX = this.closeBtn.width / 2;
        this.closeBtn.x = this.stage.stageWidth - 80;
        this.closeBtn.y = 80;
        this.closeBtn.visible = false;
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
            this.closeBtn.source = "resource/882646219480720208.png"
        }, this)

        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_END, () => {
            this.closeBtn.source = "resource/884123855432430447.png"
        }, this)
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.bitmap.parent && this.bitmap.parent.removeChild(this.bitmap);
            this.rankingListMask.parent && this.rankingListMask.parent.removeChild(this.rankingListMask);
            this.closeBtn.visible = false;
        }, this);
    }

    /**
     * 点击按钮
     * Click the button
     */
    private onButtonClick(e: egret.TouchEvent) {
        this.closeBtn.visible = true;
        let openDataContext = wx.getOpenDataContext();
        //处理遮罩，避免开放数据域事件影响主域。
        this.rankingListMask = new egret.Shape();
        this.rankingListMask.graphics.beginFill(0x000000, 1);
        this.rankingListMask.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        this.rankingListMask.graphics.endFill();
        this.rankingListMask.alpha = 0.5;
        this.addChild(this.rankingListMask);
        this.rankingListMask.touchEnabled = true;
        console.log();

        //简单实现，打开这关闭使用一个按钮。
        //主要示例代码开始
        const bitmapdata1 = new egret.BitmapData(window["sharedCanvas"]);
        bitmapdata1.$deleteSource = false;
        const texture = new egret.Texture();
        texture.bitmapData = bitmapdata1;
        this.bitmap = new egret.Bitmap(texture);
        this.bitmap.width = this.stage.stageWidth;
        this.bitmap.height = this.stage.stageHeight;
        this.bitmap.anchorOffsetX = this.bitmap.width / 2
        this.bitmap.anchorOffsetY = this.bitmap.height / 2
        this.bitmap.x = this.stage.stageWidth / 2;
        this.bitmap.y = this.stage.stageHeight / 2;
        this.addChild(this.bitmap);
        egret.startTick((timeStarmp: number) => {
            egret.WebGLUtils.deleteWebGLTexture(bitmapdata1.webGLTexture);
            bitmapdata1.webGLTexture = null;
            return false;
        }, this);
        //主要示例代码结束          
        //发送消息
        openDataContext.postMessage({
            text: "hello",
            year: (new Date()).getFullYear()
        });
        console.log("data");
        this.addChild(this.closeBtn);
    }
}
