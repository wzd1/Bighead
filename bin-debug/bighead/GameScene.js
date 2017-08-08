var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var bighead;
(function (bighead) {
    /**
    * 游戏上下容器
    */
    var GameScene = (function (_super) {
        __extends(GameScene, _super);
        function GameScene() {
            var _this = _super.call(this) || this;
            //当前玩家的准备状态
            _this.readyStatus = false;
            //人物表情变化
            _this.phiz = false;
            // 放大缩小的倍数
            _this.scaleMom = 1.2;
            //游戏输赢 是否被原谅？
            _this.gameover = false;
            _this.skinName = 'src/bighead/GameSceneSkin.exml';
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            return _this;
        }
        /**初始化*/
        GameScene.prototype.onAddToStage = function (event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.createGameScene();
        };
        /**
         * 创建游戏场景
         */
        GameScene.prototype.createGameScene = function () {
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            //创建游戏角色
            this.gameRole = new bighead.GameRole();
            this.gameRole.x = 0;
            this.gameRole.y = 1178;
            // this.gameRole.y = 1300;
            this.gameRole.scaleX = 1.2;
            this.gameRole.scaleY = 1.2;
            console.log(this.gameRole.height);
            this.gameRole.anchorOffsetX = 0;
            this.gameRole.anchorOffsetY = 398;
            this.addChildAt(this.gameRole, 0); // 深度管理
            //监听准备按钮点击事件
            this.readyBtn.skinName = 'resource/skins/readyBtnStart.exml';
            this.readyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.readyBtnHandler, this);
        };
        /**
         * 添加游戏角色各种事件监听
         */
        GameScene.prototype.addPlayerEvtListener = function () {
            //监听帧事件
            this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.pumpBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
            this.pumpBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
        };
        /**
         * 移除游戏角色各种事件监听
         */
        GameScene.prototype.removePlayerEvtListener = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.pumpBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
            this.pumpBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouch, this);
        };
        /**
        * 点击打气按钮的触摸事件回调
        */
        GameScene.prototype.onTouch = function (event) {
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
                default:
                    break;
            }
        };
        /**
         * 监听准备按钮事件
         */
        GameScene.prototype.readyBtnHandler = function (evt) {
            if (this.readyBtn.skinName != 'resource/skins/readyBtnEnd.exml') {
                this.readyBtn.skinName = 'resource/skins/readyBtnEnd.exml';
                this.readyStatus = true;
            }
            else {
                this.readyBtn.skinName = 'resource/skins/readyBtnStart.exml';
                this.readyStatus = false;
            }
        };
        /**
         * 游戏画面更新， 即每一帧刷新
         */
        GameScene.prototype.gameViewUpdate = function (evt) {
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime = egret.getTimer();
            var fps = 1000 / (nowTime - this.__lastTime);
            this.__lastTime = nowTime;
            var speedOffset = 60 / fps;
        };
        /**
         * 游戏结束
         */
        GameScene.prototype.gameOver = function () {
            console.log("over");
            this.gamelose.visible = true;
        };
        /**
         * 游戏胜利
         */
        GameScene.prototype.gameWin = function () {
            this.gamewin.visible = true;
        };
        return GameScene;
    }(eui.Component));
    bighead.GameScene = GameScene;
    __reflect(GameScene.prototype, "bighead.GameScene");
})(bighead || (bighead = {}));
//# sourceMappingURL=GameScene.js.map