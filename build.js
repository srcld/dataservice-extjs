const moduleSettings = require('./settings/module/moduleSettings'),
    instanceSettings = require('./settings/instance/instanceSettings'),
    config = require('./settings/instance/config'),
    configModule = require('./settings/module/configModule'),
    sdk = require('@srcld/bpc-sdk-unofficial'),
    packageJson = require('./package.json');

const {name, applicationName, bpcVersion = '', bpcPropertiesFile = ''} = packageJson.bpcCompat;

const settings = {
    instance: {module: instanceSettings, config},
    module: {module: moduleSettings, config: configModule},
}

sdk.buildPackage(name, applicationName, settings, bpcVersion)
    .then(() => {
        console.log('Yo.')
    })