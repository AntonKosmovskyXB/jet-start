import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";

export default class ContactsFormView extends JetView {
	config() {
		const contactsFormHeaderLabel = {
			view: "label",
			label: "Edit contact",
			localId: "headerLabel",
			css: "header-label",
			padding: 10
		};

		const contactsForm = {
			view: "form",
			localId: "contactsForm",
			cols: [
				{
					margin: 30,
					width: 350,
					rows: [
						{
							view: "text",
							name: "FirstName",
							label: "First Name",
							required: true,
							invalidMessage: "Field should not be empty"
						},
						{
							view: "text",
							name: "LastName",
							label: "Last Name",
							required: true,
							invalidMessage: "Field should not be empty"
						},
						{
							view: "datepicker",
							name: "StartDate",
							label: "Joining Date",
							width: 400,
							required: true,
							invalidMessage: "Field should not be empty"
						},
						{
							view: "richselect",
							name: "StatusID",
							label: "Status",
							options: {
								body: {
									data: statuses,
									template: "#Value#"
								}
							},
							required: true,
							invalidMessage: "Field should not be empty"
						},
						{
							view: "text",
							name: "Job",
							label: "Job"
						},
						{
							view: "text",
							name: "Company",
							label: "Company",
							required: true,
							invalidMessage: "Field should not be empty"
						},
						{
							view: "text",
							name: "Website",
							label: "Website"

						},
						{
							view: "text",
							name: "Address",
							label: "Address"
						}
					]
				},
				{},
				{
					margin: 30,
					width: 350,
					rows: [
						{
							view: "text",
							name: "Email",
							label: "Email",
							required: true,
							invalidMessage: "Field should not be empty"
						},
						{
							view: "text",
							name: "Skype",
							label: "Skype",
							required: true,
							invalidMessage: "Field should not be empty"
						},
						{
							view: "text",
							name: "Phone",
							label: "Phone",
							required: true,
							invalidMessage: "Field should not be empty"
						},
						{
							view: "datepicker",
							name: "Birthday",
							label: "Birthday",
							required: true,
							invalidMessage: "Field should not be empty"
						}
					]
				}
			],
			rules: {
				Email: webix.rules.isEmail
			}
		};

		const formButtons = {
			view: "toolbar",
			margin: 10,
			elements: [
				{},
				{
					view: "button",
					localId: "cancelButton",
					value: "Cancel",
					width: 150,
					css: "webix_primary",
					click: () => {
						this.contactsView.list.select(contacts.getFirstId());
						this.closeForm();
					}
				},
				{
					view: "button",
					localId: "saveButton",
					value: "Save",
					width: 150,
					css: "webix_primary",
					click: () => {
						this.saveContact();
					}
				}
			]
		};

		return {
			type: "clean",
			rows: [contactsFormHeaderLabel, contactsForm, {}, formButtons]
		};
	}

	init() {
		this.headerLabel = this.$$("headerLabel");
		this.saveButton = this.$$("saveButton");
		this.cancelButton = this.$$("cancelButton");
		this.form = this.$$("contactsForm");
		this.contactsView = this.getParentView();
	}

	showForm(id) {
		if (id && contacts.exists(id)) {
			const currentItem = contacts.getItem(id);
			this.form.setValues(currentItem);
		}

		else {
			this.headerLabel.config.label = "Add new contact";
			this.headerLabel.refresh();
			this.saveButton.setValue("Add");
		}
	}

	saveContact() {
		const validationResult = this.form.validate();
		if (validationResult) {
			const newItem = this.form.getValues();
			if (newItem.id) {
				contacts.updateItem(newItem.id, newItem);
			}

			else {
				contacts.add(newItem);
				this.contactsView.list.select(newItem.id);
			}

			this.closeForm();
		}
	}

	closeForm() {
		this.form.clear();
		this.form.clearValidation();
		this.show("./contactInfo");
	}
}
