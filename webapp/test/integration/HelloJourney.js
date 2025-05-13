define(["require", "exports", "sap/ui/test/opaQunit", "./pages/MainPage"], function (require, exports, opaQunit_1, MainPage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var onTheMainPage = new MainPage_1.default();
    QUnit.module("Sample Hello Journey");
    (0, opaQunit_1.default)("Should open the Hello dialog", function () {
        // Arrangements
        onTheMainPage.iStartMyUIComponent({
            componentConfig: {
                name: "ui5training"
            }
        });
        // Actions
        onTheMainPage.iPressTheSayHelloWithDialogButton();
        // Assertions
        onTheMainPage.iShouldSeeTheHelloDialog();
        // Actions
        onTheMainPage.iPressTheOkButtonInTheDialog();
        // Assertions
        onTheMainPage.iShouldNotSeeTheHelloDialog();
        // Cleanup
        onTheMainPage.iTeardownMyApp();
    });
    (0, opaQunit_1.default)("Should close the Hello dialog", function () {
        // Arrangements
        onTheMainPage.iStartMyUIComponent({
            componentConfig: {
                name: "ui5training"
            }
        });
        // Actions
        onTheMainPage.iPressTheSayHelloWithDialogButton();
        onTheMainPage.iPressTheOkButtonInTheDialog();
        // Assertions
        onTheMainPage.iShouldNotSeeTheHelloDialog();
        // Cleanup
        onTheMainPage.iTeardownMyApp();
    });
});
