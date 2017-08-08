module bighead
{
     /**
     * 游戏上下容器
     */
    export class GameScene extends eui.Component 
    {
        /**stage宽*/
        private stageW:number;
        /**stage高*/
        private stageH:number;

        //创建游戏角色
	    public gameRole: GameRole
        
        //暂停按钮
        public pauseBtn: eui.Button
        //准备按钮，双方都已经准备，则游戏倒计时3秒，进入游戏
        public readyBtn: eui.Button
        //当前玩家的准备状态
        public readyStatus: boolean = false
        //打气按钮
        public pumpBtn: eui.Button
        //人物表情变化
	    public phiz: boolean = false
        // 放大缩小的倍数
        public scaleMom: number = 1.2
  
        //单例
        private static shared: GameScene
        //时间
        private __lastTime: number

        //游戏输赢 是否被原谅？
	    public gameover: boolean = false

        //游戏输赢提示信息
        private gamelose: eui.Image
        private gamewin: eui.Image
        //玩家输显示
	    private gameloseShowbrother: egret.Bitmap

        public constructor() { 
            super();
            this.skinName = 'src/bighead/GameSceneSkin.exml'
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        }

        /**初始化*/
        private onAddToStage(event:egret.Event){
            this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
            this.createGameScene();
        }

        /**
         * 创建游戏场景
         */
        private createGameScene():void {
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;

            //创建游戏角色
            this.gameRole = new GameRole();
            this.gameRole.x = 0;  
            this.gameRole.y = 1178;
            // this.gameRole.y = 1300;
            this.gameRole.scaleX = 1.2;
            this.gameRole.scaleY = 1.2;
            console.log(this.gameRole.height);
            this.gameRole.anchorOffsetX = 0
            this.gameRole.anchorOffsetY = 398
            this.addChildAt( this.gameRole, 0 ); // 深度管理

            //监听准备按钮点击事件
            this.readyBtn.skinName = 'resource/skins/readyBtnStart.exml'
            this.readyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.readyBtnHandler, this);
        }

        /**
         * 添加游戏角色各种事件监听
         */
        public addPlayerEvtListener(): void {
            //监听帧事件
            this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this)
            this.pumpBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
            this.pumpBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouch,this);
        }

        /**
         * 移除游戏角色各种事件监听
         */
        public removePlayerEvtListener(): void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this)
            this.pumpBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouch,this);
            this.pumpBtn.removeEventListener(egret.TouchEvent.TOUCH_END,this.onTouch,this);
        }

        /**
        * 点击打气按钮的触摸事件回调
        */
        private onTouch(event:egret.TouchEvent) {
            //获得当前按钮
            // var btn:eui.Button = <eui.Button>event.target;
            switch (event.type) {
                case egret.TouchEvent.TOUCH_BEGIN:
                    //设置按钮的 icon
                    this.pumpBtn.skinName = 'resource/skins/pumpBtnClick.exml';
                    this.phiz = true;
                    // this.gameRole.skinName = 'resource/skins/GameRoleHit.exml';
                    break;
                case egret.TouchEvent.TOUCH_END:
                    //取消按钮的 icon
                    this.pumpBtn.skinName = 'resource/skins/pumpBtnDefault.exml';
                    this.phiz = false;
                    // this.gameRole.skinName = 'resource/skins/GameRole.exml';
                    break;
                default :
                    break;
            }

        }

        /**
         * 监听准备按钮事件
         */
        private readyBtnHandler(evt: egret.TouchEvent) {
            if (this.readyBtn.skinName != 'resource/skins/readyBtnEnd.exml') {
                this.readyBtn.skinName = 'resource/skins/readyBtnEnd.exml'
                this.readyStatus = true
            } else {
                this.readyBtn.skinName = 'resource/skins/readyBtnStart.exml'
                this.readyStatus = false
            }
        }

        /**
         * 游戏画面更新， 即每一帧刷新
         */
        private gameViewUpdate(evt: egret.Event): void {
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime: number = egret.getTimer()
            var fps: number = 1000 / (nowTime - this.__lastTime)
            this.__lastTime = nowTime
            var speedOffset: number = 60 / fps
        }

        /**
         * 游戏结束
         */
        public gameOver(): void {
            console.log("over")
            this.gamelose.visible = true
        }

        /**
         * 游戏胜利
         */
        public gameWin(): void {
            this.gamewin.visible = true
        }

    }
}