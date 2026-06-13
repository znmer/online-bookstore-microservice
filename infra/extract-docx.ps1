$path = [System.IO.Path]::GetFullPath("C:\Users\31235\Downloads\Java_EE核心框架技术结课报告(2).docx")
Write-Host "File path: $path"
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($path)
$entry = $zip.Entries | Where-Object { $_.Name -eq "document.xml" } | Select-Object -First 1
$reader = New-Object System.IO.StreamReader($entry.Open())
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

# Extract text content from XML - strip all XML tags
$text = [regex]::Replace($xml, "<[^>]+>", " ")
$text = [regex]::Replace($text, "\s+", " ")
Write-Output $text
