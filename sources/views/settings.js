import {JetView} from "webix-jet";

export default class SettingsView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();
		return {
			rows: [
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
	}

	changeLanguage() {
		const languages = this.app.getService("locale");
		const value = this.$$("langToggle").getValue();
		languages.setLang(value);
	}
}

