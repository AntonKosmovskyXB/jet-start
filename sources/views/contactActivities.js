import {JetView} from "webix-jet";

import activities from "../models/activities";
import activitiesTypes from "../models/activitiesTypes";
import contacts from "../models/contacts";
import PopupView from "./popup";

export default class ContactActivitiesView extends JetView {
	config() {
		const activitiesTable = {
			view: "datatable",
			localId: "activitiesTable",
			scroll: "y",
			select: true,
			columns: [
				{
					id: "State",
					header: "",
					template: "{common.checkbox()}"
				},
				{
					id: "TypeID",
					header: [
						{text: "Activity type"},
						{content: "selectFilter"}
					],
					sort: "int",
					collection: activitiesTypes
				},
				{
					id: "DueDate",
					header: [
						{text: "Due Date"},
						{content: "dateRangeFilter"}
					],
					sort: "date",
					format: webix.i18n.dateFormatStr
				},
				{
					id: "Details",
					fillspace: true,
					header: [
						{text: "Details"},
						{content: "textFilter"}
					],
					sort: "text"
				},
				{template: "<span class='webix_icon wxi-pencil'></span>"},
				{template: "<span class='webix_icon wxi-trash'></span>"}
			],
			onClick: {
				"wxi-trash": (event, id) => {
					webix.confirm({
						text: "Are you sure that you want to remove this activity item?"
					}).then(() => {
						activities.remove(id);
						this.app.callEvent("onDatatableChange");
					});
					return false;
				},
				"wxi-pencil": (event, id) => {
					this.popup.showPopup(id);
					this.setContactFieldSettings(id);
				}
			}
		};

		const addActivityButton = {
			view: "button",
			type: "icon",
			icon: "wxi-plus",
			label: "Add activity",
			width: 200,
			css: "webix_primary",
			click: () => {
				const selectedItemId = this.contactsList.getSelectedId();
				this.popup.showPopup();
				this.setContactFieldSettings(selectedItemId);
			}
		};

		return {
			rows: [
				activitiesTable,
				{
					cols: [
						{},
						addActivityButton
					]
				}
			]
		};
	}

	init() {
		this.activitiesTable = this.$$("activitiesTable");
		this.activitiesTable.sync(activities);
		this.popup = this.ui(PopupView);
		this.contactsList = this.getParentView().getParentView().getParentView().list;
		this.on(this.app, "onDatatableChange", (state) => {
			this.activitiesTable.setState(state);
			this.activitiesTable.filterByAll();
		});
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activitiesTypes.waitData
		]).then(() => {
			const currentId = this.getParam("id", true);
			if (currentId && contacts.exists(currentId)) {
				activities.filter(obj => obj.ContactID.toString() === currentId.toString());
			}
		});
	}

	setContactFieldSettings(id) {
		const contactField = this.popup.$$("contact");

		if (!contactField._settings.value) {
			contactField.setValue(id);
		}

		contactField._settings.readonly = true;
		contactField.refresh();
	}
}
