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
define(["require", "exports", "sap/m/GroupHeaderListItem", "sap/m/MessageBox", "sap/ui/core/library", "sap/ui/core/routing/History", "sap/ui/core/UIComponent", "./BaseController"], function (require, exports, GroupHeaderListItem_1, MessageBox_1, library_1, History_1, UIComponent_1, BaseController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CreateOrder = /** @class */ (function (_super) {
        __extends(CreateOrder, _super);
        function CreateOrder() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.getGroupHeader = function (oGroup) {
                return new GroupHeaderListItem_1.default({
                    title: oGroup.key
                });
            };
            return _this;
        }
        CreateOrder.prototype.onInit = function () {
            console.log("CreateOrder controller initialized");
            var oWizard = this.byId("idCreateOrderWizard");
            oWizard.setShowNextButton(false);
            var button = this.byId("idNextStepButton");
            button.setVisible(false);
        };
        CreateOrder.prototype.onNavBack = function () {
            var _this = this;
            var snavBackConfirmationText = this.getResourceBundle().getText("navBackConfirmationText");
            var snavBackMessasgeBoxTitle = this.getResourceBundle().getText("navBackMessasgeBoxTitle");
            MessageBox_1.default.confirm(snavBackConfirmationText, {
                title: snavBackMessasgeBoxTitle,
                actions: [MessageBox_1.default.Action.OK, MessageBox_1.default.Action.CANCEL],
                emphasizedAction: MessageBox_1.default.Action.OK,
                onClose: function (sAction) {
                    if (sAction === MessageBox_1.default.Action.OK) {
                        var oHistory = History_1.default.getInstance();
                        var sPreviousHash = oHistory.getPreviousHash();
                        if (sPreviousHash !== undefined) {
                            window.history.back();
                        }
                        else {
                            var oRouter = UIComponent_1.default.getRouterFor(_this);
                            oRouter.navTo("main", {}, true);
                        }
                    }
                },
            });
        };
        CreateOrder.prototype.onCustomerSelected = function (oEvent) {
            var oWizard = this.byId("idCreateOrderWizard");
            var sCurrentStepId = oWizard.getCurrentStep();
            var oCurrentStep = this.byId(sCurrentStepId);
            var oComboBox = oEvent.getSource();
            var sSelectedKey = oComboBox.getSelectedKey();
            var sValue = oComboBox.getValue();
            var scomboboxValidationText = this.getResourceBundle().getText("comboboxValidationText");
            var sbuttonGoToOrderOverviewText = this.getResourceBundle().getText("buttonGoToOrderOverviewText");
            var oButton = this.byId("idNextStepButton");
            if (!sSelectedKey && sValue) {
                oComboBox.setValueState(library_1.ValueState.Error);
                oComboBox.setValueStateText(scomboboxValidationText);
            }
            else if (sValue) {
                oButton.setVisible(true);
                oButton.setText(sbuttonGoToOrderOverviewText);
                oButton.setEnabled(false);
                oComboBox.setValueState(library_1.ValueState.Success);
                oWizard.validateStep(oCurrentStep);
                oWizard.nextStep();
            }
            else {
                oComboBox.setValueState(library_1.ValueState.None);
            }
        };
        CreateOrder.prototype.onProductsSelected = function () {
            var oTable = this.byId("idProductsTable");
            var aSelectedItems = oTable.getSelectedItems();
            var oButton = this.byId("idNextStepButton");
            if (aSelectedItems.length === 0) {
                oButton.setEnabled(false);
                return;
            }
            if (oButton) {
                oButton.setEnabled(true);
            }
        };
        CreateOrder.prototype.onGoToOrderOverview = function () {
            var oWizard = this.byId("idCreateOrderWizard");
            var sCurrentStepId = oWizard.getCurrentStep();
            var oCurrentStep = this.byId(sCurrentStepId);
            var sbuttonPlaceOrderText = this.getResourceBundle().getText("buttonPlaceOrderText");
            var oButton = this.byId("idNextStepButton");
            oButton.setText(sbuttonPlaceOrderText);
            oButton.setType("Accept");
            oButton.setEnabled(false);
            oWizard.validateStep(oCurrentStep);
            oWizard.nextStep();
        };
        CreateOrder.prototype.onCancel = function () {
            var _this = this;
            var scancelConfirmationText = this.getResourceBundle().getText("cancelConfirmationText");
            var scancelMessasgeBoxTitle = this.getResourceBundle().getText("cancelMessasgeBoxTitle");
            MessageBox_1.default.confirm(scancelConfirmationText, {
                title: scancelMessasgeBoxTitle,
                actions: [MessageBox_1.default.Action.OK, MessageBox_1.default.Action.CANCEL],
                emphasizedAction: MessageBox_1.default.Action.OK,
                onClose: function (sAction) {
                    if (sAction === MessageBox_1.default.Action.OK) {
                        var oHistory = History_1.default.getInstance();
                        var sPreviousHash = oHistory.getPreviousHash();
                        if (sPreviousHash !== undefined) {
                            window.history.back();
                        }
                        else {
                            var oRouter = UIComponent_1.default.getRouterFor(_this);
                            oRouter.navTo("main", {}, true);
                        }
                    }
                },
            });
        };
        return CreateOrder;
    }(BaseController_1.default));
    exports.default = CreateOrder;
});
