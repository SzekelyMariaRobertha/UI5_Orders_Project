"use strict";
/* eslint-disable */
// @ts-nocheck
window.suite = function () {
    var _a;
    var suite = new parent.jsUnitTestSuite();
    var sContextPath = (_a = location.pathname.match(/(.*\/)(?:[^/]+)/)) === null || _a === void 0 ? void 0 : _a[1];
    suite.addTestPage(sContextPath + "unit/unitTests.qunit.html");
    suite.addTestPage(sContextPath + "integration/opaTests.qunit.html");
    return suite;
};
