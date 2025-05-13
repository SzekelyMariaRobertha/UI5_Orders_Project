define(["require", "exports", "sap/ui/core/util/MockServer", "sap/base/Log"], function (require, exports, MockServer_1, Log_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initMockServer = initMockServer;
    function initMockServer() {
        var sManifestUrl = sap.ui.require.toUrl("ui5training/manifest.json");
        var sPath = sap.ui.require.toUrl("ui5training/model");
        var oMockServer = new MockServer_1.default({
            rootUri: "/ODataService/"
        });
        oMockServer.simulate(sPath + "/metadata.xml", {
            sMockdataBaseUrl: sPath + "/mockdata",
            bGenerateMissingMockData: true
        });
        oMockServer.start();
        Log_1.default.info("Mock server started at /ODataService/");
    }
});
