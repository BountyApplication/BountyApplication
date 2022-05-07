import { ZXingHtml5QrcodeDecoder } from "./zxing-html5-qrcode-decoder";
import { BarcodeDetectorDelegate } from "./native-bar-code-detector";
var Html5QrcodeShim = (function () {
    function Html5QrcodeShim(requestedFormats, verbose, logger, experimentalFeatureConfig) {
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
    Html5QrcodeShim.prototype.decodeAsync = function (canvas) {
        var _this = this;
        var start = performance.now();
        return this.decoder.decodeAsync(canvas).finally(function () {
            if (_this.verbose) {
                var executionTime = performance.now() - start;
                _this.executionResults.push(executionTime);
                _this.executions++;
                _this.possiblyFlushPerformanceReport();
            }
        });
    };
    Html5QrcodeShim.prototype.possiblyFlushPerformanceReport = function () {
        if (this.executions < this.EXECUTIONS_TO_REPORT_PERFORMANCE) {
            return;
        }
        var sum = 0;
        for (var _i = 0, _a = this.executionResults; _i < _a.length; _i++) {
            var executionTime = _a[_i];
            sum += executionTime;
        }
        var mean = sum / this.executionResults.length;
        console.log(mean + " ms for " + this.executionResults.length + " last runs.");
        this.executions = 0;
        this.executionResults = [];
    };
    return Html5QrcodeShim;
}());
export { Html5QrcodeShim };
//# sourceMappingURL=code-decoder.js.map