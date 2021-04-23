import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import ContactInfoView from "./contactInfo";

export default class ContactsView extends JetView {
	config() {
		const usersList = {
			cols: [
				{
					view: "list",
					id: "contactsList",
					select: true,
					width: 300,
					type: {
						template: "<span class='webix_icon wxi-user'></span> <span class='contact-name'>#value#</span> <br> <span class='contact-company'>#Company#</span>",
						height: 70
					},
					on: {
						onAfterSelect: () => {
							this.setUrlParam(this.list.getSelectedId());
						}
					}
				}
			]
		};

		return {cols: [usersList, ContactInfoView]};
	}

	init() {
		this.list = this.$$("contactsList");
		this.list.sync(contacts);
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
