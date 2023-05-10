variable "account_id" {
  type = string
}
variable "environment" {
  type = string
}
variable "region" {
  type = string
}
variable "service_name" {
  type = string
}
variable "vpc_id" {
  type = string
}
variable "allowed_cidr_blocks" {
  type = list(string)
}
