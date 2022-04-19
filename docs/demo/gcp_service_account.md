
### GCP Service account creation steps
<!-- gcp_service_account -->
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
