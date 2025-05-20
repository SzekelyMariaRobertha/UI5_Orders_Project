define(["require", "exports", "sap/ui/model/json/JSONModel", "sap/ui/model/BindingMode", "sap/ui/Device"], function (require, exports, JSONModel_1, BindingMode_1, Device_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        createDeviceModel: function () {
            var oModel = new JSONModel_1.default(Device_1.default);
            oModel.setDefaultBindingMode(BindingMode_1.default.OneWay);
            return oModel;
        },
        createViewModel: function () {
            var oModel = new JSONModel_1.default({
                busy: true,
                step: 0,
                customerSelected: false,
                productsSelected: false,
                selectedProducts: [],
                totalAmount: 0
            });
            return oModel;
        },
    };
});
