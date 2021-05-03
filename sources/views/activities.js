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
					view: "tabbar",
					optionWidth: 120,
					options: [
						{
							value: "All",
							id: "All"
						},
						{
							value: "Overdue",
							id: "Overdue"
						},
						{
							value: "Completed",
							id: "Completed"
						},
						{
							value: "Today",
							id: "Today"
						},
						{
							value: "Tomorrow",
							id: "Tomorrow"
						},
						{
							value: "This week",
							id: "Week"
						},
						{
							value: "This month",
							id: "Month"
						}
					],

					on: {
						onChange: (id) => {
							if (id === "All") {
								this.activitiesTable.filter();
								this.activitiesTable.filterByAll();
							}
							if (id === "Overdue") {
								this.activitiesTable.filter((obj) => {
									this.activitiesTable.filter();
									const date = new Date();
									return obj.State === "Open" && date > obj.DueDate;
								});
							}
							if (id === "Completed") {
								this.activitiesTable.filter(obj => obj.State === "Close");
							}
							if (id === "Today") {
								this.activitiesTable.filter((obj) => {
									const date = new Date();
									return date.getDate() === obj.DueDate.getDate();
								});
							}
							if (id === "Tomorrow") {
								this.activitiesTable.filter((obj) => {
									const date = new Date();
									const tomorrowDate = new Date(date.getTime() + (24 * 60 * 60 * 1000));
									return tomorrowDate.getDate() === obj.DueDate.getDate();
								});
							}
							if (id === "Week") {
								this.activitiesTable.filter((obj) => {
									const date = new Date();
									const weekStart = webix.Date.weekStart(date);
									const weekEnd = new Date(weekStart.getTime() + ((24 * 60 * 60 * 1000) * 7));
									return obj.DueDate >= weekStart && obj.DueDate < weekEnd;
								});
							}
							if (id === "Month") {
								this.activitiesTable.filter((obj) => {
									const date = new Date();
									return date.getMonth() === obj.DueDate.getMonth();
								});
							}
						}
					}
				},
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
							checkValue: "Close",
							uncheckValue: "Open",
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
								this.app.callEvent("onDatatableChange", [this.activitiesTable.getState()]);
							});
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
		this.activitiesTable = this.$$("activitiesTable");
		this.activitiesTable.sync(activities);
		this.popup = this.ui(PopupView);
		activities.filter();
		this.on(this.app, "onDatatableChange", (state) => {
			this.activitiesTable.setState(state);
			this.activitiesTable.filterByAll();
		});
	}
}
