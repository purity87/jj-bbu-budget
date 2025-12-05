// 오늘 날짜의 "day"(1~31) 숫자 반환
export function getTodayDay(): number {
    return new Date().getDate()
}

// year + month + day → "YYYY-MM-DD" 문자열 반환
export function buildDate(year: number, month: number, day: number): string {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
