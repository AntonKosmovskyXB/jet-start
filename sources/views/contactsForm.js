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
			borderless: true,
			cols: [
				{
					margin: 30,
					minWidth: 350,
					maxWidth: 600,
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
				{
					margin: 30,
					minWidth: 350,
					maxWidth: 600,
					rows: [
						{
							view: "text",
							name: "Email",
							label: "Email",
							required: true,
							invalidMessage: "Please, enter correct email address"
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
							invalidMessage: "Please, enter correct phone number"
						},
						{
							view: "datepicker",
							name: "Birthday",
							label: "Birthday",
							required: true,
							invalidMessage: "Field should not be empty"
						},
						{
							cols: [
								{
									localId: "contactPhoto",
									width: 200,
									borderless: true,
									template: obj => `<div class="user-photo"><img src=${obj.Photo || "./sources/styles/Person.jpg"} 
									alt="user-photo"></div>`
								},
								{
									view: "toolbar",
									borderless: true,
									rows: [
										{},
										{
											view: "uploader",
											localId: "photoUploader",
											value: "Change photo",
											autosend: false,
											on: {
												onBeforeFileAdd: (obj) => {
													const reader = new FileReader();
													reader.readAsDataURL(obj.file);
													reader.onloadend = () => {
														this.contactPhoto.setValues({Photo: reader.result});
													};
													return false;
												}
											}
										},
										{
											view: "button",
											value: "Delete photo",
											css: "webix_primary",
											click: () => {
												webix.confirm({
													text: "Are you sure that you want to delete photo?"
												}).then(() => {
													this.contactPhoto.setValues({Photo: ""});
												});
											}
										}
									]
								}
							]
						}
					]
				}
			],
			rules: {
				Email: webix.rules.isEmail,
				Phone: (value) => {
					const validValues = /\d/g;
					return validValues.test(value);
				}
			},
			on: {
				onItemClick: () => {
					this.form.clearValidation();
				}
			}
		};

		const formButtons = {
			view: "toolbar",
			css: "form-toolbar",
			margin: 10,
			borderless: true,
			elements: [
				{
					view: "button",
					localId: "cancelButton",
					value: "Cancel",
					width: 150,
					css: "webix_primary",
					click: () => {
						webix.confirm({
							text: "Are you sure that you want to close contact editor?"
						}).then(() => {
							if (this.saveButton.getValue() === "Add") {
								this.contactsList.select(contacts.getFirstId());
							}
							this.clearForm();
							this.show("./contactInfo");
						});
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
			rows: [
				contactsFormHeaderLabel,
				contactsForm,
				{
					cols: [
						{},
						formButtons
					]
				},
				{}
			]
		};
	}

	init() {
		this.contactsList = this.getParentView().list;
		this.form = this.$$("contactsForm");
		this.headerLabel = this.$$("headerLabel");
		this.saveButton = this.$$("saveButton");
		this.contactPhoto = this.$$("contactPhoto");
	}

	updateForm(id) {
		if (id && contacts.exists(id)) {
			const currentItem = contacts.getItem(id);
			this.form.setValues(currentItem);
			this.headerLabel.config.label = "Edit contact";
			this.headerLabel.refresh();
			this.saveButton.setValue("Save");
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
				this.contactsList.select(newItem.id);
			}

			this.clearForm();
			this.show("./contactInfo");
		}
	}

	clearForm() {
		this.form.clear();
		this.form.clearValidation();
	}
}
