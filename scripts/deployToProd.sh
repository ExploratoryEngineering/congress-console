#!/bin/bash
echo "Deploying to lora.engineering"
echo "Current changes will occur:"

aws s3 sync dist/ s3://lora.engineering/ --dryrun --acl public-read --profile s3-lora-web-admin --delete

while true; do
    read -p "Does this look ok? [Yy/Nn]" yn
    case $yn in
        [Yy]* ) aws s3 sync dist/ s3://lora.engineering/ --acl public-read --profile s3-lora-web-admin --delete; aws cloudfront create-invalidation --distribution-id E3BA2B249FQAKT --paths "/*"; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done
