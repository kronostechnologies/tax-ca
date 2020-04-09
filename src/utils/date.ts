export function getMonthsDiff(firstDate: Date, secondDate: Date): number {
    const monthsDiff = secondDate.getMonth() - firstDate.getMonth();
    const yearsDiff = secondDate.getFullYear() - firstDate.getFullYear();

    return monthsDiff + (12 * yearsDiff) - (secondDate.getDate() < firstDate.getDate() ? 1 : 0);
}

function getAge(birthDate: Date): number {
    const now = new Date();
    const age = now.getFullYear() - birthDate.getFullYear();
    const month = now.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && now.getDate() < birthDate.getDate())) {
        return age - 1;
    }
    return age;
}

export function getLatestBirthday(birthDate: Date): Date {
    return getBirthdayAtAge(birthDate, getAge(birthDate));
}

export function getBirthdayAtAge(birthDate: Date, age: number): Date {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    const monthString = month < 10 ? `0${month}` : month;
    const dayString = day < 10 ? `0${day}` : day;
    const dateString = `${birthDate.getFullYear() + age}-${monthString}-${dayString}T12:00:00`;
    return new Date(dateString);
}
