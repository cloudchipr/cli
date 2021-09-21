export default class AwsCredential {
    constructor(
        private readonly accessKeyId: string,
        private readonly secretAccessKey: string
    ) {}

    getAccessKey(): String {
        return this.accessKeyId;
    }

    getSecretKey(): string {
        return this.secretAccessKey;
    }
}