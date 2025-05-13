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
define(["require", "exports", "sap/ui/core/UIComponent", "./model/models", "sap/ui/Device"], function (require, exports, UIComponent_1, models_1, Device_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @namespace ui5training
     */
    var Component = /** @class */ (function (_super) {
        __extends(Component, _super);
        function Component() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Component.prototype.init = function () {
            // if (location.hostname === "localhost") {
            // 	initMockServer();
            // }
            // call the base component's init function
            _super.prototype.init.call(this);
            // create the device model
            this.setModel(models_1.default.createDeviceModel(), "device");
            // create the views based on the url/hash
            this.getRouter().initialize();
        };
        /**
         * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
         * design mode class should be set, which influences the size appearance of some controls.
         * @public
         * @returns css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
         */
        Component.prototype.getContentDensityClass = function () {
            if (this.contentDensityClass === undefined) {
                // check whether FLP has already set the content density class; do nothing in this case
                if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                    this.contentDensityClass = "";
                }
                else if (!Device_1.default.support.touch) {
                    // apply "compact" mode if touch is not supported
                    this.contentDensityClass = "sapUiSizeCompact";
                }
                else {
                    // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                    this.contentDensityClass = "sapUiSizeCozy";
                }
            }
            return this.contentDensityClass;
        };
        Component.metadata = {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        };
        return Component;
    }(UIComponent_1.default));
    exports.default = Component;
});
