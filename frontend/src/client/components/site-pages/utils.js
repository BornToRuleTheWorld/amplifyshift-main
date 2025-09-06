import { disciplineOptions } from "./config";

export const convertToUS = (date,format) => {

    var dateTime = false
    if (format === "DateTime"){ dateTime = true }
    
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        timeZone: "America/Los_Angeles",
    };
    
    const newDate = new Date(date)
    const convertedDate = new Intl.DateTimeFormat('en-US', (dateTime) ? options : {}).format(newDate)
    return convertedDate
}

export const convertTo12HourFormat = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesFormatted = minutes.padStart(2, '0');
    return `${hours12}:${minutesFormatted} ${period}`;
};

export const formatDateToMMDDYYYY = (dateStr) => {
  const date = new Date(dateStr);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
};

export const getCurrentUserDiscipline = () => {
    let currentDiscipline = ""
    let outputDiscipline = disciplineOptions

    if(localStorage.getItem('currentDiscipline')){
        currentDiscipline = JSON.parse(atob(localStorage.getItem("currentDiscipline")))|| ""
    }

    console.log("currentDiscipline", currentDiscipline)

    if (Array.isArray(currentDiscipline) && currentDiscipline.length > 0) {
        outputDiscipline = disciplineOptions.filter(options => currentDiscipline.includes(options.value))
    }

    return outputDiscipline

}



