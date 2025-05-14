import BaseController from "./BaseController";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Label from "sap/m/Label";
import Event from "sap/ui/base/Event";
import SearchField from "sap/m/SearchField";
import ListBinding from "sap/ui/model/ListBinding";
import Table from "sap/m/Table";
import UIComponent from "sap/ui/core/UIComponent";


/**
 * @namespace ui5training.controller
 */
export default class Main extends BaseController {
	
	public onInit(): void {
		console.log("Main controller initialized");

		// Retrieve models from the manifest
        const oOrderModel = this.getOwnerComponent().getModel("order");
        const oCustomerModel = this.getOwnerComponent().getModel("customer");

        // Set models to the view (this will bind them to the XML view automatically)
        this.getView().setModel(oOrderModel, "order");
		this.getView().setModel(oCustomerModel, "customer");
	}

	public onSearch(oEvent: Event): void {
		const sQuery = (oEvent.getSource() as SearchField).getValue();
		const aFilters: Filter[] = [];
	  
		if (sQuery && sQuery.length > 0) {
		  aFilters.push(new Filter("CustomerID", FilterOperator.Contains, sQuery));
		}
	  
		const oTable = this.byId("idOrdersTable") as Table;
		const oBinding = oTable.getBinding("items") as ListBinding;
		oBinding.filter(aFilters, "Application");
	}
	
	public onSelectionChange(oEvent: Event): void {
		const oTable = this.byId("idOrdersTable") as Table;
		const oLabel = this.byId("idFilterLabel") as Label;
	  
		const aContexts = oTable.getSelectedContexts(true); // include contexts even they are not showed
	  
		const bSelected = aContexts && aContexts.length > 0;
	  
		const sText = bSelected ? `${aContexts.length} selected` : "";
		oLabel.setText(sText);
	}
}
