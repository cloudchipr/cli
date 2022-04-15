# CloudChipr CLI

[![Build and Push a Docker Image](https://github.com/cloudchipr/cli/actions/workflows/docker-image.yml/badge.svg)](https://github.com/cloudchipr/cli/actions/workflows/docker-image.yml)

<!-- overview -->
## Overview
#### Cloudchipr(c8r) CLI is an open source tool that helps users easily identify and clean public cloud resources. 

c8r provides a mechanism to apply user defined filters which would help to find, consolidate and delete all idle, abandoned or undesired resources in many different accounts and regions. By default, Cloudchipr CLI uses it's own pre-populated [filters](https://github.com/cloudchipr/cli/tree/main/default-filters). 

Currently, AWS and GCP are supported.
<!-- overviewstop -->

<!-- aws -->
## AWS
When executed, c8r will check users environment to identify AWS Access credentials, if users are logged in with AWS CLI then they are logged in with c8r as well. 
<!-- awsstop -->

<!-- quickstart -->
### Quick start using Docker
Run with the `latest` docker image
```shell 
docker run -t -v ~/.aws/credentials:/root/.aws/credentials cloudchipr/cli c8r collect all --verbose --region all
```

![](https://raw.githubusercontent.com/cloudchipr/cli/b416ad0553f6ec2acf50124057715fb7d09836dc/docs/demo/c8r-demo.gif)
<!-- quickstartstop -->

<!-- aws_resources -->
### Currently supported AWS resource types
* EC2 Instances
* EBS Volumes
* RDS Instances
* Elastic IPs
* Load Balancers - ALB, NLB, ELB
<!-- aws_resourcesstop -->

<!-- usage -->
### Usage Examples
##### Collect all EC2 instances in `us-west-2` region which have a `Name` tag key containing `dev` substring in the value and have been launched more than 1 day ago

Create the filters file
```shell
cat ec2-filters.yaml
```
```
and:
  - resource: "launch-time"
    op: "GreaterThanEqualTo"
    value: 1
  - resource: "tag:Name"
    op: "Contains"
    value: "dev"
```
Then run:
```shell
c8r collect ec2 --region us-west-2 -f ec2-filters.yaml
```
##### Collect all ebs volumes which are not attached to an instance in `us-west-2` region

Create the filters file
```shell
cat ebs-filters.yaml
```
```
and:
  - resource: "attachments"
    op: "IsEmpty"
  - resource: "volume-age"
    op: "GreaterThanEqualTo"
    value: 0
```
Then run:
```shell
c8r collect ebs --region us-west-2 -f ebs-filters.yaml
```
##### Collect all EIPs in default region which are not associated with an instance and don't have a `Name` tag

Create the filters file
```
cat eip-filter.yaml
```
```
and:
  - resource: "instance-ids"
    op: "IsAbsent"
  - resource: "association-ids"
    op: "IsAbsent"
  - resource: "tag:owner"
    op: "Exists"
```
Then run:
```shell
 c8r collect eip -f eip-filter.yaml
```
##### Collect all resource information from all regions and all connected accounts based on default filters.
###### Please note, this will work on multiple accounts in case the account that user logged in has assume role privileges to other accounts, typically management account.

```shell
c8r collect all --region all --account-id all
```
##### Clean
Very simple, `clean` and `collect` subcommands have exactly the same filters, simply replace `collect` with `clean` in order to delete selected resources.
###### `clean` subcommant will perform `collect` first, then present a confirmation (Y/n) request before executing the clean action. 
<!-- usagestop -->

<!-- gcp -->
## GCP
When executed, c8r will check GOOGLE_APPLICATION_CREDENTIALS environment variable which should contain path to the service accounts credentials key file in json format. [Here](https://github.com/cloudchipr/cli#gcp-service-account-steps) are our recommended list of commands to create GCP service account, generate a key and create role bindings.
For more details please check GCP authentication documentation [here](https://cloud.google.com/docs/authentication/getting-started). F
<!-- gcpstop -->

<!-- quickstart -->
### Quick start using Docker
Once you are successfully authenticated with application-default login, run:

```shell 
docker run -it --env GOOGLE_APPLICATION_CREDENTIALS=/root/.gcloud/gcloud-key.json --env CLOUDSDK_CORE_PROJECT=<Project_ID> -v $PWD/gcloud-key.json:/root/.gcloud/gcloud-key.json cloudchipr/cli c8r --cloud-provider gcp collect all --verbose
```
<!-- quickstartstop -->

<!-- gcp_resources -->
### Currently supported GCP resource types
* VM Instances
* Disks 
* SQL (MySQL and PostgreSQL)
* External IPs
* Load Balancers
<!-- gcp_resourcesstop -->

<!-- usage -->
### Usage Examples
In order to configure gcp cloud provider as default please run:
```shell 
c8r configure --set-default-provider gcp
```
##### Collect all disk volumes which are not attached to a VM instance.
Create the filters file
```shell
cat disks-filters.yaml
```
```
and:
  - resource: "attachments"
    op: "IsEmpty"
```
Then run:
```shell
c8r collect disks -f disks-filters.yaml
```

<!-- usagestop -->

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

## GCP Service account steps
Please replace <PROJECT_ID> with your own.
```
gcloud iam service-accounts create test-svc-acct --display-name "test svc account"

gcloud iam service-accounts keys create ./gcloud-key.json \
--iam-account=test-svc-acct@<PROJECT_ID>.iam.gserviceaccount.com

gcloud projects add-iam-policy-binding <PROJECT_ID> \
--member serviceAccount:test-svc-acct@<PROJECT_ID>.iam.gserviceaccount.com \
--role "roles/compute.admin"

gcloud projects add-iam-policy-binding <PROJECT_ID> \
--member serviceAccount:test-svc-acct@<PROJECT_ID>.iam.gserviceaccount.com \
--role "roles/cloudsql.admin"

gcloud projects add-iam-policy-binding <PROJECT_ID> \
--member serviceAccount:test-svc-acct@<PROJECT_ID>.iam.gserviceaccount.com \
--role "roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding <PROJECT_ID> \ 
--member serviceAccount:test-svc-acct@<PROJECT_ID>.iam.gserviceaccount.com \
--role "roles/serviceusage.serviceUsageConsumer"
```
<!-- gcp_service_accountstop -->


