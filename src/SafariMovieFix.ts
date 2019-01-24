/*:
 * deprecated
 *
 * @plugindesc Safariで「サウンド付きメディアは再生しない」設定の場合に、動画を無音で再生するプラグイン
 * @author RPGアツマール開発チーム
 *
 * @help プラグインを有効にするだけで動画再生の修正を行います。
 */

Graphics._onVideoLoad = function () {
    // まず音声有りでの再生を試みる
    this._video.muted = false;

    // 古いブラウザではvideo.play()がPromiseを返さないため、Promiseでラップしてからcatchする
    Promise.resolve()
        .then(() => this._video.play())
        .catch(e => {
            // 失敗し、NotAllowedErrorだった場合、音声無しでの再生を試みる
            if (e.name === "NotAllowedError") {
                this._video.muted = true;
                return Promise.resolve()
                    .then(() => this._video.play());
            }
            return Promise.reject(e);
        })
        .catch(() => {
            // それでも失敗した場合、ゲームを再開させる
            this._updateVisibility(false);
            this._videoLoading = false;
        });

    this._updateVisibility(true);
    this._videoLoading = false;
};
