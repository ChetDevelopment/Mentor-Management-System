import { DayOfWeek } from '../../constants';
export declare class Availability {
    id: string;
    mentorId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
