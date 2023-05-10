resource "aws_s3_bucket" "sentilabeling_bucket" {
  bucket = "sentilabeling-s3"

  tags = {
    Name        = var.service_name
    Environment = var.environment
  }
}

resource "aws_s3_bucket_acl" "example" {
  bucket = aws_s3_bucket.sentilabeling_bucket.id
  acl    = "private"
}
