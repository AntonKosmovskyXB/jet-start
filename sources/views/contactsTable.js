import {JetView} from "webix-jet";

import activities from "../models/activities";
import activitiesTypes from "../models/activitiesTypes";

export default class ContactsTableView extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "activitiesTable",
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
					});
					this.popup.closePopup();
					return false;
				},
				"wxi-pencil": (event, id) => {
					this.popup.showPopup(id);
				}
			}
		};
	}
}
