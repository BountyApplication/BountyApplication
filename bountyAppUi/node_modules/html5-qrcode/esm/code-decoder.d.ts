import { QrcodeResult, Html5QrcodeSupportedFormats, Logger, QrcodeDecoderAsync } from "./core";
import { ExperimentalFeaturesConfig } from "./experimental-features";
export declare class Html5QrcodeShim implements QrcodeDecoderAsync {
    private verbose;
    private decoder;
    private readonly EXECUTIONS_TO_REPORT_PERFORMANCE;
    private executions;
    private executionResults;
    constructor(requestedFormats: Array<Html5QrcodeSupportedFormats>, verbose: boolean, logger: Logger, experimentalFeatureConfig: ExperimentalFeaturesConfig);
    decodeAsync(canvas: HTMLCanvasElement): Promise<QrcodeResult>;
    possiblyFlushPerformanceReport(): void;
}
