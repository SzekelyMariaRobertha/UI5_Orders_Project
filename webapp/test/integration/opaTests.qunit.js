define(["require", "exports"], function (require, exports) {
    "use strict";
    /* @sapUiRequire */
    // https://api.qunitjs.com/config/autostart/
    QUnit.config.autostart = false;
    // import all your OPA journeys here
    void Promise.all([new Promise(function (resolve_1, reject_1) { require(["integration/HelloJourney"], resolve_1, reject_1); })]).then(function () {
        QUnit.start();
    });
});
