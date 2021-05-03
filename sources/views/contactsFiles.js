import {JetView} from "webix-jet";

import contacts from "../models/contacts";
import files from "../models/files";

export default class ContactsFilesView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const filesTable = {
			view: "datatable",
			localId: "filesTable",
			type: "uploader",
			scroll: "y",
			select: true,
			columns: [
				{
					id: "name",
					header: "Name",
					sort: "text",
					fillspace: true
				},
				{
					id: "ChangeDate",
					header: "Change date",
					sort: "date",
					format: webix.i18n.dateFormatStr
				},
				{
					id: "sizetext",
					header: "Size",
					sort: this.sortFileSizes
				},
				{template: "<span class='webix_icon wxi-trash'></span>"}
			],
			onClick: {
				"wxi-trash": (event, id) => {
					webix.confirm({
						text: _("Are you sure that you want to remove this file?")
					}).then(() => {
						files.remove(id);
					});
					return false;
				}
			}
		};

		const updoadButton = {
			view: "uploader",
			localId: "uploadButton",
			type: "icon",
			icon: "mdi mdi-cloud-upload",
			label: "Upload file",
			css: "webix_primary",
			autosend: false,
			on: {
				onBeforeFileAdd: (obj) => {
					obj.ChangeDate = obj.file.lastModifiedDate;
					obj.ContactID = this.getParam("id", true);
					files.add(obj);
					return false;
				}
			}
		};

		return {
			rows: [
				filesTable,
				{
					cols: [
						{},
						updoadButton,
						{}
					]
				}
			]
		};
	}

	init() {
		this.filesTable = this.$$("filesTable");
		this.filesTable.sync(files);
	}

	urlChange() {
		contacts.waitData.then(() => {
			const currentId = this.getParam("id", true);
			if (currentId && contacts.exists(currentId)) {
				files.filter(obj => obj.ContactID.toString() === currentId.toString());
			}
		});
	}

	sortFileSizes(a, b) {
		let first = parseFloat(a.sizetext);
		let second = parseFloat(b.sizetext);

		if (a.sizetext.includes("Kb")) {
			first *= 1024;
		}

		if (b.sizetext.includes("Kb")) {
			second *= 1024;
		}

		if (a.sizetext.includes("Mb")) {
			first *= 1024 * 1024;
		}

		if (b.sizetext.includes("Mb")) {
			second *= 1024 * 1024;
		}

		if (a.sizetext.includes("Gb")) {
			first *= 1024 * 1024 * 1024;
		}

		if (b.sizetext.includes("Gb")) {
			second *= 1024 * 1024 * 1024;
		}

		return first > second ? 1 : -1;
	}
}
