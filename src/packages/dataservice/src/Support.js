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

    objectToParams: function (obj = {}) {
        let params = new URLSearchParams();
        Object.keys(obj).map((key) => {
            params.append(key, obj[key]);
        })
        return params.toString();
    },

    libLoadError: false,
    loading: false,
    loaded: false,
    loadPromise: undefined,

    loadScriptData: function (config) {
        if (this.loaded) {
            console.debug('library found, stopping here')
            return Promise.resolve(true);
        }

        if (this.loading) return this.loadPromise;
        this.loading = true;

        let {clientId, libId, serviceUrl, path, proxyId, proxyUrl} = config;
        // from 4.1 - default csp does not allow to load js from another site
        // if defined, lets use proxy
        if (proxyId) serviceUrl = proxyUrl;
        let url = serviceUrl + path + '/' + libId + '-ext.js?' + this.objectToParams({clientId});

        // TODO rfc
        let p = this.addScriptToHead(url)
            .then((success) => {
                if (success !== true) {
                    this.libLoadError = true;
                    throw new Error('Could not load: ' + url);
                }
                if (window.srcld) {
                    this.loaded = true;
                    this.loading = false;
                }
                return !!window.srcld
            });
        this.loadPromise = p;
        return p;
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
            script.addEventListener('error', (e) => {
                resolve(e);
            })
        })
    },

    getConfig: function (moduleId) {
        const libBpc = dataservice.Bpc;
        const config = libBpc.getSetting(moduleId, 'clientConfiguration') || {};
        const serviceUrl = libBpc.getSetting('dataservice', 'serviceUrl') || '';
        const clientId = libBpc.getSetting('dataservice', 'clientId') || '';
        const proxyId = libBpc.getSetting('dataservice', 'proxyId') || '';
        if (serviceUrl.length) config.serviceUrl = serviceUrl;
        if (clientId.length) config.clientId = clientId;
        if (proxyId.length) config.proxyId = proxyId;
        console.debug('config used: ', config);
        return config;
    },

    siteConfig: function () {
        const libBpc = dataservice.Bpc;
        const {client} = libBpc.getSetting('dataservice', 'config') || {};
        return client;
    },

    configValid: function (config) {
        const {clientId = '', feedId = '', libId = '', serviceUrl = '', path = ''} = config;
        return [clientId, feedId, libId, serviceUrl, path].map((v) => v && v.length > 0).indexOf(false) === -1
    },

    // TODO rfc
    getApiConfig: function (config) {
        const {clientId = '', feedId = '', libId = '', serviceUrl = '', path = '', proxyId} = config;
        return {clientId, feedId, libId, serviceUrl, path, proxyId, proxyUrl: BpcCommon.Api.getBackendUrl(proxyId)};
    },

    getServiceWrapperComponent: function (moduleId) {
        const config = dataservice.Support.getConfig(moduleId);
        let validConfig = dataservice.Support.configValid(config);

        return validConfig ? {
            xtype: 'dataserviceWrapper', moduleId
        } : dataservice.Support.getErrorComponentConfig()
    }
});