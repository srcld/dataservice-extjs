Ext.define('dataservice.view.Main', {
    extend: 'Ext.panel.Panel',

    requires: ['dataservice.Wrapper', 'dataservice.Support', 'dataservice.BpcInterface'],

    moduleId: undefined,
    layout: 'fit',

    dataSrvConfig: {},
    validConfig: undefined,

    initComponent: function () {
        this.callParent(arguments);
        this.prepareDataService();
        this.launchDataService();
    },

    prepareDataService: function () {
        const config = dataservice.Support.getConfig(this.moduleId);
        this.validConfig = dataservice.Support.configValid(config);
    },

    launchDataService: function () {
        this.add(this.validConfig ? {
            xtype: 'dataserviceWrapper',
            moduleId: this.moduleId
        } : dataservice.Support.getErrorComponentConfig())
    }
});