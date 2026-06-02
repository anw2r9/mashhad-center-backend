# تشغيل MongoDB بدون صلاحيات مسؤول (بديل لـ net start MongoDB)
$mongoBin = "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
$dataPath = Join-Path $PSScriptRoot "..\mongo-data" | Resolve-Path -ErrorAction SilentlyContinue
if (-not $dataPath) {
    $dataPath = (New-Item -ItemType Directory -Force -Path (Join-Path $PSScriptRoot "..\mongo-data")).FullName
}

if (-not (Test-Path $mongoBin)) {
    Write-Error "mongod.exe not found. Install MongoDB Community or update the path in scripts/start-mongodb.ps1"
    exit 1
}

Write-Host "Starting MongoDB on 127.0.0.1:27017 ..."
Write-Host "Data folder: $dataPath"
Write-Host "Keep this window open. Press Ctrl+C to stop."

& $mongoBin --dbpath $dataPath --port 27017 --bind_ip 127.0.0.1
