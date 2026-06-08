const SuiteCloudJestConfiguration = require('@oracle/suitecloud-unit-testing/jest-configuration/SuiteCloudJestConfiguration');
const cliConfig = require('./suitecloud.config');

module.exports = SuiteCloudJestConfiguration.build({
  projectFolder: cliConfig.defaultProjectFolder,
  projectType: SuiteCloudJestConfiguration.ProjectType.ACP,
  root: [
    './src',
  ],
  customStubs: [
    {
      module: 'N/https/serverresponse',
      path: '<rootDir>/jestStubs/netsuite/https/ServerResponse.js',
    },
  ],
});
