import moment from "moment";

const DateService = {
  getDurationMinutes: (value: number = 0) => {
    return value > 0
      ? moment.duration(value, "minutes").humanize()
      : "0 seconds";
  },

  getDurationString: (seconds: number = 0) => {
    let hours = seconds / 3600;
    let mins = (seconds % 3600) / 60;
    let secs = (mins * 60) % 60;

    hours = Math.trunc(hours);
    mins = Math.trunc(mins);

    if (!hours && !mins && !secs) return "0 sec";

    if (hours) {
      if (mins)
        return secs
          ? `${hours} hr ${mins} min & ${secs} sec`
          : `${hours} hr & ${mins} min`;
      else return secs ? `${hours} hr & ${secs} sec` : `${hours} hr`;
    } else {
      if (mins) return secs ? `${mins} min & ${secs} sec` : `${mins} min`;
      else return secs ? `${secs} sec` : `None`;
    }
  },

  getMonthString: (value: string = "") => {
    return moment(new Date(value)).format("MMMM-YYYY");
  },

  getDateRange: (value: any) => {
    return [
      value[0] ? new Date(value[0]).toString() : "",
      value[1] ? new Date(value[1]).toString() : "",
    ];
  },

  getShortDateString: (value: any) => {
    return value ? moment(value.replace("Z", "")).format("ddd, MMM DD") : "";
  },

  getDateString: (value: any, format = "ddd, MMM DD, YYYY") => {
    return value ? moment(value.replace("Z", "")).format(format) : "";
  },

  getTimeString: (value: any) => {
    return value ? moment(value.replace("Z", "")).format("HH:mm") : "";
  },

  getDateTimeString: (value: any) => {
    return value
      ? moment(value.replace("Z", "")).format("ddd DD, MMM, YYYY, HH:mm")
      : "";
  },

  getFormattedDate: (value: any) => {
    return value
      ? new Date(value).toLocaleDateString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";
  },
  getNumericDate: (value: any) => {
    return value
      ? new Date(value).toLocaleDateString("fr-CH", {
          // weekday: "numeric",
          day: "numeric",
          month: "numeric",
          year: "numeric",
        })
      : "";
  },

  getFormattedDateTime: (value: any) => {
    return value
      ? new Date(value).toLocaleDateString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        })
      : "";
  },
  getFormattedTime: (value: any) => {
    return value
      ? new Date(value).toLocaleDateString(undefined, {
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        })
      : "";
  },

  getTimeOnly: (value: any) => {
    let valArr = value?.split(":");

    return value ? valArr[0] + ":" + valArr[1] : "";
  },
  getMomentTimeFormat: (value: any) => {
    return value ? moment(value).format("HH:mm") : "--";
  },
  getMomentDateFormat: (value: any) => {
    return value ? moment(value).format("DD.MM.YYYY") : "--";
  },
  getServerDateString: (value: any) => {
    let date = new Date(Date.parse(value));
    return date ? moment(date).format("MMM DD, YYYY") : "";
  },
};

export default DateService;
