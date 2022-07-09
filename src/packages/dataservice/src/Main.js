Ext.define('dataservice.view.Main', {
    extend: 'Ext.panel.Panel',

    requires: ['dataservice.Support'],

    moduleId: undefined,
    layout: 'fit',

    dataSrvConfig: {},

    initComponent: function () {
        this.supportLib = dataservice.Support;

        this.wrapper = this.supportLib.panelWrapper();
        this.items = [this.wrapper];

        const validConfig = this.configValid();
        this.callParent(arguments);

        if (!validConfig) {
            this.wrapper.add(this.supportLib.getErrorComponentConfig('Sorry, something went wrong. Please check your config values'));
            return;
        }

        this.supportLib.loadScriptData(this.dataSrvConfig)
            .then(this.onLibLoaded.bind(this))
            .then(this.setupDataComponent.bind(this))
    },

    configValid: function () {
        let config = this.supportLib.getSetting(this.moduleId, 'clientConfiguration') || {};
        const {clientId = '', feedId = '', libId = '', serviceUrl = '', path = ''} = config;
        this.dataSrvConfig = {clientId, feedId, libId, serviceUrl, path};
        return [clientId, feedId, libId, serviceUrl, path].map((v) => v && v.length > 0).indexOf(false) === -1
    },

    onLibLoaded: function (libsLoaded) {
        if (!libsLoaded) {
            this.wrapper.add(this.supportLib.getErrorComponentConfig('Sorry, something went wrong. Please check your config'));
            return false;
        }
        return true;
    },

    setupDataComponent: function (success) {
        if (!success) {
            this.wrapper.removeAll();
            this.wrapper.add(this.supportLib.getErrorComponentConfig('Sorry, something went wrong. Please check your config'));
            return;
        }

        let components = (srcld || {}).sources || [];
        components = components.filter((c) => {
            return c.feedId === this.dataSrvConfig.feedId;
        });

        if (components.length) {
            const clientId = this.dataSrvConfig.clientId;
            let c = components[0].getComponent({clientId});
            this.wrapper.add(c);
        }
    }
});