variable "project_name" { type = string }
variable "environment" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "rds_security_group_id" { type = string }
variable "redis_security_group_id" { type = string }
variable "db_name" { type = string }
variable "db_username" { type = string }
variable "db_password" { type = string }
variable "db_instance_class" { type = string }
variable "db_allocated_storage" { type = number }
variable "db_max_storage" { type = number; default = 500 }
variable "db_multi_az" { type = bool }
variable "db_backup_retention" { type = number; default = 30 }
variable "redis_node_type" { type = string }
variable "redis_num_cache_nodes" { type = number }