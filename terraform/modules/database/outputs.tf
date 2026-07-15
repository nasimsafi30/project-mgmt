output "db_endpoint" { value = aws_db_instance.main.endpoint }
output "db_port" { value = aws_db_instance.main.port }
output "db_name" { value = aws_db_instance.main.db_name }
output "redis_endpoint" { value = aws_elasticache_cluster.main.cache_nodes[0].address }
output "redis_port" { value = aws_elasticache_cluster.main.cache_nodes[0].port }