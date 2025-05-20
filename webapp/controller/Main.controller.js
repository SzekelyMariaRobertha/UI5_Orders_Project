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
define(["require", "exports", "sap/m/MessageBox", "sap/m/MessageToast", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "./BaseController", "sap/m/GroupHeaderListItem"], function (require, exports, MessageBox_1, MessageToast_1, Filter_1, FilterOperator_1, BaseController_1, GroupHeaderListItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @namespace ui5training.controller
     */
    var Main = /** @class */ (function (_super) {
        __extends(Main, _super);
        function Main() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getGroupHeader = function (oGroup) {
                return new GroupHeaderListItem_1.default({
                    title: oGroup.key
                });
            };
            return _this;
        }
        Main.prototype.onInit = function () {
            console.log("Main controller initialized");
        };
        Main.prototype.onSearch = function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            var oTable = this.byId("idOrdersTable");
            var oBinding = oTable.getBinding("items");
            // Since we have OrderID as number, we cannot filter on it
            // If we want to filter on it, we need to convert it to string in json file, but if we do that we wont be able to delete the entrie
            // Conclusion: we cannot filter on OrderID, we will filter on the other fields
            if (sQuery && sQuery.length > 0) {
                var oMultiFilter = new Filter_1.default({
                    filters: [
                        new Filter_1.default("Customer/CompanyName", FilterOperator_1.default.Contains, sQuery),
                        new Filter_1.default("Freight", FilterOperator_1.default.Contains, sQuery),
                        new Filter_1.default("Shipper/CompanyName", FilterOperator_1.default.Contains, sQuery),
                        new Filter_1.default("ShipCity", FilterOperator_1.default.Contains, sQuery),
                        new Filter_1.default("ShipCountry", FilterOperator_1.default.Contains, sQuery),
                        new Filter_1.default("Employee/LastName", FilterOperator_1.default.Contains, sQuery),
                        new Filter_1.default("Employee/FirstName", FilterOperator_1.default.Contains, sQuery)
                    ]
                });
                oBinding.filter(oMultiFilter);
            }
            else {
                oBinding.filter([]);
            }
        };
        Main.prototype.onCreatePress = function (oEvent) {
            this.getRouter().navTo("create");
        };
        Main.prototype.onDeletePress = function () {
            var oTable = this.byId("idOrdersTable");
            var oModel = this.getView().getModel(); // This is ODataModel!
            var aSelectedItems = oTable.getSelectedItems();
            var sAtLeastOneEntryText = this.getResourceBundle().getText("atLeastOneEntryText");
            var sdeleteMessasgeBoxTitle = this.getResourceBundle().getText("deleteMessasgeBoxTitle");
            var sdeleteConfirmationText = this.getResourceBundle().getText("deleteConfirmationText");
            var sdeleteSuccessText = this.getResourceBundle().getText("deleteSuccessText");
            var sdeleteErrorText = this.getResourceBundle().getText("deleteErrorText");
            if (aSelectedItems.length === 0) {
                MessageToast_1.default.show(sAtLeastOneEntryText);
                return;
            }
            MessageBox_1.default.confirm(sdeleteConfirmationText, {
                title: sdeleteMessasgeBoxTitle,
                actions: [MessageBox_1.default.Action.OK, MessageBox_1.default.Action.CANCEL],
                emphasizedAction: MessageBox_1.default.Action.OK,
                onClose: function (sAction) {
                    if (sAction === MessageBox_1.default.Action.OK) {
                        aSelectedItems.forEach(function (oItem) {
                            var oContext = oItem.getBindingContext();
                            var sPath = oContext.getPath();
                            oModel.setUseBatch(true);
                            // oModel.createKey("/Orders", {OrderID: a} )   #For creare, example for future
                            oModel.remove(sPath);
                        });
                        if (oModel.hasPendingChanges()) {
                            oModel.submitChanges({
                                success: function (oData) {
                                    MessageToast_1.default.show(sdeleteSuccessText);
                                },
                                error: function (oResponse) {
                                    MessageToast_1.default.show(sdeleteErrorText);
                                }
                            });
                        }
                        oTable.removeSelections();
                        oModel.refresh();
                    }
                }
            });
        };
        Main.prototype.onOrderPress = function (oEvent) {
            var oItem = oEvent.getSource().getBindingContext();
            var oOrder = oItem.getObject();
            var sID = String(oOrder.OrderID);
            this.getRouter().navTo("details", {
                OrderID: sID
            });
        };
        return Main;
    }(BaseController_1.default));
    exports.default = Main;
});
