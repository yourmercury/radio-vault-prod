export const getMonth = (num: number) => {
    const months = ["jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec"]

    return months[num - 1];
}

export function formatMediaDuration(duration: number): string {
    let h, m, s = 0;

    h = Math.floor(duration / 60 / 60);
    m = Math.floor((duration / 60 / 60 - Math.floor(duration / 60 / 60)) * 60);
    s = Math.floor((((duration / 60 / 60 - Math.floor(duration / 60 / 60)) * 60) - Math.floor((duration / 60 / 60 - Math.floor(duration / 60 / 60)) * 60)) * 60)

    let ms = m / 10 >= 1 ? m : "0" + m as string;
    let ss = s / 10 >= 1 ? s : "0" + s as string;

    // console.log(`${h}:${ms}:${ss}`);

    if (h == 0) {
        return `${m}:${ss}`
    } else {
        return `${h}:${ms}:${ss}`
    }
}

export function stuntAddress(addr: string, length?: number){
    let b = addr;
    if(addr){
        return addr.substring(0, ((length || 6) -1)) + "..." + b.substring(addr.length-(length || 6), addr.length)
    }
}

