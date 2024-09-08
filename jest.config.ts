import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    reporters: [
        'default',
        ["jest-html-reporters", {
            "publicPath": "./html-report",
            "filename": "report.html",
            "openReport": true,
            "expand": true,
            "pageTitle": "Api Test Report",
        }]
    ],
    setupFilesAfterEnv: ['jest-extended/all'],
};

export default config;
