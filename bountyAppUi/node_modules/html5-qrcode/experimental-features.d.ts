export interface ExperimentalFeaturesConfig {
    useBarCodeDetectorIfSupported?: boolean | undefined;
}
export declare class ExperimentalFeaturesConfigFactory {
    static createExperimentalFeaturesConfig(config?: ExperimentalFeaturesConfig | undefined): ExperimentalFeaturesConfig;
}
