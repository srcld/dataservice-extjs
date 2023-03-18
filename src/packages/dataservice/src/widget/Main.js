// DOCS
// https://docs.virtimo.net/bpc-docs/latest/core/dev/module_frontend_interface.html#_widgets
//
// Good existing examples are inside the monitor module
//

Ext.define("dataservice.widget.Main", {
    extend: "Ext.panel.Panel",
    alias: 'widget.dataserviceWidget',

    mixins: ["BpcCommon.mixin.Widget"], // VERY IMPORTANT.

    statics: {
        WIDGET_NAME: "Data services widget",
        WIDGET_DESCRIPTION: "Compact view",
        WIDGET_ICON_CLS: "x-fal fa-fire",
    },

    widgetConfigSettingMap: {
        moduleId: {settingType: "moduleInstance"}
    },

    config: {
        widgetConfiguration: {
            moduleId: undefined
        }
    },

    layout: 'card',

    moduleId: undefined,
    widgetId: undefined,

    initComponent: function () {
        try {
            this.initWidgetSettings();
        } catch (e) {
            // TODO errorPanel
        }
        this.lib = dataservice.Support;
        this.callParent(arguments);
        this.initWidget();
        this.settingPanel = this.add({
            xtype: "bpcSettingPanel",
            settings: this.settingStore,
            buttons: [
                {
                    text: 'OK',
                    handler: this.configureWidget.bind(this)
                }
            ]
        });
    },

    initWidget: function () {
        if (!this.moduleId) {
            this.wrapper = this.add({
                xtype: 'container',
                html: 'CONFIG_ERROR_NO_MODULEID_DEFINED',
                load: Ext.emptyFn()
            })
            return;
        }

        this.wrapper = this.add({
            xtype: 'container',
            layout: 'fit',
            item: [],
            load: Ext.emptyFn()
        })

        const config = this.lib.getConfig(this.moduleId);
        const validConfig = this.lib.configValid(config);
        if (validConfig) this.onConfiguredSuccess();
        else this.onConfiguredError()
    },

    onConfiguredSuccess: function () {
        this.serviceCmp = this.wrapper.add({
            xtype: 'dataserviceWrapper',
            widget: this,
            moduleId: this.moduleId
        })
    },

    onConfiguredError: function () {
        this.wrapper.add(this.lib.getErrorComponentConfig());
    },

    serviceCmp: undefined,

    refreshWidget: function () {
        this.wrapper.load();
        if (this.serviceCmp) this.serviceCmp.load();
    },

    changeWidgetTitle: function (title = '', iconCls = '') {
        // unsure if code changes, catch errors
        try {
            const w = this.up('dbWidgetWrapper');
            iconCls = iconCls || '';
            title = title || '';
            if (w && title.length) w.setTitle(title);
            if (w && iconCls.length) w.setIconCls(iconCls);
        } catch (e) {
            //
        }
    },

    configureWidget: function () {
        this.getLayout().setActiveItem(this.settingPanel.isVisible(true) ? this.wrapper : this.settingPanel);
    }
});