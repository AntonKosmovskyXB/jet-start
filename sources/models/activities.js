const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			const savedTime = webix.Date.strToDate("%h:%i");
			obj.DueDate = new Date(obj.DueDate);
			obj.Time = savedTime(obj.DueDate);
		},

		$save: (obj) => {
			const getTime = webix.Date.dateToStr("%h:%i");
			const getDate = webix.Date.dateToStr("%Y-%m-%d");
			const currentTime = getTime(obj.Time);
			const currentDate = getDate(obj.DueDate);
			obj.DueDate = `${currentDate} ${currentTime}`;
		}
	}
});

export default activities;
