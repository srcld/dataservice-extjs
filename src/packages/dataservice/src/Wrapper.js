Ext.define('dataservice.Wrapper', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dataserviceWrapper',

    requires: ['dataservice.Support'],


    layout: 'fit',

    moduleId: undefined,
    dataSrvConfig: {},

    widget: undefined,

    initComponent: function () {
        const supportLib = dataservice.Support;
        this.supportLib = supportLib;
        this.callParent(arguments);

        const config = supportLib.getConfig(this.moduleId);
        this.dataSrvConfig = supportLib.getApiConfig(config);
        supportLib.loadScriptData(this.dataSrvConfig)
            .then(this.onLibLoaded.bind(this))
            .then(this.setupDataComponent.bind(this))
    },

    onLibLoaded: function (libsLoaded) {
        if (!libsLoaded) {
            this.add(this.supportLib.getErrorComponentConfig());
            return false;
        }
        return true;
    },

    setupDataComponent: function (success) {
        if (!success) {
            this.removeAll();
            this.add(this.supportLib.getErrorComponentConfig());
            return;
        }

        const cfg = this.getComponentConfig();
        if (cfg) this.add(cfg);
    },

    getComponentConfig: function () {
        const {feedId, clientId} = this.dataSrvConfig || {};

        let components = (window.srcld || {}).sources || [];
        components = components.filter((c) => {
            return c.feedId === feedId;
        });

        return components.length ? components[0].getComponent({clientId}) : undefined;
    }
});