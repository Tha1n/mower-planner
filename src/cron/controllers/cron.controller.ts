import { Controller, Get, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CRON_NEVER_RUN, MOWER_CRON_NAME } from '../../assets/cron.constants';
import { CRON_ROUTE, CRON_STATE_ROUTE } from '../../assets/route.constants';
import { CRON_API_TAG } from '../../assets/swagger.constants';
import { CronData } from '../models/dto/cron-data.dto';

@ApiTags(CRON_API_TAG)
@Controller(CRON_ROUTE)
export class CronController {
  private readonly _logger = new Logger(CronController.name);

  constructor(private readonly _schedulerRegistry: SchedulerRegistry) {}

  @Get(CRON_STATE_ROUTE)
  @ApiOkResponse({
    description: 'Indicates cron jobs data.',
    type: CronData,
  })
  public getCronData(): CronData {
    this._logger.verbose('Checking cron data.');

    let result: CronData = {};
    const mowerCronJob = this._schedulerRegistry.getCronJob(MOWER_CRON_NAME);
    result[MOWER_CRON_NAME] = {
      lastRun: mowerCronJob.lastDate() ?? CRON_NEVER_RUN,
      nextRun: mowerCronJob.nextDate(),
      isRunning: mowerCronJob.running,
    };

    return result;
  }
}
