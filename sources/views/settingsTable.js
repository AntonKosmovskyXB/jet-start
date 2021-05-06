import {JetView} from "webix-jet";

import SettingsPopupView from "./settingsPopup";

export default class SettingsTableView extends JetView {
	constructor(app, name, collection, header, label) {
		super(app, name);
		this.collection = collection;
		this.header = header;
		this.label = label;
	}

	config() {
		const _ = this.app.getService("locale")._;

		const datatable = {
			view: "datatable",
			localId: "datatable",
			scroll: "y",
			margin: 10,
			select: true,
			columns: [
				{
					id: "Icon",
					header: "",
					width: 50,
					template: "<span class='webix_icon mdi mdi-#Icon#'></span>"
				},
				{
					id: "Value",
					header: this.header,
					fillspace: true
				},
				{template: "<span class='webix_icon wxi-pencil'></span>"},
				{template: "<span class='webix_icon wxi-trash'></span>"}
			],
			onClick: {
				"wxi-trash": (event, id) => {
					webix.confirm({
						text: _(`Are you sure that you want to remove this ${this.label.toLowerCase()} item?`),
						ok: _("Yes"),
						cancel: _("No")
					}).then(() => {
						this.collection.remove(id);
					});
					return false;
				},
				"wxi-pencil": (event, id) => {
					this.popup.showPopup(this.collection, id);
				}
			}
		};

		const button = {
			margin: 10,
			cols: [
				{
					view: "button",
					localId: "addActivityButton",
					type: "icon",
					icon: "wxi-plus",
					label: _(`Add ${this.label.toLowerCase()} type`),
					width: 300,
					css: "webix_primary",
					click: () => {
						this.popup.showPopup(this.collection);
					}
				},
				{}
			]
		};

		return {
			rows: [
				button,
				datatable
			]
		};
	}

	init() {
		this.datatable = this.$$("datatable");
		this.datatable.sync(this.collection);
		this.popup = this.ui(new SettingsPopupView(this.app, "", this.label, this.collection));
	}
}
