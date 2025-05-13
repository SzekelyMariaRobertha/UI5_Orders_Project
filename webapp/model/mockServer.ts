import MockServer from "sap/ui/core/util/MockServer";
import Log from "sap/base/Log";

export function initMockServer(): void {
    const sManifestUrl = sap.ui.require.toUrl("ui5training/manifest.json");
    const sPath = sap.ui.require.toUrl("ui5training/model");
    const oMockServer = new MockServer({
        rootUri: "/ODataService/"
    });

    oMockServer.simulate(sPath + "/metadata.xml", {
        sMockdataBaseUrl: sPath + "/mockdata",
        bGenerateMissingMockData: true
    });

    oMockServer.start();
    Log.info("Mock server started at /ODataService/");
}
