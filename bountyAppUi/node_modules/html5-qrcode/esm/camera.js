var CameraManager = (function () {
    function CameraManager() {
    }
    CameraManager.hasCameraPermissions = function () {
        return new Promise(function (resolve, _) {
            navigator.mediaDevices.enumerateDevices().then(function (devices) {
                devices.forEach(function (device) {
                    if (device.kind === "videoinput" && device.label) {
                        resolve(true);
                    }
                });
                resolve(false);
            });
        });
    };
    return CameraManager;
}());
export { CameraManager };
//# sourceMappingURL=camera.js.map