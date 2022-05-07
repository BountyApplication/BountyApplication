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
var Html5QrcodeScanner = (function () {
    function Html5QrcodeScanner(elementId, config, verbose) {
        this.lastMatchFound = null;
        this.cameraScanImage = null;
        this.fileScanImage = null;
        this.elementId = elementId;
        this.config = this.createConfig(config);
        this.verbose = verbose === true;
        if (!document.getElementById(elementId)) {
            throw "HTML Element with id=" + elementId + " not found";
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
    Html5QrcodeScanner.prototype.render = function (qrCodeSuccessCallback, qrCodeErrorCallback) {
        var _this = this;
        this.lastMatchFound = null;
        this.qrCodeSuccessCallback
            = function (decodedText, result) {
                if (qrCodeSuccessCallback) {
                    qrCodeSuccessCallback(decodedText, result);
                }
                else {
                    if (_this.lastMatchFound === decodedText) {
                        return;
                    }
                    _this.lastMatchFound = decodedText;
                    _this.setHeaderMessage(Html5QrcodeScannerStrings.lastMatch(decodedText), Html5QrcodeScannerStatus.STATUS_SUCCESS);
                }
            };
        this.qrCodeErrorCallback =
            function (errorMessage, error) {
                if (qrCodeErrorCallback) {
                    qrCodeErrorCallback(errorMessage, error);
                }
            };
        var container = document.getElementById(this.elementId);
        if (!container) {
            throw "HTML Element with id=" + this.elementId + " not found";
        }
        container.innerHTML = "";
        this.createBasicLayout(container);
        this.html5Qrcode = new Html5Qrcode(this.getScanRegionId(), toHtml5QrcodeFullConfig(this.config, this.verbose));
    };
    Html5QrcodeScanner.prototype.pause = function (shouldPauseVideo) {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        if (isNullOrUndefined(shouldPauseVideo) || shouldPauseVideo !== true) {
            shouldPauseVideo = false;
        }
        this.html5Qrcode.pause(shouldPauseVideo);
    };
    Html5QrcodeScanner.prototype.resume = function () {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        this.html5Qrcode.resume();
    };
    Html5QrcodeScanner.prototype.getState = function () {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        return this.html5Qrcode.getState();
    };
    Html5QrcodeScanner.prototype.clear = function () {
        var _this = this;
        var emptyHtmlContainer = function () {
            var mainContainer = document.getElementById(_this.elementId);
            if (mainContainer) {
                mainContainer.innerHTML = "";
                _this.resetBasicLayout(mainContainer);
            }
        };
        if (this.html5Qrcode) {
            return new Promise(function (resolve, reject) {
                if (!_this.html5Qrcode) {
                    resolve();
                    return;
                }
                if (_this.html5Qrcode.isScanning) {
                    _this.html5Qrcode.stop().then(function (_) {
                        if (!_this.html5Qrcode) {
                            resolve();
                            return;
                        }
                        _this.html5Qrcode.clear();
                        emptyHtmlContainer();
                        resolve();
                    }).catch(function (error) {
                        if (_this.verbose) {
                            _this.logger.logError("Unable to stop qrcode scanner", error);
                        }
                        reject(error);
                    });
                }
                else {
                    _this.html5Qrcode.clear();
                    emptyHtmlContainer();
                }
            });
        }
        return Promise.resolve();
    };
    Html5QrcodeScanner.prototype.getRunningTrackCapabilities = function () {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        return this.html5Qrcode.getRunningTrackCapabilities();
    };
    Html5QrcodeScanner.prototype.applyVideoConstraints = function (videoConstaints) {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        return this.html5Qrcode.applyVideoConstraints(videoConstaints);
    };
    Html5QrcodeScanner.prototype.createConfig = function (config) {
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
    };
    Html5QrcodeScanner.prototype.createBasicLayout = function (parent) {
        parent.style.position = "relative";
        parent.style.padding = "0px";
        parent.style.border = "1px solid silver";
        this.createHeader(parent);
        var qrCodeScanRegion = document.createElement("div");
        var scanRegionId = this.getScanRegionId();
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
        var qrCodeDashboard = document.createElement("div");
        var dashboardId = this.getDashboardId();
        qrCodeDashboard.id = dashboardId;
        qrCodeDashboard.style.width = "100%";
        parent.appendChild(qrCodeDashboard);
        this.setupInitialDashboard(qrCodeDashboard);
    };
    Html5QrcodeScanner.prototype.resetBasicLayout = function (mainContainer) {
        mainContainer.style.border = "none";
    };
    Html5QrcodeScanner.prototype.setupInitialDashboard = function (dashboard) {
        var $this = this;
        this.createSection(dashboard);
        this.createSectionControlPanel();
        if (this.scanTypeSelector.hasMoreThanOneScanType()) {
            this.createSectionSwap();
        }
    };
    Html5QrcodeScanner.prototype.createHeader = function (dashboard) {
        var header = document.createElement("div");
        header.style.textAlign = "left";
        header.style.margin = "0px";
        dashboard.appendChild(header);
        var libraryInfo = new LibraryInfoContainer();
        libraryInfo.renderInto(header);
        var headerMessageContainer = document.createElement("div");
        headerMessageContainer.id = this.getHeaderMessageContainerId();
        headerMessageContainer.style.display = "none";
        headerMessageContainer.style.textAlign = "center";
        headerMessageContainer.style.fontSize = "14px";
        headerMessageContainer.style.padding = "2px 10px";
        headerMessageContainer.style.margin = "4px";
        headerMessageContainer.style.borderTop = "1px solid #f6f6f6";
        header.appendChild(headerMessageContainer);
    };
    Html5QrcodeScanner.prototype.createSection = function (dashboard) {
        var section = document.createElement("div");
        section.id = this.getDashboardSectionId();
        section.style.width = "100%";
        section.style.padding = "10px 0px 10px 0px";
        section.style.textAlign = "left";
        dashboard.appendChild(section);
    };
    Html5QrcodeScanner.prototype.createCameraListUi = function (scpCameraScanRegion, requestPermissionContainer, requestPermissionButton) {
        var $this = this;
        $this.setHeaderMessage(Html5QrcodeScannerStrings.cameraPermissionRequesting());
        var createPermissionButtonIfNotExists = function () {
            if (!requestPermissionButton) {
                $this.createPermissionButton(scpCameraScanRegion, requestPermissionContainer);
            }
        };
        Html5Qrcode.getCameras().then(function (cameras) {
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
        }).catch(function (error) {
            $this.persistedDataManager.setHasPermission(false);
            if (requestPermissionButton) {
                requestPermissionButton.disabled = false;
            }
            else {
                createPermissionButtonIfNotExists();
            }
            $this.setHeaderMessage(error, Html5QrcodeScannerStatus.STATUS_WARNING);
        });
    };
    Html5QrcodeScanner.prototype.createPermissionButton = function (scpCameraScanRegion, requestPermissionContainer) {
        var $this = this;
        var requestPermissionButton = document.createElement("button");
        requestPermissionButton.id = this.getCameraPermissionButtonId();
        requestPermissionButton.innerText
            = Html5QrcodeScannerStrings.cameraPermissionTitle();
        requestPermissionButton.addEventListener("click", function () {
            requestPermissionButton.disabled = true;
            $this.createCameraListUi(scpCameraScanRegion, requestPermissionContainer, requestPermissionButton);
        });
        requestPermissionContainer.appendChild(requestPermissionButton);
    };
    Html5QrcodeScanner.prototype.createPermissionsUi = function (scpCameraScanRegion, requestPermissionContainer) {
        var $this = this;
        if (ScanTypeSelector.isCameraScanType(this.currentScanType)
            && this.persistedDataManager.hasCameraPermissions()) {
            CameraManager.hasCameraPermissions().then(function (hasPermissions) {
                if (hasPermissions) {
                    $this.createCameraListUi(scpCameraScanRegion, requestPermissionContainer);
                }
                else {
                    $this.persistedDataManager.setHasPermission(false);
                    $this.createPermissionButton(scpCameraScanRegion, requestPermissionContainer);
                }
            }).catch(function (_) {
                $this.persistedDataManager.setHasPermission(false);
                $this.createPermissionButton(scpCameraScanRegion, requestPermissionContainer);
            });
            return;
        }
        this.createPermissionButton(scpCameraScanRegion, requestPermissionContainer);
    };
    Html5QrcodeScanner.prototype.createSectionControlPanel = function () {
        var $this = this;
        var section = document.getElementById(this.getDashboardSectionId());
        var sectionControlPanel = document.createElement("div");
        section.appendChild(sectionControlPanel);
        var scpCameraScanRegion = document.createElement("div");
        scpCameraScanRegion.id = this.getDashboardSectionCameraScanRegionId();
        scpCameraScanRegion.style.display
            = ScanTypeSelector.isCameraScanType(this.currentScanType)
                ? "block" : "none";
        sectionControlPanel.appendChild(scpCameraScanRegion);
        var requestPermissionContainer = document.createElement("div");
        requestPermissionContainer.style.textAlign = "center";
        scpCameraScanRegion.appendChild(requestPermissionContainer);
        if (this.scanTypeSelector.isCameraScanRequired()) {
            this.createPermissionsUi(scpCameraScanRegion, requestPermissionContainer);
        }
        this.renderFileScanUi(sectionControlPanel);
    };
    Html5QrcodeScanner.prototype.renderFileScanUi = function (parent) {
        var $this = this;
        var fileBasedScanRegion = document.createElement("div");
        fileBasedScanRegion.id = this.getDashboardSectionFileScanRegionId();
        fileBasedScanRegion.style.textAlign = "center";
        fileBasedScanRegion.style.display
            = ScanTypeSelector.isCameraScanType(this.currentScanType)
                ? "none" : "block";
        parent.appendChild(fileBasedScanRegion);
        var fileScanInput = document.createElement("input");
        fileScanInput.id = this.getFileScanInputId();
        fileScanInput.accept = "image/*";
        fileScanInput.type = "file";
        fileScanInput.style.width = "200px";
        fileScanInput.disabled
            = ScanTypeSelector.isCameraScanType(this.currentScanType);
        var fileScanLabel = document.createElement("span");
        fileScanLabel.innerText = " Select Image";
        fileBasedScanRegion.appendChild(fileScanInput);
        fileBasedScanRegion.appendChild(fileScanLabel);
        fileScanInput.addEventListener("change", function (e) {
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
            var file = e.target.files[0];
            $this.html5Qrcode.scanFileV2(file, true)
                .then(function (html5qrcodeResult) {
                $this.resetHeaderMessage();
                $this.qrCodeSuccessCallback(html5qrcodeResult.decodedText, html5qrcodeResult);
            })
                .catch(function (error) {
                $this.setHeaderMessage(error, Html5QrcodeScannerStatus.STATUS_WARNING);
                $this.qrCodeErrorCallback(error, Html5QrcodeErrorFactory.createFrom(error));
            });
        });
    };
    Html5QrcodeScanner.prototype.renderCameraSelection = function (cameras) {
        var _this = this;
        var $this = this;
        var scpCameraScanRegion = document.getElementById(this.getDashboardSectionCameraScanRegionId());
        scpCameraScanRegion.style.textAlign = "center";
        var cameraSelectionContainer = document.createElement("span");
        cameraSelectionContainer.style.marginRight = "10px";
        var numCameras = cameras.length;
        var cameraSelectionSelect = document.createElement("select");
        if (numCameras === 1) {
            cameraSelectionSelect.style.display = "none";
        }
        else {
            var selectCameraString = Html5QrcodeScannerStrings.selectCamera();
            cameraSelectionContainer.innerText
                = selectCameraString + " (" + cameras.length + ")  ";
        }
        cameraSelectionSelect.id = this.getCameraSelectionId();
        var options = [];
        for (var _i = 0, cameras_1 = cameras; _i < cameras_1.length; _i++) {
            var camera = cameras_1[_i];
            var value = camera.id;
            var name_1 = camera.label == null ? value : camera.label;
            var option = document.createElement("option");
            option.value = value;
            option.innerText = name_1;
            options.push(option);
            cameraSelectionSelect.appendChild(option);
        }
        cameraSelectionContainer.appendChild(cameraSelectionSelect);
        scpCameraScanRegion.appendChild(cameraSelectionContainer);
        var cameraActionContainer = document.createElement("span");
        var cameraActionStartButton = document.createElement("button");
        cameraActionStartButton.innerText
            = Html5QrcodeScannerStrings.scanButtonStartScanningText();
        cameraActionContainer.appendChild(cameraActionStartButton);
        var cameraActionStopButton = document.createElement("button");
        cameraActionStopButton.innerText
            = Html5QrcodeScannerStrings.scanButtonStopScanningText();
        cameraActionStopButton.style.display = "none";
        cameraActionStopButton.disabled = true;
        cameraActionContainer.appendChild(cameraActionStopButton);
        scpCameraScanRegion.appendChild(cameraActionContainer);
        var resetCameraActionStartButton = function (shouldShow) {
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
        cameraActionStartButton.addEventListener("click", function (_) {
            cameraActionStartButton.innerText
                = Html5QrcodeScannerStrings.scanButtonScanningStarting();
            cameraSelectionSelect.disabled = true;
            cameraActionStartButton.disabled = true;
            cameraActionStartButton.style.opacity = "0.5";
            if (_this.scanTypeSelector.hasMoreThanOneScanType()) {
                $this.showHideScanTypeSwapLink(false);
            }
            $this.resetHeaderMessage();
            var cameraId = cameraSelectionSelect.value;
            $this.persistedDataManager.setLastUsedCameraId(cameraId);
            $this.html5Qrcode.start(cameraId, toHtml5QrcodeCameraScanConfig($this.config), $this.qrCodeSuccessCallback, $this.qrCodeErrorCallback)
                .then(function (_) {
                cameraActionStopButton.disabled = false;
                cameraActionStopButton.style.display = "inline-block";
                resetCameraActionStartButton(false);
            })
                .catch(function (error) {
                $this.showHideScanTypeSwapLink(true);
                cameraSelectionSelect.disabled = false;
                resetCameraActionStartButton(true);
                $this.setHeaderMessage(error, Html5QrcodeScannerStatus.STATUS_WARNING);
            });
        });
        if (numCameras === 1) {
            cameraActionStartButton.click();
        }
        cameraActionStopButton.addEventListener("click", function (_) {
            if (!$this.html5Qrcode) {
                throw "html5Qrcode not defined";
            }
            cameraActionStopButton.disabled = true;
            $this.html5Qrcode.stop()
                .then(function (_) {
                if (_this.scanTypeSelector.hasMoreThanOneScanType()) {
                    $this.showHideScanTypeSwapLink(true);
                }
                cameraSelectionSelect.disabled = false;
                cameraActionStartButton.disabled = false;
                cameraActionStopButton.style.display = "none";
                cameraActionStartButton.style.display = "inline-block";
                $this.insertCameraScanImageToScanRegion();
            }).catch(function (error) {
                cameraActionStopButton.disabled = false;
                $this.setHeaderMessage(error, Html5QrcodeScannerStatus.STATUS_WARNING);
            });
        });
        if ($this.persistedDataManager.getLastUsedCameraId()) {
            var cameraId = $this.persistedDataManager.getLastUsedCameraId();
            var cameraFound = false;
            for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
                var option = options_1[_a];
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
    };
    Html5QrcodeScanner.prototype.createSectionSwap = function () {
        var $this = this;
        var TEXT_IF_CAMERA_SCAN_SELECTED = Html5QrcodeScannerStrings.textIfCameraScanSelected();
        var TEXT_IF_FILE_SCAN_SELECTED = Html5QrcodeScannerStrings.textIfFileScanSelected();
        var section = document.getElementById(this.getDashboardSectionId());
        var switchContainer = document.createElement("div");
        switchContainer.style.textAlign = "center";
        var switchScanTypeLink = document.createElement("a");
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
    };
    Html5QrcodeScanner.prototype.startCameraScanIfPermissionExistsOnSwap = function () {
        var _this = this;
        var $this = this;
        if (this.persistedDataManager.hasCameraPermissions()) {
            CameraManager.hasCameraPermissions().then(function (hasPermissions) {
                if (hasPermissions) {
                    var permissionButton = document.getElementById($this.getCameraPermissionButtonId());
                    if (!permissionButton) {
                        _this.logger.logError("Permission button not found, fail;");
                        throw "Permission button not found";
                    }
                    permissionButton.click();
                }
                else {
                    $this.persistedDataManager.setHasPermission(false);
                }
            }).catch(function (_) {
                $this.persistedDataManager.setHasPermission(false);
            });
            return;
        }
    };
    Html5QrcodeScanner.prototype.resetHeaderMessage = function () {
        var messageDiv = document.getElementById(this.getHeaderMessageContainerId());
        messageDiv.style.display = "none";
    };
    Html5QrcodeScanner.prototype.setHeaderMessage = function (messageText, scannerStatus) {
        if (!scannerStatus) {
            scannerStatus = Html5QrcodeScannerStatus.STATUS_DEFAULT;
        }
        var messageDiv = this.getHeaderMessageDiv();
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
    };
    Html5QrcodeScanner.prototype.showHideScanTypeSwapLink = function (shouldDisplay) {
        if (shouldDisplay !== true) {
            shouldDisplay = false;
        }
        this.sectionSwapAllowed = shouldDisplay;
        this.getDashboardSectionSwapLink().style.display
            = shouldDisplay ? "inline-block" : "none";
    };
    Html5QrcodeScanner.prototype.insertCameraScanImageToScanRegion = function () {
        var $this = this;
        var qrCodeScanRegion = document.getElementById(this.getScanRegionId());
        if (this.cameraScanImage) {
            qrCodeScanRegion.innerHTML = "<br>";
            qrCodeScanRegion.appendChild(this.cameraScanImage);
            return;
        }
        this.cameraScanImage = new Image;
        this.cameraScanImage.onload = function (_) {
            qrCodeScanRegion.innerHTML = "<br>";
            qrCodeScanRegion.appendChild($this.cameraScanImage);
        };
        this.cameraScanImage.width = 64;
        this.cameraScanImage.style.opacity = "0.8";
        this.cameraScanImage.src = ASSET_CAMERA_SCAN;
    };
    Html5QrcodeScanner.prototype.insertFileScanImageToScanRegion = function () {
        var $this = this;
        var qrCodeScanRegion = document.getElementById(this.getScanRegionId());
        if (this.fileScanImage) {
            qrCodeScanRegion.innerHTML = "<br>";
            qrCodeScanRegion.appendChild(this.fileScanImage);
            return;
        }
        this.fileScanImage = new Image;
        this.fileScanImage.onload = function (_) {
            qrCodeScanRegion.innerHTML = "<br>";
            qrCodeScanRegion.appendChild($this.fileScanImage);
        };
        this.fileScanImage.width = 64;
        this.fileScanImage.style.opacity = "0.8";
        this.fileScanImage.src = ASSET_FILE_SCAN;
    };
    Html5QrcodeScanner.prototype.clearScanRegion = function () {
        var qrCodeScanRegion = document.getElementById(this.getScanRegionId());
        qrCodeScanRegion.innerHTML = "";
    };
    Html5QrcodeScanner.prototype.getDashboardSectionId = function () {
        return this.elementId + "__dashboard_section";
    };
    Html5QrcodeScanner.prototype.getDashboardSectionCameraScanRegionId = function () {
        return this.elementId + "__dashboard_section_csr";
    };
    Html5QrcodeScanner.prototype.getDashboardSectionFileScanRegionId = function () {
        return this.elementId + "__dashboard_section_fsr";
    };
    Html5QrcodeScanner.prototype.getDashboardSectionSwapLinkId = function () {
        return this.elementId + "__dashboard_section_swaplink";
    };
    Html5QrcodeScanner.prototype.getScanRegionId = function () {
        return this.elementId + "__scan_region";
    };
    Html5QrcodeScanner.prototype.getDashboardId = function () {
        return this.elementId + "__dashboard";
    };
    Html5QrcodeScanner.prototype.getFileScanInputId = function () {
        return this.elementId + "__filescan_input";
    };
    Html5QrcodeScanner.prototype.getStatusSpanId = function () {
        return this.elementId + "__status_span";
    };
    Html5QrcodeScanner.prototype.getHeaderMessageContainerId = function () {
        return this.elementId + "__header_message";
    };
    Html5QrcodeScanner.prototype.getCameraSelectionId = function () {
        return this.elementId + "__camera_selection";
    };
    Html5QrcodeScanner.prototype.getCameraPermissionButtonId = function () {
        return this.elementId + "__camera_permission_button";
    };
    Html5QrcodeScanner.prototype.getCameraScanRegion = function () {
        return document.getElementById(this.getDashboardSectionCameraScanRegionId());
    };
    Html5QrcodeScanner.prototype.getFileScanRegion = function () {
        return document.getElementById(this.getDashboardSectionFileScanRegionId());
    };
    Html5QrcodeScanner.prototype.getFileScanInput = function () {
        return document.getElementById(this.getFileScanInputId());
    };
    Html5QrcodeScanner.prototype.getDashboardSectionSwapLink = function () {
        return document.getElementById(this.getDashboardSectionSwapLinkId());
    };
    Html5QrcodeScanner.prototype.getHeaderMessageDiv = function () {
        return document.getElementById(this.getHeaderMessageContainerId());
    };
    return Html5QrcodeScanner;
}());
export { Html5QrcodeScanner };
//# sourceMappingURL=html5-qrcode-scanner.js.map