import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchingRepository } from '../../repositories/matching/matching.repository';
import { MentorRepository } from '../../repositories/mentor/mentor.repository';
import { AvailabilityRepository } from '../../repositories/availability/availability.repository';
import { CreateMatchingDto, UpdateMatchingDto } from '../../dto/matching';
import { MatchingStatus } from '../../constants';

@Injectable()
export class MatchingService {
  constructor(
    private matchingRepository: MatchingRepository,
    private mentorRepository: MentorRepository,
    private availabilityRepository: AvailabilityRepository,
  ) {}

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

  async getRecommendedMentors(menteeId: string, skillFilter?: string) {
    const mentors = await this.mentorRepository.findAllWithSkills();
    const scored = await Promise.all(
      mentors.map(async (mentor) => {
        const score = await this.calculateMatchScore(mentor, menteeId, skillFilter);
        return { mentor, score };
      }),
    );
    const filtered = skillFilter
      ? scored.filter((s) => s.score > 0)
      : scored;
    return filtered
      .sort((a, b) => b.score - a.score)
      .map((s) => ({ ...s.mentor, matchScore: s.score }));
  }

  async calculateMatchScore(mentor: any, menteeId: string, skillFilter?: string): Promise<number> {
    let score = 0;

    // Skill match: 50% weight
    const mentorSkills = mentor.skills || [];
    if (skillFilter && mentorSkills.length > 0) {
      const match = mentorSkills.some(
        (s: any) => s.name?.toLowerCase() === skillFilter.toLowerCase() || s.id === skillFilter,
      );
      if (match) score += 50;
    } else if (mentorSkills.length > 0) {
      score += 50;
    }

    // Rating: 30% weight
    const rating = Number(mentor.rating) || 0;
    score += (rating / 5) * 30;

    // Availability: 20% weight
    const availability = await this.availabilityRepository.findByMentorId(mentor.id);
    const hasAvailability = availability.some((a: any) => a.isActive);
    if (hasAvailability) score += 20;

    return Math.round(score);
  }
}
