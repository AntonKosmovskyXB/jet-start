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
				onAfterSelect: () => {
					this.setUrlParam(this.list.getSelectedId());
					this.app.callEvent("onListSelectChange", [this.list.getSelectedId()]);
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
				this.show("./contactsForm").then(() => {
					this.getSubView().showForm();
				});
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
