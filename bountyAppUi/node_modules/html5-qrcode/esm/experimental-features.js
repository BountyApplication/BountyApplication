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
export { ExperimentalFeaturesConfigFactory };
//# sourceMappingURL=experimental-features.js.map