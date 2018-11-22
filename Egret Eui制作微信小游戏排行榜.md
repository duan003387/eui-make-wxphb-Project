##Egret Eui制作微信小游戏排行榜

最近在做微信小游戏的排行榜的时候，发现现在官方最新的例子是原生Canvas绘制的，虽然体积小，但是在做一些复杂的排行榜的时候也是挺麻烦的，所以 在想是不是可以用Eui做排行榜。

本节制作有四个项目：

>- ####Egret主项目   

>- ####主项目发布的小游戏项目

>- ####Egret开放数据域项目   

>- ####开放数据域项目发布的小游戏项目

###   一、创建主项目

####	1.1 创建主项目
创建一个Egret项目作为主域项目并且发布为微信小游戏。

主域项目Main.ts代码为：
```typescript
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
```
>1、这里**window["sharedCanvas"]**绘制了一个离屏canvas，再将开放域中的小游戏项目作为bitmapData加载到一个bitmap上进行显示。通过egret.startTick主域不断通知开放域进行数据刷新；
>2、复制[demo](https://github.com/duan003387/eui-make-wxphb-Project/blob/master/myProject/libs/wx_mini_game.d.ts)中的wx_mini_game.d.ts进行引擎编译（主域和子域项目都要哦），不然在项目中无法调用微信的API。
>
>3、也可以通过学习[官方文档](http://developer.egret.com/cn/github/egret-docs/Engine2D/minigame/openDataContext/index.html)加深理解，思想相同。
###二、创建子域项目

#### 2.1 创建子域项目

1、再创建一个Egret项目作为子域项目；删除egretProperties.json中我们不需要用的库，笔者这里只留下egret、eui、promise、assetsmanager。然后执行egret build -e 进行编译引擎 。

2、接下来将项目发布为微信小游戏我们需要打开scripts/config.wxgame.ts将outputDir 修改为   const outputDir = `../myProject_wxgame/openDataContext`; 其中myProject_wxgame是你的主域项目的目录。

3、然后先在Launcher面板发布为微信小游戏，但是你发现主域目录下什么也没有，不要着急，这时候再打开终端输入egret publish -target wxgame 就会有了。修改子域项目game.js为index.js。编译会发现如下报错：

![](https://images2018.cnblogs.com/blog/1062174/201807/1062174-20180723161932842-169160313.png)

原因是在5.2.2引擎版本以上，使用的是assetsmananger而不是res，则会报错wx.getFileSystemManager not function。 解决办法是将egretProperties.json里ssetsmananger改为res，再egret build -e编译引擎。

会报：

>Command failed: egret build -e
>
>编译项目失败

不管它，其实已经编译完成了，之后会发现main.ts中关于RES加载的都报错了，因为即使使用res，也不能去加载default.res.json文件，把报错通通删掉；

4、仅仅加载皮肤主题，不加载default.res.json也可以使用eui，所以图片的加载都使用img.source = "resource/assets/xxx.png" 的方式实现。

5、所以子域项目Main.ts中代码为：
```typescript
class Main extends eui.UILayer {

	protected createChildren(): void {
    	super.createChildren();

    	//inject the custom material parser
    	//注入自定义的素材解析器
    	let assetAdapter = new AssetAdapter();
    	egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
    	egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

    	let theme = new eui.Theme("resource/default.thm.json", this.stage);
    	theme.addEventListener(eui.UIEvent.COMPLETE, this.createGameScene, this);
	}
	/**
 	* 创建场景界面
 	* Create scene interface
 	*/
	protected createGameScene(): void {
		//test为一个皮肤文件，你可以随便在里面放一张图片
    	this.addChild(new test())
	}
}
```

注意：1、这里为了子域项目编译之后可以直接输出为**index.js**，点击[这里](https://github.com/duan003387/eui-make-wxphb-Project/blob/master/wxa/scripts/wxgame/wxgame.ts)复制好，替换你的子域项目中的**wxgame.ts**；

​	2、再 将子域项目中index.html中渲染模式改为canvas，为避免闪屏还需要将fps改为60。

​	3、之后进行编译，发现微信开发者工具是不报错了，但是图片也没有加载出来，这里需要打开微信项目中**openDataContext** 下的**index.js** 在**egret.runEgret**上面加上**egret.wxgame.isSubContext = true;**保存运行就正常了。



PS:子域项目分辨率最好跟主域的一致或者差不多，如果排行榜是非全屏的，在制作子域的时候一定要把你的舞台当成是主域的屏幕，然后再缩小整个排行榜。如果是在主项目中将子域添加到bitmap上时对bitmap进行缩放以达到非全屏排行榜的话，会发现子域的点击区域还是全屏的，这时候有点击的偏移量。



**总结：**使用eui制作排行榜实际上就是把egret项目发布为微信小游戏来作为主项目的开放域；Eui制作排行榜虽然可视化、简单，但是需要引入两套egret库，这会造成代码体积偏大，如果你的游戏本身很大是不建议使用这种方法制作排行榜的。

最后附上GitHub源码：https://github.com/duan003387/eui-make-wxphb-Project，demo中还有很多可以删减的东西，比如resource可以直接用主域项目的resource，开发者可以自行删减。