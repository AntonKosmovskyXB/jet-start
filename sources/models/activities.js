export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$save: (obj) => {
			const savedDate = webix.Date.dateToStr("%Y-%m-%d %h:%i");
			obj.DueDate = savedDate(obj.DueDate);
		}
	}
});
