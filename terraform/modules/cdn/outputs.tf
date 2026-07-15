output "cloudfront_domain" { value = aws_cloudfront_distribution.main.domain_name }
output "cloudfront_distribution_id" { value = aws_cloudfront_distribution.main.id }
output "cloudfront_hosted_zone_id" { value = aws_cloudfront_distribution.main.hosted_zone_id }