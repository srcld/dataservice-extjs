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
                .then(this.onLibLoaded.bind(this))
                .then(this.setupDataComponent.bind(this));
        } catch (e) {
            console.debug('Error loading dataservice component');
        }
    },

    onLibLoaded: function (libsLoaded) { // TODO improve - true or text
        if (libsLoaded !== true) {
            this.add(dataservice.Support.getErrorComponentConfig(libsLoaded));
            return libsLoaded;
        }
        return true;
    },

    setupDataComponent: function (success) { // TODO improve - true or text
        if (success !== true) {
            this.removeAll();
            this.add(dataservice.Support.getErrorComponentConfig(success));
            return;
        }

        const cfg = this.getComponentConfig();
        if (this.widget) {
            cfg.header = false;
        }
        if (cfg) return this.add(cfg);
    },

    getComponentConfig: function (widget = false) {
        const {feedId, clientId, proxyId, proxyUrl} = this.dataSrvConfig || {};

        let components = (window.srcld || {}).sources || [];
        components = components.filter((c) => {
            return c.feedId === feedId;
        });

        return components.length ? components[0].getComponent({clientId, proxyUrl}) : undefined;
    }
});