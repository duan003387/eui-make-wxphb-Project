class test extends eui.Component implements eui.UIComponent {
	public phb_bg: eui.Image;
	public scroll: eui.Scroller;
	public list: eui.List;
	public arr: any[] = [];
	public btngroup: eui.Group;
	public quanqiuphb_bg: eui.Image;
	public scroll_bg: eui.Image;
	public btUpimgArr: string[] = [];
	public btDownimgArr: string[] = [];
	public viewstack: eui.ViewStack;


	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.width = this.stage.stageWidth;
		this.height = this.stage.stageHeight;
		this.InitBtnUrlArr()
		wx.onMessage(data => {
			console.log(data);
			// if (data.isDisplay) {
			//获取小游戏开放数据接口 --- 开始
			wx.getFriendCloudStorage({
				keyList: ["score"],
				success: res => {
					console.log(res.data);
					this.runGame(res.data);
				},
				fail: err => {
					console.log(err);
				},
				complete: () => {

				}
			});
		});
	}
	private runGame(data) {
		this.arr.splice(0, this.arr.length);
		data.forEach(
			(value, index) => {
				console.log(value);
				//arr为：any的数组
				//value["avatarUrl"]为微信头像图片地址
				this.arr.push({ "img": value["avatarUrl"], "rightImg": "openDataContext/resource/rankingList/qt_47.png", "name": value["nickname"], "haungguanimg": "openDataContext/resource/rankingList/phb1.png", "bgimg": "openDataContext/resource/rankingList/tongyonk_bg6.png", "shouye": "openDataContext/resource/rankingList/shouye_3.png", "sexImg": "openDataContext/resource/rankingList/Helot_09.png" });
			})
		this.arr.forEach((value, index) => {
			console.log(value);
		});
		this.list.dataProvider = new eui.ArrayCollection(this.arr);
		this.Init();
	}

	//初始化界面
	private Init() {
		//初始化三个按钮状态
		for (let i = 0; i < this.btngroup.numChildren; i++) {
			let img: eui.Image = <eui.Image>this.btngroup.getChildAt(i);
			if (i == this.viewstack.selectedIndex) {
				img.source = "openDataContext/resource/rankingList/" + this.btDownimgArr[i];
			}
			else {
				img.source = "openDataContext/resource/rankingList/" + this.btUpimgArr[i];
			}
			this.btngroup.getChildAt(i).addEventListener(egret.TouchEvent.TOUCH_TAP, this.BtnClick, this)
		}

		console.log(this.width, this.height);

		// this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.BtnClick,this)

		this.phb_bg.source = "openDataContext/resource/rankingList/tongyonk_bg.png";
		this.quanqiuphb_bg.source = "openDataContext/resource/rankingList/tiltle_qqphb.png"
	}
	private InitBtnUrlArr() {
		this.btUpimgArr.push("bun_bg3_hs.png");
		this.btUpimgArr.push("bun_bg3_hs_cf.png");
		this.btUpimgArr.push("bun_bg3_hs_dj.png");
		this.btDownimgArr.push("bun_bg3_ls.png");
		this.btDownimgArr.push("bun_bg3_ls_cf.png");
		this.btDownimgArr.push("bun_bg3_ls_dj.png");
	}

	private BtnClick(evt: egret.TouchEvent) {
		let targetImg: eui.Image = evt.target;
		let index: number = this.btngroup.getChildIndex(evt.target);
		for (let i = 0; i < this.btngroup.numChildren; i++) {
			let img: eui.Image = <eui.Image>this.btngroup.getChildAt(i);
			if (i == index) {
				img.source = "openDataContext/resource/rankingList/" + this.btDownimgArr[index];
			}
			else {
				img.source = "openDataContext/resource/rankingList/" + this.btUpimgArr[i];
			}
		}
		this.viewstack.selectedIndex = index;
	}
}