import MessageBox from "sap/m/MessageBox";
import History from "sap/ui/core/routing/History";
import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./BaseController";
import ComboBox from "sap/m/ComboBox";

export default class CreateOrder extends BaseController {

    public onInit(): void {
        console.log("CreateOrder controller initialized");
    }

    public onNavBack(): void {
        MessageBox.confirm(
            "Are you sure you want to go back? Unsaved data will be lost.",
            {
                title: "Confirm Navigation",
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
                }
            }
        );
    }

    public handleChange(oEvent: Event): void {
        const oComboBox = oEvent.getSource() as ComboBox;
        const sSelectedKey = oComboBox.getSelectedKey();
        const sValue = oComboBox.getValue();

        if (!sSelectedKey && sValue) {
            oComboBox.setValueState(ValueState.Error);
            oComboBox.setValueStateText("Please enter a valid customer!");
        } else {
            oComboBox.setValueState(ValueState.None);
        }
    }
}