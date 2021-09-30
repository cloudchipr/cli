CloudChiprCLI
=============
# Setup
<!-- setup -->
* Clone the repository [CloudChiprCLI](https://github.com/cloudchipr/cloudchipr-cli)
* Install [NodeJS](https://nodejs.org/)
* Navigate to the CloudChiprCLI folder
```sh-session
$ cd cloudchipr-cli
```
* Install node dependencies
```sh-session
$ npm install
```
* In order to use commands like `c8r [command]` or `cloudchipr [command]` run
```sh-session
$ npm link
```
<!-- setupstop -->
# Development
<!-- development -->
* Run the watch command to build your changes whenever a file is changed
```sh-session
$ npm run watch
```
* Run the build command to build your changes
```sh-session
$ npm run build
```

### How to run via Docker
1. Build the docker image
```shell
 docker build . -t c8r/cli
```
2. Run you commands
```shell 
 docker run -v ~/.aws/credentials:/root/.aws/credentials  c8r/cli c8r collect ebs
```
<!-- developmentstop -->
