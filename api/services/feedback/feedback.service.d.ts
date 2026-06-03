import { FeedbackRepository } from '../../repositories/feedback/feedback.repository';
import { SessionRepository } from '../../repositories/session/session.repository';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { CreateFeedbackDto, UpdateFeedbackDto } from '../../dto/feedback';
export declare class FeedbackService {
    private feedbackRepository;
    private sessionRepository;
    private mentorRepository;
    feedbackRepo: any;
    constructor(feedbackRepository: FeedbackRepository, sessionRepository: SessionRepository, mentorRepository: MentorRepository);
    submitFeedback(createFeedbackDto: CreateFeedbackDto, user: any): Promise<import("../../entities/feedback/feedback.entity").Feedback>;
    updateMentorRating(mentorId: string): Promise<void>;
    respondToFeedback(id: string, response: string): Promise<import("../../entities/feedback/feedback.entity").Feedback>;
    findAll(query?: any): Promise<import("../../entities/feedback/feedback.entity").Feedback[]>;
    findById(id: string): Promise<import("../../entities/feedback/feedback.entity").Feedback>;
    getFeedbackByMentor(mentorId: string): Promise<import("../../entities/feedback/feedback.entity").Feedback[]>;
    deleteFeedback(id: string): Promise<void>;
    update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<import("../../entities/feedback/feedback.entity").Feedback>;
    remove(id: string): Promise<void>;
}
