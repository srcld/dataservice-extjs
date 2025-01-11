Ext.define('dataservice.Wrapper', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dataserviceWrapper',

    requires: ['dataservice.Support'],

    layout: 'fit',

    moduleId: undefined,
    dataSrvConfig: {},

    widget: undefined,

    initComponent: function () {
        this.callParent(arguments);
        this.loadDsComponent();
    },

    loadDsComponent: function () {
        try {
            const config = dataservice.Support.getConfig(this.moduleId);
            this.dataSrvConfig = dataservice.Support.getApiConfig(config);
            dataservice.Support.loadScriptData(this.dataSrvConfig)
                .then(this.setupDataComponent.bind(this))
                .catch((e) => {
                    this.removeAll();
                    this.add(dataservice.Support.getErrorComponentConfig((e.message || e.msg || 'SITE LOAD ERROR') + ' PLEASE CHECK YOUR CONSOLE'));
                });
        } catch (e) {
            console.debug('Error loading dataservice component');
        }
    },

    setupDataComponent: function (success) { // TODO improve - true or text
        if (success !== true) throw new Error('Lib not loaded.');
        const cfg = this.getComponentConfig();
        if (this.widget) {
            cfg.header = false;
        }
        if (cfg) return this.add(cfg);
    },

    getComponentConfig: function () {
        const {feedId, clientId, proxyUrl} = this.dataSrvConfig || {};
        let feedConfig = this.getFeedConfig(feedId);
        // remove calls to this method - should be 1 instead of 3
        return feedConfig ? feedConfig.getComponent({
            clientId,
            proxyUrl,
            serviceConfig: dataservice.Support.getConfig(this.moduleId),
            siteConfig: dataservice.Support.siteConfig()
        }) : undefined;
    },

    getFeedConfig: function (feedId) {
        let [feedConfig] = ((window.srcld || {}).sources || []).filter((c) => {
            return c.feedId === feedId;
        });
        return feedConfig;
    }
});