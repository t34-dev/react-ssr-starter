# Примеры запросов

## Правила

1. <b class="pick">ЗАПРОСЫ</b> должны содержать:

   1. минимум 1 поле
      1. "op" - сокращение <u>operation</u>. Типы: [СТРОКА]
   2. максимум 2 поля
      1. "op" - сокращение <u>operation</u>. Типы: [СТРОКА]
      2. "args" - сокращение <u>arguments</u>. Типы: [СТРОКА, ОБЪЕКТ, МАССИВ]. Необязательный параметр

```bash
# 1 поле
{
  op: "ping",
}

# 2 поля
{
  op: "auth",
  args: {
     login: "login",
     password: "password"
  }
}
# Ещё пример
{
  op: "auth",
  args: "BTN.10min"
}
# ИЛИ отдельно аргументы
{
  op: "auth",
  args: {
     name: "BTN",
     time: "10min"
  }
}
```

2. Все <b class="pick">ОТВЕТЫ</b> должны содержать:

   1. минимум 1 поле
      1. "res" - сокращение <u>response</u> (op меняется на res). Типы: [СТРОКА]
   2. максимум 2 поля
      1. "res" - сокращение <u>response</u>. Типы: [СТРОКА]
      2. "args" - сокращение <u>arguments</u>. Типы: [СТРОКА, ОБЪЕКТ, МАССИВ] (такой же как в запросе). Необязательный параметр
      3. "p" - сокращение <u>payload</u>. Типы: [СТРОКА, ОБЪЕКТ, МАССИВ]. Полезная нагрузка. Необязательный параметр

## ПРИМЕРЫ

1. Пингование

```bash
# Запрос
{
  op: "ping",
}

# Ответ
{
  res: "pong",
}
```

2. Подписка на маркеры

```bash
# Запрос
{
  op: "subscribe",
  args: "markets.BTN.10min"
}

# Ответ
{
  res: "subscribe",
  args: "markets.BTN.10min",
  p: ["hi","ho"]
}
или более сложный
{
  res: "subscribe",
  args: "markets.BTN.10min",
  p: {
     status: true,
     timestamp: 1717833130,
     arr: ["hi","ho"]
  }
}
```

3. Отправка запроса

```bash
# Запрос
{
  op: "message",
  args: "get_name"
}

# Ответ
{
  res: "message",
  args: "get_name",
  p: "zakon47"
}
# или так
{
  res: "message",
  args: "get_name",
  p: {
     name: "zakon47"
  }
}
```

<style>
    .pick {
        background:orange;
        color:black;
    }
</style>
