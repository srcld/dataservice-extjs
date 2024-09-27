Ext.define('dataservice.Bpc', {
    singleton: true,

    getSetting: function (moduleId, settingName) {
        return BpcCommon.Api.getSetting(moduleId, settingName);
    }
});