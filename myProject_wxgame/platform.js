/**
 * 请在白鹭引擎的Main.ts中调用 platform.login() 方法调用至此处。
 */

class WxgamePlatform {

    name = 'wxgame'

    login() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (res) => {
                    resolve(res)
                }
            })
        })
    }
  //转发
  showShareMenu(){
    return new Promise((resolve, reject) => {
      wx.showShareMenu({
        withShareTicket:true
      })
      wx.onShareAppMessage(function () {
        return {
          title: '我是被动转发转发',
          imageUrl: "resource/assets/bg.jpg"
        }
      })

    })
  }

//
  shareAppMessage() {
    return new Promise((resolve, reject) => {
      wx.shareAppMessage({
        title: "我要转发",
        imageUrl: "resource/assets/bg.jpg",   
        query: ""
      })
    })
  }


  createBannerAd(){
    let bannerAd = wx.createBannerAd({
      adUnitId: 'adunit-71fbce1a685f590f',
      style: {
        left: 10,
        top: 76,
        width: 320
      }
    })
    bannerAd.show()
      .catch(err => console.log("成功"))
    bannerAd.onLoad(() => {
      console.log('banner 广告加载成功')
    })
    bannerAd.onError(err => {
      console.log(err)
    })
  }

  getUserInfo(left, bottom) {
    return new Promise((resolve, reject) => {
      let sysInfo = wx.getSystemInfoSync();
      let sdkVersion = sysInfo.SDKVersion;
      sdkVersion = sdkVersion.replace(/\./g, "");
      sdkVersion = sdkVersion.substr(0, 3);
      let sdkVersionNum = parseInt(sdkVersion);
      console.log("platform获取用户授权:", sdkVersionNum);
      //判断用户是否授权过
      wx.getSetting({
        success(res) {
          if (sdkVersionNum >= 201 && !res.authSetting['scope.userInfo']) {
            var button = wx.createUserInfoButton({
              type: 'text',
              text: '老铁授权',
              style: {
                left: 50,
                top: 50,
                width: 95,
                height: 45,
                lineHeight: 0,
                backgroundColor: '#228B22',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 0,
                borderRadius: 10
              }
            });
            button.onTap((res) => {
              console.log("用户授权:", res);
              var userInfo = res.userInfo;
              var nickName = userInfo.nickName;
              var avatarUrl = userInfo.avatarUrl;
              var gender = userInfo.gender; //性别 0：未知、1：男、2：女
              var province = userInfo.province;
              var city = userInfo.city;
              var country = userInfo.country;
              button.destroy();
              resolve(userInfo);
            });
          } else {
            wx.getUserInfo({
              withCredentials: true,
              success: res => {
                var userInfo = res.userInfo;
                var nickName = userInfo.nickName;
                var avatarUrl = userInfo.avatarUrl;
                var gender = userInfo.gender; //性别 0：未知、1：男、2：女
                var province = userInfo.province;
                var city = userInfo.city;
                var country = userInfo.country;
                resolve(userInfo);
              },
              fail: res => {
                wx.showModal({
                  title: '友情提醒',
                  content: '请允许微信获得授权!',
                  confirmText: "授权",
                  showCancel: false,
                  success: res => {
                    resolve(null);
                  }
                });
              }
            });
          }
        }
      })
    });
  }

    openDataContext = new WxgameOpenDataContext();
}

class WxgameOpenDataContext {

    createDisplayObject(type, width, height) {
        const bitmapdata = new egret.BitmapData(sharedCanvas);
        bitmapdata.$deleteSource = false;
        const texture = new egret.Texture();
        texture._setBitmapData(bitmapdata);
        const bitmap = new egret.Bitmap(texture);
        bitmap.width = width;
        bitmap.height = height;

        if (egret.Capabilities.renderMode == "webgl") {
            const renderContext = egret.wxgame.WebGLRenderContext.getInstance();
            const context = renderContext.context;
            ////需要用到最新的微信版本
            ////调用其接口WebGLRenderingContext.wxBindCanvasTexture(number texture, Canvas canvas)
            ////如果没有该接口，会进行如下处理，保证画面渲染正确，但会占用内存。
            if (!context.wxBindCanvasTexture) {
                egret.startTick((timeStarmp) => {
                    egret.WebGLUtils.deleteWebGLTexture(bitmapdata.webGLTexture);
                    bitmapdata.webGLTexture = null;
                    return false;
                }, this);
            }
        }
        return bitmap;
    }


    postMessage(data) {
        const openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage(data);
    }
}


window.platform = new WxgamePlatform();