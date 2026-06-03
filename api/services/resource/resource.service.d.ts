import { ResourceRepository } from '../../repositories/resource/resource.repository';
import { CreateResourceDto } from '../../dto/resource';
export declare class ResourceService {
    private resourceRepository;
    constructor(resourceRepository: ResourceRepository);
    uploadResource(createResourceDto: CreateResourceDto): Promise<import("../../entities/resource/resource.entity").Resource>;
    getResources(mentorId: string): Promise<import("../../entities/resource/resource.entity").Resource[]>;
    deleteResource(id: string): Promise<{
        message: string;
    }>;
}
