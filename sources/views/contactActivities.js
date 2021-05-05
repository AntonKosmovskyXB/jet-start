import {JetView} from "webix-jet";

import activities from "../models/activities";
import activitiesTypes from "../models/activitiesTypes";
import contacts from "../models/contacts";
import PopupView from "./popup";

export default class ContactActivitiesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const activitiesTable = {
			view: "datatable",
			localId: "activitiesTable",
			scroll: "y",
			select: true,
			columns: [
				{
					id: "State",
					header: "",
					checkValue: "Close",
					uncheckValue: "Open",
					template: "{common.checkbox()}"
				},
				{
					id: "TypeID",
					fillspace: true,
					header: [
						{text: _("Activity type")},
						{content: "selectFilter"}
					],
					sort: "int",
					collection: activitiesTypes,
					template: (obj) => {
						const activityType = activitiesTypes.getItem(obj.TypeID);
						if (activityType) {
							return `<span class="webix_icon mdi mdi-${activityType.Icon}"></span> ${activityType.Value}`;
						}
						return "Unknown";
					}
				},
				{
					id: "DueDate",
					header: [
						{text: _("Due Date")},
						{content: "dateRangeFilter"}
					],
					sort: "date",
					format: webix.i18n.dateFormatStr
				},
				{
					id: "Details",
					fillspace: true,
					header: [
						{text: _("Details")},
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
						text: _("Are you sure that you want to remove this activity item?"),
						ok: _("Yes"),
						cancel: _("No")
					}).then(() => {
						activities.remove(id);
						this.app.callEvent("onDatatableChange", [this.activitiesTable.getState()]);
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
			label: _("Add activity"),
			width: 200,
			css: "webix_primary",
			click: () => {
				this.popup.showPopup();
				this.setContactFieldSettings(this.getParam("id", true));
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
				this.activitiesTable.filterByAll();
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
