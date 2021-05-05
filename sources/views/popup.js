import {JetView} from "webix-jet";

import activities from "../models/activities";
import activitiesTypes from "../models/activitiesTypes";
import contacts from "../models/contacts";

export default class PopupView extends JetView {
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
						view: "textarea",
						name: "Details",
						label: _("Details")
					},
					{
						view: "richselect",
						name: "TypeID",
						label: _("Type"),
						required: true,
						options: activitiesTypes,
						invalidMessage: _("Type should be selected"),
						on: {
							onItemClick: () => {
								this.form.clearValidation();
							}
						}
					},
					{
						view: "richselect",
						name: "ContactID",
						localId: "contact",
						label: _("Contact"),
						required: true,
						options: contacts,
						invalidMessage: _("Contact should be selected"),
						on: {
							onItemClick: () => {
								this.form.clearValidation();
							}
						}
					},
					{
						cols: [
							{
								view: "datepicker",
								type: "date",
								required: true,
								name: "DueDate",
								label: _("Date"),
								format: webix.i18n.dateFormatStr,
								invalidMessage: _("Date should be selected")
							},
							{
								view: "datepicker",
								type: "time",
								required: true,
								name: "Time",
								label: _("Time"),
								format: webix.i18n.timeFormatStr,
								invalidMessage: _("Time should be selected")
							}
						]
					},
					{
						cols: [
							{
								view: "checkbox",
								name: "State",
								labelRight: _("Completed")
							},
							{}
						]
					},
					{
						cols: [
							{},
							{
								view: "button",
								localId: "saveButton",
								click: () => {
									this.saveActivity();
								}
							},
							{
								view: "button",
								value: _("Cancel"),
								click: () => {
									webix.confirm({
										text: _("Are you sure that you want to close editor?")
									}).then(() => {
										this.closePopup();
									});
								}
							}
						]
					}
				],
				rules: {
					ContactID: id => contacts.data.order.includes(parseInt(id)),
					TypeID: id => activitiesTypes.data.order.includes(parseInt(id))
				}
			}
		};

		return window;
	}

	init() {
		this.form = this.$$("popupForm");
		this.popup = this.getRoot();
		this.saveButton = this.$$("saveButton");
		this.header = this.$$("header");
	}

	showPopup(id) {
		const _ = this.app.getService("locale")._;
		if (id && activities.exists(id)) {
			this.form.setValues(activities.getItem(id));
			const headerTemplate = _("Edit activity");
			this.saveButton.setValue(_("Save"));
			this.header.setValues({headerTemplate});
		}

		else {
			const headerTemplate = _("Add activity");
			this.saveButton.setValue(_("Add"));
			this.header.setValues({headerTemplate});
		}

		this.popup.show();
	}

	saveActivity() {
		const validationResult = this.form.validate();
		if (validationResult) {
			const newItem = this.form.getValues();
			if (newItem.id) {
				activities.updateItem(newItem.id, newItem);
			}

			else {
				activities.add(newItem);
			}

			this.closePopup();
			this.app.callEvent("onDatatableChange", [this.getParentView().activitiesTable.getState()]);
		}
	}

	closePopup() {
		this.popup.hide();
		this.form.clear();
		this.form.clearValidation();
	}
}
