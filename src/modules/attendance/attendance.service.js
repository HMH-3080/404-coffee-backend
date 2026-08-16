const prisma = require("../../lib/prisma");

const SHIFT_START_DEFAULT = "10:00";

const toDateOnly = (value) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
};

const getShiftStart = async () => {
    const setting = await prisma.setting.findUnique({
        where: {
            key: "shift_start",
        },
    });

    return setting?.value || SHIFT_START_DEFAULT;
};

// ============================================================
// Get attendance records (with filters)
// ============================================================

const getAttendance = async ({ userId, status, from, to } = {}) => {
    const where = {};

    if (userId !== undefined && userId !== "") {
        where.userId = Number(userId);
    }

    if (status) {
        where.status = status;
    }

    if (from || to) {
        where.date = {};

        if (from) {
            where.date.gte = toDateOnly(new Date(from));
        }

        if (to) {
            const end = toDateOnly(new Date(to));
            end.setDate(end.getDate() + 1);
            where.date.lt = end;
        }
    }

    return prisma.attendance.findMany({
        where,
        orderBy: {
            date: "desc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    position: true,
                },
            },
        },
    });
};

// ============================================================
// Check in
// ============================================================

const checkIn = async ({ userId, notes, method = "MANUAL" }) => {
    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId),
        },
    });

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const today = toDateOnly(new Date());

    const existing = await prisma.attendance.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: today,
            },
        },
    });

    if (existing?.checkIn) {
        const error = new Error("User already checked in today");
        error.statusCode = 409;
        throw error;
    }

    const now = new Date();

    return prisma.attendance.upsert({
        where: {
            userId_date: {
                userId: user.id,
                date: today,
            },
        },
        update: {
            checkIn: now,
            method,
            ...(notes !== undefined && { notes: notes || null }),
        },
        create: {
            userId: user.id,
            date: today,
            checkIn: now,
            status: "PRESENT",
            method,
            notes: notes || null,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    position: true,
                },
            },
        },
    });
};

// ============================================================
// Check out
// ============================================================

const checkOut = async ({ userId, method = "MANUAL" }) => {
    const today = toDateOnly(new Date());

    const record = await prisma.attendance.findUnique({
        where: {
            userId_date: {
                userId: Number(userId),
                date: today,
            },
        },
    });

    if (!record) {
        const error = new Error("No check-in found for today");
        error.statusCode = 404;
        throw error;
    }

    if (!record.checkIn) {
        const error = new Error("User has not checked in");
        error.statusCode = 400;
        throw error;
    }

    if (record.checkOut) {
        const error = new Error("User already checked out today");
        error.statusCode = 409;
        throw error;
    }

    return prisma.attendance.update({
        where: {
            id: record.id,
        },
        data: {
            checkOut: new Date(),
            method,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    position: true,
                },
            },
        },
    });
};

// ============================================================
// Fingerprint check-in / check-out (no JWT — the fingerprint
// itself is the identity). Toggles: check-in then check-out.
// ============================================================

const fingerprintCheckInOut = async ({ fingerprintId }) => {
    if (!fingerprintId) {
        const error = new Error("fingerprintId is required");
        error.statusCode = 400;
        throw error;
    }

    const user = await prisma.user.findUnique({
        where: {
            fingerprintId: String(fingerprintId),
        },
    });

    if (!user) {
        const error = new Error("No employee linked to this fingerprint");
        error.statusCode = 404;
        throw error;
    }

    if (user.status !== "ACTIVE") {
        const error = new Error("User account is suspended");
        error.statusCode = 403;
        throw error;
    }

    const today = toDateOnly(new Date());
    const now = new Date();

    const existing = await prisma.attendance.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: today,
            },
        },
    });

    if (!existing || !existing.checkIn) {
        const record = await prisma.attendance.upsert({
            where: {
                userId_date: {
                    userId: user.id,
                    date: today,
                },
            },
            update: {
                checkIn: now,
                method: "FINGERPRINT",
            },
            create: {
                userId: user.id,
                date: today,
                checkIn: now,
                status: "PRESENT",
                method: "FINGERPRINT",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        position: true,
                    },
                },
            },
        });

        return {
            action: "checked_in",
            user: record.user,
            record,
        };
    }

    if (!existing.checkOut) {
        const record = await prisma.attendance.update({
            where: {
                id: existing.id,
            },
            data: {
                checkOut: now,
                method: "FINGERPRINT",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        position: true,
                    },
                },
            },
        });

        return {
            action: "checked_out",
            user: record.user,
            record,
        };
    }

    const error = new Error("Employee already checked in and out today");
    error.statusCode = 409;
    throw error;
};

// ============================================================
// Attendance summary / performance
// ============================================================

const getAttendanceSummary = async ({ userId, from, to } = {}) => {
    const where = {};

    if (userId !== undefined && userId !== "") {
        where.userId = Number(userId);
    }

    where.date = {};

    if (from) {
        where.date.gte = toDateOnly(new Date(from));
    }

    const rangeEnd = to ? new Date(to) : new Date();
    const end = toDateOnly(rangeEnd);
    end.setDate(end.getDate() + 1);
    where.date.lt = end;

    const [records, shiftStart] = await Promise.all([
        prisma.attendance.findMany({
            where,
            orderBy: {
                date: "asc",
            },
        }),
        getShiftStart(),
    ]);

    const [shiftHour, shiftMinute] = shiftStart.split(":").map(Number);

    let totalMinutes = 0;
    let presentDays = 0;
    let lateCount = 0;

    for (const record of records) {
        if (record.checkIn && record.checkOut) {
            const minutes =
                (new Date(record.checkOut) - new Date(record.checkIn)) / 60000;

            if (minutes > 0) {
                totalMinutes += minutes;
                presentDays += 1;
            }

            const checkInTime = new Date(record.checkIn);
            const shiftStartTime = new Date(checkInTime);
            shiftStartTime.setHours(shiftHour, shiftMinute, 0, 0);

            if (checkInTime > shiftStartTime) {
                lateCount += 1;
            }
        }
    }

    const totalHours = Math.round((totalMinutes / 60) * 100) / 100;
    const averageHoursPerDay =
        presentDays > 0
            ? Math.round((totalHours / presentDays) * 100) / 100
            : 0;
    const lateRate =
        presentDays > 0 ? Math.round((lateCount / presentDays) * 100) : 0;

    return {
        range: {
            from: where.date.gte || null,
            to: where.date.lt || null,
        },
        shiftStart,
        summary: {
            records: records.length,
            presentDays,
            totalHours,
            averageHoursPerDay,
            lateCount,
            lateRate,
        },
    };
};

module.exports = {
    getAttendance,
    checkIn,
    checkOut,
    fingerprintCheckInOut,
    getAttendanceSummary,
};