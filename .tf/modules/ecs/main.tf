resource "aws_ecs_cluster" "aws-ecs-cluster" {
  name = "${var.service_name}-${var.environment}-cluster"
  tags = {
    Name        = "${var.service_name}-ecs"
    Environment = var.environment
  }
}

resource "aws_ecs_task_definition" "aws-ecs-task" {
  family = "${var.service_name}-task"

  container_definitions = <<DEFINITION
  [
    {
      "name": "${var.service_name}-${var.environment}-container",
      "image": "${var.repository_url}:latest",
      "entryPoint": [],
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8080,
          "hostPort": 8080
        }
      ],
      "cpu": 256,
      "memory": 512,
      "networkMode": "awsvpc"
    }
  ]
  DEFINITION

  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = "512"
  cpu                      = "256"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role .arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn

  tags = {
    Name        = "${var.service_name}-ecs-td"
    Environment = var.environment
  }
}

resource "aws_ecs_service" "aws-ecs-service" {
  name                 = "${var.service_name}-${var.environment}-ecs-service"
  cluster              = aws_ecs_cluster.aws-ecs-cluster.id
  task_definition = "${aws_ecs_task_definition.aws-ecs-task.arn}" # Referencing the task our service will spin up
  launch_type          = "FARGATE"
  scheduling_strategy  = "REPLICA"
  desired_count        = 1
  force_new_deployment = true
  network_configuration {
    subnets          = ["${aws_default_subnet.default_subnet_a.id}", "${aws_default_subnet.default_subnet_b.id}", "${aws_default_subnet.default_subnet_c.id}"]
    assign_public_ip = true # Providing our containers with public IPs
  }
}
