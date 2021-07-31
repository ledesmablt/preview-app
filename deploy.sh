#!/bin/bash

PROJECT="general-scripts-273314"
NAME="digital-assets-form"
REGION="asia-southeast1"
URL="gcr.io/$PROJECT/$NAME"

gcloud builds submit --project $PROJECT --tag $URL && \
gcloud run deploy $NAME --project $PROJECT --image $URL \
  --region $REGION --platform managed \
  --allow-unauthenticated
