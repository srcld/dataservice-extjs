Ext.define('dataservice.Support', {
    singleton: true,

    errorText: 'Sorry, something went wrong. Please check your config values.',

    getErrorComponentConfig: function (text) {
        text = text || this.errorText || '';
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
        let {clientId, libId, serviceUrl, path, proxyId, proxyUrl} = config;
        // return new Promise((resolve) => {
        if (window.srcld) {
            console.debug('library found, stopping here')
            return Promise.resolve(true);
        }
        // from 4.1 - default csp does not allow to load js from another site
        // if defined, lets use proxy
        if (proxyId) serviceUrl = proxyUrl;
        let url = serviceUrl + path + '?' + this.objectToParams({clientId, id: libId});

        // TODO rfc
        return this.addScriptToHead(url)
            .then(() => {
                console.debug('library not found, adding lib..')
                return !!window.srcld
            });

        //
        // fetch(url)
        //     .then((response) => {
        //         if (!response.ok) {
        //             let {status} = response;
        //             let errorMessage = status + ' - ';
        //             return response.json().then((body) => {
        //                 let {message} = body || {};
        //                 errorMessage += (message || this.errorText);
        //                 return {
        //                     success: response.ok,
        //                     message: errorMessage
        //                 }
        //             })
        //         }
        //         if (asBlob) {
        //             return response.blob().then((blob) => {
        //                 return {
        //                     success: response.ok,
        //                     data: blob
        //                 }
        //             });
        //         }
        //         return response.text().then((text) => {
        //             return {
        //                 success: response.ok,
        //                 data: text
        //             }
        //         });
        //     }).then((obj) => {
        //         if (obj.success) {
        //
        //         }
        //         return obj.message;
        //     }).catch((e) => {
        //         return false;
        //     })

        // });
    },

    addScriptToHead: function (url) {
        let script = document.createElement("script");
        script.setAttribute("src", url);
        script.setAttribute("type", "text/javascript");
        script.async = false;
        return new Promise((resolve) => {
            document.head.appendChild(script);
            script.addEventListener('load', () => {
                resolve(true);
            })
        })
    },

    panelWrapper: function () {
        return Ext.create({
            xtype: 'panel',
            layout: 'fit'
        });
    },

    getConfig: function (moduleId) {
        const config = this.getSetting(moduleId, 'clientConfiguration') || {};
        const serviceUrl = this.getSetting('dataservice', 'serviceUrl') || '';
        const clientId = this.getSetting('dataservice', 'clientId') || '';
        const proxyId = this.getSetting('dataservice', 'proxyId') || '';
        if (serviceUrl.length) config.serviceUrl = serviceUrl;
        if (clientId.length) config.clientId = clientId;
        if (proxyId.length) config.proxyId = proxyId;
        return config;
    },

    configValid: function (config) {
        const {clientId = '', feedId = '', libId = '', serviceUrl = '', path = ''} = config;
        return [clientId, feedId, libId, serviceUrl, path].map((v) => v && v.length > 0).indexOf(false) === -1
    },

    // TODO rfc
    getApiConfig: function (config) {
        const {clientId = '', feedId = '', libId = '', serviceUrl = '', path = '', proxyId} = config;
        return {clientId, feedId, libId, serviceUrl, path, proxyId, proxyUrl: BpcCommon.Api.getBackendUrl(proxyId)};
    }
});