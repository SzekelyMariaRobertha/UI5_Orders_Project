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
define(["require", "exports", "sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/core/UIComponent"], function (require, exports, Controller_1, History_1, UIComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @namespace ui5training.controller
     */
    var BaseController = /** @class */ (function (_super) {
        __extends(BaseController, _super);
        function BaseController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Convenience method for accessing the component of the controller's view.
         * @returns The component of the controller's view
         */
        BaseController.prototype.getOwnerComponent = function () {
            return _super.prototype.getOwnerComponent.call(this);
        };
        /**
         * Convenience method to get the components' router instance.
         * @returns The router instance
         */
        BaseController.prototype.getRouter = function () {
            return UIComponent_1.default.getRouterFor(this);
        };
        /**
         * Convenience method for getting the i18n resource bundle of the component.
         * @returns The i18n resource bundle of the component
         */
        BaseController.prototype.getResourceBundle = function () {
            var oModel = this.getOwnerComponent().getModel("i18n");
            return oModel.getResourceBundle();
        };
        // public async getTextAsync(key: string): Promise<string> {
        // 	const bundle = await this.getResourceBundle();
        // 	return bundle.getText(key);
        // }
        /**
         * Convenience method for getting the view model by name in every controller of the application.
         * @param [sName] The model name
         * @returns The model instance
         */
        BaseController.prototype.getModel = function (sName) {
            return this.getView().getModel(sName);
        };
        /**
         * Convenience method for setting the view model in every controller of the application.
         * @param oModel The model instance
         * @param [sName] The model name
         * @returns The current base controller instance
         */
        BaseController.prototype.setModel = function (oModel, sName) {
            this.getView().setModel(oModel, sName);
            return this;
        };
        /**
         * Convenience method for triggering the navigation to a specific target.
         * @public
         * @param sName Target name
         * @param [oParameters] Navigation parameters
         * @param [bReplace] Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
         */
        BaseController.prototype.navTo = function (sName, oParameters, bReplace) {
            this.getRouter().navTo(sName, oParameters, undefined, bReplace);
        };
        /**
         * Convenience event handler for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the main route.
         */
        BaseController.prototype.onNavBack = function () {
            var sPreviousHash = History_1.default.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            }
            else {
                this.getRouter().navTo("main", {}, undefined, true);
            }
        };
        return BaseController;
    }(Controller_1.default));
    exports.default = BaseController;
});
