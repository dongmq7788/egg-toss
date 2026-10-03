Add-Type -AssemblyName System.Drawing

$sourcePath = Join-Path $PSScriptRoot '..\src\assets\brand\logo-transparent.png'
$publicPath = Join-Path $PSScriptRoot '..\public'
New-Item -ItemType Directory -Path $publicPath -Force | Out-Null

$source = [System.Drawing.Bitmap]::FromFile($sourcePath)
$background = [System.Drawing.ColorTranslator]::FromHtml('#EDF9F6')

foreach ($size in @(180, 192, 512)) {
  $canvas = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  $graphics.Clear($background)
  $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $targetWidth = [Math]::Round($size * 0.88)
  $targetHeight = [Math]::Round($source.Height * $targetWidth / $source.Width)
  $targetX = [Math]::Round(($size - $targetWidth) / 2)
  $targetY = [Math]::Round(($size - $targetHeight) / 2)
  $graphics.DrawImage($source, $targetX, $targetY, $targetWidth, $targetHeight)
  $graphics.Dispose()

  $outputPath = Join-Path $publicPath "basta-app-icon-$size.png"
  $canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Dispose()
  Write-Output $outputPath
}

$source.Dispose()
