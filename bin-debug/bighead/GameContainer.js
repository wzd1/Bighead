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
    * 主游戏容器
    */
    var GameContainer = (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            var _this = _super.call(this) || this;
            //当前游戏状态是否在进行中
            _this.gameIscontinue = false;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            return _this;
        }
        GameContainer.prototype.onAddToStage = function (event) {
            this.skinName = 'src/bighead/GameContainerSkin.exml';
            this.P1 = new bighead.GameScene();
            this.P2 = new bighead.GameScene();
            this.P2.anchorOffsetX = this.P2.width;
            this.P2.anchorOffsetY = this.P2.height;
            this.P2.rotation = 180;
            this.addChildAt(this.P1, 1);
            this.addChildAt(this.P2, 1);
            //监听游戏开始事件
            this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            //暂停按钮的事件监听
            this.P1.pauseBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.gamePause, this);
            this.P2.pauseBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.gamePause, this);
            //重新开始 回到首页按钮事件
            this.resetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.resetBtnHandler, this);
            this.continueBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.continueBtnHandler, this);
        };
        /**
         * 游戏画面更新， 即每一帧刷新
         */
        GameContainer.prototype.gameViewUpdate = function (evt) {
            //监听游戏的准备状态
            if (this.P1.readyStatus && this.P2.readyStatus) {
                //在游戏开始之前，入场动画
                if (!this.gameIscontinue) {
                    this.readyStar();
                }
            }
            else {
                this.P1.removePlayerEvtListener();
                this.P2.removePlayerEvtListener();
                this.removeGameCtrl();
            }
        };
        /**
         * 游戏开始的过度动画， 遮罩层， 倒计时3秒， 开始游戏
         */
        GameContainer.prototype.readyStar = function () {
            var _this = this;
            this.gameIscontinue = true;
            //隐藏准备按钮
            this.P1.readyBtn.visible = false;
            this.P2.readyBtn.visible = false;
            //开始倒计时动画
            this.CountDownAnime = new bighead.CountDownAnime();
            this.CountDownAnime1 = new bighead.CountDownAnime();
            this.CountDownAnime.x = (this.stage.stageWidth - this.CountDownAnime.width) / 2;
            this.CountDownAnime.y = 788;
            this.CountDownAnime1.x = (this.stage.stageWidth - this.CountDownAnime1.width) / 2;
            this.CountDownAnime1.y = 438;
            this.CountDownAnime1.anchorOffsetX = this.CountDownAnime1.width;
            this.CountDownAnime1.anchorOffsetY = this.CountDownAnime1.height;
            this.CountDownAnime1.rotation = 180;
            this.addChild(this.CountDownAnime);
            this.addChild(this.CountDownAnime1);
            setTimeout(function () {
                // this.removeChild(this.CountDownAnime);
                // this.removeChild(this.CountDownAnime1);
                _this.CountDownAnime.visible = false;
                _this.CountDownAnime1.visible = false;
                //显示暂停按钮
                _this.P1.pauseBtn.visible = true;
                _this.P2.pauseBtn.visible = true;
                // this.P1.pauseBtn.touchEnabled = true;
                // 监听动画完后可以点击打气
                _this.P1.addPlayerEvtListener();
                _this.P2.addPlayerEvtListener();
                _this.gameCtrl();
            }, 4000);
        };
        /**
         * 监听打气事件
         */
        GameContainer.prototype.gameCtrl = function () {
            this.P1.pumpBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.headChange, this);
            this.P2.pumpBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.headChange2, this);
        };
        /**
         * 移除监听打气事件
         */
        GameContainer.prototype.removeGameCtrl = function () {
            this.P1.pumpBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.headChange, this);
            this.P2.pumpBtn.removeEventListener(egret.TouchEvent.TOUCH_END, this.headChange2, this);
        };
        /**
         * 人物头变大变小
         */
        GameContainer.prototype.headChange = function (evt) {
            var _this = this;
            this.P1.scaleMom = this.P1.scaleMom + 0.05;
            if (this.P1.gameRole.skinName != 'resource/skins/GameRoleHit.exml') {
                this.P1.gameRole.skinName = 'resource/skins/GameRoleHit.exml';
                setTimeout(function () {
                    _this.P1.gameRole.skinName = 'resource/skins/GameRole.exml';
                    _this.P1.gameRole.scaleX = _this.P1.scaleMom;
                    _this.P1.gameRole.scaleY = _this.P1.scaleMom;
                }, 1000);
            }
            this.P2.scaleMom = this.P2.scaleMom - 0.05;
            this.P2.gameRole.skinName = 'resource/skins/GameRole.exml';
            this.P2.gameRole.scaleX = this.P2.scaleMom;
            this.P2.gameRole.scaleY = this.P2.scaleMom;
            //监听当前游戏的结局， 是否已经有玩家出局
            if (this.P1.scaleMom >= 1.2 + 0.05 * 10) {
                this.P2.gameOver();
                this.P1.gameWin();
                this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
                this.resetBtn.visible = true;
                this.homeBtn.visible = true;
                this.P1.pauseBtn.visible = false;
                this.P2.pauseBtn.visible = false;
                this.P1.gameRole.visible = false;
                this.P2.gameRole.visible = false;
            }
        };
        GameContainer.prototype.headChange2 = function (evt) {
            var _this = this;
            this.P2.scaleMom = this.P2.scaleMom + 0.05;
            if (this.P2.gameRole.skinName != 'resource/skins/GameRoleHit.exml') {
                this.P2.gameRole.skinName = 'resource/skins/GameRoleHit.exml';
                setTimeout(function () {
                    _this.P2.gameRole.skinName = 'resource/skins/GameRole.exml';
                    _this.P2.gameRole.scaleX = _this.P2.scaleMom;
                    _this.P2.gameRole.scaleY = _this.P2.scaleMom;
                }, 1000);
            }
            this.P1.scaleMom = this.P1.scaleMom - 0.05;
            this.P1.gameRole.skinName = 'resource/skins/GameRole.exml';
            this.P1.gameRole.scaleX = this.P1.scaleMom;
            this.P1.gameRole.scaleY = this.P1.scaleMom;
            //监听当前游戏的结局， 是否已经有玩家出局
            if (this.P2.scaleMom >= 1.2 + 0.05 * 10) {
                this.P1.gameOver();
                this.P2.gameWin();
                this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
                this.resetBtn.visible = true;
                this.homeBtn.visible = true;
                this.P1.pauseBtn.visible = false;
                this.P2.pauseBtn.visible = false;
                this.P1.gameRole.visible = false;
                this.P2.gameRole.visible = false;
            }
        };
        /**
         * 重新开始游戏
         */
        GameContainer.prototype.resetBtnHandler = function () {
            //删除当前游戏玩家，重新声场游戏玩家
            this.removeChild(this.P1);
            this.removeChild(this.P2);
            this.P1 = new bighead.GameScene();
            this.P2 = new bighead.GameScene();
            this.P2.anchorOffsetX = this.P2.width;
            this.P2.anchorOffsetY = this.P2.height;
            this.P2.rotation = 180;
            this.addChildAt(this.P1, 1);
            this.addChildAt(this.P2, 1);
            //监听游戏开始事件
            this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            //隐藏按钮
            this.resetBtn.visible = false;
            this.homeBtn.visible = false;
            this.gameIscontinue = false;
            //准备按钮设置为未准备状态
            this.P1.readyStatus = false;
            this.P2.readyStatus = false;
        };
        /**
         * 任意一个玩家点击暂停
         */
        GameContainer.prototype.gamePause = function (mes) {
            this.pauseMask.width = this.stage.stageWidth;
            this.continueBtn.visible = true;
            this.homeBtn.visible = true;
        };
        /**
         * 继续游戏
         */
        GameContainer.prototype.continueBtnHandler = function () {
            this.pauseMask.width = 0;
            this.continueBtn.visible = false;
            this.homeBtn.visible = false;
        };
        return GameContainer;
    }(eui.Component));
    bighead.GameContainer = GameContainer;
    __reflect(GameContainer.prototype, "bighead.GameContainer");
})(bighead || (bighead = {}));
//# sourceMappingURL=GameContainer.js.map