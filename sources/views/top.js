import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		let header = {
			type: "header", template: "Jet-start-app", height: 40
		};

		let menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: "Contacts", id: "contacts", icon: "wxi-user"},
				{value: "Activities", id: "activities", icon: "wxi-calendar"},
				{value: "Settings", id: "settings", icon: "mdi mdi-cogs"}
			]
		};

		let ui = {
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
