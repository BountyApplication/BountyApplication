export class CameraManager {
    static hasCameraPermissions() {
        return new Promise((resolve, _) => {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                devices.forEach((device) => {
                    if (device.kind === "videoinput" && device.label) {
                        resolve(true);
                    }
                });
                resolve(false);
            });
        });
    }
}
//# sourceMappingURL=camera.js.map