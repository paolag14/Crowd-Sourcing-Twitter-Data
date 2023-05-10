resource "aws_ecr_repository" "repository" {
  name = var.repository_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
  encryption_configuration {
    encryption_type = "AES256"
  }
}

resource "aws_ecr_repository_policy" "repository_policy" {
  repository = aws_ecr_repository.repository.name
  policy = jsonencode({
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AllowCrossProductionPull",
          "Effect": "Allow",
          "Principal": {
            "AWS" : [
              // specify aws iam roles
            ]
          },
          "Action": [
            "ecr:BatchCheckLayerAvailability",
            "ecr:BatchGetImage",
            "ecr:GetDownloadUrlForLayer"
          ]
        }
      ]
  })
  depends_on = [aws_ecr_repository.repository]
}
