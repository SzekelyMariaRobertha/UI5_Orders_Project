import Button from "sap/m/Button";
import ComboBox from "sap/m/ComboBox";
import GroupHeaderListItem from "sap/m/GroupHeaderListItem";
import MessageBox from "sap/m/MessageBox";
import Table from "sap/m/Table";
import Wizard from "sap/m/Wizard";
import WizardStep from "sap/m/WizardStep";
import Event from "sap/ui/base/Event";
import { ValueState } from "sap/ui/core/library";
import History from "sap/ui/core/routing/History";
import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController";

export default class CreateOrder extends BaseController {
    public onInit(): void {
        console.log("CreateOrder controller initialized");

        const oWizard = this.byId("idCreateOrderWizard") as Wizard;
        oWizard.setShowNextButton(false);

        const button = this.byId("idNextStepButton") as Button;
        button.setVisible(false);
    }

    public onNavBack(): void {
        const snavBackConfirmationText = this.getResourceBundle().getText(
            "navBackConfirmationText",
        );
        const snavBackMessasgeBoxTitle = this.getResourceBundle().getText(
            "navBackMessasgeBoxTitle",
        );

        MessageBox.confirm(snavBackConfirmationText, {
            title: snavBackMessasgeBoxTitle,
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: (sAction: string) => {
                if (sAction === MessageBox.Action.OK) {
                    const oHistory = History.getInstance();
                    const sPreviousHash = oHistory.getPreviousHash();

                    if (sPreviousHash !== undefined) {
                        window.history.back();
                    } else {
                        const oRouter = UIComponent.getRouterFor(this);
                        oRouter.navTo("main", {}, true);
                    }
                }
            },
        });
    }

    public onCustomerSelected(oEvent: Event): void {
        const oWizard = this.byId("idCreateOrderWizard") as Wizard;
        const sCurrentStepId = oWizard.getCurrentStep();
        const oCurrentStep = this.byId(sCurrentStepId) as WizardStep;
        const oComboBox = oEvent.getSource() as ComboBox;
        const sSelectedKey = oComboBox.getSelectedKey();
        const sValue = oComboBox.getValue();
        const scomboboxValidationText = this.getResourceBundle().getText(
            "comboboxValidationText",
        );
        const sbuttonGoToOrderOverviewText = this.getResourceBundle().getText(
            "buttonGoToOrderOverviewText",
        );
        const oButton = this.byId("idNextStepButton") as Button;

        if (!sSelectedKey && sValue) {
            oComboBox.setValueState(ValueState.Error);
            oComboBox.setValueStateText(scomboboxValidationText);
        } else if (sValue) {
            oButton.setVisible(true);
            oButton.setText(sbuttonGoToOrderOverviewText);
            oButton.setEnabled(false);
            oComboBox.setValueState(ValueState.Success);
            oWizard.validateStep(oCurrentStep);
            oWizard.nextStep();
        } else {
            oComboBox.setValueState(ValueState.None);
        }
    }

    public getGroupHeader = (oGroup: { key: string }): GroupHeaderListItem => {
        return new GroupHeaderListItem({
            title: oGroup.key
        });
    }

    public onProductsSelected(): void {
        const oTable = this.byId("idProductsTable") as Table;
        const aSelectedItems = oTable.getSelectedItems();
        const oButton = this.byId("idNextStepButton") as Button;

        if (aSelectedItems.length === 0) {
            oButton.setEnabled(false);
            return;
        }

        if (oButton) {
            oButton.setEnabled(true);
        }
    }

    public onGoToOrderOverview(): void {
        const oWizard = this.byId("idCreateOrderWizard") as Wizard;
        const sCurrentStepId = oWizard.getCurrentStep();
        const oCurrentStep = this.byId(sCurrentStepId) as WizardStep;
        const sbuttonPlaceOrderText = this.getResourceBundle().getText(
            "buttonPlaceOrderText",
        );
        const oButton = this.byId("idNextStepButton") as Button;

        oButton.setText(sbuttonPlaceOrderText);
        oButton.setType("Accept");
        oButton.setEnabled(false);

        oWizard.validateStep(oCurrentStep);
        oWizard.nextStep();
    }

    public onCancel(): void {
        const scancelConfirmationText = this.getResourceBundle().getText(
            "cancelConfirmationText",
        );
        const scancelMessasgeBoxTitle = this.getResourceBundle().getText(
            "cancelMessasgeBoxTitle",
        );

        MessageBox.confirm(scancelConfirmationText, {
            title: scancelMessasgeBoxTitle,
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: (sAction: string) => {
                if (sAction === MessageBox.Action.OK) {
                    const oHistory = History.getInstance();
                    const sPreviousHash = oHistory.getPreviousHash();

                    if (sPreviousHash !== undefined) {
                        window.history.back();
                    } else {
                        const oRouter = UIComponent.getRouterFor(this);
                        oRouter.navTo("main", {}, true);
                    }
                }
            },
        });
    }
}
