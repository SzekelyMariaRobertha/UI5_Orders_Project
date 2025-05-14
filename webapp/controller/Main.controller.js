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
define(["require", "exports", "./BaseController", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (require, exports, BaseController_1, Filter_1, FilterOperator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @namespace ui5training.controller
     */
    var Main = /** @class */ (function (_super) {
        __extends(Main, _super);
        function Main() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Main.prototype.onInit = function () {
            console.log("Main controller initialized");
            // Retrieve models from the manifest
            var oOrderModel = this.getOwnerComponent().getModel("order");
            var oCustomerModel = this.getOwnerComponent().getModel("customer");
            // Set models to the view (this will bind them to the XML view automatically)
            this.getView().setModel(oOrderModel, "order");
            this.getView().setModel(oCustomerModel, "customer");
        };
        Main.prototype.onSearch = function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            var aFilters = [];
            if (sQuery && sQuery.length > 0) {
                aFilters.push(new Filter_1.default("CustomerID", FilterOperator_1.default.Contains, sQuery));
            }
            var oTable = this.byId("idOrdersTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters, "Application");
        };
        Main.prototype.onSelectionChange = function (oEvent) {
            var oTable = this.byId("idOrdersTable");
            var oLabel = this.byId("idFilterLabel");
            var aContexts = oTable.getSelectedContexts(true); // include contexts even they are not showed
            var bSelected = aContexts && aContexts.length > 0;
            var sText = bSelected ? "".concat(aContexts.length, " selected") : "";
            oLabel.setText(sText);
        };
        return Main;
    }(BaseController_1.default));
    exports.default = Main;
});
