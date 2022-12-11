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
        let {clientId, libId, serviceUrl, path} = config;
        return new Promise((resolve) => {
            if (window.srcld) {
                resolve(true);
                return;
            }
            const url = serviceUrl + path + '?' + this.objectToParams({clientId, id: libId});

            fetch(url).then((response) => {
                if (!response.ok) {
                    let {status} = response;
                    let errorMessage = status + ' - ';
                    return response.json().then((body) => {
                        let {message} = body || {};
                        errorMessage += (message || this.errorText);
                        return {
                            success: response.ok,
                            message: errorMessage
                        }
                    })
                }
                return response.blob().then((blob) => {
                    return {
                        success: response.ok,
                        data: blob
                    }
                });
            }).then((obj) => {
                if (obj.success) {
                    this.addBlobAsScript(obj.data).then(() => {
                        resolve(!!window.srcld);
                    });
                } else {
                    resolve(obj.message);
                }
            }).catch((e) => {
                resolve(false);
            })

        });
    },

    addBlobAsScript: function (blob) {
        let script = document.createElement("script");
        script.setAttribute("src", URL.createObjectURL(blob));
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
        return this.getSetting(moduleId, 'clientConfiguration') || {};
    },

    configValid: function (config) {
        const {clientId = '', feedId = '', libId = '', serviceUrl = '', path = ''} = config;
        return [clientId, feedId, libId, serviceUrl, path].map((v) => v && v.length > 0).indexOf(false) === -1
    },

    getApiConfig: function (config) {
        const {clientId = '', feedId = '', libId = '', serviceUrl = '', path = ''} = config;
        return {clientId, feedId, libId, serviceUrl, path};
    }
});