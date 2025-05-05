import {
    IApiRequest,
    IApiResponse,
    IApiEndpointMetadata,
    IApiEndpointInfo,
    ApiVisibility,
    ApiSecurity,
} from "@rocket.chat/apps-engine/definition/api";
import { IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";

export class ForwardMessageEndpoint implements IApiEndpointMetadata {
    public path = "forward";
    public visibility = ApiVisibility.PUBLIC;
    public security = ApiSecurity.UNSECURE;
    public methods = ["POST"];
    public computedPath: string;

    public async post(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify
    ): Promise<IApiResponse> {
        const { authorization } = request.headers;

        if (!authorization) {
            return {
                status: 401,
            };
        }

        if (authorization !== "Bearer whatever-some-token") {
            return {
                status: 403,
            };
        }

        const { roomId, text, alias, imageUrl } = request.content;

        if (!roomId || !text) {
            return {
                status: 400,
                content: { error: "Missing roomId or text in request body." },
            };
        }

        const room: IRoom | undefined = await read
            .getRoomReader()
            .getById(roomId);
        if (!room) {
            return {
                status: 404,
                content: { error: "Room not found." },
            };
        }

        const builder = modify
            .getCreator()
            .startMessage()
            .setRoom(room)
            .setText(text)
            .setUsernameAlias(alias || "Spacetube")
            .setAvatarUrl(imageUrl);

        await modify.getCreator().finish(builder);

        return {
            status: 200,
            content: { message: "Message sent successfully." },
        };
    }
}
