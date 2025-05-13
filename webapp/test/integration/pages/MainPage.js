var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "sap/ui/test/Opa5", "sap/ui/test/actions/Press"], function (require, exports, Opa5_1, Press_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var viewName = "ui5training.view.Main";
    var MainPage = /** @class */ (function (_super) {
        __extends(MainPage, _super);
        function MainPage() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // Actions
        MainPage.prototype.iPressTheSayHelloWithDialogButton = function () {
            this.waitFor({
                id: "helloButton",
                viewName: viewName,
                actions: new Press_1.default(),
                errorMessage: "Did not find the 'Say Hello With Dialog' button on the Main view"
            });
        };
        MainPage.prototype.iPressTheOkButtonInTheDialog = function () {
            this.waitFor({
                controlType: "sap.m.Button",
                searchOpenDialogs: true,
                viewName: viewName,
                actions: new Press_1.default(),
                errorMessage: "Did not find the 'OK' button in the Dialog"
            });
        };
        // Assertions
        MainPage.prototype.iShouldSeeTheHelloDialog = function () {
            this.waitFor({
                controlType: "sap.m.Dialog",
                success: function () {
                    // we set the view busy, so we need to query the parent of the app
                    Opa5_1.default.assert.ok(true, "The dialog is open");
                },
                errorMessage: "Did not find the dialog control"
            });
        };
        MainPage.prototype.iShouldNotSeeTheHelloDialog = function () {
            this.waitFor({
                controlType: "sap.m.App", // dummy, I just want a check function, where I can search the DOM. Probably there is a better way for a NEGATIVE test (NO dialog).
                check: function () {
                    return document.querySelectorAll(".sapMDialog").length === 0;
                },
                success: function () {
                    Opa5_1.default.assert.ok(true, "No dialog is open");
                }
            });
        };
        return MainPage;
    }(Opa5_1.default));
    exports.default = MainPage;
});
