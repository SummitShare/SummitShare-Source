"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.etherscanConfigExtender = void 0;
const chalk_1 = __importDefault(require("chalk"));
function etherscanConfigExtender(config, userConfig) {
    const defaultConfig = {
        apiKey: "",
        customChains: [],
    };
    if (userConfig.etherscan !== undefined) {
        const cloneDeep = require("lodash.clonedeep");
        const customConfig = cloneDeep(userConfig.etherscan);
        config.etherscan = { ...defaultConfig, ...customConfig };
    }
    else {
        config.etherscan = defaultConfig;
        // check that there is no etherscan entry in the networks object, since
        // this is a common mistake made by users
        if (config.networks?.etherscan !== undefined) {
            console.warn(chalk_1.default.yellow("WARNING: you have an 'etherscan' entry in your networks configuration. This is likely a mistake. The etherscan configuration should be at the root of the configuration, not within the networks object."));
        }
    }
}
exports.etherscanConfigExtender = etherscanConfigExtender;
//# sourceMappingURL=config.js.map