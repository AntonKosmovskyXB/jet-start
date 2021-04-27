import {JetView} from "webix-jet";

import ContactActivitiesView from "./contactActivities";
import ContactFilesView from "./contactsFiles";

export default class ContactsTableView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "tabbar",
					localId: "tableTabbar",
					options: [
						{value: "Activities", id: "activitiesTable"},
						{value: "Files", id: "filesTable"}
					]
				},
				{
					view: "multiview",
					cells: [
						{localId: "activitiesTable", cols: [ContactActivitiesView]},
						{localId: "filesTable", cols: [ContactFilesView]}
					]
				}
			]
		};
	}

	init() {
		this.$$("tableTabbar").attachEvent("onChange", (table) => {
			this.$$(table).show();
		});
	}
}
