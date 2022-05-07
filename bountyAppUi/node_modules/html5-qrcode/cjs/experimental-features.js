"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperimentalFeaturesConfigFactory = void 0;
var ExperimentalFeaturesConfigFactory = (function () {
    function ExperimentalFeaturesConfigFactory() {
    }
    ExperimentalFeaturesConfigFactory.createExperimentalFeaturesConfig = function (config) {
        if (!config) {
            return {
                useBarCodeDetectorIfSupported: false
            };
        }
        if (config.useBarCodeDetectorIfSupported !== true) {
            config.useBarCodeDetectorIfSupported = false;
        }
        return config;
    };
    return ExperimentalFeaturesConfigFactory;
}());
exports.ExperimentalFeaturesConfigFactory = ExperimentalFeaturesConfigFactory;
//# sourceMappingURL=experimental-features.js.map