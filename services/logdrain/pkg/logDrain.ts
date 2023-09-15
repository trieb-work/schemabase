import { AuthToken } from "./authenticate";

export async function createLogDrain(req: {
    token: AuthToken;
    teamId?: string;
    name: string;
    type: "json" | "ndjson" | "syslog";
    url: string;
    secret: string;
}): Promise<void> {
    let url = "https://api.vercel.com/v1/integrations/log-drains";
    if (req.teamId) {
        url = `${url}?teamId=${req.teamId}`;
    }
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${req.token.token_type} ${req.token.access_token}`,
        },
        body: JSON.stringify({
            name: req.name,
            type: req.type,
            url: req.url,
            secret: req.secret,
        }),
    });
    if (!res.ok) {
        throw new Error(await res.text());
    }
}
