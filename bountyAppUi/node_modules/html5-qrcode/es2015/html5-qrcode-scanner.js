import { Html5QrcodeConstants, Html5QrcodeScanType, Html5QrcodeErrorFactory, BaseLoggger, isNullOrUndefined, } from "./core";
import { Html5Qrcode, } from "./html5-qrcode";
import { Html5QrcodeScannerStrings, } from "./strings";
import { ASSET_FILE_SCAN, ASSET_CAMERA_SCAN, } from "./image-assets";
import { PersistedDataManager } from "./storage";
import { LibraryInfoContainer } from "./ui";
import { CameraManager } from "./camera";
import { ScanTypeSelector } from "./ui/scanner/scan-type-selector";
var Html5QrcodeScannerStatus;
(function (Html5QrcodeScannerStatus) {
    Html5QrcodeScannerStatus[Html5QrcodeScannerStatus["STATUS_DEFAULT"] = 0] = "STATUS_DEFAULT";
    Html5QrcodeScannerStatus[Html5QrcodeScannerStatus["STATUS_SUCCESS"] = 1] = "STATUS_SUCCESS";
    Html5QrcodeScannerStatus[Html5QrcodeScannerStatus["STATUS_WARNING"] = 2] = "STATUS_WARNING";
    Html5QrcodeScannerStatus[Html5QrcodeScannerStatus["STATUS_REQUESTING_PERMISSION"] = 3] = "STATUS_REQUESTING_PERMISSION";
})(Html5QrcodeScannerStatus || (Html5QrcodeScannerStatus = {}));
function toHtml5QrcodeCameraScanConfig(config) {
    return {
        fps: config.fps,
        qrbox: config.qrbox,
        aspectRatio: config.aspectRatio,
        disableFlip: config.disableFlip,
        videoConstraints: config.videoConstraints
    };
}
function toHtml5QrcodeFullConfig(config, verbose) {
    return {
        formatsToSupport: config.formatsToSupport,
        experimentalFeatures: config.experimentalFeatures,
        verbose: verbose
    };
}
export class Html5QrcodeScanner {
    constructor(elementId, config, verbose) {
        this.lastMatchFound = null;
        this.cameraScanImage = null;
        this.fileScanImage = null;
        this.elementId = elementId;
        this.config = this.createConfig(config);
        this.verbose = verbose === true;
        if (!document.getElementById(elementId)) {
            throw `HTML Element with id=${elementId} not found`;
        }
        this.scanTypeSelector = new ScanTypeSelector(this.config.supportedScanTypes);
        this.currentScanType = this.scanTypeSelector.getDefaultScanType();
        this.sectionSwapAllowed = true;
        this.logger = new BaseLoggger(this.verbose);
        this.persistedDataManager = new PersistedDataManager();
        if (config.rememberLastUsedCamera !== true) {
            this.persistedDataManager.reset();
        }
    }
    render(qrCodeSuccessCallback, qrCodeErrorCallback) {
        this.lastMatchFound = null;
        this.qrCodeSuccessCallback
            = (decodedText, result) => {
                if (qrCodeSuccessCallback) {
                    qrCodeSuccessCallback(decodedText, result);
                }
                else {
                    if (this.lastMatchFound === decodedText) {
                        return;
                    }
                    this.lastMatchFound = decodedText;
                    this.setHeaderMessage(Html5QrcodeScannerStrings.lastMatch(decodedText), Html5QrcodeScannerStatus.STATUS_SUCCESS);
                }
            };
        this.qrCodeErrorCallback =
            (errorMessage, error) => {
                if (qrCodeErrorCallback) {
                    qrCodeErrorCallback(errorMessage, error);
                }
            };
        const container = document.getElementById(this.elementId);
        if (!container) {
            throw `HTML Element with id=${this.elementId} not found`;
        }
        container.innerHTML = "";
        this.createBasicLayout(container);
        this.html5Qrcode = new Html5Qrcode(this.getScanRegionId(), toHtml5QrcodeFullConfig(this.config, this.verbose));
    }
    pause(shouldPauseVideo) {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        if (isNullOrUndefined(shouldPauseVideo) || shouldPauseVideo !== true) {
            shouldPauseVideo = false;
        }
        this.html5Qrcode.pause(shouldPauseVideo);
    }
    resume() {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        this.html5Qrcode.resume();
    }
    getState() {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        return this.html5Qrcode.getState();
    }
    clear() {
        const emptyHtmlContainer = () => {
            const mainContainer = document.getElementById(this.elementId);
            if (mainContainer) {
                mainContainer.innerHTML = "";
                this.resetBasicLayout(mainContainer);
            }
        };
        if (this.html5Qrcode) {
            return new Promise((resolve, reject) => {
                if (!this.html5Qrcode) {
                    resolve();
                    return;
                }
                if (this.html5Qrcode.isScanning) {
                    this.html5Qrcode.stop().then((_) => {
                        if (!this.html5Qrcode) {
                            resolve();
                            return;
                        }
                        this.html5Qrcode.clear();
                        emptyHtmlContainer();
                        resolve();
                    }).catch((error) => {
                        if (this.verbose) {
                            this.logger.logError("Unable to stop qrcode scanner", error);
                        }
                        reject(error);
                    });
                }
                else {
                    this.html5Qrcode.clear();
                    emptyHtmlContainer();
                }
            });
        }
        return Promise.resolve();
    }
    getRunningTrackCapabilities() {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        return this.html5Qrcode.getRunningTrackCapabilities();
    }
    applyVideoConstraints(videoConstaints) {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        return this.html5Qrcode.applyVideoConstraints(videoConstaints);
    }
    createConfig(config) {
        if (config) {
            if (!config.fps) {
                config.fps = Html5QrcodeConstants.SCAN_DEFAULT_FPS;
            }
            if (config.rememberLastUsedCamera !== (!Html5QrcodeConstants.DEFAULT_REMEMBER_LAST_CAMERA_USED)) {
                config.rememberLastUsedCamera
                    = Html5QrcodeConstants.DEFAULT_REMEMBER_LAST_CAMERA_USED;
            }
            return config;
        }
        return {
            fps: Html5QrcodeConstants.SCAN_DEFAULT_FPS,
            rememberLastUsedCamera: Html5QrcodeConstants.DEFAULT_REMEMBER_LAST_CAMERA_USED,
            supportedScanTypes: Html5QrcodeConstants.DEFAULT_SUPPORTED_SCAN_TYPE
        };
    }
    createBasicLayout(parent) {
        parent.style.position = "relative";
        parent.style.padding = "0px";
        parent.style.border = "1px solid silver";
        this.createHeader(parent);
        const qrCodeScanRegion = document.createElement("div");
        const scanRegionId = this.getScanRegionId();
        qrCodeScanRegion.id = scanRegionId;
        qrCodeScanRegion.style.width = "100%";
        qrCodeScanRegion.style.minHeight = "100px";
        qrCodeScanRegion.style.textAlign = "center";
        parent.appendChild(qrCodeScanRegion);
        if (ScanTypeSelector.isCameraScanType(this.currentScanType)) {
            this.insertCameraScanImageToScanRegion();
        }
        else {
            this.insertFileScanImageToScanRegion();
        }
        const qrCodeDashboard = document.createElement("div");
        const dashboardId = this.getDashboardId();
        qrCodeDashboard.id = dashboardId;
        qrCodeDashboard.style.width = "100%";
        parent.appendChild(qrCodeDashboard);
        this.setupInitialDashboard(qrCodeDashboard);
    }
    resetBasicLayout(mainContainer) {
        mainContainer.style.border = "none";
    }
    setupInitialDashboard(dashboard) {
        const $this = this;
        this.createSection(dashboard);
        this.createSectionControlPanel();
        if (this.scanTypeSelector.hasMoreThanOneScanType()) {
            this.createSectionSwap();
        }
    }
    createHeader(dashboard) {
        const header = document.createElement("div");
        header.style.textAlign = "left";
        header.style.margin = "0px";
        dashboard.appendChild(header);
        let libraryInfo = new LibraryInfoContainer();
        libraryInfo.renderInto(header);
        const headerMessageContainer = document.createElement("div");
        headerMessageContainer.id = this.getHeaderMessageContainerId();
        headerMessageContainer.style.display = "none";
        headerMessageContainer.style.textAlign = "center";
        headerMessageContainer.style.fontSize = "14px";
        headerMessageContainer.style.padding = "2px 10px";
        headerMessageContainer.style.margin = "4px";
        headerMessageContainer.style.borderTop = "1px solid #f6f6f6";
        header.appendChild(headerMessageContainer);
    }
    createSection(dashboard) {
        const section = document.createElement("div");
        section.id = this.getDashboardSectionId();
        section.style.width = "100%";
        section.style.padding = "10px 0px 10px 0px";
        section.style.textAlign = "left";
        dashboard.appendChild(section);
    }
    createCameraListUi(scpCameraScanRegion, requestPermissionContainer, requestPermissionButton) {
        const $this = this;
        $this.setHeaderMessage(Html5QrcodeScannerStrings.cameraPermissionRequesting());
        const createPermissionButtonIfNotExists = () => {
            if (!requestPermissionButton) {
                $this.createPermissionButton(scpCameraScanRegion, requestPermissionContainer);
            }
        };
        Html5Qrcode.getCameras().then((cameras) => {
            $this.persistedDataManager.setHasPermission(true);
            $this.resetHeaderMessage();
            if (cameras && cameras.length > 0) {
                scpCameraScanRegion.removeChild(requestPermissionContainer);
                $this.renderCameraSelection(cameras);
            }
            else {
                $this.setHeaderMessage(Html5QrcodeScannerStrings.noCameraFound(), Html5QrcodeScannerStatus.STATUS_WARNING);
                createPermissionButtonIfNotExists();
            }
        }).catch((error) => {
            $this.persistedDataManager.setHasPermission(false);
            if (requestPermissionButton) {
                requestPermissionButton.disabled = false;
            }
            else {
                createPermissionButtonIfNotExists();
            }
            $this.setHeaderMessage(error, Html5QrcodeScannerStatus.STATUS_WARNING);
        });
    }
    createPermissionButton(scpCameraScanRegion, requestPermissionContainer) {
        const $this = this;
        const requestPermissionButton = document.createElement("button");
        requestPermissionButton.id = this.getCameraPermissionButtonId();
        requestPermissionButton.innerText
            = Html5QrcodeScannerStrings.cameraPermissionTitle();
        requestPermissionButton.addEventListener("click", function () {
            requestPermissionButton.disabled = true;
            $this.createCameraListUi(scpCameraScanRegion, requestPermissionContainer, requestPermissionButton);
        });
        requestPermissionContainer.appendChild(requestPermissionButton);
    }
    createPermissionsUi(scpCameraScanRegion, requestPermissionContainer) {
        const $this = this;
        if (ScanTypeSelector.isCameraScanType(this.currentScanType)
            && this.persistedDataManager.hasCameraPermissions()) {
            CameraManager.hasCameraPermissions().then((hasPermissions) => {
                if (hasPermissions) {
                    $this.createCameraListUi(scpCameraScanRegion, requestPermissionContainer);
                }
                else {
                    $this.persistedDataManager.setHasPermission(false);
                    $this.createPermissionButton(scpCameraScanRegion, requestPermissionContainer);
                }
            }).catch((_) => {
                $this.persistedDataManager.setHasPermission(false);
                $this.createPermissionButton(scpCameraScanRegion, requestPermissionContainer);
            });
            return;
        }
        this.createPermissionButton(scpCameraScanRegion, requestPermissionContainer);
    }
    createSectionControlPanel() {
        const $this = this;
        const section = document.getElementById(this.getDashboardSectionId());
        const sectionControlPanel = document.createElement("div");
        section.appendChild(sectionControlPanel);
        const scpCameraScanRegion = document.createElement("div");
        scpCameraScanRegion.id = this.getDashboardSectionCameraScanRegionId();
        scpCameraScanRegion.style.display
            = ScanTypeSelector.isCameraScanType(this.currentScanType)
                ? "block" : "none";
        sectionControlPanel.appendChild(scpCameraScanRegion);
        const requestPermissionContainer = document.createElement("div");
        requestPermissionContainer.style.textAlign = "center";
        scpCameraScanRegion.appendChild(requestPermissionContainer);
        if (this.scanTypeSelector.isCameraScanRequired()) {
            this.createPermissionsUi(scpCameraScanRegion, requestPermissionContainer);
        }
        this.renderFileScanUi(sectionControlPanel);
    }
    renderFileScanUi(parent) {
        const $this = this;
        const fileBasedScanRegion = document.createElement("div");
        fileBasedScanRegion.id = this.getDashboardSectionFileScanRegionId();
        fileBasedScanRegion.style.textAlign = "center";
        fileBasedScanRegion.style.display
            = ScanTypeSelector.isCameraScanType(this.currentScanType)
                ? "none" : "block";
        parent.appendChild(fileBasedScanRegion);
        const fileScanInput = document.createElement("input");
        fileScanInput.id = this.getFileScanInputId();
        fileScanInput.accept = "image/*";
        fileScanInput.type = "file";
        fileScanInput.style.width = "200px";
        fileScanInput.disabled
            = ScanTypeSelector.isCameraScanType(this.currentScanType);
        const fileScanLabel = document.createElement("span");
        fileScanLabel.innerText = " Select Image";
        fileBasedScanRegion.appendChild(fileScanInput);
        fileBasedScanRegion.appendChild(fileScanLabel);
        fileScanInput.addEventListener("change", (e) => {
            if (!$this.html5Qrcode) {
                throw "html5Qrcode not defined";
            }
            if (e == null || e.target == null) {
                return;
            }
            if (!ScanTypeSelector.isFileScanType($this.currentScanType)) {
                return;
            }
            if (e.target.files.length === 0) {
                return;
            }
            const file = e.target.files[0];
            $this.html5Qrcode.scanFileV2(file, true)
                .then((html5qrcodeResult) => {
                $this.resetHeaderMessage();
                $this.qrCodeSuccessCallback(html5qrcodeResult.decodedText, html5qrcodeResult);
            })
                .catch((error) => {
                $this.setHeaderMessage(error, Html5QrcodeScannerStatus.STATUS_WARNING);
                $this.qrCodeErrorCallback(error, Html5QrcodeErrorFactory.createFrom(error));
            });
        });
    }
    renderCameraSelection(cameras) {
        const $this = this;
        const scpCameraScanRegion = document.getElementById(this.getDashboardSectionCameraScanRegionId());
        scpCameraScanRegion.style.textAlign = "center";
        const cameraSelectionContainer = document.createElement("span");
        cameraSelectionContainer.style.marginRight = "10px";
        const numCameras = cameras.length;
        const cameraSelectionSelect = document.createElement("select");
        if (numCameras === 1) {
            cameraSelectionSelect.style.display = "none";
        }
        else {
            const selectCameraString = Html5QrcodeScannerStrings.selectCamera();
            cameraSelectionContainer.innerText
                = `${selectCameraString} (${cameras.length})  `;
        }
        cameraSelectionSelect.id = this.getCameraSelectionId();
        const options = [];
        for (const camera of cameras) {
            const value = camera.id;
            const name = camera.label == null ? value : camera.label;
            const option = document.createElement("option");
            option.value = value;
            option.innerText = name;
            options.push(option);
            cameraSelectionSelect.appendChild(option);
        }
        cameraSelectionContainer.appendChild(cameraSelectionSelect);
        scpCameraScanRegion.appendChild(cameraSelectionContainer);
        const cameraActionContainer = document.createElement("span");
        const cameraActionStartButton = document.createElement("button");
        cameraActionStartButton.innerText
            = Html5QrcodeScannerStrings.scanButtonStartScanningText();
        cameraActionContainer.appendChild(cameraActionStartButton);
        const cameraActionStopButton = document.createElement("button");
        cameraActionStopButton.innerText
            = Html5QrcodeScannerStrings.scanButtonStopScanningText();
        cameraActionStopButton.style.display = "none";
        cameraActionStopButton.disabled = true;
        cameraActionContainer.appendChild(cameraActionStopButton);
        scpCameraScanRegion.appendChild(cameraActionContainer);
        const resetCameraActionStartButton = (shouldShow) => {
            if (!shouldShow) {
                cameraActionStartButton.style.display = "none";
            }
            cameraActionStartButton.innerText
                = Html5QrcodeScannerStrings
                    .scanButtonStartScanningText();
            cameraActionStartButton.style.opacity = "1";
            cameraActionStartButton.disabled = false;
            if (shouldShow) {
                cameraActionStartButton.style.display = "inline-block";
            }
        };
        cameraActionStartButton.addEventListener("click", (_) => {
            cameraActionStartButton.innerText
                = Html5QrcodeScannerStrings.scanButtonScanningStarting();
            cameraSelectionSelect.disabled = true;
            cameraActionStartButton.disabled = true;
            cameraActionStartButton.style.opacity = "0.5";
            if (this.scanTypeSelector.hasMoreThanOneScanType()) {
                $this.showHideScanTypeSwapLink(false);
            }
            $this.resetHeaderMessage();
            const cameraId = cameraSelectionSelect.value;
            $this.persistedDataManager.setLastUsedCameraId(cameraId);
            $this.html5Qrcode.start(cameraId, toHtml5QrcodeCameraScanConfig($this.config), $this.qrCodeSuccessCallback, $this.qrCodeErrorCallback)
                .then((_) => {
                cameraActionStopButton.disabled = false;
                cameraActionStopButton.style.display = "inline-block";
                resetCameraActionStartButton(false);
            })
                .catch((error) => {
                $this.showHideScanTypeSwapLink(true);
                cameraSelectionSelect.disabled = false;
                resetCameraActionStartButton(true);
                $this.setHeaderMessage(error, Html5QrcodeScannerStatus.STATUS_WARNING);
            });
        });
        if (numCameras === 1) {
            cameraActionStartButton.click();
        }
        cameraActionStopButton.addEventListener("click", (_) => {
            if (!$this.html5Qrcode) {
                throw "html5Qrcode not defined";
            }
            cameraActionStopButton.disabled = true;
            $this.html5Qrcode.stop()
                .then((_) => {
                if (this.scanTypeSelector.hasMoreThanOneScanType()) {
                    $this.showHideScanTypeSwapLink(true);
                }
                cameraSelectionSelect.disabled = false;
                cameraActionStartButton.disabled = false;
                cameraActionStopButton.style.display = "none";
                cameraActionStartButton.style.display = "inline-block";
                $this.insertCameraScanImageToScanRegion();
            }).catch((error) => {
                cameraActionStopButton.disabled = false;
                $this.setHeaderMessage(error, Html5QrcodeScannerStatus.STATUS_WARNING);
            });
        });
        if ($this.persistedDataManager.getLastUsedCameraId()) {
            const cameraId = $this.persistedDataManager.getLastUsedCameraId();
            let cameraFound = false;
            for (const option of options) {
                if (option.value === cameraId) {
                    cameraFound = true;
                    break;
                }
            }
            if (cameraFound) {
                cameraSelectionSelect.value = cameraId;
                cameraActionStartButton.click();
            }
            else {
                $this.persistedDataManager.resetLastUsedCameraId();
            }
        }
    }
    createSectionSwap() {
        const $this = this;
        const TEXT_IF_CAMERA_SCAN_SELECTED = Html5QrcodeScannerStrings.textIfCameraScanSelected();
        const TEXT_IF_FILE_SCAN_SELECTED = Html5QrcodeScannerStrings.textIfFileScanSelected();
        const section = document.getElementById(this.getDashboardSectionId());
        const switchContainer = document.createElement("div");
        switchContainer.style.textAlign = "center";
        const switchScanTypeLink = document.createElement("a");
        switchScanTypeLink.style.textDecoration = "underline";
        switchScanTypeLink.id = this.getDashboardSectionSwapLinkId();
        switchScanTypeLink.innerText
            = ScanTypeSelector.isCameraScanType(this.currentScanType)
                ? TEXT_IF_CAMERA_SCAN_SELECTED : TEXT_IF_FILE_SCAN_SELECTED;
        switchScanTypeLink.addEventListener("click", function () {
            if (!$this.sectionSwapAllowed) {
                if ($this.verbose) {
                    $this.logger.logError("Section swap called when not allowed");
                }
                return;
            }
            $this.resetHeaderMessage();
            $this.getFileScanInput().value = "";
            $this.sectionSwapAllowed = false;
            if (ScanTypeSelector.isCameraScanType($this.currentScanType)) {
                $this.clearScanRegion();
                $this.getFileScanInput().disabled = false;
                $this.getCameraScanRegion().style.display = "none";
                $this.getFileScanRegion().style.display = "block";
                switchScanTypeLink.innerText = TEXT_IF_FILE_SCAN_SELECTED;
                $this.currentScanType = Html5QrcodeScanType.SCAN_TYPE_FILE;
                $this.insertFileScanImageToScanRegion();
            }
            else {
                $this.clearScanRegion();
                $this.getFileScanInput().disabled = true;
                $this.getCameraScanRegion().style.display = "block";
                $this.getFileScanRegion().style.display = "none";
                switchScanTypeLink.innerText = TEXT_IF_CAMERA_SCAN_SELECTED;
                $this.currentScanType = Html5QrcodeScanType.SCAN_TYPE_CAMERA;
                $this.insertCameraScanImageToScanRegion();
                $this.startCameraScanIfPermissionExistsOnSwap();
            }
            $this.sectionSwapAllowed = true;
        });
        switchContainer.appendChild(switchScanTypeLink);
        section.appendChild(switchContainer);
    }
    startCameraScanIfPermissionExistsOnSwap() {
        const $this = this;
        if (this.persistedDataManager.hasCameraPermissions()) {
            CameraManager.hasCameraPermissions().then((hasPermissions) => {
                if (hasPermissions) {
                    let permissionButton = document.getElementById($this.getCameraPermissionButtonId());
                    if (!permissionButton) {
                        this.logger.logError("Permission button not found, fail;");
                        throw "Permission button not found";
                    }
                    permissionButton.click();
                }
                else {
                    $this.persistedDataManager.setHasPermission(false);
                }
            }).catch((_) => {
                $this.persistedDataManager.setHasPermission(false);
            });
            return;
        }
    }
    resetHeaderMessage() {
        const messageDiv = document.getElementById(this.getHeaderMessageContainerId());
        messageDiv.style.display = "none";
    }
    setHeaderMessage(messageText, scannerStatus) {
        if (!scannerStatus) {
            scannerStatus = Html5QrcodeScannerStatus.STATUS_DEFAULT;
        }
        const messageDiv = this.getHeaderMessageDiv();
        messageDiv.innerText = messageText;
        messageDiv.style.display = "block";
        switch (scannerStatus) {
            case Html5QrcodeScannerStatus.STATUS_SUCCESS:
                messageDiv.style.background = "#6aaf5042";
                messageDiv.style.color = "#477735";
                break;
            case Html5QrcodeScannerStatus.STATUS_WARNING:
                messageDiv.style.background = "#cb243124";
                messageDiv.style.color = "#cb2431";
                break;
            case Html5QrcodeScannerStatus.STATUS_DEFAULT:
            default:
                messageDiv.style.background = "#00000000";
                messageDiv.style.color = "rgb(17, 17, 17)";
                break;
        }
    }
    showHideScanTypeSwapLink(shouldDisplay) {
        if (shouldDisplay !== true) {
            shouldDisplay = false;
        }
        this.sectionSwapAllowed = shouldDisplay;
        this.getDashboardSectionSwapLink().style.display
            = shouldDisplay ? "inline-block" : "none";
    }
    insertCameraScanImageToScanRegion() {
        const $this = this;
        const qrCodeScanRegion = document.getElementById(this.getScanRegionId());
        if (this.cameraScanImage) {
            qrCodeScanRegion.innerHTML = "<br>";
            qrCodeScanRegion.appendChild(this.cameraScanImage);
            return;
        }
        this.cameraScanImage = new Image;
        this.cameraScanImage.onload = (_) => {
            qrCodeScanRegion.innerHTML = "<br>";
            qrCodeScanRegion.appendChild($this.cameraScanImage);
        };
        this.cameraScanImage.width = 64;
        this.cameraScanImage.style.opacity = "0.8";
        this.cameraScanImage.src = ASSET_CAMERA_SCAN;
    }
    insertFileScanImageToScanRegion() {
        const $this = this;
        const qrCodeScanRegion = document.getElementById(this.getScanRegionId());
        if (this.fileScanImage) {
            qrCodeScanRegion.innerHTML = "<br>";
            qrCodeScanRegion.appendChild(this.fileScanImage);
            return;
        }
        this.fileScanImage = new Image;
        this.fileScanImage.onload = (_) => {
            qrCodeScanRegion.innerHTML = "<br>";
            qrCodeScanRegion.appendChild($this.fileScanImage);
        };
        this.fileScanImage.width = 64;
        this.fileScanImage.style.opacity = "0.8";
        this.fileScanImage.src = ASSET_FILE_SCAN;
    }
    clearScanRegion() {
        const qrCodeScanRegion = document.getElementById(this.getScanRegionId());
        qrCodeScanRegion.innerHTML = "";
    }
    getDashboardSectionId() {
        return `${this.elementId}__dashboard_section`;
    }
    getDashboardSectionCameraScanRegionId() {
        return `${this.elementId}__dashboard_section_csr`;
    }
    getDashboardSectionFileScanRegionId() {
        return `${this.elementId}__dashboard_section_fsr`;
    }
    getDashboardSectionSwapLinkId() {
        return `${this.elementId}__dashboard_section_swaplink`;
    }
    getScanRegionId() {
        return `${this.elementId}__scan_region`;
    }
    getDashboardId() {
        return `${this.elementId}__dashboard`;
    }
    getFileScanInputId() {
        return `${this.elementId}__filescan_input`;
    }
    getStatusSpanId() {
        return `${this.elementId}__status_span`;
    }
    getHeaderMessageContainerId() {
        return `${this.elementId}__header_message`;
    }
    getCameraSelectionId() {
        return `${this.elementId}__camera_selection`;
    }
    getCameraPermissionButtonId() {
        return `${this.elementId}__camera_permission_button`;
    }
    getCameraScanRegion() {
        return document.getElementById(this.getDashboardSectionCameraScanRegionId());
    }
    getFileScanRegion() {
        return document.getElementById(this.getDashboardSectionFileScanRegionId());
    }
    getFileScanInput() {
        return document.getElementById(this.getFileScanInputId());
    }
    getDashboardSectionSwapLink() {
        return document.getElementById(this.getDashboardSectionSwapLinkId());
    }
    getHeaderMessageDiv() {
        return document.getElementById(this.getHeaderMessageContainerId());
    }
}
//# sourceMappingURL=html5-qrcode-scanner.js.map