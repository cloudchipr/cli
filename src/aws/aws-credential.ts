export default class AwsCredential {
    constructor(
        private readonly accessKeyId: string,
        private readonly secretAccessKey: string
    ) {}
}