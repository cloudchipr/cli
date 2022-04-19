# CloudChipr CLI

[![Build and Push a Docker Image](https://github.com/cloudchipr/cli/actions/workflows/docker-image.yml/badge.svg)](https://github.com/cloudchipr/cli/actions/workflows/docker-image.yml)

<!-- overview -->
## Overview
#### Cloudchipr(c8r) CLI is an open source tool that helps users easily identify and clean public cloud resources. 

c8r provides a mechanism to apply user defined filters which would help to find, consolidate and delete all idle, abandoned or undesired resources in many different accounts and regions. By default, Cloudchipr CLI uses it's own pre-populated [filters](https://github.com/cloudchipr/cli/tree/main/default-filters). 

Currently, AWS and GCP are supported.
<!-- overviewstop -->

<!-- quickstart -->
## Quick start using Docker
<!-- aws -->
### AWS
When executed, c8r will check users environment to identify AWS Access credentials, if users are logged in with AWS CLI then they are logged in with c8r as well. 

Run with the `latest` docker image
```shell 
docker run -t -v ~/.aws/credentials:/root/.aws/credentials cloudchipr/cli c8r collect all --verbose --region all
```
<!-- awsstop -->
<!-- gcp -->
### GCP
When executed, c8r will check GOOGLE_APPLICATION_CREDENTIALS environment variable which should contain path to the service accounts credentials key file in json format. Please find our recommended [list of commands](#gcp-service-account-steps) to create GCP service account, generate a key and create role bindings.
For more details please check GCP authentication documentation [here](https://cloud.google.com/docs/authentication/getting-started).

Alternatively, Application Default Credentials (ADC) method could be used, which will generate a json file in ```~/.config/gcloud/``` directory.
```shell
gcloud auth application-default login

```
Once you are successfully authenticated with ADC, run:

```shell 
docker run -t --env GOOGLE_CLOUD_PROJECT=<PROJECT_ID> \
-v ~/.config/gcloud:/root/.config/gcloud cloudchipr/cli c8r \
--cloud-provider gcp collect all --verbose
```
<!-- quickstartstop -->



![](https://raw.githubusercontent.com/cloudchipr/cli/b416ad0553f6ec2acf50124057715fb7d09836dc/docs/demo/c8r-demo.gif)
<!-- quickstartstop -->

<!-- resources -->
### Currently supported resource types
#### AWS
* EC2 Instances
* EBS Volumes
* RDS Instances
* Elastic IPs
* Load Balancers - ALB, NLB, ELB

#### GCP
* VM Instances
* Disks 
* Cloud SQL 
* External IPs
* Load Balancers
<!-- resourcesstop -->

<!-- setup -->
## Dockerless Setup
* Install [NodeJS](https://nodejs.org/en/download/package-manager/)
* Install CloudCustodian ([c7n](https://cloudcustodian.io/docs/quickstart/index.html#linux-and-mac-os)) and CloudCustodian Org ([c7n-org](https://cloudcustodian.io/docs/tools/c7n-org.html#installation)) for multi-account usage.
* Set the following environment variables
```shell
export C8R_CUSTODIAN=<<PATH_TO_C7N_Binary>>
export C8R_CUSTODIAN_ORG=<<PATH_TO_C7N-ORG_Binary>>
```

* Clone the repository and run
```shell
cd cli
npm install
npm run build
chmod +x lib/index.js
npm link
```
<!-- setupstop -->

<!-- dockerless_usage -->
By default c8r is configured to work with AWS

```shell
c8r collect ec2
```
In order to use GCP there is an additional option
```shell
c8r --cloud-provider gcp collect eip
```
or the default could provider could be switched
```shell
c8r configure 
C8R cloud provider: gcp # just type gcp here
c8r configure --list
```
<!-- dockerless_usagestop -->

<!-- development -->
## Development
* Run the watch command to build your changes whenever a file is changed
```shell
npm run watch
```
* Run the build command to build your changes
```shell
npm run build
```
<!-- developmentstop -->

<!-- gcp_service_account -->

