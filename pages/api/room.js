import { checkToken } from "../../backendLibs/checkToken";
import { readChatRoomsDB } from "../../backendLibs/dbLib";

export default function roomRoute(req, res)
{
  const user = checkToken(req);
  if (!user)
  {
    return res.status(401).json({
      ok: false,
      message: "Yon don't permission to access this api",
    });
  }
  
  const chatrooms = readChatRoomsDB();

  const data = chatrooms.map((x) => ({
      roomId: x.roomId,
      roomName: x.roomName,
    }))

    return res.json({
      ok: true,
      rooms: data,
    });
}
