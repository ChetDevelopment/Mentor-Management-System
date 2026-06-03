import { FeedbackService } from '../../services/feedback/feedback.service';
import { CreateFeedbackDto, UpdateFeedbackDto, RespondFeedbackDto } from '../../dto/feedback';
export declare class FeedbackController {
    private feedbackService;
    constructor(feedbackService: FeedbackService);
    findAll(query: any): Promise<import("../../entities/feedback/feedback.entity").Feedback[]>;
    findOne(id: string): Promise<import("../../entities/feedback/feedback.entity").Feedback>;
    findByMentor(mentorId: string): Promise<import("../../entities/feedback/feedback.entity").Feedback[]>;
    create(createFeedbackDto: CreateFeedbackDto, user: any): Promise<import("../../entities/feedback/feedback.entity").Feedback>;
    update(id: string, updateFeedbackDto: UpdateFeedbackDto, user: any): Promise<import("../../entities/feedback/feedback.entity").Feedback>;
    remove(id: string, user: any): Promise<void>;
    respond(id: string, dto: RespondFeedbackDto, user: any): Promise<import("../../entities/feedback/feedback.entity").Feedback>;
}
