only for Python 3.x

## 数据类型

```python
None
_bool = not True and False or True
_int = 0
_float = 0.0
_complex = 1 + 2j

_str = 'single quotes'
_str = "double quotes"
_str = '''triple single quotes'''
_str = """triple double quotes"""
_tamplate_str = f'int is {0}, but float is {1:.2f}'
_raw_str = r'use for regex matching'
_bytes = b'\x00\x01\x02'

_list = [1, 2, 3, 4]
_list[0] # return: 1
_list[-1] # return: 4
_list[0:2] # return: [1, 2]
_list[2:0:-1] # return: [3, 2]
_list[:] # return: [1, 2, 3, 4]
_list[::] # return: [1, 2, 3, 4]
_list.append(5) # return: None
_list.pop() # return: 5
_list.remove(2) # return: None
len(_list) # return: 3

_tuple = (1, 2, 3, 3)
_tuple.count(3) # return: 2
_tuple.index(2) # return: 1

_set = {1, 2, 3}
_set.add(4) # return: None
_set.remove(2) # return: None
_set.difference({2, 3}) # return: {1, 4}
_set.union({2, 3}) # return: {1, 2, 3, 4}
_set.intersection({1, 3}) # return: {1, 3}

_dict = {'one': 1, 'two': 2}
_dict['one'] # return: 1
_dict.keys() # return: dict_keys(["one", "two"])
_dict.values() # return: dict_values([1, 2])
_dict.items() # return: dict_items([('one', 1), ('two', 2)])
_dict.update({'three': 3}) # return: None
_dict.get('four','not found') # return: 'not found'
_dict.setdefault('four', 4) # return: 4

def _function(arg1, arg2='default value', *args, **kwargs):
    '''
    :param arg1: description of arg1
    :param arg2: description of arg2
    :param args: variable length argument list
    :param kwargs: keyworded variable length argument dict
    '''
    ...
    return ...
def _generator_function( *args):
    ...
    yield ...
_anonymous_function = lambda x1, x2: 'return value'
_result = _function()

class _Class(_SuperClass):
    '''description of class'''
    property = ...
    __private_property = ...

    def __init__(self, *args):
        ... # initialize instance
    def method(self, *args):
        ...
    def __private_method(self, *args):
        ...
_instance = _Class()
```

## 控制流

```python
if condition:
    ...
elif condition:
    ...
else:
    ...

for item in iterable:
    ...

while condition:
    ...

try:
    ...
except exception_class as variable:
    ...
finally:
    ...

with context_manager as variable:
    ...

assert condition, 'error message'
```

## 推导式（Comprehension）

```python
[... for item in iterable] # return: list
{...: ... for item in iterable} # return: dict
{... for item in iterable} # return: set
(... for item in iterable) # return: generator

[... for item in iterable if condition] # filter items
[... for item in iterable for subitem in subiterable] # nested loop
```
