const saveDate = webix.Date.dateToStr("%Y-%m-%d %h:%i");
const showDate = webix.Date.dateToStr("%Y-%m-%d");

const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (obj) => {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			obj.Birthday = showDate(obj.Birthday);
			obj.StartDate = showDate(obj.StartDate);
		},

		$save: (obj) => {
			obj.Birthday = saveDate(obj.Birthday);
			obj.StartDate = saveDate(obj.StartDate);
		},

		$update: (obj) => {
			obj.Birthday = showDate(obj.Birthday);
			obj.StartDate = showDate(obj.StartDate);
		}
	}
});

export default contacts;
