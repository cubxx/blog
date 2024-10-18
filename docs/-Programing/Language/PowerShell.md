## 数据类型

```powershell
$number = 0

$boolean = $true
$condition = -not $true -or $false -and $null

$string_1 = 'the number is $number'
$string_2 = "the string is $string_1"
$string_3 = "the string is $($string_1)"

$array_1 = @($hashtable_1, $hashtable_2)
$array_2 = @(
    $hashtable_1,
    $hashtable_2
)
$array_1[0]
$array_1[0].('key1')

$hashtable_1 = @{ key1 = $array_1; key2 = $array_2 }
$hashtable_2 = @{
    key1 = $array_1
    key2 = $array_2
}
$hashtable_1.key1
$hashtable_1['key1']

$function_1 = {
    param([number]$a, [number]$b) # 定义参数
    return $a + $b
}
function function_2 {
    param(
        [number]$a,
        [number]$b
    )
    return $a + $b
}
& $function_1 1 2 # 调用匿名函数，需要加 &
function_2 -a 1 -b 2 # 具名传参
& $function_1 | function_2 # 函数管道
```

## 控制流

```powershell
if ($condition) {} else {}
switch ($number) {
    0 { 'zero' }
    1 { 'one' }
    default { 'other' }
}
$result = if ($condition) { 1 } else { 0 } # 条件表达式

for ($i = 0; $i -lt 10; $i++) {}
foreach ($item in $array_1) {}
while ($condition) {}
do {} while ($condition)

try {
    throw 'error'
}
catch {
    Write-Host $_ # 输出捕获的异常
}
finally {}
```

## API

```powershell
Write-Host '输出'
Write-Error '报错'
Read-Host '输入'

Invoke-RestMethod 'http://www.example.com' # 返回解析后的json
Invoke-WebRequest 'http://www.example.com' # 返回原始响应
```
