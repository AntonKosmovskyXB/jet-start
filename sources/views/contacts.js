import {JetView} from "webix-jet";

import contacts from "../models/contacts";

export default class ContactsView extends JetView {
	config() {
		const usersList = {
			view: "list",
			id: "contactsList",
			select: true,
			width: 300,
			type: {
				template: `<div class="contacts-list"><span class='webix_icon wxi-user'></span> <div class='short-info'>
				<span class='contact-name'>#value#</span> <br> <span class='contact-company' style="font-size: 11px">#Company#</span></div></div>`,
				height: 45
			},
			on: {
				onBeforeSelect: (id) => {
					const contactsFormView = this.getSubView();
					if (contactsFormView.form && contactsFormView.form.isDirty()) {
						webix.confirm({
							text: "Are you sure that you want to close contact editor? Data will not be saved"
						}).then(() => {
							contactsFormView.clearForm();
							this.list.select(id);
						});
						return false;
					}

					return true;
				},
				onAfterSelect: (id) => {
					const contactsFormView = this.getSubView();
					this.setUrlParam(id);
					if (contactsFormView.form) {
						contactsFormView.updateForm(id);
					}
				}
			}
		};

		const addContactButton = {
			view: "button",
			localId: "addContactButton",
			borderless: false,
			type: "icon",
			icon: "wxi-plus",
			label: "Add contact",
			css: "webix_primary",
			click: () => {
				const currentSubview = this.getSubView();
				if (currentSubview.form && currentSubview.form.isDirty()) {
					webix.confirm({
						text: "Are you sure that you want to close contact editor? Data will not be saved"
					}).then(() => {
						this.updateForm();
					});
					return false;
				}

				this.show("./contactsForm").then(() => {
					this.updateForm();
				});
				return true;
			}
		};

		return {
			cols: [
				{rows: [usersList, addContactButton]},
				{$subview: true}
			]
		};
	}

	init() {
		this.list = this.$$("contactsList");
		this.list.sync(contacts);
		contacts.waitData.then(() => {
			this.show("./contactInfo");
		});
		webix.dp(contacts).attachEvent("onAfterSave", (response) => {
			this.setParam("id", response.id, true);
		});
	}

	urlChange() {
		contacts.waitData.then(() => {
			const id = this.getParam("id") || contacts.getFirstId();

			if (id && contacts.exists(id)) {
				this.list.select(id);
			}

			else {
				this.list.select(contacts.getFirstId());
			}
		});
	}


	updateForm() {
		const contactsForm = this.getSubView();
		contactsForm.updateForm();
	}

	setUrlParam(selectedId) {
		this.setParam("id", selectedId, true);
	}
}
