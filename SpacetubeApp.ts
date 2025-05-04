import { IAppAccessors, IConfigurationExtend, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import {
    ApiVisibility,
    ApiSecurity,
} from '@rocket.chat/apps-engine/definition/api';
import { SpacetubeCommand } from './commands/SpacetubeCommand';
import { ForwardMessageEndpoint } from './endpoints/ForwardMessageEndpoint';

export class SpacetubeApp extends App {
    private readonly appLogger: ILogger

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
        this.appLogger = this.getLogger()
        this.appLogger.debug('Hello, World!')
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        configuration.slashCommands.provideSlashCommand(new SpacetubeCommand(this.appLogger));
        await configuration.api.provideApi({
            endpoints: [new ForwardMessageEndpoint()],
            visibility: ApiVisibility.PUBLIC,
            security: ApiSecurity.UNSECURE
        });
    }
}
