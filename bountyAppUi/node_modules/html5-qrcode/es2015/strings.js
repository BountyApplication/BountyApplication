export class Html5QrcodeStrings {
    static codeParseError(exception) {
        return `QR code parse error, error = ${exception}`;
    }
    static errorGettingUserMedia(error) {
        return `Error getting userMedia, error = ${error}`;
    }
    static onlyDeviceSupportedError() {
        return "The device doesn't support navigator.mediaDevices , only "
            + "supported cameraIdOrConfig in this case is deviceId parameter "
            + "(string).";
    }
    static cameraStreamingNotSupported() {
        return "Camera streaming not supported by the browser.";
    }
    static unableToQuerySupportedDevices() {
        return "Unable to query supported devices, unknown error.";
    }
    static insecureContextCameraQueryError() {
        return "Camera access is only supported in secure context like https "
            + "or localhost.";
    }
}
export class Html5QrcodeScannerStrings {
    static scanningStatus() {
        return "Scanning";
    }
    static idleStatus() {
        return "Idle";
    }
    static errorStatus() {
        return "Error";
    }
    static permissionStatus() {
        return "Permission";
    }
    static noCameraFoundErrorStatus() {
        return "No Cameras";
    }
    static lastMatch(decodedText) {
        return `Last Match: ${decodedText}`;
    }
    static codeScannerTitle() {
        return "Code Scanner";
    }
    static cameraPermissionTitle() {
        return "Request Camera Permissions";
    }
    static cameraPermissionRequesting() {
        return "Requesting camera permissions...";
    }
    static noCameraFound() {
        return "No camera found";
    }
    static scanButtonStopScanningText() {
        return "Stop Scanning";
    }
    static scanButtonStartScanningText() {
        return "Start Scanning";
    }
    static scanButtonScanningStarting() {
        return "Launching Camera...";
    }
    static textIfCameraScanSelected() {
        return "Scan an Image File";
    }
    static textIfFileScanSelected() {
        return "Scan using camera directly";
    }
    static selectCamera() {
        return "Select Camera";
    }
}
export class LibraryInfoStrings {
    static builtUsing() {
        return "Built using ";
    }
    static reportIssues() {
        return "Report issues";
    }
}
//# sourceMappingURL=strings.js.map