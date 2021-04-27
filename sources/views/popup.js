import {JetView} from "webix-jet";

import activities from "../models/activities";
import activitiesTypes from "../models/activitiesTypes";
import contacts from "../models/contacts";

export default class PopupView extends JetView {
	config() {
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
						label: "Details"
					},
					{
						view: "richselect",
						name: "TypeID",
						label: "Type",
						required: true,
						options: activitiesTypes,
						invalidMessage: "Type should be selected",
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
						label: "Contact",
						required: true,
						options: contacts,
						invalidMessage: "Contact should be selected",
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
								label: "Date",
								format: webix.i18n.dateFormatStr,
								invalidMessage: "Date should be selected"
							},
							{
								view: "datepicker",
								type: "time",
								required: true,
								name: "Time",
								label: "Time",
								format: webix.i18n.timeFormatStr,
								invalidMessage: "Time should be selected"
							}
						]
					},
					{
						cols: [
							{
								view: "checkbox",
								name: "State",
								labelRight: "Completed"
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
								value: "Cancel",
								click: () => {
									webix.confirm({
										text: "Are you sure that you want to close editor?"
									}).then(() => {
										this.closePopup();
									});
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
		this.form = this.$$("popupForm");
		this.popup = this.getRoot();
		this.saveButton = this.$$("saveButton");
		this.header = this.$$("header");
	}

	showPopup(id) {
		if (id && activities.exists(id)) {
			this.form.setValues(activities.getItem(id));
			const headerTemplate = "Edit activity";
			this.saveButton.setValue("Save");
			this.header.setValues({headerTemplate});
		}

		else {
			const headerTemplate = "Add activity";
			this.saveButton.setValue("Add");
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
		}
	}

	closePopup() {
		this.popup.hide();
		this.form.clear();
		this.form.clearValidation();
	}
}
