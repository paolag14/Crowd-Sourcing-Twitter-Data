locals {
  environment = "staging"
  account_id = "528591436707"
  region = "us-east-1"
  service_name = "sentilabelling"
}
terraform {
  required_version = ">= 1.1.3"

}
module "ecr" {
  source = "../modules/ecr"
  account_id = local.account_id
  region = local.region
  repository_name = "repo/${local.service_name}"
}

module "ecs" {
  source = "../modules/ecs"
  service_name = local.service_name
  environment = local.environment
  repository_url = module.ecr.repository_url
}

module "rds" {
  source = "../modules/rds"
  environment = local.environment
  account_id = local.account_id
  region = local.region
  service_name = local.service_name
  vpc_id = module.ecs.vpc_id
  allowed_cidr_blocks = [
    "10.18.32.0/19"
  ]
}

module "s3" {
  source = "../modules/s3"
  environment = local.environment
  service_name = local.service_name
}
