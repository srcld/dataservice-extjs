Ext.define('dataservice.Support', {
    singleton: true,

    getErrorComponentConfig: function (text) {
        return {
            xtype: 'container',
            html: text
        }
    },

    getSetting: function (moduleId, settingName) {
        return BpcCommon.Api.getSetting(moduleId, settingName);
    },

    objectToParams: function (obj = {}) {
        let params = new URLSearchParams();
        Object.keys(obj).map((key) => {
            params.append(key, obj[key]);
        })
        return params.toString();
    },

    loadScriptData: function (config) {
        let {clientId, libId, serviceUrl, path} = config;
        return new Promise((resolve) => {
            if (window.srcld) {
                resolve(true);
                return;
            }
            Ext.Loader.loadScript({
                url: serviceUrl + path + '?' + this.objectToParams({clientId, id: libId}),
                onLoad: function () {
                    resolve(!!window.srcld);
                },
                onError: function (error) {
                    resolve(false);
                }
            });
        });
    },

    panelWrapper: function () {
        return Ext.create({
            xtype: 'panel',
            layout: 'fit'
        });
    }

});