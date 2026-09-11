Add-Type -AssemblyName System.Drawing

$sourcePath = Join-Path $PSScriptRoot '..\src\assets\brand\logo.png'
$outputPath = Join-Path $PSScriptRoot '..\src\assets\brand\logo-transparent.png'
$source = [System.Drawing.Bitmap]::FromFile($sourcePath)
$width = 1000
$height = [Math]::Round($source.Height * $width / $source.Width)
$resized = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($resized)
$graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.DrawImage($source, 0, 0, $width, $height)
$graphics.Dispose()
$source.Dispose()

for ($y = 0; $y -lt $height; $y++) {
  for ($x = 0; $x -lt $width; $x++) {
    $pixel = $resized.GetPixel($x, $y)
    $minimum = [Math]::Min($pixel.R, [Math]::Min($pixel.G, $pixel.B))
    if ($minimum -ge 248) {
      $alpha = 0
    } elseif ($minimum -le 225) {
      $alpha = 255
    } else {
      $alpha = [Math]::Round((248 - $minimum) * 255 / 23)
    }
    $resized.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $pixel.R, $pixel.G, $pixel.B))
  }
}

$resized.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$resized.Dispose()
Write-Output $outputPath
