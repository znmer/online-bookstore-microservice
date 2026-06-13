$path = [System.IO.Path]::GetFullPath("C:UsersÊ35DownloadsJava_EE核心框架技术结课报告(2).docx")
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($path)
$entry = $zip.Entries | Where-Object { $_.Name -eq "document.xml" } | Select-Object -First 1
$reader = New-Object System.IO.StreamReader($entry.Open())
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()
$text = [regex]::Replace($xml, "<[^>]+>", " ")
$text = [regex]::Replace($text, "s+", " ")
Write-Output $text
