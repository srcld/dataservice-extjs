// DOCS
// https://docs.virtimo.net/bpc-docs/latest/core/dev/module_frontend_interface.html#_beispiel

Ext.define("dataservice.BpcInterface", {
    extend: "BpcCommon.BpcInterface",

    requires: ['dataservice.widget.Main'],

    config: {
        moduleConfigurationComponents: [],
        moduleInstanceConfigurationComponents: [],
        defaultModuleInstanceConfigurationComponent: undefined,

        widgets: ['dataservice.widget.Main']
    }
});