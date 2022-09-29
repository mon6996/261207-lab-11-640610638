import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res)
{
  if (req.method === "GET")
  {
    const user = checkToken(req);
    if (!user)
    {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }

    const roomId = req.query.roomId;

    const rooms = readChatRoomsDB();

    const roomIdx = rooms.findIndex((x) => x.roomId === roomId);
    if (roomIdx === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    return res.json({ ok: true, messages: rooms[roomIdx].messages });
  }
  else if (req.method === "POST")
  {
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }

    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();

    const roomIdx = rooms.findIndex((x) => x.roomId === roomId);
    if (roomIdx === -1)
      return res.status(404).json({ ok: false, message: "Invalid room id" });

    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    const newMessage = {
      messageId: uuidv4(),
      text: req.body.text,
      username: user.username,
    };
    rooms[roomIdx].messages.push(newMessage);

    writeChatRoomsDB(rooms);
    
    return res.json({
      ok: true,
      message: newMessage,
    });
  }
}
