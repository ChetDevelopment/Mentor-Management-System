import { ResourceService } from '../../services/resource/resource.service';
import { CreateResourceDto } from '../../dto/resource';
export declare class ResourceController {
    private resourceService;
    constructor(resourceService: ResourceService);
    getResources(mentorId: string): Promise<import("../../entities/resource/resource.entity").Resource[]>;
    uploadResource(createResourceDto: CreateResourceDto, user: any): Promise<import("../../entities/resource/resource.entity").Resource>;
    deleteResource(id: string, user: any): Promise<{
        message: string;
    }>;
}
