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
    * 倒计时动画
    */
    var CountDownAnime = (function (_super) {
        __extends(CountDownAnime, _super);
        function CountDownAnime() {
            var _this = _super.call(this) || this;
            _this.skinName = "resource/skins/countDown.exml";
            return _this;
        }
        /**
         * 播放动画组
         */
        CountDownAnime.prototype.childrenCreated = function () {
            this.test1.addEventListener('complete', this.onTweenGroupComplete, this);
            this.test1.addEventListener('itemComplete', this.onTweenItemComplete, this);
            this.test1.play();
        };
        /**
         * 动画组播放完成
         */
        CountDownAnime.prototype.onTweenGroupComplete = function () {
            // console.log('TweenGroup play completed.');  //所有动画播放完成
            this.test1.removeEventListener('complete', this.onTweenGroupComplete, this);
            this.test1.removeEventListener('itemComplete', this.onTweenItemComplete, this);
        };
        /**
         * 动画组中的一项播放完成
         */
        CountDownAnime.prototype.onTweenItemComplete = function (event) {
            var item = event.data;
            // console.log(item.target);    //先播放完成的组件，例如该组有2个Image动画，先播放完的触发该事件
            // console.log('TweenItem play completed.');
        };
        return CountDownAnime;
    }(eui.Component));
    bighead.CountDownAnime = CountDownAnime;
    __reflect(CountDownAnime.prototype, "bighead.CountDownAnime");
})(bighead || (bighead = {}));
//# sourceMappingURL=CountDownAnime.js.map