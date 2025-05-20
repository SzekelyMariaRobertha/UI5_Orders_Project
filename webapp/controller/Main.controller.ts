import ColumnListItem from "sap/m/ColumnListItem";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import SearchField from "sap/m/SearchField";
import Table from "sap/m/Table";
import Event from "sap/ui/base/Event";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import BaseController from "./BaseController";
import GroupHeaderListItem from "sap/m/GroupHeaderListItem";


/**
 * @namespace ui5training.controller
 */
export default class Main extends BaseController {

    public onInit(): void {
        console.log("Main controller initialized");
    }

    public onSearch(oEvent: Event): void {
        const sQuery = (oEvent.getSource() as SearchField).getValue();
        const oTable = this.byId("idOrdersTable") as Table;
        const oBinding = oTable.getBinding("items") as ListBinding;

        // Since we have OrderID as number, we cannot filter on it
        // If we want to filter on it, we need to convert it to string in json file, but if we do that we wont be able to delete the entrie
        // Conclusion: we cannot filter on OrderID, we will filter on the other fields
        if (sQuery && sQuery.length > 0) {
            let oMultiFilter: Filter = new Filter({
                filters: [
                    new Filter("Customer/CompanyName", FilterOperator.Contains, sQuery),
                    new Filter("Freight", FilterOperator.Contains, sQuery),
                    new Filter("Shipper/CompanyName", FilterOperator.Contains, sQuery),
                    new Filter("ShipCity", FilterOperator.Contains, sQuery),
                    new Filter("ShipCountry", FilterOperator.Contains, sQuery),
                    new Filter("Employee/LastName", FilterOperator.Contains, sQuery),
                    new Filter("Employee/FirstName", FilterOperator.Contains, sQuery)
                ]
            });
            oBinding.filter(oMultiFilter);
        } else {
            oBinding.filter([]);
        }
    }

    public onCreatePress(oEvent: Event): void {
        this.getRouter().navTo("create");
    }

    public onDeletePress(): void {
        const oTable = this.byId("idOrdersTable") as Table;
        const oModel = this.getView().getModel() as ODataModel; // This is ODataModel!
        const aSelectedItems = oTable.getSelectedItems();
        const sAtLeastOneEntryText = this.getResourceBundle().getText("atLeastOneEntryText");
        const sdeleteMessasgeBoxTitle = this.getResourceBundle().getText("deleteMessasgeBoxTitle");
        const sdeleteConfirmationText = this.getResourceBundle().getText("deleteConfirmationText");
        const sdeleteSuccessText = this.getResourceBundle().getText("deleteSuccessText");
        const sdeleteErrorText = this.getResourceBundle().getText("deleteErrorText");


        if (aSelectedItems.length === 0) {
            MessageToast.show(sAtLeastOneEntryText);
            return;
        }

        MessageBox.confirm(sdeleteConfirmationText, {
            title: sdeleteMessasgeBoxTitle,
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: (sAction: string) => {
                if (sAction === MessageBox.Action.OK) {
                    aSelectedItems.forEach(oItem => {
                        const oContext = oItem.getBindingContext();
                        let sPath = oContext.getPath();
                        oModel.setUseBatch(true);
                        // oModel.createKey("/Orders", {OrderID: a} )   #For creare, example for future
                        oModel.remove(sPath);
                    });
                    if (oModel.hasPendingChanges()) {
                        oModel.submitChanges({
                            success: (oData: any) => {
                                MessageToast.show(sdeleteSuccessText);
                            },
                            error: (oResponse: any) => {
                                MessageToast.show(sdeleteErrorText);
                            }
                        })
                    }
                    oTable.removeSelections();
                    oModel.refresh();
                }
            }
        });
    }

    public getGroupHeader = (oGroup: { key: string }): GroupHeaderListItem => {
        return new GroupHeaderListItem({
            title: oGroup.key
        });
    }

    public onOrderPress(oEvent: Event): void {
        let oItem = (oEvent.getSource() as ColumnListItem).getBindingContext();
        let oOrder: any = oItem.getObject();
        let sID = String(oOrder.OrderID);
        this.getRouter().navTo("details", {
            OrderID: sID
        });
    }
}
