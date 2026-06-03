export declare enum DayOfWeek {
    MON = "Mon",
    TUE = "Tue",
    WED = "Wed",
    THU = "Thu",
    FRI = "Fri",
    SAT = "Sat",
    SUN = "Sun"
}
export declare class CreateAvailabilityDto {
    mentorId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isActive?: boolean;
}
export declare class UpdateAvailabilityDto {
    dayOfWeek?: DayOfWeek;
    startTime?: string;
    endTime?: string;
    isActive?: boolean;
}
export declare class BlockDateDto {
    mentorId: string;
    blockedDate: string;
    reason?: string;
}
