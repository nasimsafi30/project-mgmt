# ============================================
# Networking Outputs
# ============================================

output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.networking.public_subnet_ids
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.networking.private_subnet_ids
}

# ============================================
# Compute Outputs
# ============================================

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.compute.ecs_cluster_name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.compute.ecs_service_name
}

output "load_balancer_dns" {
  description = "ALB DNS name"
  value       = module.compute.alb_dns_name
}

output "load_balancer_arn" {
  description = "ALB ARN"
  value       = module.compute.alb_arn
}

# ============================================
# Database Outputs
# ============================================

output "db_endpoint" {
  description = "RDS endpoint"
  value       = module.database.db_endpoint
  sensitive   = true
}

output "db_port" {
  description = "RDS port"
  value       = module.database.db_port
}

output "redis_endpoint" {
  description = "Redis endpoint"
  value       = module.database.redis_endpoint
  sensitive   = true
}

# ============================================
# CDN Outputs
# ============================================

output "cloudfront_domain" {
  description = "CloudFront distribution domain"
  value       = module.cdn.cloudfront_domain
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.cdn.cloudfront_distribution_id
}

# ============================================
# Storage Outputs
# ============================================

output "uploads_bucket_name" {
  description = "S3 bucket for file uploads"
  value       = module.storage.uploads_bucket_name
}

output "backups_bucket_name" {
  description = "S3 bucket for backups"
  value       = module.storage.backups_bucket_name
}

# ============================================
# Application URLs
# ============================================

output "app_url" {
  description = "Application URL"
  value       = "https://${var.domain_name}"
}

output "api_url" {
  description = "API URL"
  value       = "https://api.${var.domain_name}"
}