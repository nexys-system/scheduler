# Nexys Scheduler

[![Build and Test Package](https://github.com/nexys-system/scheduler/actions/workflows/test.yml/badge.svg)](https://github.com/nexys-system/scheduler/actions/workflows/test.yml)
[![Docker Publish](https://github.com/nexys-system/scheduler/actions/workflows/publish.yml/badge.svg)](https://github.com/nexys-system/scheduler/actions/workflows/publish.yml)

Configure your CRON/schedulers in [Nexys](https://app.nexys.io) and run the container for execution

## API

#### see: `/see`

See all crons. Allowed flag: `active=[false|true]`.Default is `true`

#### start: `/start`

Start a cron

Required query params:

- `name`: name/identifier of the cron job

#### stop: `/stop`

Stop a cron

Required query params:

- `name`: name/identifier of the cron job

#### startAll: `/startAll`

Starts all cron (that were not started yet)

#### stopAll: `/stopAll`

Stops all cron (that were not started yet)
