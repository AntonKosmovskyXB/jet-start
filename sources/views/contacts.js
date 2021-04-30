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
					if (this.form && this.form.isDirty()) {
						webix.confirm({
							text: "Are you sure that you want to close contact editor? Data will not be saved"
						}).then(() => {
							this.app.callEvent("onClearForm");
							this.list.select(id);
						});
						return false;
					}

					return true;
				},
				onAfterSelect: (id) => {
					this.setUrlParam(id);
					if (this.form) {
						this.app.callEvent("onShowForm", [id]);
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
				if (this.form && this.form.isDirty()) {
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

		this.on(this.app, "onFormInit", (form) => {
			this.form = form;
		});

		this.on(this.app, "onCloseForm", () => {
			this.form = null;
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
