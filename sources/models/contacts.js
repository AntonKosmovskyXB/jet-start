const saveDate = webix.Date.dateToStr("%Y-%m-%d %h:%i");
const showDate = webix.Date.dateToStr("%Y-%m-%d");
const contactParse = (obj) => {
	obj.value = `${obj.FirstName} ${obj.LastName}`;
	obj.Birthday = showDate(obj.Birthday);
	obj.StartDate = showDate(obj.StartDate);
};

const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: contactParse,

		$save: (obj) => {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			obj.Birthday = saveDate(obj.Birthday);
			obj.StartDate = saveDate(obj.StartDate);
		},

		$update: contactParse
	}
});

export default contacts;
