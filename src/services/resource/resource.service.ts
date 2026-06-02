import { Injectable, NotFoundException } from '@nestjs/common';
import { ResourceRepository } from '../../repositories/resource/resource.repository';
import { CreateResourceDto } from '../../dto/resource';

@Injectable()
export class ResourceService {
  constructor(private resourceRepository: ResourceRepository) {}

  async uploadResource(createResourceDto: CreateResourceDto) {
    return this.resourceRepository.create(createResourceDto as any);
  }

  async getResources(mentorId: string) {
    return this.resourceRepository.findByMentorId(mentorId);
  }

  async deleteResource(id: string) {
    const resource = await this.resourceRepository.findById(id);
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    await this.resourceRepository.remove(id);
    return { message: 'Resource deleted successfully' };
  }
}
