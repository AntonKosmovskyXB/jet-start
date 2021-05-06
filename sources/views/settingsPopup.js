import {JetView} from "webix-jet";

import icons from "../models/icons";

export default class SettingsPopupView extends JetView {
	constructor(app, name, label, collection) {
		super(app, name);
		this.label = label;
		this.collection = collection;
	}

	config() {
		const _ = this.app.getService("locale")._;
		const window = {
			view: "window",
			modal: true,
			localId: "popup",
			head: {
				localId: "header",
				template: "#headerTemplate#"
			},
			position: "center",
			width: 600,
			body: {
				view: "form",
				localId: "popupForm",
				elements: [
					{
						view: "text",
						name: "Value",
						label: _(this.label),
						required: true,
						labelWidth: 90,
						invalidMessage: _("Field should not be empty")
					},
					{
						view: "richselect",
						name: "Icon",
						label: _("Icon"),
						labelWidth: 90,
						options: {
							template: obj => `<span class='${obj.icon}'></span>`,
							data: icons
						},
						required: true,
						invalidMessage: _("Icon must be selected")
					},
					{
						cols: [
							{
								view: "button",
								localId: "cancelButton",
								label: _("Cancel"),
								css: "webix_primary",
								click: () => {
									webix.confirm({
										text: _("Are you sure that you want to close editor?"),
										ok: _("Yes"),
										cancel: _("No")
									}).then(() => {
										this.closePopup();
									});
								}
							},
							{
								view: "button",
								localId: "saveButton",
								css: "webix_primary",
								click: () => {
									this.saveFormData(this.collection);
								}
							}
						]
					}
				]
			}
		};

		return window;
	}

	init() {
		this.popup = this.getRoot();
		this.form = this.$$("popupForm");
		this.saveButton = this.$$("saveButton");
		this.header = this.$$("header");
	}

	showPopup(collection, id) {
		const _ = this.app.getService("locale")._;

		if (id && collection.exists(id)) {
			this.form.setValues(collection.getItem(id));
			const headerTemplate = _(`Edit ${this.label.toLowerCase()}`);
			this.saveButton.setValue(_("Save"));
			this.header.setValues({headerTemplate});
		}

		else {
			const headerTemplate = _(`Add ${this.label.toLowerCase()}`);
			this.saveButton.setValue(_("Add"));
			this.header.setValues({headerTemplate});
		}

		this.popup.show();
	}

	saveFormData(collection) {
		const validationResult = this.form.validate();
		if (validationResult) {
			const newItem = this.form.getValues();
			if (newItem.id) {
				collection.updateItem(newItem.id, newItem);
			}

			else {
				collection.add(newItem);
			}

			this.closePopup();
		}
	}

	closePopup() {
		this.popup.hide();
		this.form.clear();
		this.form.clearValidation();
	}
}

