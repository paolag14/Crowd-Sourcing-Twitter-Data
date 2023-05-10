#!/usr/bin/env bash
set -x
awslocal s3 mb "s3://${S3_URL}"
set +x
