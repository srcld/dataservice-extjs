Ext.define('dataservice.plugin.button.ButtonPlugin', {
    extend: 'Ext.button.Button',
    alias: 'widget.srcldDynamicButton',

    layout: 'fit',

    initComponent: function () {
        this.iconCls = 'x-fal fa-fire';
        this.tooltip = 'dynamic content'

        const menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: []
        });

        this.menu = menu;

        this.callParent(arguments);
        this.handleModuleChange();

        Ext.on('bpcActiveModuleChanged', () => {
            this.handleModuleChange();
        });
    },

    handleModuleChange: function () {
        let {instanceId, moduleId} = BpcCommon.Api.getActiveModuleMeta();

        let {pluginConfiguration} = this;
        let {configuration} = pluginConfiguration || {};
        let {moduleMap} = configuration || {};

        const map = moduleMap || {};
        if (map[moduleId]) {
            this.menu.removeAll();
            let k = 'Dokumentation';
            this.setText(k);
            k = k + ' ' + moduleId;
            this.setTooltip(k)
            let data = map[moduleId].links || [];
            data.map((o) => {
                this.menu.add({
                    text: o.name,
                    url: o.url,
                    iconCls: 'x-fal fa-browser',
                    handler: function (){
                        Ext.create({
                            tabGuard: false,
                            xtype: 'window',
                            title: 'Documentation',
                            height: document.body.clientHeight * 0.5,
                            width: document.body.clientWidth * 0.8,
                            layout: 'fit',
                            items: [{
                                xtype: 'container',
                                html: '<iframe src="' + this.url + '" width="100%" height="100%"></iframe>'
                            }]
                        }).show()
                    }
                })
            });
            this.show();
            return;
        }
        this.hide();
    }
});