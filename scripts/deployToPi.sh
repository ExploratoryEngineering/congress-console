#/bin/bash
echo "Deploying to local pi"

if scp -r dist/* pi@congress:self-service-portal/.; then
  echo "=============="
  echo "Deploy success"
  echo "=============="
else
  echo "========================================================================"
  echo "Something went wrong when trying to deploy to pi"
  echo "Make sure that you have the correct credentials available"
  echo "Tip: use ssh-copy-id with pi@congress to implicitly login without prompt"
  echo "========================================================================"
fi
