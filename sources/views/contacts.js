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
						template: `<div class="contacts-list"><span class='webix_icon wxi-user'></span> <div class='short-info'>
						<span class='contact-name'>#value#</span> <br> <span class='contact-company' style="font-size: 11px">#Company#</span></div></div>`,
						height: 45
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
