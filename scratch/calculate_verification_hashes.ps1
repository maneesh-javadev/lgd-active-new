$files = @(
    "auth-service/src/test/java/in/nic/lgd/auth/security/JwtUtilTest.java",
    "auth-service/target/surefire-reports/TEST-in.nic.lgd.auth.security.JwtUtilTest.xml",
    "user-management/src/test/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserServiceImplTest.java",
    "user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserServiceImplTest.xml",
    "user-management/src/test/java/in/nic/lgd/usermanagement/modules/user/service/impl/UserRoleMappingServiceImplTest.java",
    "user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.modules.user.service.impl.UserRoleMappingServiceImplTest.xml",
    "user-management/src/test/java/in/nic/lgd/usermanagement/integration/LiveHttpSecurityIntegrationTest.java",
    "user-management/target/surefire-reports/TEST-in.nic.lgd.usermanagement.integration.LiveHttpSecurityIntegrationTest.xml",
    "revenue/src/test/java/in/nic/lgd/revenue/security/SubDistrictPrimaryControllerSecurityTest.java",
    "revenue/target/surefire-reports/TEST-in.nic.lgd.revenue.security.SubDistrictPrimaryControllerSecurityTest.xml"
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $hash = (Get-FileHash -Path $f -Algorithm SHA256).Hash
        $item = Get-Item $f
        Write-Output "$($item.FullName) | $($item.Length) bytes | $($item.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss')) | $hash"
    } else {
        Write-Output "MISSING: $f"
    }
}
