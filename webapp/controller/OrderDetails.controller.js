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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define(["require", "exports", "./BaseController", "sap/ui/model/Filter", "sap/ui/model/json/JSONModel", "sap/ui/model/FilterOperator"], function (require, exports, BaseController_1, Filter_1, JSONModel_1, FilterOperator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OrderDetails = /** @class */ (function (_super) {
        __extends(OrderDetails, _super);
        function OrderDetails() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OrderDetails.prototype.onInit = function () {
            console.log("OrderDetails controller initialized");
            var oRouter = this.getRouter();
            // let oRoute = oRouter.getRoute("details")
            // oRoute.attachPatternMatched(this.onPatternMatched, this);
            this.getRouter().getRoute("details").attachMatched(this.onRouteMatched, this);
        };
        OrderDetails.prototype.onRouteMatched = function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var sOrderID = oArgs.OrderID;
            var oView = this.getView();
            var oModel = oView.getModel();
            var sPath = oModel.createKey("/Orders", {
                OrderID: Number(sOrderID)
            });
            oView.bindElement({
                path: sPath,
                parameters: {
                    expand: "Customer,Employee,Shipper"
                }
            });
            oModel.read("/Order_Details", {
                filters: [new Filter_1.default("OrderID", FilterOperator_1.default.EQ, sOrderID)],
                success: function (oData) {
                    var aDetails = oData.results.map(function (entry) {
                        var price = Number(entry.UnitPrice) || 0;
                        var qty = Number(entry.Quantity) || 0;
                        return __assign(__assign({}, entry), { TotalAmount: (price * qty).toFixed(2) });
                    });
                    var fTotal = aDetails.reduce(function (sum, item) {
                        return sum + Number(item.TotalAmount);
                    }, 0);
                    var oJSONModel = new JSONModel_1.default({
                        items: aDetails,
                        orderTotal: fTotal.toFixed(2)
                    });
                    oView.setModel(oJSONModel, "orderDetailsModel");
                }
            });
        };
        return OrderDetails;
    }(BaseController_1.default));
    exports.default = OrderDetails;
});
