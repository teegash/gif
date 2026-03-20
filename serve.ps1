param(
  [int]$Port = 8080,
  [string]$Root = $PSScriptRoot
)

$ErrorActionPreference = "Stop"

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg" = "image/svg+xml"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".gif" = "image/gif"
  ".webp" = "image/webp"
  ".ico" = "image/x-icon"
  ".txt" = "text/plain; charset=utf-8"
}

function Send-Response {
  param(
    [System.IO.Stream]$Stream,
    [int]$StatusCode,
    [string]$StatusText,
    [byte[]]$BodyBytes,
    [string]$ContentType = "text/plain; charset=utf-8"
  )

  $header = "HTTP/1.1 $StatusCode $StatusText`r`nContent-Type: $ContentType`r`nContent-Length: $($BodyBytes.Length)`r`nConnection: close`r`n`r`n"
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
  if ($BodyBytes.Length -gt 0) {
    $Stream.Write($BodyBytes, 0, $BodyBytes.Length)
  }
  $Stream.Flush()
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()

Write-Output "Serving $Root on http://localhost:$Port/"

while ($true) {
  $client = $null
  $stream = $null
  $reader = $null

  try {
    $client = $listener.AcceptTcpClient()
    $stream = $client.GetStream()
    $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)

    $requestLine = $reader.ReadLine()
    if ([string]::IsNullOrWhiteSpace($requestLine)) {
      continue
    }

    while (($line = $reader.ReadLine()) -ne "") {
      if ($null -eq $line) {
        break
      }
    }

    $parts = $requestLine.Split(" ")
    $method = if ($parts.Length -ge 1) { $parts[0] } else { "" }
    $target = if ($parts.Length -ge 2) { $parts[1] } else { "/" }

    if ($method -ne "GET") {
      $body = [System.Text.Encoding]::UTF8.GetBytes("Method Not Allowed")
      Send-Response -Stream $stream -StatusCode 405 -StatusText "Method Not Allowed" -BodyBytes $body
      continue
    }

    $relativePath = [System.Uri]::UnescapeDataString(($target.Split("?")[0]).TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($relativePath)) {
      $relativePath = "index.html"
    }

    $rootPath = [System.IO.Path]::GetFullPath($Root)
    $fullPath = [System.IO.Path]::GetFullPath((Join-Path $Root $relativePath))

    if (-not $fullPath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
      $body = [System.Text.Encoding]::UTF8.GetBytes("Forbidden")
      Send-Response -Stream $stream -StatusCode 403 -StatusText "Forbidden" -BodyBytes $body
      continue
    }

    if ((Test-Path $fullPath) -and (Get-Item $fullPath).PSIsContainer) {
      $fullPath = Join-Path $fullPath "index.html"
    }

    if (-not (Test-Path $fullPath)) {
      $body = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
      Send-Response -Stream $stream -StatusCode 404 -StatusText "Not Found" -BodyBytes $body
      continue
    }

    $extension = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
    $contentType = if ($mimeTypes.ContainsKey($extension)) { $mimeTypes[$extension] } else { "application/octet-stream" }
    $bytes = [System.IO.File]::ReadAllBytes($fullPath)
    Send-Response -Stream $stream -StatusCode 200 -StatusText "OK" -BodyBytes $bytes -ContentType $contentType
  } catch {
    if ($stream) {
      try {
        $body = [System.Text.Encoding]::UTF8.GetBytes("Server Error")
        Send-Response -Stream $stream -StatusCode 500 -StatusText "Server Error" -BodyBytes $body
      } catch {
        # Ignore write failures during exception handling.
      }
    }
  } finally {
    if ($reader) { $reader.Dispose() }
    if ($stream) { $stream.Dispose() }
    if ($client) { $client.Dispose() }
  }
}
