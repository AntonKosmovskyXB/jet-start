import {JetView} from "webix-jet";


import activitiesTypes from "../models/activitiesTypes";
import statuses from "../models/statuses";
import SettingsTableView from "./settingsTable";

export default class SettingsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();
		const langToggle = {
			cols: [
				{
					view: "segmented",
					localId: "langToggle",
					label: _("Language"),
					width: 500,
					value: lang,
					options: [
						{id: "en", value: "en"},
						{id: "ru", value: "ru"}
					],
					click: () => {
						this.changeLanguage();
					}
				},
				{}
			]
		};

		const tablesArea = {
			cols: [
				new SettingsTableView(this.app, "", activitiesTypes, _("Activities types"), "Activity"),
				new SettingsTableView(this.app, "", statuses, _("Statuses"), "Status")
			]
		};

		return {
			rows: [
				langToggle,
				tablesArea
			]
		};
	}

	changeLanguage() {
		const languages = this.app.getService("locale");
		const value = this.$$("langToggle").getValue();
		languages.setLang(value);
	}
}
