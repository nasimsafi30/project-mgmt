variable "project_name" { type = string }
variable "environment" { type = string }
variable "domain_name" { type = string }
data "aws_caller_identity" "current" {}