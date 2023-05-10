locals {
  database_name = replace(var.service_name,"-", "_")
  rds_name = "${var.environment}-${var.service_name}"
  engine = "postgres"
  version = "14.2"
}

module "security_group" {
  source = "terraform-aws-modules/security-group/aws"
  version = "4.9.0"

  name = "${local.rds_name}-rds"
  description = "${local.rds_name} RDS security group"
  vpc_id = var.vpc_id
  ingress_cidr_blocks = var.allowed_cidr_blocks
  ingress_rules = ["postgresql-tcp"]
  tags = {
    Name        = var.service_name
    Environment = var.environment
  }
}

module "rds" {
  source = "terraform-aws-modules/rds/aws"
  version = "4.4.0"
  identifier = local.rds_name
  engine = "postgres"
  engine_version = "14.3"
  family = "postgres14"
  instance_class = "db.t2.micro"
  storage_encrypted = true
  allocated_storage = 10
  max_allocated_storage = 50

  username = "sentilabelling"
  db_name = local.database_name
  random_password_length = 32

  vpc_security_group_ids = [
    module.security_group.security_group_id
  ]
  monitoring_interval = 50
  monitoring_role_name = "${local.rds_name}-rds-monitoring"
  create_monitoring_role = true

  apply_immediately = false
  skip_final_snapshot = false

}
