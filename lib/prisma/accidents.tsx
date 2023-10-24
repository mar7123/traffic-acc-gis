import prisma from ".";

export async function getAccidentsByState(state: number) {
  try {
    const acc = await prisma.accidents.findMany({
      select: {
        id: true,
        STATE: true,
        ST_CASE: true,
        LATITUDE: true,
        LONGITUD: true,
        DATETIME_CRASH: true,
      },
      where: {
        STATE: state,
      },
    });
    return { acc };
  } catch (error) {
    return { error };
  }
}
export async function getAccidents(year: number, month: number, state: number) {
  try {
    let start_time = new Date();
    start_time.setUTCFullYear(year, month - 1, 1);
    start_time.setUTCHours(0, 0, 0);
    let end_time = new Date(start_time);
    end_time.setMonth(end_time.getMonth() + 1);
    console.log(start_time);
    console.log(end_time);
    const acc = await prisma.accidents.findMany({
      select: {
        id: true,
        STATE: true,
        ST_CASE: true,
        LATITUDE: true,
        LONGITUD: true,
        DATETIME_CRASH: true,
      },
      where: {
        DATETIME_CRASH: {
          gte: start_time,
          lt: end_time,
        },
        STATE: state,
      },
    });
    return { acc };
  } catch (error) {
    return { error };
  }
}
