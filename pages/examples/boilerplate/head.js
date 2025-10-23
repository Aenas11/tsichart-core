window.addEventListener('DOMContentLoaded', function(){
    // Load only the essentials - TsiClient UMD now bundles all dependencies
    var promiseJs = document.createElement('script');
    promiseJs.src = 'https://cdn.jsdelivr.net/npm/bluebird@3.7.2/js/browser/bluebird.js';

    var sdkCss = document.createElement('link');
    sdkCss.rel = 'stylesheet';
    sdkCss.type = 'text/css';
    sdkCss.href = '/packages/core/dist/styles/index.css';

    var metaCharset = document.createElement('meta');
    metaCharset.charSet = 'utf-8';

    var metaHttp = document.createElement('meta');
    metaHttp['http-equiv'] = 'cache-control';
    metaHttp.content = 'no-cache';

    // Load TsiClient UMD module (now self-contained)
    var sdkJs = document.createElement('script');
    sdkJs.src = '/packages/core/dist/index.umd.js';
    sdkJs.onload = function() {
        // TsiClient should now be available globally
        window.dispatchEvent(new CustomEvent('tsiClientReady'));
    };
    sdkJs.onerror = function() {
        console.error('Failed to load TsiClient UMD module');
    };

    document.getElementsByTagName('head')[0].appendChild(promiseJs);
    document.getElementsByTagName('head')[0].appendChild(sdkCss);
    document.getElementsByTagName('head')[0].appendChild(metaCharset);
    document.getElementsByTagName('head')[0].appendChild(metaHttp);
    document.getElementsByTagName('head')[0].appendChild(sdkJs);
});