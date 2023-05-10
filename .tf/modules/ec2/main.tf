resource "aws_vpc" "aws-vpc" {
  cidr_block = "10.10.0.0/16"
  enable_dns_hostnames =  true
  enable_dns_support =  true
  tags = {
    Environment = var.environment
  }
}
resource "aws_internet_gateway" "aws-igw" {
  vpc_id = aws_vpc.aws-vpc.id
  tags = {
    Name        = "${var.app_name}-igw"
    Environment = var.environment
  }
}

resource "aws_subnet" "private" {
  vpc_id = aws_vpc.aws-vpc.id
  count = lenght(var.private_subnets)
  cidr_block = element(var.private_subnets, count.index)
  availability_zone =  element(var.availability_zones, count.index)

  tags = {
    Name = "${var.service_name}-private-subnet-${count.index + 1}"
    Environment = var.environment
  }
}

resource "aws_subnet" "public" {
  vpc_id = aws_vpc.aws-vpc.id
  count = lenght(var.public_subnets)
  cidr_block = element(var.public_subnets, count.index)
  availability_zone = element(var.availability_zones, count.index)
  map_public_ip_on_launch =  true

  tags = {
    Name = "${var.service_name}-public-subnet-${count.index + 1}"
    Environment = var.environment
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.aws-vpc.id
  tags = {
    Name        = "${var.service_name}-routing-table-public"
    Environment = var.environment
  }
}

resource "aws_route" "public" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.aws-igw.id
}

resource "aws_route_table_association" "public" {
  count          = length(var.public_subnets)
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = aws_route_table.public.id
}

resource "aws_cloudwatch_log_group" "log-group" {
  name = "${var.app_name}-${var.app_environment}-logs"

  tags = {
    Application = var.service_name
    Environment = var.environment
  }
}
