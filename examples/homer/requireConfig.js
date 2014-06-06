/*globals require*/
require.config({
    shim: {

    },
    paths: {
        'famous-map': '../..',
        famous: '../lib/famous',
        requirejs: '../lib/requirejs/require',
        almond: '../lib/almond/almond',
        'famous-polyfills': '../lib/polyfills/index'
    }
});
require(['example']);
