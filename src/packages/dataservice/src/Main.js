Ext.define('dataservice.view.Main', {
    extend: 'Ext.panel.Panel',

    requires: ['dataservice.Wrapper', 'dataservice.Support', 'dataservice.BpcInterface'],

    moduleId: undefined,
    layout: 'fit',

    dataSrvConfig: {},

    initComponent: function () {
        this.callParent(arguments);

        const config = dataservice.Support.getConfig(this.moduleId);
        const validConfig = dataservice.Support.configValid(config);

        this.add(validConfig ? {
            xtype: 'dataserviceWrapper',
            moduleId: this.moduleId
        } : dataservice.Support.getErrorComponentConfig())
    }
});