module bighead
{
     /**
     * 主游戏容器
     */
    export class GameContainer extends eui.Component
    {
        //玩家
        public P1: GameScene
        public P2: GameScene

        //当前游戏状态是否在进行中
	    private gameIscontinue: boolean = false
        // 创建游戏倒计时动画对象
        public CountDownAnime: CountDownAnime
        public CountDownAnime1: CountDownAnime
        
        //继续游戏按钮
        private continueBtn: eui.Button
        //首页按钮
        private homeBtn: eui.Button
        //重新开始按钮
        private resetBtn: eui.Button
        //游戏暂停遮罩层
        private pauseMask: eui.Rect

        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        }

        private onAddToStage(event:egret.Event){
            this.skinName = 'src/bighead/GameContainerSkin.exml'

            this.P1 = new GameScene()
		    this.P2 = new GameScene()
            this.P2.anchorOffsetX = this.P2.width
            this.P2.anchorOffsetY = this.P2.height
            this.P2.rotation = 180

            this.addChildAt(this.P1, 1)
            this.addChildAt(this.P2, 1)
            
            //监听游戏开始事件
		    this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this)

            //暂停按钮的事件监听
            this.P1.pauseBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.gamePause, this)
            this.P2.pauseBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.gamePause, this)

            //重新开始 回到首页按钮事件
		    this.resetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.resetBtnHandler, this)
            this.continueBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.continueBtnHandler, this)
        }

        /**
         * 游戏画面更新， 即每一帧刷新
         */
        private gameViewUpdate(evt: egret.Event): void {
            //监听游戏的准备状态
            if (this.P1.readyStatus && this.P2.readyStatus) {
                //在游戏开始之前，入场动画
                if (!this.gameIscontinue){
                    this.readyStar()
                }
            } else {
                this.P1.removePlayerEvtListener();
			    this.P2.removePlayerEvtListener();
                this.removeGameCtrl();
            }

        }

        /**
         * 游戏开始的过度动画， 遮罩层， 倒计时3秒， 开始游戏
         */
        private readyStar() {
            this.gameIscontinue = true
            //隐藏准备按钮
            this.P1.readyBtn.visible = false
            this.P2.readyBtn.visible = false

            //开始倒计时动画
            this.CountDownAnime = new CountDownAnime()
            this.CountDownAnime1 = new CountDownAnime()
            this.CountDownAnime.x = (this.stage.stageWidth - this.CountDownAnime.width) / 2
            this.CountDownAnime.y = 788

            this.CountDownAnime1.x = (this.stage.stageWidth - this.CountDownAnime1.width) / 2
            this.CountDownAnime1.y = 438
            this.CountDownAnime1.anchorOffsetX = this.CountDownAnime1.width
            this.CountDownAnime1.anchorOffsetY = this.CountDownAnime1.height
            this.CountDownAnime1.rotation = 180

            this.addChild(this.CountDownAnime)
            this.addChild(this.CountDownAnime1)

            setTimeout(() => {
                // this.removeChild(this.CountDownAnime);
                // this.removeChild(this.CountDownAnime1);
                this.CountDownAnime.visible = false;
                this.CountDownAnime1.visible = false;
                //显示暂停按钮
                this.P1.pauseBtn.visible = true
                this.P2.pauseBtn.visible = true
                // this.P1.pauseBtn.touchEnabled = true;

                // 监听动画完后可以点击打气
                this.P1.addPlayerEvtListener();
                this.P2.addPlayerEvtListener();
                this.gameCtrl();
            }, 4000)
        }

        /**
         * 监听打气事件
         */
        private gameCtrl(): void {
            this.P1.pumpBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.headChange,this);
            this.P2.pumpBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.headChange2,this);
        }

        /**
         * 移除监听打气事件
         */
        private removeGameCtrl(): void {
            this.P1.pumpBtn.removeEventListener(egret.TouchEvent.TOUCH_END,this.headChange,this);
            this.P2.pumpBtn.removeEventListener(egret.TouchEvent.TOUCH_END,this.headChange2,this);
        }

        /**
         * 人物头变大变小
         */
        private headChange(evt: egret.TouchEvent): void {
            this.P1.scaleMom = this.P1.scaleMom + 0.05;
            if (this.P1.gameRole.skinName != 'resource/skins/GameRoleHit.exml') {
                this.P1.gameRole.skinName = 'resource/skins/GameRoleHit.exml'
                setTimeout(() => {
                    this.P1.gameRole.skinName = 'resource/skins/GameRole.exml';
                    this.P1.gameRole.scaleX = this.P1.scaleMom;
                    this.P1.gameRole.scaleY = this.P1.scaleMom;
                }, 1000)
            }

            this.P2.scaleMom = this.P2.scaleMom - 0.05;
            this.P2.gameRole.skinName = 'resource/skins/GameRole.exml';
            this.P2.gameRole.scaleX = this.P2.scaleMom;
            this.P2.gameRole.scaleY = this.P2.scaleMom;

            //监听当前游戏的结局， 是否已经有玩家出局
            if(this.P1.scaleMom >= 1.2 + 0.05*10){
                this.P2.gameOver()
                this.P1.gameWin()
                this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this)
                this.resetBtn.visible = true
                this.homeBtn.visible = true
                this.P1.pauseBtn.visible = false
                this.P2.pauseBtn.visible = false
                this.P1.gameRole.visible = false
                this.P2.gameRole.visible = false
            }
        }


        public headChange2(evt: egret.TouchEvent): void {
            this.P2.scaleMom = this.P2.scaleMom + 0.05;
            if (this.P2.gameRole.skinName != 'resource/skins/GameRoleHit.exml') {
                this.P2.gameRole.skinName = 'resource/skins/GameRoleHit.exml'
                setTimeout(() => {
                    this.P2.gameRole.skinName = 'resource/skins/GameRole.exml';
                    this.P2.gameRole.scaleX = this.P2.scaleMom;
                    this.P2.gameRole.scaleY = this.P2.scaleMom;
                }, 1000)
            }

            this.P1.scaleMom = this.P1.scaleMom - 0.05;
            this.P1.gameRole.skinName = 'resource/skins/GameRole.exml';
            this.P1.gameRole.scaleX = this.P1.scaleMom;
            this.P1.gameRole.scaleY = this.P1.scaleMom;

            //监听当前游戏的结局， 是否已经有玩家出局
            if(this.P2.scaleMom >= 1.2 + 0.05*10){
                this.P1.gameOver()
                this.P2.gameWin()
                this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this)
                this.resetBtn.visible = true
                this.homeBtn.visible = true
                this.P1.pauseBtn.visible = false
                this.P2.pauseBtn.visible = false
                this.P1.gameRole.visible = false
                this.P2.gameRole.visible = false
            }
        }

        /**
         * 重新开始游戏
         */
        private resetBtnHandler(): void {
            //删除当前游戏玩家，重新声场游戏玩家
            this.removeChild(this.P1)
            this.removeChild(this.P2)

            this.P1 = new GameScene()
		    this.P2 = new GameScene()
            this.P2.anchorOffsetX = this.P2.width
            this.P2.anchorOffsetY = this.P2.height
            this.P2.rotation = 180

            this.addChildAt(this.P1, 1)
            this.addChildAt(this.P2, 1)
            
            //监听游戏开始事件
		    this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this)

            //隐藏按钮
            this.resetBtn.visible = false
            this.homeBtn.visible = false

            this.gameIscontinue = false

            //准备按钮设置为未准备状态
            this.P1.readyStatus = false
            this.P2.readyStatus = false
        }
        
        /**
         * 任意一个玩家点击暂停
         */
        private gamePause(mes: string): void {
            this.pauseMask.width = this.stage.stageWidth
            this.continueBtn.visible = true
            this.homeBtn.visible = true
        }

        /**
         * 继续游戏
         */
        private continueBtnHandler(): void {
            this.pauseMask.width = 0
            this.continueBtn.visible = false
            this.homeBtn.visible = false
        }

    }
}