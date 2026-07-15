variable "project_name" { type = string }
variable "environment" { type = string }
variable "vpc_cidr" { type = string }
variable "az_count" { type = number }
variable "container_port" { type = number }

data "aws_availability_zones" "available" {
  state = "available"
}