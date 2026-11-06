$reportFiles = Get-ChildItem -Path "security-audit/phase-6-remediation/final-verification/*.md"
foreach ($rf in $reportFiles) {
    $h = (Get-FileHash -Path $rf.FullName -Algorithm SHA256).Hash
    Write-Output "$($rf.Name) | $($rf.Length) bytes | $h"
}
