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
define(["require", "exports", "sap/m/Button", "sap/m/ColumnListItem", "sap/m/GroupHeaderListItem", "sap/m/MessageBox", "sap/m/StepInput", "sap/m/Text", "sap/ui/core/library", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/json/JSONModel", "./BaseController"], function (require, exports, Button_1, ColumnListItem_1, GroupHeaderListItem_1, MessageBox_1, StepInput_1, Text_1, library_1, Filter_1, FilterOperator_1, JSONModel_1, BaseController_1) {
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
            this.getRouter().getRoute("create").attachMatched(this.onRouteMatched, this);
        };
        CreateOrder.prototype.generateOrderId = function () {
            var now = Date.now().toString().slice(-3); // last 3 digits of ms timestamp
            var rand = Math.floor(10 + Math.random() * 90); // 2-digit random number
            return Number(now + rand); // always 5 digits
        };
        CreateOrder.prototype.onRouteMatched = function () {
            var oView = this.getView();
            var oModel = oView.getModel();
            var oViewModel = oView.getModel("viewModel");
            var nOrderId = this.generateOrderId();
            var oOrder = {
                OrderID: nOrderId,
                CustomerID: "",
                EmployeeID: "EMP001",
                OrderDate: "",
                RequiredDate: "",
                ShippedDate: "",
                ShipVia: "1",
                Freight: "20.00",
                ShipName: "Maria SRL",
                ShipAddress: "Str. Libertății 10",
                ShipCity: "Cluj-Napoca",
                ShipRegion: "Cluj",
                ShipPostalCode: "400001",
                ShipCountry: "Romania",
                Customer: {
                    CompanyName: ""
                },
                Employee: {
                    FirstName: "Maria",
                    LastName: "Popescu"
                },
                Shipper: {
                    CompanyName: "Fast Delivery Express"
                }
            };
            oModel.create("/Orders", oOrder, {
                success: function (oData) {
                    var sPath = oView.getModel().createKey("/Orders", {
                        OrderID: oData.OrderID
                    });
                    // !! This tells the ODataModel to set the property CustomerID at the full path of the newly created order
                    // const sCustomerID = "TSK102";
                    // oModel.setProperty(sPath + "/CustomerID", sCustomerID)
                    // oModel.submitChanges(); // submit changes to the server(BE) 
                    // oModel.refresh(true); // refresh the model to get the latest data from the server
                    oView.bindElement(sPath, {
                        success: function (oData) {
                            oViewModel.setProperty("/busy", false);
                            console.log();
                        },
                        error: function (oResponse) {
                            console.log();
                        }
                    });
                },
                error: function (oResponse) {
                    console.log();
                }
            });
        };
        CreateOrder.prototype.navigationChange = function (oEvent) {
            console.log();
        };
        CreateOrder.prototype.onCustomerSelected = function (oEvent) {
            var _a;
            var oView = this.getView();
            var oModel = oView.getModel();
            var oViewModel = oView.getModel("viewModel");
            var oWizard = this.byId("idCreateOrderWizard");
            var oComboBox = oEvent.getSource();
            var sValue = oComboBox.getValue();
            var sValidationText = this.getResourceBundle().getText("comboboxValidationText");
            var oCurrentStep = this.byId(oWizard.getCurrentStep());
            // Empty input
            if (!sValue) {
                oComboBox.setValueState(library_1.ValueState.None);
                oWizard.invalidateStep(oCurrentStep);
                oViewModel.setProperty("/customerSelected", false);
                return;
            }
            // Try to find a matching item
            var oSelectedItem = oComboBox.getItems().find(function (item) { return item.getText() === sValue; });
            if (oSelectedItem) {
                // Valid input
                var sCustomerID = oSelectedItem.getKey();
                var sCompanyName = oSelectedItem.getText();
                var sOrderPath = (_a = oView.getBindingContext()) === null || _a === void 0 ? void 0 : _a.getPath();
                if (sOrderPath) {
                    oModel.setProperty("".concat(sOrderPath, "/CustomerID"), sCustomerID);
                    oModel.setProperty("".concat(sOrderPath, "/Customer/CompanyName"), sCompanyName);
                    oComboBox.setValueState(library_1.ValueState.Success);
                    oWizard.validateStep(oCurrentStep);
                    oViewModel.setProperty("/customerSelected", true);
                    oWizard.nextStep();
                    var oNextStep = oWizard.getProgressStep();
                    var iNextIndex = oWizard.getSteps().indexOf(oNextStep);
                    oViewModel.setProperty("/step", iNextIndex);
                }
            }
            else {
                // Invalid input
                oComboBox.setValueState(library_1.ValueState.Error);
                oComboBox.setValueStateText(sValidationText);
                oWizard.invalidateStep(oCurrentStep);
                oViewModel.setProperty("/customerSelected", false);
            }
        };
        CreateOrder.prototype.onProductsSelected = function () {
            var oView = this.getView();
            var oViewModel = oView.getModel("viewModel");
            var oTable = this.byId("idProductsTable");
            var aSelectedItems = oTable.getSelectedItems();
            var bHasSelection = aSelectedItems.length > 0;
            oViewModel.setProperty("/productsSelected", bHasSelection);
            var aSelectedContexts = oTable.getSelectedContexts();
            var aSelectedProducts = aSelectedContexts.map(function (ctx) {
                var product = ctx.getObject();
                return __assign(__assign({}, product), { Quantity: 1 // default
                 });
            });
            oViewModel.setProperty("/selectedProducts", aSelectedProducts);
            this.calculateTotalAmount();
        };
        CreateOrder.prototype.onGoToOrderOverview = function () {
            var _a;
            var oView = this.getView();
            var oModel = oView.getModel();
            var oViewModel = oView.getModel("viewModel");
            var oWizard = this.byId("idCreateOrderWizard");
            var oCurrentStep = this.byId(oWizard.getCurrentStep());
            var sOrderPath = (_a = oView.getBindingContext()) === null || _a === void 0 ? void 0 : _a.getPath();
            var sCustomerID = oModel.getProperty(sOrderPath + "/CustomerID");
            var oFilter = new Filter_1.default("CustomerID", FilterOperator_1.default.EQ, sCustomerID);
            oModel.read("/Customers", {
                filters: [oFilter],
                success: function (oData) {
                    if (oData.results.length > 0) {
                        var oCustomer = oData.results[0];
                        var oCustomerModel = new JSONModel_1.default(oCustomer);
                        oView.setModel(oCustomerModel, "customerData");
                    }
                },
                error: function (oResponse) {
                    console.log();
                }
            });
            var oOverviewTable = this.byId("idSelectedProductsOverviewTable");
            oOverviewTable.setModel(oViewModel, "viewModel");
            oOverviewTable.bindItems({
                path: "viewModel>/selectedProducts",
                template: new ColumnListItem_1.default({
                    cells: [
                        new Button_1.default({
                            icon: "sap-icon://delete",
                            type: "Transparent",
                            tooltip: "{i18n>deleteTooltip}",
                            press: this.onDeleteProduct.bind(this)
                        }),
                        new Text_1.default({ text: "{viewModel>ProductName}" }),
                        new Text_1.default({ text: "{viewModel>Category/Description}" }),
                        new Text_1.default({ text: "{viewModel>Supplier/CompanyName}" }),
                        new Text_1.default({ text: "{viewModel>QuantityPerUnit}" }),
                        new Text_1.default({ text: "{viewModel>UnitPrice} $" }),
                        new StepInput_1.default({
                            value: "{viewModel>Quantity}",
                            min: 1,
                            max: {
                                parts: [
                                    { path: "viewModel>UnitsInStock" },
                                    { path: "viewModel>UnitsOnOrder" }
                                ],
                                formatter: function (inStock, onOrder) {
                                    var stock = Number(inStock) || 0;
                                    var ordered = Number(onOrder) || 0;
                                    return Math.max(1, stock - ordered);
                                }
                            },
                            step: 1,
                            valueState: "Success",
                            // valueState: {
                            //     parts: [
                            //         { path: "viewModel>Quantity" },
                            //         { path: "viewModel>UnitsInStock" },
                            //         { path: "viewModel>UnitsOnOrder" }
                            //     ],
                            //     formatter: (qty: String, inStock: String, onOrder: String) => {
                            //         const q = Number(qty) || 0;
                            //         const s = Number(inStock) || 0;
                            //         const o = Number(onOrder) || 0;
                            //         return s >= o + q ? "Success" : "Error";
                            //     }
                            // },
                            // valueStateText: "{i18n>quantityStockErrorText}",
                            change: this.onQuantityChanged.bind(this)
                        }),
                        new Text_1.default({
                            text: "{= (Number(${viewModel>UnitPrice} || 0) * Number(${viewModel>Quantity} || 0)).toFixed(2) + ' $'}"
                        })
                    ]
                })
            });
            this.calculateTotalAmount();
            oWizard.validateStep(oCurrentStep);
            oWizard.nextStep();
            var oNextStep = oWizard.getProgressStep();
            var iNextIndex = oWizard.getSteps().indexOf(oNextStep);
            oViewModel.setProperty("/step", iNextIndex);
        };
        CreateOrder.prototype.onQuantityChanged = function (oEvent) {
            var oStepInput = oEvent.getSource();
            oStepInput.setValueState("Success");
            this.calculateTotalAmount();
        };
        CreateOrder.prototype.calculateTotalAmount = function () {
            var oView = this.getView();
            var oViewModel = oView.getModel("viewModel");
            var aProducts = oViewModel.getProperty("/selectedProducts") || [];
            var total = aProducts.reduce(function (acc, product) {
                var price = Number(product.UnitPrice) || 0;
                var qty = Number(product.Quantity) || 0;
                return acc + price * qty;
            }, 0);
            oViewModel.setProperty("/totalAmount", "".concat(total.toFixed(2)));
        };
        CreateOrder.prototype.onDeleteProduct = function (oEvent) {
            var oView = this.getView();
            var oViewModel = oView.getModel("viewModel");
            var aSelectedProducts = oViewModel.getProperty("/selectedProducts") || [];
            var oItem = oEvent.getSource().getParent(); // ColumnListItem
            var oCtx = oItem.getBindingContext("viewModel");
            var oDeletedProduct = oCtx.getObject();
            var aUpdatedProducts = aSelectedProducts.filter(function (p) { return p.ProductID !== oDeletedProduct.ProductID; });
            oViewModel.setProperty("/selectedProducts", aUpdatedProducts);
            oViewModel.setProperty("/productsSelected", aUpdatedProducts.length > 0);
            // Deselect from products table
            var oProductsTable = this.byId("idProductsTable");
            var aItems = oProductsTable.getItems();
            aItems.forEach(function (oItem) {
                var oContext = oItem.getBindingContext();
                var oProduct = oContext === null || oContext === void 0 ? void 0 : oContext.getObject();
                if ((oProduct === null || oProduct === void 0 ? void 0 : oProduct.ProductID) === oDeletedProduct.ProductID) {
                    oProductsTable.setSelectedItem(oItem, false);
                }
            });
            this.calculateTotalAmount();
        };
        // public onDeleteOrderProduct(oEvent): void {
        //     //asta e functie pentru X-ul de pe fiecare line item al OrderOverview table of products
        //     // let sPathToDelete = oEvent.getSource().getParent().getBindingContext().getPath();
        //     // oModel.remove(sPathToDelete, {});
        // }
        CreateOrder.prototype.onCancel = function () {
            var _this = this;
            var oView = this.getView();
            var oRouter = this.getRouter();
            var oWizard = this.byId("idCreateOrderWizard");
            var oViewModel = oView.getModel("viewModel");
            var oModel = oView.getModel();
            var oResourceBundle = this.getResourceBundle();
            var scancelConfirmationText = oResourceBundle.getText("cancelConfirmationText");
            var scancelMessasgeBoxTitle = oResourceBundle.getText("cancelMessasgeBoxTitle");
            MessageBox_1.default.confirm(scancelConfirmationText, {
                title: scancelMessasgeBoxTitle,
                actions: [MessageBox_1.default.Action.OK, MessageBox_1.default.Action.CANCEL],
                emphasizedAction: MessageBox_1.default.Action.OK,
                onClose: function (sAction) {
                    if (sAction === MessageBox_1.default.Action.OK) {
                        oViewModel.setProperty("/busy", true);
                        oModel.remove(oView.getBindingContext().getPath(), {
                            success: function () {
                                oViewModel.setProperty("/busy", false);
                                console.log();
                            },
                            error: function () {
                                console.log();
                            }
                        });
                        _this.clearWizard();
                    }
                }
            });
        };
        CreateOrder.prototype.onSubmitOrder = function () {
            var _this = this;
            var _a, _b;
            var oView = this.getView();
            var oModel = oView.getModel();
            var oViewModel = oView.getModel("viewModel");
            var aOrderProducts = oViewModel.getProperty("/selectedProducts") || [];
            var sOrderPath = (_a = oView.getBindingContext()) === null || _a === void 0 ? void 0 : _a.getPath();
            var oOrderId = (_b = sOrderPath === null || sOrderPath === void 0 ? void 0 : sOrderPath.match(/\((\d+)\)/)) === null || _b === void 0 ? void 0 : _b[1]; // extract ID from "/Orders(20250518162530)"
            if (!oOrderId)
                return;
            aOrderProducts.forEach(function (product) {
                var oOrderDetail = {
                    OrderID: Number(oOrderId),
                    ProductID: product.ProductID,
                    UnitPrice: product.UnitPrice,
                    Quantity: String(product.Quantity),
                    Discount: "0",
                    Product: {
                        ProductID: product.ProductID,
                        ProductName: product.ProductName,
                        SupplierID: product.SupplierID,
                        CategoryID: product.CategoryID,
                        QuantityPerUnit: product.QuantityPerUnit,
                        UnitPrice: product.UnitPrice,
                        UnitsInStock: product.UnitsInStock,
                        UnitsOnOrder: product.UnitsOnOrder,
                        ReorderLevel: product.ReorderLevel,
                        Discontinued: product.Discontinued,
                        Category: product.Category,
                        Supplier: product.Supplier
                    }
                };
                oViewModel.setProperty("/busy", true);
                oModel.create("/Order_Details", oOrderDetail, {
                    success: function (oData) {
                        var oWizard = _this.byId("idCreateOrderWizard");
                        var oCurrentStep = _this.byId(oWizard.getCurrentStep());
                        oWizard.validateStep(oCurrentStep);
                        _this.clearWizard();
                    },
                    error: function (oError) {
                        console.error();
                    }
                });
            });
        };
        CreateOrder.prototype.clearWizard = function () {
            var oViewModel = this.getView().getModel("viewModel");
            var oWizard = this.byId("idCreateOrderWizard");
            oWizard.discardProgress(oWizard.getSteps()[0], false);
            var oComboBox = this.byId("idCustomerSelect");
            oComboBox.setValueState(library_1.ValueState.None);
            var oProductsTable = this.byId("idProductsTable");
            oProductsTable.removeSelections(true);
            oViewModel.setProperty("/step", 0);
            oViewModel.setProperty("/customerSelected", false);
            oViewModel.setProperty("/productsSelected", false);
            oViewModel.setProperty("/selectedProducts", []);
            oViewModel.setProperty("/totalAmount", "");
            oViewModel.setProperty("/busy", false);
            var oRouter = this.getRouter();
            oRouter.navTo("main");
        };
        return CreateOrder;
    }(BaseController_1.default));
    exports.default = CreateOrder;
});
