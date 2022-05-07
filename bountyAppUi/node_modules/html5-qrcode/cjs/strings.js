"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryInfoStrings = exports.Html5QrcodeScannerStrings = exports.Html5QrcodeStrings = void 0;
var Html5QrcodeStrings = (function () {
    function Html5QrcodeStrings() {
    }
    Html5QrcodeStrings.codeParseError = function (exception) {
        return "QR code parse error, error = " + exception;
    };
    Html5QrcodeStrings.errorGettingUserMedia = function (error) {
        return "Error getting userMedia, error = " + error;
    };
    Html5QrcodeStrings.onlyDeviceSupportedError = function () {
        return "The device doesn't support navigator.mediaDevices , only "
            + "supported cameraIdOrConfig in this case is deviceId parameter "
            + "(string).";
    };
    Html5QrcodeStrings.cameraStreamingNotSupported = function () {
        return "Camera streaming not supported by the browser.";
    };
    Html5QrcodeStrings.unableToQuerySupportedDevices = function () {
        return "Unable to query supported devices, unknown error.";
    };
    Html5QrcodeStrings.insecureContextCameraQueryError = function () {
        return "Camera access is only supported in secure context like https "
            + "or localhost.";
    };
    return Html5QrcodeStrings;
}());
exports.Html5QrcodeStrings = Html5QrcodeStrings;
var Html5QrcodeScannerStrings = (function () {
    function Html5QrcodeScannerStrings() {
    }
    Html5QrcodeScannerStrings.scanningStatus = function () {
        return "Scanning";
    };
    Html5QrcodeScannerStrings.idleStatus = function () {
        return "Idle";
    };
    Html5QrcodeScannerStrings.errorStatus = function () {
        return "Error";
    };
    Html5QrcodeScannerStrings.permissionStatus = function () {
        return "Permission";
    };
    Html5QrcodeScannerStrings.noCameraFoundErrorStatus = function () {
        return "No Cameras";
    };
    Html5QrcodeScannerStrings.lastMatch = function (decodedText) {
        return "Last Match: " + decodedText;
    };
    Html5QrcodeScannerStrings.codeScannerTitle = function () {
        return "Code Scanner";
    };
    Html5QrcodeScannerStrings.cameraPermissionTitle = function () {
        return "Request Camera Permissions";
    };
    Html5QrcodeScannerStrings.cameraPermissionRequesting = function () {
        return "Requesting camera permissions...";
    };
    Html5QrcodeScannerStrings.noCameraFound = function () {
        return "No camera found";
    };
    Html5QrcodeScannerStrings.scanButtonStopScanningText = function () {
        return "Stop Scanning";
    };
    Html5QrcodeScannerStrings.scanButtonStartScanningText = function () {
        return "Start Scanning";
    };
    Html5QrcodeScannerStrings.scanButtonScanningStarting = function () {
        return "Launching Camera...";
    };
    Html5QrcodeScannerStrings.textIfCameraScanSelected = function () {
        return "Scan an Image File";
    };
    Html5QrcodeScannerStrings.textIfFileScanSelected = function () {
        return "Scan using camera directly";
    };
    Html5QrcodeScannerStrings.selectCamera = function () {
        return "Select Camera";
    };
    return Html5QrcodeScannerStrings;
}());
exports.Html5QrcodeScannerStrings = Html5QrcodeScannerStrings;
var LibraryInfoStrings = (function () {
    function LibraryInfoStrings() {
    }
    LibraryInfoStrings.builtUsing = function () {
        return "Built using ";
    };
    LibraryInfoStrings.reportIssues = function () {
        return "Report issues";
    };
    return LibraryInfoStrings;
}());
exports.LibraryInfoStrings = LibraryInfoStrings;
//# sourceMappingURL=strings.js.map