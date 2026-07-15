output "uploads_bucket_name" { value = aws_s3_bucket.uploads.id }
output "uploads_bucket_arn" { value = aws_s3_bucket.uploads.arn }
output "backups_bucket_name" { value = aws_s3_bucket.backups.id }
output "static_bucket_name" { value = aws_s3_bucket.static.id }
output "static_oac_id" { value = aws_cloudfront_origin_access_control.static.id }