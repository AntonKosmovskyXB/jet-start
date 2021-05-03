import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const header = {
			type: "header", template: "Jet-start-app", height: 40
		};

		const menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: _("Contacts"), id: "contacts", icon: "wxi-user"},
				{value: _("Activities"), id: "activities", icon: "wxi-calendar"},
				{value: _("Settings"), id: "settings", icon: "mdi mdi-cogs"}
			]
		};

		const ui = {
			css: "app_layout",
			rows: [header,
				{cols: [
					menu,
					{$subview: true}
				]
				}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}
}
