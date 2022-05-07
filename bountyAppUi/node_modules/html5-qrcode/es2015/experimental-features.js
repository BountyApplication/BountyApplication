export class ExperimentalFeaturesConfigFactory {
    static createExperimentalFeaturesConfig(config) {
        if (!config) {
            return {
                useBarCodeDetectorIfSupported: false
            };
        }
        if (config.useBarCodeDetectorIfSupported !== true) {
            config.useBarCodeDetectorIfSupported = false;
        }
        return config;
    }
}
//# sourceMappingURL=experimental-features.js.map