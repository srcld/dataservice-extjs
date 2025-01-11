Ext.define('dataservice.view.Main', {
    extend: 'Ext.panel.Panel',

    requires: ['dataservice.Wrapper', 'dataservice.Support', 'dataservice.BpcInterface'],

    moduleId: undefined,
    layout: 'fit',

    dataSrvConfig: {},
    validConfig: undefined,

    initComponent: function () {
        this.callParent(arguments);
        this.add(dataservice.Support.getServiceWrapperComponent(this.moduleId))
    }
});