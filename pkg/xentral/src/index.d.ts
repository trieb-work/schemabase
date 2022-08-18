declare module "digest-fetch" {
    export default class DigestClient {
        constructor(username: string, password: string, options?: { algorithm?: 'MD5' }): {
            fetch: () => void
        }
        fetch(url: RequestInfo, init?: RequestInit): Promise<Response>
    }
}