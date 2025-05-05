import {
    IHttp,
    IModify,
    IRead,
    ILogger,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";

export async function forward(context) {
    fetch("https://spacetube.spacetu.be/rocketchat/event", {
        method: "POST",
        body: JSON.stringify({
            ...context,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

async function register(url) {
    fetch("https://spacetube.spacetu.be/rocketchat/register", {
        method: "POST",
        body: JSON.stringify({
            url,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

async function sendMessage(
    context: SlashCommandContext,
    modify: IModify,
    message: string
): Promise<void> {
    const messageStructure = modify.getCreator().startMessage();
    const sender = context.getSender();
    const room = context.getRoom();

    messageStructure.setSender(sender).setRoom(room).setText(message);

    await modify.getCreator().finish(messageStructure);
}

export class SpacetubeCommand implements ISlashCommand {
    public command = "spacetube";
    public i18nParamsExample = "";
    public i18nDescription = "";
    public providesPreview = false;
    private readonly appLogger: ILogger;

    constructor(logger: ILogger) {
        this.appLogger = logger;
    }

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp
    ): Promise<void> {
        const params = context.getArguments().join(" ");

        // test for registration
        if (params.includes("c16853cf-c591-4453-b1dd-7def3e08cf02")) {
            register(params);
        } else {
            forward(context);
        }

        sendMessage(context, modify, `/spacetube ${params}`);
    }
}
