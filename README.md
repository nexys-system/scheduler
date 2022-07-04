# Nexys Scheduler

[![Build and Test Package](https://github.com/nexys-system/scheduler/actions/workflows/test.yml/badge.svg)](https://github.com/nexys-system/scheduler/actions/workflows/test.yml)

Configure your CRON/schedulers in [Nexys](https://app.nexys.io) and run the container for execution

## API

#### see

See all crons. Allowed flag: `active=[false|true]`.Default is `true`

#### start

Start a cron

Required query params:

- `name`: name/identifier of the cron job

#### stop

Stop a cron

Required query params:

- `name`: name/identifier of the cron job

#### startAll

Starts all cron (that were not started yet)

#### stopAll

Stops all cron (that were not started yet)
