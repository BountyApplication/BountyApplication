import { ZXingHtml5QrcodeDecoder } from "./zxing-html5-qrcode-decoder";
import { BarcodeDetectorDelegate } from "./native-bar-code-detector";
export class Html5QrcodeShim {
    constructor(requestedFormats, verbose, logger, experimentalFeatureConfig) {
        this.EXECUTIONS_TO_REPORT_PERFORMANCE = 100;
        this.executions = 0;
        this.executionResults = [];
        this.verbose = verbose;
        if (experimentalFeatureConfig.useBarCodeDetectorIfSupported === true
            && BarcodeDetectorDelegate.isSupported()) {
            this.decoder = new BarcodeDetectorDelegate(requestedFormats, verbose, logger);
        }
        else {
            this.decoder = new ZXingHtml5QrcodeDecoder(requestedFormats, verbose, logger);
        }
    }
    decodeAsync(canvas) {
        let start = performance.now();
        return this.decoder.decodeAsync(canvas).finally(() => {
            if (this.verbose) {
                let executionTime = performance.now() - start;
                this.executionResults.push(executionTime);
                this.executions++;
                this.possiblyFlushPerformanceReport();
            }
        });
    }
    possiblyFlushPerformanceReport() {
        if (this.executions < this.EXECUTIONS_TO_REPORT_PERFORMANCE) {
            return;
        }
        let sum = 0;
        for (let executionTime of this.executionResults) {
            sum += executionTime;
        }
        let mean = sum / this.executionResults.length;
        console.log(`${mean} ms for ${this.executionResults.length} last runs.`);
        this.executions = 0;
        this.executionResults = [];
    }
}
//# sourceMappingURL=code-decoder.js.map