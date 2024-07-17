import { NextPage } from "next";
import { useRouter } from "next/router";
import { Button, Dot, Grid, Input, Page } from "@geist-ui/react";
import React, { useState } from "react";
import { CreateRequest } from "./api/create";

const NewPage: NextPage = () => {
    const router = useRouter();
    const code = router.query.code as string;
    const configurationId = router.query.configurationId as string;
    const projectId = router.query.currentProjectId as string;
    const teamId = router.query.teamId as string;
    const next = router.query.next as string;

    const [url, setUrl] = useState("https://github.com");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (): Promise<void> => {
        const body: CreateRequest = {
            elastic: {
                url,
                username,
                password,
            },
            vercel: {
                configurationId,
                projectId,
                teamId,
            },
            code,
        };
        const res = await fetch("/api/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            setError(`${res.status}: ${await res.text()}`);
            return;
        }
        router.push(next);
    };
    return (
        // <div>
        //   <pre>{authToken}</pre>
        //   <pre>{code}</pre>
        //   <pre>{teamId}</pre>
        //   <pre>{configurationId}</pre>
        //   <pre>{next}</pre>
        // </div>

        <Page>
            <Page.Content>
                <h2>Add your elastic cluster here</h2>
                <Grid.Container gap={2} direction="column">
                    <Grid>
                        <Input
                            value={url}
                            onChange={(e: React.FormEvent<HTMLInputElement>) =>
                                setUrl(e.currentTarget.value)
                            }
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            crossOrigin={undefined}
                        >
                            Url
                        </Input>

                        {url.length === 0 ? (
                            <Dot type="error">Url must not be empty</Dot>
                        ) : null}
                    </Grid>
                    <Grid>
                        <Input
                            value={username}
                            onChange={(e: React.FormEvent<HTMLInputElement>) =>
                                setUsername(e.currentTarget.value)
                            }
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            crossOrigin={undefined}
                        >
                            Username
                        </Input>
                        {username.length === 0 ? (
                            <Dot type="error">Username must not be empty</Dot>
                        ) : null}
                    </Grid>
                    <Grid>
                        <Input.Password
                            value={password}
                            onChange={(e: React.FormEvent<HTMLInputElement>) =>
                                setPassword(e.currentTarget.value)
                            }
                        >
                            Password
                        </Input.Password>
                        {password.length === 0 ? (
                            <Dot type="error">Password must not be empty</Dot>
                        ) : null}
                    </Grid>
                    {error ? (
                        <Grid>
                            <Dot type="error">{error}</Dot>
                        </Grid>
                    ) : null}
                    <Grid>
                        <Button
                            loading={loading}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            placeholder={undefined}
                            onClick={async () => {
                                try {
                                    if (loading) {
                                        return;
                                    }
                                    setLoading(true);
                                    await submit();
                                } catch (err) {
                                    console.error(err);
                                    throw err;
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            Create
                        </Button>
                    </Grid>
                </Grid.Container>
            </Page.Content>
            <Page.Footer>
                <h2>Footer</h2>
            </Page.Footer>
        </Page>
    );
};

export default NewPage;
