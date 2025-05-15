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
define(["require", "exports", "./BaseController", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/m/MessageBox", "sap/m/MessageToast"], function (require, exports, BaseController_1, Filter_1, FilterOperator_1, MessageBox_1, MessageToast_1) {
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
        };
        Main.prototype.onSearch = function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            var aFilters = [];
            if (sQuery && sQuery.length > 0) {
                aFilters.push(new Filter_1.default("OrderID", FilterOperator_1.default.Contains, sQuery));
            }
            var oTable = this.byId("idOrdersTable");
            var oBinding = oTable.getBinding("items");
            console.log(oBinding.getModel().getProperty("/Orders"));
            oBinding.filter(aFilters);
        };
        Main.prototype.onCreatePress = function () {
            this.getRouter().navTo("create");
        };
        Main.prototype.onDeletePress = function () {
            var oTable = this.byId("idOrdersTable");
            var oModel = this.getView().getModel(); // This is ODataModel!
            var aSelectedItems = oTable.getSelectedItems();
            if (aSelectedItems.length === 0) {
                MessageToast_1.default.show("Please select at least one order.");
                return;
            }
            MessageBox_1.default.confirm("Are you sure you want to delete the selected orders?", {
                title: "Confirm Deletion",
                actions: [MessageBox_1.default.Action.OK, MessageBox_1.default.Action.CANCEL],
                emphasizedAction: MessageBox_1.default.Action.OK,
                onClose: function (sAction) {
                    if (sAction === MessageBox_1.default.Action.OK) {
                        aSelectedItems.forEach(function (oItem) {
                            var oContext = oItem.getBindingContext();
                            var oOrder = oContext.getObject();
                            var sOrderID = typeof oOrder.OrderID === "number"
                                ? "/Orders(".concat(oOrder.OrderID, ")")
                                : "/Orders('".concat(oOrder.OrderID, "')");
                            oModel.remove(sOrderID, {
                                success: function () {
                                    MessageToast_1.default.show("Selected orders deleted.");
                                },
                                error: function () {
                                    MessageToast_1.default.show("Delete failed for OrderID: " + oOrder.OrderID);
                                }
                            });
                        });
                        oTable.removeSelections();
                        oModel.refresh();
                    }
                }
            });
        };
        return Main;
    }(BaseController_1.default));
    exports.default = Main;
});
