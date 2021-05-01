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
				template: obj => `<div class="contacts-list">${obj.Photo || "<span class='webix_icon wxi-user'></span>"} <div class='short-info'>
				<span class='contact-name'>${obj.value}</span> <br> <span class='contact-company' style="font-size: 11px">${obj.Company}</span></div></div>`,
				height: 45
			},
			on: {
				onBeforeSelect: (id) => {
					if (this.app.callEvent("isFormSaved", []) === false) {
						webix.confirm({
							text: "Are you sure that you want to close contact editor? Data will not be saved"
						}).then(() => {
							this.setUrlParam(id);
							this.app.callEvent("onShowForm", [id]);
						});
						return false;
					}

					return true;
				},
				onAfterSelect: (id) => {
					this.setUrlParam(id);
					this.app.callEvent("onShowForm", [id]);
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
				if (this.app.callEvent("isFormSaved", []) === false) {
					webix.confirm({
						text: "Are you sure that you want to close contact editor? Data will not be saved"
					}).then(() => {
						this.app.callEvent("onShowForm");
					});
					return false;
				}

				this.show("./contactsForm").then(() => {
					this.app.callEvent("onShowForm");
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
			this.list.select(response.id);
		});

		this.on(this.app, "onEditClick", () => {
			this.show("./contactsForm").then(() => {
				this.app.callEvent("onShowForm", [this.getParam("id"), true]);
			});
		});

		this.on(this.app, "onSelectFirst", () => {
			this.list.select(contacts.getFirstId());
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

	setUrlParam(selectedId) {
		this.setParam("id", selectedId, true);
	}
}
