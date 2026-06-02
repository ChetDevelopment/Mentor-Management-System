import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceController } from '../../controllers/resource/resource.controller';
import { ResourceService } from '../../services/resource/resource.service';
import { ResourceRepository } from '../../repositories/resource/resource.repository';
import { Resource } from '../../entities/resource/resource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resource])],
  controllers: [ResourceController],
  providers: [ResourceService, ResourceRepository],
  exports: [ResourceService],
})
export class ResourceModule {}
