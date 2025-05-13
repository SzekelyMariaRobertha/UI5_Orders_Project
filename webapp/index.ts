import { initMockServer } from "./model/mockServer";
import ComponentContainer from "sap/ui/core/ComponentContainer";


if (location.hostname === "localhost") {
	initMockServer();
}

sap.ui.getCore().attachInit(() => {
	new ComponentContainer({
		name: "ui5training",
		settings: {
			id: "ui5training"
		},
		async: true
	}).placeAt("content");
});
