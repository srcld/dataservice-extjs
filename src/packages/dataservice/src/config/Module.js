Ext.define('dataservice.config.Module', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dataserviceConfig',

    moduleId: undefined,
    layout: 'fit',

    initComponent: function () {

        this.title = 'Data Service Configurator';
        this.iconCls = 'x-fal fa-cog';

        this.items = [{
            xtype: 'container', html: 'test config cmp'
        }];

        this.callParent(arguments);
    }
});