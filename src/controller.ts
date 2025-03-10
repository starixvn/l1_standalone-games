import { v4 as uuidv4 } from "uuid";
import axios from "axios";

type DemoPlayer = {
  Payload: {
    Token: string;
  };
};

export default function controller({ server }: Context) {
  server.get("/health", (_, res) => {
    res.send("OK");
  });

  server.get("/:gameId", async (req, res) => {
    const url =
      "http://saba-play-official-site.3rd-party.t1p.nebula.prod:21080/api/v2";
    const language = req.query.language ?? "en";
    const gameId = req.params.gameId;
    const now = new Date().toISOString();
    const seq = uuidv4();
    const userAgent = req.get("User-Agent");

    if (!gameId || isNaN(Number(gameId))) {
      res.status(400).send("Game ID is required");

      return;
    }

    const demoPlayerResponse = await axios.post(
      `${url}/DemoSite/GetDemoPlayer`,
      {
        seq: seq,
        timeStamp: now,
        payload: {
          platform: "d",
        },
      },
      { headers: { "User-Agent": userAgent, Host: "lobby.sabaplay.game" } },
    );

    const demoPlayer = demoPlayerResponse.data as DemoPlayer;
    const gameResponse = await axios.post(
      `${url}/DemoSite/LaunchGame`,
      {
        seq: seq,
        timeStamp: now,
        payload: {
          gameId: gameId,
          language: language,
          gameMode: "NewPage",
          browserUserAgent: userAgent,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${demoPlayer.Payload.Token}`,
          Host: "lobby.sabaplay.game",
        },
      },
    );

    const redirectUrl = new URL(gameResponse.data.Payload.ReturnUrl);

    redirectUrl.searchParams.delete("rurl");

    res.render("main", { url: redirectUrl.toString() });
  });
}
