import { Controller, Post, Get } from '@nestjs/common'
import { ProcessorService } from './processor.service'

@Controller('processor')
export class ProcessorController {
  constructor(private readonly processorService: ProcessorService) {}

  @Post('update')
  async updateData() {
    return await this.processorService.runUpdate()
  }

  @Get('status')
  getStatus() {
    return this.processorService.getStatus()
  }
} 