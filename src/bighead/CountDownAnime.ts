module bighead
{
     /**
     * 倒计时动画
     */
    export class CountDownAnime extends eui.Component 
    {
        private test1:egret.tween.TweenGroup;

        public constructor() {
            super();
            this.skinName = "resource/skins/countDown.exml";
        }
    
        /**
         * 播放动画组
         */
        public childrenCreated(){
            this.test1.addEventListener('complete', this.onTweenGroupComplete, this);
            this.test1.addEventListener('itemComplete', this.onTweenItemComplete, this);
            this.test1.play();
        }
    
        /**
         * 动画组播放完成
         */
        private onTweenGroupComplete(): void {
            // console.log('TweenGroup play completed.');  //所有动画播放完成
            this.test1.removeEventListener('complete', this.onTweenGroupComplete, this);
            this.test1.removeEventListener('itemComplete', this.onTweenItemComplete, this);
        }
        /**
         * 动画组中的一项播放完成
         */
        private onTweenItemComplete(event: egret.Event): void {
            const item = event.data as egret.tween.TweenItem;
            // console.log(item.target);    //先播放完成的组件，例如该组有2个Image动画，先播放完的触发该事件
            // console.log('TweenItem play completed.');
        }

    }
}