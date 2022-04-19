<!-- usage -->
### Usage Examples
#### AWS examples
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

#### GCP examples
In order to configure gcp cloud provider as default please run:
```shell 
c8r configure
```
then type `gcp`
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

