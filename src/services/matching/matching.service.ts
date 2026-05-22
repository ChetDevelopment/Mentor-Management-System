import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchingRepository } from '../../repositories/matching/matching.repository';
import { CreateMatchingDto, UpdateMatchingDto } from '../../dto/matching';
import { MatchingStatus } from '../../constants';

@Injectable()
export class MatchingService {
  constructor(private matchingRepository: MatchingRepository) {}

  async create(createMatchingDto: CreateMatchingDto) {
    return this.matchingRepository.create(createMatchingDto);
  }

  async findAll(query?: any) {
    return this.matchingRepository.findAll(query);
  }

  async findById(id: string) {
    const matching = await this.matchingRepository.findById(id);
    if (!matching) {
      throw new NotFoundException('Matching not found');
    }
    return matching;
  }

  async findByMentorId(mentorId: string) {
    return this.matchingRepository.findByMentorId(mentorId);
  }

  async findByMenteeId(menteeId: string) {
    return this.matchingRepository.findByMenteeId(menteeId);
  }

  async update(id: string, updateMatchingDto: UpdateMatchingDto) {
    const matching = await this.findById(id);
    Object.assign(matching, updateMatchingDto);
    
    if (updateMatchingDto.status === MatchingStatus.COMPLETED) {
      matching.completedAt = new Date();
    }
    
    return this.matchingRepository.update(id, matching);
  }

  async remove(id: string) {
    return this.matchingRepository.remove(id);
  }
}
