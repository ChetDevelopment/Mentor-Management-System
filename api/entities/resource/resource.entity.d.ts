export declare enum ResourceType {
    DOCUMENT = "document",
    LINK = "link",
    TASK = "task"
}
export declare class Resource {
    id: string;
    mentorId: string;
    sessionId: string;
    title: string;
    description: string;
    type: ResourceType;
    fileUrl: string;
    linkUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
