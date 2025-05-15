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
define(["require", "exports", "sap/m/MessageBox", "./BaseController", "sap/ui/core/routing/History", "sap/ui/core/UIComponent"], function (require, exports, MessageBox_1, BaseController_1, History_1, UIComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CreateOrder = /** @class */ (function (_super) {
        __extends(CreateOrder, _super);
        function CreateOrder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CreateOrder.prototype.onInit = function () {
            console.log("CreateOrder controller initialized");
        };
        CreateOrder.prototype.onNavBack = function () {
            var _this = this;
            MessageBox_1.default.confirm("Are you sure you want to go back? Unsaved data will be lost.", {
                title: "Confirm Navigation",
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
                            oRouter.navTo("main", {}, true); // replace=true to clear history
                        }
                    }
                }
            });
        };
        return CreateOrder;
    }(BaseController_1.default));
    exports.default = CreateOrder;
});
