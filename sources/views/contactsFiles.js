import {JetView} from "webix-jet";

export default class ContactsFilesView extends JetView {
	config() {
		const filesTable = {
			view: "datatable",
			localId: "activitiesTable",
			scroll: "y",
			select: true,
			columns: [
				{
					id: "Name",
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
					id: "Size",
					header: "Size",
					sort: "number"
				},
				{template: "<span class='webix_icon wxi-trash'></span>"}
			]
		};

		const updoadButton = {
			view: "uploader",
			localId: "uploadButton",
			type: "icon",
			icon: "mdi mdi-cloud-upload",
			label: "Upload file",
			css: "webix_primary",
			autosend: false
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
}
