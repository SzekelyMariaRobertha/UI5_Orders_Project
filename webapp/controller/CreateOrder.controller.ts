import Button from "sap/m/Button";
import ColumnListItem from "sap/m/ColumnListItem";
import ComboBox from "sap/m/ComboBox";
import GroupHeaderListItem from "sap/m/GroupHeaderListItem";
import MessageBox from "sap/m/MessageBox";
import StepInput from "sap/m/StepInput";
import Table from "sap/m/Table";
import Text from "sap/m/Text";
import Wizard from "sap/m/Wizard";
import WizardStep from "sap/m/WizardStep";
import Event from "sap/ui/base/Event";
import { ValueState } from "sap/ui/core/library";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { Order } from "ui5training/model/order";
import { OrderDetails } from "ui5training/model/order_details";
import { SelectedProduct } from "ui5training/model/products";
import BaseController from "./BaseController";

export default class CreateOrder extends BaseController {

    public onInit(): void {
        console.log("CreateOrder controller initialized");

        const oWizard = this.byId("idCreateOrderWizard") as Wizard;
        oWizard.setShowNextButton(false);

        this.getRouter().getRoute("create").attachMatched(this.onRouteMatched, this);
    }

    private generateOrderId(): number {
        const now = Date.now().toString().slice(-3); // last 3 digits of ms timestamp
        const rand = Math.floor(10 + Math.random() * 90); // 2-digit random number
        return Number(now + rand); // always 5 digits
    }

    public onRouteMatched(): void {
        const oView = this.getView();
        const oModel = oView.getModel() as ODataModel;
        const oViewModel = oView.getModel("viewModel") as JSONModel;

        const nOrderId = this.generateOrderId();
        const oOrder: Order = {
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
            success: (oData: any) => {
                const sPath = (oView.getModel() as ODataModel).createKey("/Orders", {
                    OrderID: oData.OrderID
                });

                // !! This tells the ODataModel to set the property CustomerID at the full path of the newly created order
                // const sCustomerID = "TSK102";
                // oModel.setProperty(sPath + "/CustomerID", sCustomerID)
                // oModel.submitChanges(); // submit changes to the server(BE) 
                // oModel.refresh(true); // refresh the model to get the latest data from the server

                oView.bindElement(sPath, {
                    success: (oData: any) => {
                        oViewModel.setProperty("/busy", false);
                        console.log();
                    },
                    error: (oResponse: any) => {
                        console.log();
                    }
                });
            },
            error: (oResponse: any) => {
                console.log();
            }
        });

    }

    public navigationChange(oEvent: Event): void {
        const oWizard = this.byId("idCreateOrderWizard") as Wizard;
        const oFromStep = this.byId(oWizard.getCurrentStep()) as WizardStep;
        const oToStep = (oEvent as any).getParameter("step") as WizardStep;
        const aSteps = oWizard.getSteps();
        const iFromIndex = aSteps.indexOf(oFromStep);
        const iToIndex = aSteps.indexOf(oToStep);

        if (iToIndex < iFromIndex) {
            MessageBox.warning(this.getResourceBundle().getText("discardChangesText"), {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: (sAction: string) => {
                    if (sAction === MessageBox.Action.OK) {
                        for (let i = iToIndex; i <= iFromIndex; i++) {
                            oWizard.invalidateStep(aSteps[i]);
                        }

                        oWizard.discardProgress(oToStep, false);
                        oWizard.goToStep(oToStep, false);

                        const oView = this.getView();
                        const oViewModel = oView.getModel("viewModel") as JSONModel;

                        if (iToIndex === 0) {
                            const oProductsTable = this.byId("idProductsTable") as Table;
                            oProductsTable.removeSelections(true);

                            oViewModel.setProperty("/step", iToIndex);
                            oViewModel.setProperty("/productsSelected", false);
                            oViewModel.setProperty("/selectedProducts", []);
                            oViewModel.setProperty("/totalAmount", "");
                            oViewModel.setProperty("/busy", false);
                        } else if (iToIndex === 1) {
                            oViewModel.setProperty("/step", iToIndex);
                            oViewModel.setProperty("/totalAmount", "");
                            oViewModel.setProperty("/busy", false);
                        }
                    }
                }
            });

            oEvent.preventDefault?.();
        }
    }

    public onCustomerSelected(oEvent: Event): void {
        const oView = this.getView();
        const oModel = oView.getModel() as ODataModel;
        const oViewModel = oView.getModel("viewModel") as JSONModel;
        const oWizard = this.byId("idCreateOrderWizard") as Wizard;
        const oComboBox = oEvent.getSource() as ComboBox;
        const sValue = oComboBox.getValue();
        const sValidationText = this.getResourceBundle().getText("comboboxValidationText");

        const oCurrentStep = this.byId(oWizard.getCurrentStep()) as WizardStep;

        // Empty input
        if (!sValue) {
            oComboBox.setValueState(ValueState.None);
            oWizard.invalidateStep(oCurrentStep);
            oViewModel.setProperty("/customerSelected", false);
            return;
        }

        // Try to find a matching item
        const oSelectedItem = oComboBox.getItems().find(item => item.getText() === sValue);

        if (oSelectedItem) {
            // Valid input
            const sCustomerID = oSelectedItem.getKey();
            const sCompanyName = oSelectedItem.getText();
            const sOrderPath = oView.getBindingContext()?.getPath();

            if (sOrderPath) {
                oModel.setProperty(`${sOrderPath}/CustomerID`, sCustomerID);
                oModel.setProperty(`${sOrderPath}/Customer/CompanyName`, sCompanyName);
                oComboBox.setValueState(ValueState.Success);
                oWizard.validateStep(oCurrentStep);
                oViewModel.setProperty("/customerSelected", true);
                oWizard.nextStep();
                const oNextStep = oWizard.getProgressStep();
                const iNextIndex = oWizard.getSteps().indexOf(oNextStep);
                oViewModel.setProperty("/step", iNextIndex);
            }
        } else {
            // Invalid input
            oComboBox.setValueState(ValueState.Error);
            oComboBox.setValueStateText(sValidationText);
            oWizard.invalidateStep(oCurrentStep);
            oViewModel.setProperty("/customerSelected", false);
        }
    }

    public getGroupHeader = (oGroup: { key: string }): GroupHeaderListItem => {
        return new GroupHeaderListItem({
            title: oGroup.key
        });
    }

    public onProductsSelected(): void {
        const oView = this.getView();
        const oViewModel = oView.getModel("viewModel") as JSONModel;
        const oTable = this.byId("idProductsTable") as Table;
        const aSelectedItems = oTable.getSelectedItems();
        const bHasSelection = aSelectedItems.length > 0;

        oViewModel.setProperty("/productsSelected", bHasSelection);

        const aSelectedContexts = oTable.getSelectedContexts();
        const aSelectedProducts = aSelectedContexts.map(ctx => {
            const product = ctx.getObject();
            return {
                ...product,
                Quantity: 1 // default
            };
        });
        oViewModel.setProperty("/selectedProducts", aSelectedProducts);
        this.calculateTotalAmount();
    }

    public onGoToOrderOverview(): void {
        const oView = this.getView();
        const oModel = oView.getModel() as ODataModel;
        const oViewModel = oView.getModel("viewModel") as JSONModel;
        const oWizard = this.byId("idCreateOrderWizard") as Wizard;
        const oCurrentStep = this.byId(oWizard.getCurrentStep()) as WizardStep;

        const sOrderPath = oView.getBindingContext()?.getPath();
        const sCustomerID = oModel.getProperty(sOrderPath + "/CustomerID");
        const oFilter = new Filter("CustomerID", FilterOperator.EQ, sCustomerID);


        oModel.read("/Customers", {
            filters: [oFilter],
            success: (oData: any) => {
                if (oData.results.length > 0) {
                    const oCustomer = oData.results[0];
                    const oCustomerModel = new JSONModel(oCustomer);
                    oView.setModel(oCustomerModel, "customerData");
                }
            },
            error: (oResponse: any) => {
                console.log();
            }
        });

        const oOverviewTable = this.byId("idSelectedProductsOverviewTable") as Table;

        oOverviewTable.setModel(oViewModel, "viewModel");
        oOverviewTable.bindItems({
            path: "viewModel>/selectedProducts",
            template: new ColumnListItem({
                cells: [
                    new Button({
                        icon: "sap-icon://delete",
                        type: "Transparent",
                        tooltip: "{i18n>deleteTooltipText}",
                        press: this.onDeleteProduct.bind(this)
                    }),
                    new Text({ text: "{viewModel>ProductName}" }),
                    new Text({ text: "{viewModel>Category/Description}" }),
                    new Text({ text: "{viewModel>Supplier/CompanyName}" }),
                    new Text({ text: "{viewModel>QuantityPerUnit}" }),
                    new Text({ text: "{viewModel>UnitPrice} $" }),
                    new StepInput({
                        value: "{viewModel>Quantity}",
                        min: 1,
                        max: {
                            parts: [
                                { path: "viewModel>UnitsInStock" },
                                { path: "viewModel>UnitsOnOrder" }
                            ],
                            formatter: (inStock: string, onOrder: string) => {
                                const stock = Number(inStock) || 0;
                                const ordered = Number(onOrder) || 0;
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
                    new Text({
                        text: "{= (Number(${viewModel>UnitPrice} || 0) * Number(${viewModel>Quantity} || 0)).toFixed(2) + ' $'}"
                    })
                ]
            })
        });

        this.calculateTotalAmount();

        oWizard.validateStep(oCurrentStep);
        oWizard.nextStep();
        const oNextStep = oWizard.getProgressStep();
        const iNextIndex = oWizard.getSteps().indexOf(oNextStep);
        oViewModel.setProperty("/step", iNextIndex);
    }

    public onQuantityChanged(oEvent: Event): void {
        const oStepInput = oEvent.getSource() as StepInput;
        oStepInput.setValueState("Success");
        this.calculateTotalAmount();
    }

    private calculateTotalAmount(): void {
        const oView = this.getView();
        const oViewModel = oView.getModel("viewModel") as JSONModel;
        const aProducts = oViewModel.getProperty("/selectedProducts") || [];

        const total = aProducts.reduce((acc: any, product: any) => {
            const price = Number(product.UnitPrice) || 0;
            const qty = Number(product.Quantity) || 0;
            return acc + price * qty;
        }, 0);

        oViewModel.setProperty("/totalAmount", `${total.toFixed(2)}`);
    }

    public onDeleteProduct(oEvent: Event): void {
        const oView = this.getView();
        const oViewModel = oView.getModel("viewModel") as JSONModel;
        const aSelectedProducts = oViewModel.getProperty("/selectedProducts") || [];

        const oItem = (oEvent.getSource() as Button).getParent(); // ColumnListItem
        const oCtx = oItem.getBindingContext("viewModel");
        const oDeletedProduct = oCtx.getObject() as any;

        const aUpdatedProducts = aSelectedProducts.filter((p: any) => p.ProductID !== oDeletedProduct.ProductID);
        oViewModel.setProperty("/selectedProducts", aUpdatedProducts);
        oViewModel.setProperty("/productsSelected", aUpdatedProducts.length > 0);

        const oProductsTable = this.byId("idProductsTable") as Table;
        const aItems = oProductsTable.getItems();

        aItems.forEach(oItem => {
            const oContext = oItem.getBindingContext();
            const oProduct = oContext?.getObject() as any;

            if (oProduct?.ProductID === oDeletedProduct.ProductID) {
                oProductsTable.setSelectedItem(oItem, false);
            }
        });

        const oOverviwProductsTable = this.byId("idSelectedProductsOverviewTable") as Table;
        if (oOverviwProductsTable.getItems().length === 0) {
            const oWizard = this.byId("idCreateOrderWizard") as Wizard;
            const aSteps = oWizard.getSteps();
            const oCurrentStep = this.byId(oWizard.getCurrentStep()) as WizardStep;
            const iCurrentIndex = aSteps.indexOf(oCurrentStep);
            const oPreviousStep = aSteps[iCurrentIndex - 1];
            const iPreviousIndex = iCurrentIndex - 1;
    
            oWizard.invalidateStep(oCurrentStep);
            oWizard.discardProgress(oPreviousStep, false);
            oWizard.goToStep(oPreviousStep, false);

            oViewModel.setProperty("/step", iPreviousIndex);
            oViewModel.setProperty("/productsSelected", false);
            oViewModel.setProperty("/selectedProducts", []);
            oViewModel.setProperty("/totalAmount", "");
            oViewModel.setProperty("/busy", false);
        }
    }

    public onCancel(): void {
        const oView = this.getView();
        const oRouter = this.getRouter();
        const oWizard = this.byId("idCreateOrderWizard") as Wizard;
        const oViewModel = oView.getModel("viewModel") as JSONModel;
        const oModel = oView.getModel() as ODataModel;
        const oResourceBundle = this.getResourceBundle();

        const scancelConfirmationText = oResourceBundle.getText("cancelConfirmationText");
        const scancelMessasgeBoxTitle = oResourceBundle.getText("cancelMessasgeBoxTitle");

        MessageBox.confirm(scancelConfirmationText, {
            title: scancelMessasgeBoxTitle,
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            emphasizedAction: MessageBox.Action.OK,
            onClose: (sAction: string) => {
                if (sAction === MessageBox.Action.OK) {
                    oViewModel.setProperty("/busy", true);

                    oModel.remove(oView.getBindingContext().getPath(), {
                        success: () => {
                            oViewModel.setProperty("/busy", false);
                            console.log();
                        },
                        error: () => {
                            console.log();
                        }
                    });

                    this.clearWizard();
                }
            }
        });
    }

    public onSubmitOrder(): void {
        const oView = this.getView();
        const oModel = oView.getModel() as ODataModel;
        const oViewModel = oView.getModel("viewModel") as JSONModel;
        const aOrderProducts = oViewModel.getProperty("/selectedProducts") || [];

        const sOrderPath = oView.getBindingContext()?.getPath();
        const oOrderId = sOrderPath?.match(/\((\d+)\)/)?.[1]; // extract ID from "/Orders(20250518162530)"
        if (!oOrderId) return;

        aOrderProducts.forEach((product: SelectedProduct) => {
            const oOrderDetail: OrderDetails = {
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
                success: (oData: any) => {
                    const oWizard = this.byId("idCreateOrderWizard") as Wizard;
                    const oCurrentStep = this.byId(oWizard.getCurrentStep()) as WizardStep;
                    oWizard.validateStep(oCurrentStep);

                    this.clearWizard();
                },
                error: (oError: any) => {
                    console.error();
                }
            });
        });
    }

    public clearWizard(): void {
        const oViewModel = this.getView().getModel("viewModel") as JSONModel;
        const oWizard = this.byId("idCreateOrderWizard") as Wizard;

        oWizard.discardProgress(oWizard.getSteps()[0], false);

        const oComboBox = this.byId("idCustomerSelect") as ComboBox;
        oComboBox.setValueState(ValueState.None);

        const oProductsTable = this.byId("idProductsTable") as Table;
        oProductsTable.removeSelections(true);

        oViewModel.setProperty("/step", 0);
        oViewModel.setProperty("/customerSelected", false);
        oViewModel.setProperty("/productsSelected", false);
        oViewModel.setProperty("/selectedProducts", []);
        oViewModel.setProperty("/totalAmount", "");
        oViewModel.setProperty("/busy", false);

        const oRouter = this.getRouter();
        oRouter.navTo("main");

    }
}
