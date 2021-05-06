import {JetView} from "webix-jet";

import ContactActivitiesView from "./contactActivities";
import ContactFilesView from "./contactsFiles";

export default class ContactsTableView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{
					view: "tabbar",
					localId: "tableTabbar",
					options: [
						{value: _("Activities"), id: "activitiesTable"},
						{value: _("Files"), id: "filesTable"}
					],
					on: {
						onChange: (table) => {
							this.$$(table).show();
						}
					}
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
}
