import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";

export default class ContactsFormView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
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
							label: _("First Name"),
							invalidMessage: "Field should not be empty"
						},
						{
							view: "text",
							name: "LastName",
							label: _("Last Name"),
							invalidMessage: "Field should not be empty"
						},
						{
							view: "datepicker",
							name: "StartDate",
							label: _("Joining Date"),
							invalidMessage: "Field should not be empty",
							labelHeight: 50
						},
						{
							view: "richselect",
							name: "StatusID",
							label: _("Status"),
							options: {
								body: {
									data: statuses,
									template: "#Value#"
								}
							},
							invalidMessage: "Field should not be empty"
						},
						{
							view: "text",
							name: "Job",
							label: _("Job"),
							required: false
						},
						{
							view: "text",
							name: "Company",
							label: _("Company"),
							invalidMessage: "Field should not be empty"
						},
						{
							view: "text",
							name: "Website",
							label: _("Website"),
							required: false

						},
						{
							view: "text",
							name: "Address",
							label: _("Address"),
							required: false
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
							label: _("Email"),
							invalidMessage: "Please, enter correct email address"
						},
						{
							view: "text",
							name: "Skype",
							label: _("Skype"),
							invalidMessage: "Field should not be empty"
						},
						{
							view: "text",
							name: "Phone",
							label: _("Phone"),
							invalidMessage: "Please, enter correct phone number"
						},
						{
							view: "datepicker",
							name: "Birthday",
							label: _("Birthday"),
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
											value: _("Change photo"),
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
											value: _("Delete photo"),
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
			elementsConfig: {
				labelWidth: 125,
				required: true
			},
			rules: {
				Email: webix.rules.isEmail,
				Phone: webix.rules.isNumber
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
					value: _("Cancel"),
					width: 150,
					css: "webix_primary",
					click: () => {
						webix.confirm({
							text: "Are you sure that you want to close contact editor?"
						}).then(() => {
							if (this.saveButton.getValue() === "Add") {
								this.app.callEvent("onSelectFirst");
							}
							this.app.callEvent("onCloseForm");
							this.clearForm();
							this.show("./contactInfo");
						});
					}
				},
				{
					view: "button",
					localId: "saveButton",
					value: _("Save"),
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
		this.form = this.$$("contactsForm");
		this.headerLabel = this.$$("headerLabel");
		this.saveButton = this.$$("saveButton");
		this.contactPhoto = this.$$("contactPhoto");
		this.on(this.app, "isFormSaved", () => !this.form.isDirty());
		this.on(this.app, "onShowForm", (id) => {
			if (id) {
				this.updateForm(id);
			}

			else {
				this.updateForm();
			}
		});
	}

	updateForm(id) {
		this.clearForm();

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
			this.clearForm();
			if (newItem.id) {
				contacts.updateItem(newItem.id, newItem);
			}

			else {
				contacts.add(newItem);
			}

			this.show("./contactInfo");
		}
	}

	clearForm() {
		this.form.clear();
		this.form.clearValidation();
	}
}
