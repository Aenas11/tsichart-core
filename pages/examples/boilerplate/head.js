window.addEventListener('DOMContentLoaded', function(){
    var sdkJs = document.createElement('script');
    // sdkJs.src = 'https://unpkg.com/tsiclient@1.3.0/tsiclient.js';
    sdkJs.src = '../../../dist/tsiclient.js';  // UMD build for browser usage

    var promiseJs = document.createElement('script');
    promiseJs.src = 'https://cdn.jsdelivr.net/npm/bluebird@3.7.2/js/browser/bluebird.js';

    var sdkCss = document.createElement('link');
    sdkCss.rel = 'stylesheet';
    sdkCss.type = 'text/css';
    // sdkCss.href = 'https://unpkg.com/tsiclient@1.3.0/tsiclient.css';
    sdkCss.href = '../../../dist/tsiclient.css';  // CSS file

    var metaCharset = document.createElement('meta');
    metaCharset.charSet = 'utf-8';

    var metaHttp = document.createElement('meta');
    metaHttp['http-equiv'] = 'cache-control';
    metaHttp.content = 'no-cache';

    document.getElementsByTagName('head')[0].appendChild(sdkJs);
    document.getElementsByTagName('head')[0].appendChild(promiseJs);
    document.getElementsByTagName('head')[0].appendChild(sdkCss);
    document.getElementsByTagName('head')[0].appendChild(metaCharset);
    document.getElementsByTagName('head')[0].appendChild(metaHttp);


});