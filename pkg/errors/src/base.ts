export abstract class GenericError extends Error {
    constructor(name: string, message: string) {
        super(message);
        this.name = name;
    }
}
