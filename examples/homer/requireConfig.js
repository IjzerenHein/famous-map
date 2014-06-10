/*globals require*/
require.config({
    shim: {

    },
    paths: {
        'famous-map': '../..',
        famous: '../../bower_components/famous',
        require: '../../bower_components/requirejs'
    }
});
require(['example']);
