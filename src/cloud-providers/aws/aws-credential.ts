export default class AwsCredential {
    constructor(
        private readonly accessKeyId: string,
        private readonly secretAccessKey: string
    ) {}

    getAccessKey(): string {
        return this.accessKeyId;
    }

    getSecretKey(): string {
        return this.secretAccessKey;
    }
}