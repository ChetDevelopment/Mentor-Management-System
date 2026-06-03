import { ResourceType } from '../../entities/resource/resource.entity';
export declare class CreateResourceDto {
    mentorId: string;
    title: string;
    description?: string;
    type?: ResourceType;
    fileUrl?: string;
    linkUrl?: string;
    sessionId?: string;
}
