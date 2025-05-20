import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import BaseController from "./BaseController";
import Event from "sap/ui/base/Event";
import Filter from "sap/ui/model/Filter";
import JSONModel from "sap/ui/model/json/JSONModel";
import FilterOperator from "sap/ui/model/FilterOperator";


export default class OrderDetails extends BaseController {

    public onInit(): void {
        console.log("OrderDetails controller initialized");

        const oRouter = this.getRouter();
        // let oRoute = oRouter.getRoute("details")
        // oRoute.attachPatternMatched(this.onPatternMatched, this);

        this.getRouter().getRoute("details").attachMatched(this.onRouteMatched, this);
    }

    private onRouteMatched(oEvent: any): void { //did as any due to not finding the correct type and did not want to waste time
        const oArgs = oEvent.getParameter("arguments" as any);
        const sOrderID = oArgs.OrderID;
        const oView = this.getView();
        const oModel = oView.getModel() as ODataModel;

        const sPath = oModel.createKey("/Orders", {
            OrderID: Number(sOrderID)
        });

        oView.bindElement({
            path: sPath,
            parameters: {
                expand: "Customer,Employee,Shipper"
            }
        });

        oModel.read("/Order_Details", {
            filters: [new Filter("OrderID", FilterOperator.EQ, sOrderID)],
            success: (oData: any) => {
                const aDetails = oData.results.map((entry: any) => {
                    const price = Number(entry.UnitPrice) || 0;
                    const qty = Number(entry.Quantity) || 0;
                    return {
                        ...entry,
                        TotalAmount: (price * qty).toFixed(2)
                    };
                });
        
                const fTotal = aDetails.reduce((sum: number, item: any) => {
                    return sum + Number(item.TotalAmount);
                }, 0);
        
                const oJSONModel = new JSONModel({
                    items: aDetails,
                    orderTotal: fTotal.toFixed(2)
                });
        
                oView.setModel(oJSONModel, "orderDetailsModel");
            }
        });
    }
}