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

    onLibLoaded: function (libsLoaded) { // TODO improve - true or text
        if (libsLoaded !== true) {
            this.add(this.supportLib.getErrorComponentConfig(libsLoaded));
            return libsLoaded;
        }
        return true;
    },

    setupDataComponent: function (success) { // TODO improve - true or text
        if (success !== true) {
            this.removeAll();
            this.add(this.supportLib.getErrorComponentConfig(success));
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