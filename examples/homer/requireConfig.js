/*globals require*/
require.config({
    shim: {

    },
    paths: {
        'famous-map': '../..',
        famous: 'bower_components/famous',
        requirejs: 'bower_components/require'
    }
});
require(['example']);
