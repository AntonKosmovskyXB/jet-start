import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import statuses from "../models/statuses";
import ContactsTableView from "./contactsTable";


export default class ContactInfoView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const userInfoTemplate = {
			type: "clean",
			localId: "contactInfo",
			template: obj => `<h2 class="user-name">${obj.value || "Unknown"}</h2>
			<div class='user-main-info'>
				<div class="user-photo-area">
					<div class="user-photo"><img src= ${obj.Photo || "./sources/styles/Person.jpg"}></div>
					<div class="status align-center">Status: ${obj.Status || "Unknown"}</div>
				</div>
				<div class="first-info-column">
					<span class='webix_icon mdi mdi-email'></span><span>${obj.Email || "Unknown"}</span> <br><br>
					<span class='webix_icon mdi mdi-skype'></span><span>${obj.Skype || "Unknown"}</span> <br><br>
					<span class='webix_icon mdi mdi-label'></span><span>${obj.Job || "Unknown"}</span> <br><br>
					<span class='webix_icon mdi mdi-briefcase'></span><span>${obj.Company || "Unknown"}</span> 
				</div>
				<div class="second-info-column">
				<span class='webix_icon mdi mdi-calendar'></span><span>${obj.Birthday || "Unknown"}</span> <br><br>
				<span class='webix_icon mdi mdi-map-marker'></span><span>${obj.Address || "Unknown"}</span> 
				</div>
			</div>`
		};

		const buttons = {
			rows: [
				{
					padding: 10,
					cols: [
						{
							view: "button",
							type: "icon",
							label: _("Delete"),
							icon: "wxi-trash",
							css: "user-info-button",
							width: 120,
							click: () => {
								webix.confirm({
									text: _("Are you sure that you want to remove this contact?")
								}).then(() => {
									contacts.remove(this.getParam("id", true));
									this.app.callEvent("onSelectFirst");
								});
								return false;
							}
						},
						{
							view: "button",
							type: "icon",
							label: _("Edit"),
							icon: "wxi-pencil",
							css: "user-info-button",
							width: 120,
							click: () => {
								const id = this.getParam("id", true);
								this.app.callEvent("onEditClick", [id]);
							}
						}
					]
				},
				{}
			]
		};

		return {
			rows: [
				{
					cols: [
						userInfoTemplate,
						buttons
					]
				},
				{$subview: ContactsTableView}
			]
		};
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			const currentId = this.getParam("id", true) || contacts.getFirstId();
			const currentUser = contacts.getItem(currentId);
			currentUser.Status = statuses.getItem(currentUser.StatusID).Value;
			if (currentId && contacts.exists(currentId)) {
				this.$$("contactInfo").parse(contacts.getItem(currentId));
			}
		});
	}
}
