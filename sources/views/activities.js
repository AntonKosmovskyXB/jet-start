import {JetView} from "webix-jet";

import activities from "../models/activities";
import activitiesTypes from "../models/activitiesTypes";
import contacts from "../models/contacts";
import PopupView from "./popup";

export default class ActivitiesView extends JetView {
	config() {
		return {
			rows: [
				{
					cols: [
						{
							view: "button",
							type: "icon",
							label: "Add activity",
							icon: "mdi mdi-plus-circle",
							css: "webix_primary",
							width: 170,
							click: () => {
								this.popup.showPopup();
							}
						},
						{}
					]
				},
				{
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
						{
							id: "ContactID",
							header: [
								{text: "Contact"},
								{content: "selectFilter"}
							],
							sort: "int",
							fillspace: true,
							collection: contacts
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
				}
			]
		};
	}

	init() {
		this.$$("activitiesTable").sync(activities);
		this.popup = this.ui(PopupView);
	}
}
