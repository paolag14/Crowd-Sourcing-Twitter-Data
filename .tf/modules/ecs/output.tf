output "vpc_id" {
  description = "VPC id for the entire sentilabelling app"
  value = aws_vpc.sentilabelling-vpc.id
}
