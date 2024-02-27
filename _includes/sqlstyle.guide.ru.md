# SQL: Руководство по стилю

## Предисловие

Вы можете использовать это руководство целиком, [сделать его форк][fork] или
создать своё на его основе. Цель — определить, какой стиль вам подходит
больше, и придерживаться его. Если вы хотите предложить изменение или
исправить ошибку, [откройте Issue][issue] или [создайте Pull Request][pull] на
GitHub'е.

Рекомендации, описанные в этом руководстве, во многом пересекаются с
описанными в книге Джо Селко
«[Стиль программирования Джо Селко на SQL][celko-ru]» (оригинал:
[SQL Programming Style][celko]). Это, в частности, найдут полезным те, кто уже
знаком с этой книгой. Тем не менее автор этого руководства в некоторых
аспектах более категоричен, нежели Джо Селко, а в других, напротив, более
гибок. И, конечно, нельзя не отметить, что это руководство значительно короче
и лаконичнее [книги Селко][celko-ru] — здесь вы не встретите ни весёлых
историй из жизни, наглядно объясняющих, как и почему лучше не делать, ни
длинных повествований, мотивирующих на использование той или иной
рекомендации.

Руководство написано в [формате Markdown][dl-md], что позволяет легко включить
его в проект или просто сослаться на него оттуда, что гораздо удобнее, нежели
работать с большой бумажной книгой.

«SQL: Руководство по стилю» (SQL style guide) за авторством Саймона Холиуэлла
(Simon Holywell) находится под лицензией [Creative Commons «Атрибуция — На тех
же условиях» 4.0 Всемирная][licence-ru]. Оригинал —
[https://www.sqlstyle.guide][sqlstyleguide].

## Основные положения

### Хороший стиль

* **Идентификаторы и имена**. Осмысленные и в едином стиле.
* **Пробелы и отступы**. Логично расставленные для лучшей читаемости кода.
* **Дата и время**. Соответствующие стандарту [ISO 8601][iso-8601-ru]:
  `YYYY-MM-DDTHH:MM:SS.SSSSS`.
* **Функции SQL**. Стандартные вместо специфичных (определяемых поставщиком) с
  целью лучшей переносимости.
* **Код**. Лаконичный и без излишеств, как например: ненужные кавычки или
  скобки или неуместное использование оператора `WHERE`.
* **Комментарии**. Предпочтительно в [стиле C][c-style-comments-ru] — `/*`
  (начало) и `*/` (конец). Либо `--` перед комментарием, тогда окончанием
  будет новая строка.

```sql
SELECT file_hash -- stored ssdeep hash
  FROM file_system
 WHERE file_name = '.vimrc';
```

```sql
/* Updating the file record after writing to the file */
UPDATE file_system
   SET file_modified_date = '1980-02-22 13:19:01.00000',
       file_size = 209732
 WHERE file_name = '.vimrc';
```

### Плохой стиль

* **camelCase**. Неудобочитаем.
* **Префиксы и [венгерская нотация][hungarian-notation-ru]**. Префиксы
  наподобие `sp_` или `tbl_` избыточны.
* **Множественное число**. Лучше использовать более естественно звучащие
  собирательные понятия. Например, `staff` вместо `employees` или `people`
  вместо `individuals`.
* **Идентификаторы в кавычках**. Если они обязательно нужны, тогда используйте
  двойные кавычки, определённые в стандарте [SQL-92][sql-92-ru] с целью лучшей
  переносимости в дальнейшем.
* **Принципы объектно-ориентированного проектирования**. Не нужно применять к
  SQL или структуре базы данных.

## Соглашения о наименовании

### Общее

* **Убедитесь** в том, что имя уникально и его нет в
  [списке зарезервированных ключевых слов][reserved-keywords].
* **Ограничивайте** длину имени 30 байтами (это 30 символов, если не
  используется многобайтный набор символов).
* **Начинайте** имена с буквы и **не заканчивайте** их символом подчёркивания.
* **Используйте** в именах только буквы, цифры и символ подчёркивания.
* **Избегайте** нескольких подряд идущих символов подчёркивания.
* **Используйте** символ подчёркивания там, где вы бы поставили пробел в
  реальной жизни (например, `first name` станет `first_name`).
* **Избегайте** сокращений. Если их всё же нужно использовать, убедитесь в
  том, что они общепонятны.

```sql
SELECT first_name
  FROM staff;
```

### Таблицы

* **Используйте** собирательные имена или, что менее предпочтительно, форму
  множественного числа. Например, `staff` и `employees` (в порядке убывания
  предпочтения).
* **Не используйте** описательные префиксы вида `tbl_` и венгерскую нотацию в
  целом.
* **Не допускайте** совпадений названия таблицы с названием любого из её
  столбцов.
* По возможности **избегайте** объединения названий двух таблиц для построения
  таблицы отношений. Например, вместо названия `cars_mechanics` лучше подойдёт
  `services`.

### Столбцы

* Названия всегда **давайте** в единственном числе.
* По возможности **не используйте** `id` в качестве первичного идентификатора
  таблицы.
* **Не создавайте** в таблице столбцов с таким же названием, как у неё самой.
* Названия **всегда пишите** со строчной буквы. Могут быть исключения,
  например использование имени собственного.

### Псевдонимы/корреляции

* **Должны** так или иначе быть связаны с объектами или выражениями,
  псевдонимом которых они являются.
* Имя корреляции **обычно составляется** из первых букв каждого слова в имени
  объекта.
* **Добавьте** цифру к имени, если такое уже существует.
* Всегда **используйте** ключевое слово `AS` для лучшей читаемости.
* Для вычислимых данных (`SUM()` или `AVG()`) **используйте** такие имена,
  которые вы бы дали, будь они столбцами в таблице.

```sql
SELECT first_name AS fn
  FROM staff AS s1
  JOIN students AS s2
    ON s2.mentor_id = s1.staff_num;
```

```sql
SELECT SUM(s.monitor_tally) AS monitor_total
  FROM staff AS s;
```

### Хранимые процедуры

* Имя **должно** содержать глагол.
* **Не используйте** описательные префиксы вида `sp_` и венгерскую нотацию в
  целом.

### Универсальные суффиксы

Приведённые ниже суффиксы универсальны, что гарантирует простоту понимания
значения столбцов из кода SQL.

* `_id` — уникальный идентификатор, например первичный ключ.
* `_status` — флаг или любой статус, например `publication_status`.
* `_total` — общее количество или сумма значений.
* `_num` — поле, содержащее число.
* `_name` — любое имя, например `first_name`.
* `_seq` — непрерывная последовательность значений.
* `_date` — колонка, содержащая дату.
* `_tally` — счётчик.
* `_size` — размер или величина чего-либо, например размер файла.
* `_addr` — физический или абстрактный адрес, например `ip_addr`.

## Синтаксис запросов

### Зарезервированные слова

[Зарезервированные ключевые слова][reserved-keywords] всегда пишите прописными
буквами, например `SELECT`, `WHERE`.

Не используйте сокращённый вариант ключевого слова, если имеется полный.
Например, используйте `ABSOLUTE` вместо `ABS`.

Не используйте специфичные для какого-либо поставщика СУБД ключевые слова,
если в ANSI SQL есть ключевые слова, выполняющие такие же функции. Это сделает
ваш код более переносимым.

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### Пробельные символы

Для лучшей удобочитаемости кода важно правильно использовать пробельные символы.
Не нужно нагромождать код или удалять пробелы, присущие естественному языку.

#### Пробелы

Можно и нужно использовать пробелы для выравнивания основных ключевых слов по
их правому краю. В типографике получающиеся таким образом
«[коридоры][rivers-ru]» стараются избегать, в то же время в нашем случае они,
напротив, помогают лучше вычленять важные ключевые слова.

```sql
(SELECT f.species_name,
        AVG(f.height) AS average_height, AVG(f.diameter) AS average_diameter
   FROM flora AS f
  WHERE f.species_name = 'Banksia'
     OR f.species_name = 'Sheoak'
     OR f.species_name = 'Wattle'
  GROUP BY f.species_name, f.observation_date)

  UNION ALL

(SELECT b.species_name,
        AVG(b.height) AS average_height, AVG(b.diameter) AS average_diameter
   FROM botanic_garden_flora AS b
  WHERE b.species_name = 'Banksia'
     OR b.species_name = 'Sheoak'
     OR b.species_name = 'Wattle'
  GROUP BY b.species_name, b.observation_date);
```

Обратите внимание, что ключевые слова `SELECT`, `FROM` и т.д. выровнены по
правому краю, при этом названия столбцов и различные условия — по левому.

Помимо этого, старайтесь расставлять пробелы:

* **до** и **после** знака равно (`=`)
* **после** запятых (`,`)
* **до** открывающего и **после** закрывающего апострофов (`'`), если последний
  не внутри скобок, или без последующих запятой или точки с запятой, или не в
  конце строки

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### Переводы строки

Всегда делайте перенос строки:

* **перед** `AND` или `OR`
* **после** точки с запятой (для разделения запросов)
* **после** каждого основного ключевого слова
* **после** запятой (при выделении логических групп столбцов)

Следуя принципу, что ключевые слова выравниваются по правому краю, а всё
остальное — по левому, мы добиваемся достаточно удобного расположения частей
кода, вследствие чего улучшается зрительная навигация по нему.

```sql
INSERT INTO albums (title, release_date, recording_date)
VALUES ('Charcoal Lane', '1990-01-01 01:01:01.00000', '1990-01-01 01:01:01.00000'),
       ('The New Danger', '2008-01-01 01:01:01.00000', '1990-01-01 01:01:01.00000');
```

```sql
UPDATE albums
   SET release_date = '1990-01-01 01:01:01.00000'
 WHERE title = 'The New Danger';
```

```sql
SELECT a.title,
       a.release_date, a.recording_date, a.production_date -- grouped dates together
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

### Отступы

Для того, чтобы SQL был удобочитаем, важно также следовать стандартам
расстановки отступов.

#### `JOIN`

Объединения (`JOIN`) должны располагаться по правую часть «коридора». При
необходимости между ними можно добавить пустую строку.

```sql
SELECT r.last_name
  FROM riders AS r
       INNER JOIN bikes AS b
       ON r.bike_vin_num = b.vin_num
          AND b.engine_tally > 2

       INNER JOIN crew AS c
       ON r.crew_chief_last_name = c.last_name
          AND c.chief = 'Y';
```

#### Подзапросы

Подзапросы тоже должны быть выровнены по правому краю «коридора», а внутри них
самих применяются те же правила форматирования, что и в любом другом запросе.
Если используются вложенные подзапросы, может иметь смысл поставить
закрывающую скобку на новой строке ровно под парной ей открывающей скобкой.

```sql
SELECT r.last_name,
       (SELECT MAX(YEAR(championship_date))
          FROM champions AS c
         WHERE c.last_name = r.last_name
           AND c.confirmed = 'Y') AS last_championship_year
  FROM riders AS r
 WHERE r.last_name IN
       (SELECT c.last_name
          FROM champions AS c
         WHERE YEAR(championship_date) > '2008'
           AND c.confirmed = 'Y');
```

### Формальные тонкости

* **Используйте** `BETWEEN`, где возможно, вместо нагромождения условий `AND`.
* Таким же образом старайтесь **использовать** `IN()` вместо `OR`.
* **Используйте** `CASE`, если значение должно быть интерпретировано до
  окончания выполнения запроса. С помощью `CASE` можно также формировать
  сложные логические структуры.
* По возможности **избегайте** использования `UNION` и временных таблиц.

```sql
SELECT CASE postcode
       WHEN 'BN1' THEN 'Brighton'
       WHEN 'EH1' THEN 'Edinburgh'
       END AS city
  FROM office_locations
 WHERE country = 'United Kingdom'
   AND opening_time BETWEEN 8 AND 9
   AND postcode IN ('EH1', 'BN1', 'NN1', 'KW1');
```

## Синтаксис `CREATE`

При разработке схемы данных важно создавать человекочитаемый код. Убедитесь в
том, что объявления столбцов логически структурированы и сгруппированы.

Внутри объявления `CREATE` делайте отступ, равный 4 пробелам.

### Типы данных

* По возможности **не используйте** специфичные для той или иной СУБД типы
  данных. Это может негативно сказаться на переносимости, а также этих типов
  может не оказаться в старых версиях этих же СУБД.
* Для работы с плавающей точкой **используйте** только `REAL` или `FLOAT`, но
  где нет необходимости в подобных вычислениях, всегда **используйте**
  `NUMERIC` и `DECIMAL`. Ошибки округления в операциях с плавающей точкой
  могут оказаться очень некстати.

### Значения по умолчанию

* Значение по умолчанию всегда должно **совпадать** по типу со столбцом. Если,
  скажем, столбец объявлен как `DECIMAL`, не нужно в качестве умолчания
  указывать значение типа `INTEGER`.
* Значения по умолчанию должны располагаться **после** объявления типа столбца
  и **перед** пометкой `NOT NULL`.

### Ограничения и ключи

Ограничения и их подмножество, ключи, — важная часть любой структуры базы
данных, поэтому важно следовать стандартам их объявления, чтобы избежать
трудностей в последующей поддержке написанного.

#### Ключи

Выбор столбцов, которые будут играть роль ключей, должен быть обоснован и
предельно выверен, поскольку от них напрямую зависит производительность и
целостность данных.

1. Ключ должен быть в какой-то степени уникальным.
1. Должна быть согласованность по типу данных для значения во всей схеме, а
  также чем ниже вероятность того, что это изменится в будущем, тем лучше.
1. Можно ли проверить значение на соответствие стандарту (например, ISO)?
1. Ключ должен быть как можно проще, чтобы можно было без трудностей
  использовать составные ключи.

Это своего рода конвенции, которые нужно сформулировать при проектировании
базы данных. Если требования впоследствии будут разрастаться, можно и нужно
вносить изменения в структуру базы, чтобы поддерживать её в актуальном
состоянии.

#### Ограничения

Как только решено, какие ключи должны использоваться, нужно определить их в базе
с помощью ограничений наряду с валидацией значений полей.

##### Общее

* У каждой таблицы **должен быть** хотя бы один ключ.
* Ограничениям нужно **присваивать** вразумительные имена. Для `UNIQUE`,
  `PRIMARY KEY` и `FOREIGN KEY` подобные имена создаются автоматически,
  поэтому нужно позаботиться об остальных ограничениях.

##### Расположение и порядок

* Первичный ключ должен быть **объявлен** в самом начале, сразу после
  оператора `CREATE TABLE`.
* Ограничения должны быть **объявлены** строго ниже столбца, с которым они
  связаны. Расставьте отступы так, чтобы объявление ограничения начиналось
  после названия столбца.
* В случае ограничений, затрагивающих несколько столбцов, старайтесь
  **объявлять** их как можно ближе к описанию последнего из них. В крайнем
  случае объявляйте ограничение в конце тела `CREATE TABLE`.
* Ограничения целостности уровня таблицы должны **располагаться** в конце.
* **Используйте** алфавитный порядок там, где `ON DELETE` предшествует
  `ON UPDATE`.
* Внутри запроса можно **выравнивать** каждый уровень по-своему. Например,
  можно добавить отступы после названия столбцов, чтобы типы данных начинались
  с одной позиции, а затем ещё добавить отступов в нужном количестве, чтобы
  все объявления `NOT NULL` тоже были выровнены по левому краю. Подобное
  форматирование позволит быстрее ориентироваться в коде.

##### Валидация

* **Используйте** `LIKE` и `SIMILAR TO` для обеспечения целостности строк с
  известным форматом.
* Если диапазон числовых значений для столбца известен, **используйте**
  `CHECK()` для предотвращения внесения в базу некорректных данных или
  скрытого отсечения части значения слишком больших данных. Обычно проверка
  делается на то, что значение больше нуля.
* `CHECK()` должен быть **объявлен** как отдельное ограничение для упрощения
  последующей отладки.

##### Пример

```sql
CREATE TABLE staff (
    PRIMARY KEY (staff_num),
    staff_num      INT(5)       NOT NULL,
    first_name     VARCHAR(100) NOT NULL,
    pens_in_drawer INT(2)       NOT NULL,
                   CONSTRAINT pens_in_drawer_range
                   CHECK(pens_in_drawer BETWEEN 1 AND 99)
);
```

### Чего следует избегать

* **Не применяйте** объектно-ориентированные принципы, поскольку они далеко не
  всегда оптимально ложатся на реляционную модель баз данных.
* **Не разносите** по разным столбцам значения и единицы измерения. Нужно
  создавать столбцы так, чтобы единицы измерения были чем-то самим собой
  разумеющимся. Для проверки корректности вставляемых  в столбец данных
  используйте `CHECK()`.
* **Избегайте** паттерна [EAV (Entity Attribute Value)][eav]. Вместо него
  используйте специальные продукты, предназначенные для работы с
  неструктурированными данными.
* **Не разбивайте** данные, логически принадлежащие одной таблице, по разным
  таблицам на основании условностей, например архивации по времени или
  географическим атрибутам. Впоследствии для работы с несколькими подобными
  таблицам придётся часто использовать `UNION` вместо простых запросов к одной
  таблице.

## Приложение

<span id="reserved-keyword-reference" />

### Список зарезервированных ключевых слов

Список зарезервированных ключевых слов ANSI SQL (92, 99 and 2003), MySQL
версий с 3 по 5.x, PostgreSQL 8.1, MS SQL Server 2000, MS ODBC и Oracle 10.2.

```sql
A
ABORT
ABS
ABSOLUTE
ACCESS
ACTION
ADA
ADD
ADMIN
AFTER
AGGREGATE
ALIAS
ALL
ALLOCATE
ALSO
ALTER
ALWAYS
ANALYSE
ANALYZE
AND
ANY
ARE
ARRAY
AS
ASC
ASENSITIVE
ASSERTION
ASSIGNMENT
ASYMMETRIC
AT
ATOMIC
ATTRIBUTE
ATTRIBUTES
AUDIT
AUTHORIZATION
AUTO_INCREMENT
AVG
AVG_ROW_LENGTH
BACKUP
BACKWARD
BEFORE
BEGIN
BERNOULLI
BETWEEN
BIGINT
BINARY
BIT
BIT_LENGTH
BITVAR
BLOB
BOOL
BOOLEAN
BOTH
BREADTH
BREAK
BROWSE
BULK
BY
C
CACHE
CALL
CALLED
CARDINALITY
CASCADE
CASCADED
CASE
CAST
CATALOG
CATALOG_NAME
CEIL
CEILING
CHAIN
CHANGE
CHAR
CHAR_LENGTH
CHARACTER
CHARACTER_LENGTH
CHARACTER_SET_CATALOG
CHARACTER_SET_NAME
CHARACTER_SET_SCHEMA
CHARACTERISTICS
CHARACTERS
CHECK
CHECKED
CHECKPOINT
CHECKSUM
CLASS
CLASS_ORIGIN
CLOB
CLOSE
CLUSTER
CLUSTERED
COALESCE
COBOL
COLLATE
COLLATION
COLLATION_CATALOG
COLLATION_NAME
COLLATION_SCHEMA
COLLECT
COLUMN
COLUMN_NAME
COLUMNS
COMMAND_FUNCTION
COMMAND_FUNCTION_CODE
COMMENT
COMMIT
COMMITTED
COMPLETION
COMPRESS
COMPUTE
CONDITION
CONDITION_NUMBER
CONNECT
CONNECTION
CONNECTION_NAME
CONSTRAINT
CONSTRAINT_CATALOG
CONSTRAINT_NAME
CONSTRAINT_SCHEMA
CONSTRAINTS
CONSTRUCTOR
CONTAINS
CONTAINSTABLE
CONTINUE
CONVERSION
CONVERT
COPY
CORR
CORRESPONDING
COUNT
COVAR_POP
COVAR_SAMP
CREATE
CREATEDB
CREATEROLE
CREATEUSER
CROSS
CSV
CUBE
CUME_DIST
CURRENT
CURRENT_DATE
CURRENT_DEFAULT_TRANSFORM_GROUP
CURRENT_PATH
CURRENT_ROLE
CURRENT_TIME
CURRENT_TIMESTAMP
CURRENT_TRANSFORM_GROUP_FOR_TYPE
CURRENT_USER
CURSOR
CURSOR_NAME
CYCLE
DATA
DATABASE
DATABASES
DATE
DATETIME
DATETIME_INTERVAL_CODE
DATETIME_INTERVAL_PRECISION
DAY
DAY_HOUR
DAY_MICROSECOND
DAY_MINUTE
DAY_SECOND
DAYOFMONTH
DAYOFWEEK
DAYOFYEAR
DBCC
DEALLOCATE
DEC
DECIMAL
DECLARE
DEFAULT
DEFAULTS
DEFERRABLE
DEFERRED
DEFINED
DEFINER
DEGREE
DELAY_KEY_WRITE
DELAYED
DELETE
DELIMITER
DELIMITERS
DENSE_RANK
DENY
DEPTH
DEREF
DERIVED
DESC
DESCRIBE
DESCRIPTOR
DESTROY
DESTRUCTOR
DETERMINISTIC
DIAGNOSTICS
DICTIONARY
DISABLE
DISCONNECT
DISK
DISPATCH
DISTINCT
DISTINCTROW
DISTRIBUTED
DIV
DO
DOMAIN
DOUBLE
DROP
DUAL
DUMMY
DUMP
DYNAMIC
DYNAMIC_FUNCTION
DYNAMIC_FUNCTION_CODE
EACH
ELEMENT
ELSE
ELSEIF
ENABLE
ENCLOSED
ENCODING
ENCRYPTED
END
END-EXEC
ENUM
EQUALS
ERRLVL
ESCAPE
ESCAPED
EVERY
EXCEPT
EXCEPTION
EXCLUDE
EXCLUDING
EXCLUSIVE
EXEC
EXECUTE
EXISTING
EXISTS
EXIT
EXP
EXPLAIN
EXTERNAL
EXTRACT
FALSE
FETCH
FIELDS
FILE
FILLFACTOR
FILTER
FINAL
FIRST
FLOAT
FLOAT4
FLOAT8
FLOOR
FLUSH
FOLLOWING
FOR
FORCE
FOREIGN
FORTRAN
FORWARD
FOUND
FREE
FREETEXT
FREETEXTTABLE
FREEZE
FROM
FULL
FULLTEXT
FUNCTION
FUSION
G
GENERAL
GENERATED
GET
GLOBAL
GO
GOTO
GRANT
GRANTED
GRANTS
GREATEST
GROUP
GROUPING
HANDLER
HAVING
HEADER
HEAP
HIERARCHY
HIGH_PRIORITY
HOLD
HOLDLOCK
HOST
HOSTS
HOUR
HOUR_MICROSECOND
HOUR_MINUTE
HOUR_SECOND
IDENTIFIED
IDENTITY
IDENTITY_INSERT
IDENTITYCOL
IF
IGNORE
ILIKE
IMMEDIATE
IMMUTABLE
IMPLEMENTATION
IMPLICIT
IN
INCLUDE
INCLUDING
INCREMENT
INDEX
INDICATOR
INFILE
INFIX
INHERIT
INHERITS
INITIAL
INITIALIZE
INITIALLY
INNER
INOUT
INPUT
INSENSITIVE
INSERT
INSERT_ID
INSTANCE
INSTANTIABLE
INSTEAD
INT
INT1
INT2
INT3
INT4
INT8
INTEGER
INTERSECT
INTERSECTION
INTERVAL
INTO
INVOKER
IS
ISAM
ISNULL
ISOLATION
ITERATE
JOIN
K
KEY
KEY_MEMBER
KEY_TYPE
KEYS
KILL
LANCOMPILER
LANGUAGE
LARGE
LAST
LAST_INSERT_ID
LATERAL
LEADING
LEAST
LEAVE
LEFT
LENGTH
LESS
LEVEL
LIKE
LIMIT
LINENO
LINES
LISTEN
LN
LOAD
LOCAL
LOCALTIME
LOCALTIMESTAMP
LOCATION
LOCATOR
LOCK
LOGIN
LOGS
LONG
LONGBLOB
LONGTEXT
LOOP
LOW_PRIORITY
LOWER
M
MAP
MATCH
MATCHED
MAX
MAX_ROWS
MAXEXTENTS
MAXVALUE
MEDIUMBLOB
MEDIUMINT
MEDIUMTEXT
MEMBER
MERGE
MESSAGE_LENGTH
MESSAGE_OCTET_LENGTH
MESSAGE_TEXT
METHOD
MIDDLEINT
MIN
MIN_ROWS
MINUS
MINUTE
MINUTE_MICROSECOND
MINUTE_SECOND
MINVALUE
MLSLABEL
MOD
MODE
MODIFIES
MODIFY
MODULE
MONTH
MONTHNAME
MORE
MOVE
MULTISET
MUMPS
MYISAM
NAME
NAMES
NATIONAL
NATURAL
NCHAR
NCLOB
NESTING
NEW
NEXT
NO
NO_WRITE_TO_BINLOG
NOAUDIT
NOCHECK
NOCOMPRESS
NOCREATEDB
NOCREATEROLE
NOCREATEUSER
NOINHERIT
NOLOGIN
NONCLUSTERED
NONE
NORMALIZE
NORMALIZED
NOSUPERUSER
NOT
NOTHING
NOTIFY
NOTNULL
NOWAIT
NULL
NULLABLE
NULLIF
NULLS
NUMBER
NUMERIC
OBJECT
OCTET_LENGTH
OCTETS
OF
OFF
OFFLINE
OFFSET
OFFSETS
OIDS
OLD
ON
ONLINE
ONLY
OPEN
OPENDATASOURCE
OPENQUERY
OPENROWSET
OPENXML
OPERATION
OPERATOR
OPTIMIZE
OPTION
OPTIONALLY
OPTIONS
OR
ORDER
ORDERING
ORDINALITY
OTHERS
OUT
OUTER
OUTFILE
OUTPUT
OVER
OVERLAPS
OVERLAY
OVERRIDING
OWNER
PACK_KEYS
PAD
PARAMETER
PARAMETER_MODE
PARAMETER_NAME
PARAMETER_ORDINAL_POSITION
PARAMETER_SPECIFIC_CATALOG
PARAMETER_SPECIFIC_NAME
PARAMETER_SPECIFIC_SCHEMA
PARAMETERS
PARTIAL
PARTITION
PASCAL
PASSWORD
PATH
PCTFREE
PERCENT
PERCENT_RANK
PERCENTILE_CONT
PERCENTILE_DISC
PLACING
PLAN
PLI
POSITION
POSTFIX
POWER
PRECEDING
PRECISION
PREFIX
PREORDER
PREPARE
PREPARED
PRESERVE
PRIMARY
PRINT
PRIOR
PRIVILEGES
PROC
PROCEDURAL
PROCEDURE
PROCESS
PROCESSLIST
PUBLIC
PURGE
QUOTE
RAID0
RAISERROR
RANGE
RANK
RAW
READ
READS
READTEXT
REAL
RECHECK
RECONFIGURE
RECURSIVE
REF
REFERENCES
REFERENCING
REGEXP
REGR_AVGX
REGR_AVGY
REGR_COUNT
REGR_INTERCEPT
REGR_R2
REGR_SLOPE
REGR_SXX
REGR_SXY
REGR_SYY
REINDEX
RELATIVE
RELEASE
RELOAD
RENAME
REPEAT
REPEATABLE
REPLACE
REPLICATION
REQUIRE
RESET
RESIGNAL
RESOURCE
RESTART
RESTORE
RESTRICT
RESULT
RETURN
RETURNED_CARDINALITY
RETURNED_LENGTH
RETURNED_OCTET_LENGTH
RETURNED_SQLSTATE
RETURNS
REVOKE
RIGHT
RLIKE
ROLE
ROLLBACK
ROLLUP
ROUTINE
ROUTINE_CATALOG
ROUTINE_NAME
ROUTINE_SCHEMA
ROW
ROW_COUNT
ROW_NUMBER
ROWCOUNT
ROWGUIDCOL
ROWID
ROWNUM
ROWS
RULE
SAVE
SAVEPOINT
SCALE
SCHEMA
SCHEMA_NAME
SCHEMAS
SCOPE
SCOPE_CATALOG
SCOPE_NAME
SCOPE_SCHEMA
SCROLL
SEARCH
SECOND
SECOND_MICROSECOND
SECTION
SECURITY
SELECT
SELF
SENSITIVE
SEPARATOR
SEQUENCE
SERIALIZABLE
SERVER_NAME
SESSION
SESSION_USER
SET
SETOF
SETS
SETUSER
SHARE
SHOW
SHUTDOWN
SIGNAL
SIMILAR
SIMPLE
SIZE
SMALLINT
SOME
SONAME
SOURCE
SPACE
SPATIAL
SPECIFIC
SPECIFIC_NAME
SPECIFICTYPE
SQL
SQL_BIG_RESULT
SQL_BIG_SELECTS
SQL_BIG_TABLES
SQL_CALC_FOUND_ROWS
SQL_LOG_OFF
SQL_LOG_UPDATE
SQL_LOW_PRIORITY_UPDATES
SQL_SELECT_LIMIT
SQL_SMALL_RESULT
SQL_WARNINGS
SQLCA
SQLCODE
SQLERROR
SQLEXCEPTION
SQLSTATE
SQLWARNING
SQRT
SSL
STABLE
START
STARTING
STATE
STATEMENT
STATIC
STATISTICS
STATUS
STDDEV_POP
STDDEV_SAMP
STDIN
STDOUT
STORAGE
STRAIGHT_JOIN
STRICT
STRING
STRUCTURE
STYLE
SUBCLASS_ORIGIN
SUBLIST
SUBMULTISET
SUBSTRING
SUCCESSFUL
SUM
SUPERUSER
SYMMETRIC
SYNONYM
SYSDATE
SYSID
SYSTEM
SYSTEM_USER
TABLE
TABLE_NAME
TABLES
TABLESAMPLE
TABLESPACE
TEMP
TEMPLATE
TEMPORARY
TERMINATE
TERMINATED
TEXT
TEXTSIZE
THAN
THEN
TIES
TIME
TIMESTAMP
TIMEZONE_HOUR
TIMEZONE_MINUTE
TINYBLOB
TINYINT
TINYTEXT
TO
TOAST
TOP
TOP_LEVEL_COUNT
TRAILING
TRAN
TRANSACTION
TRANSACTION_ACTIVE
TRANSACTIONS_COMMITTED
TRANSACTIONS_ROLLED_BACK
TRANSFORM
TRANSFORMS
TRANSLATE
TRANSLATION
TREAT
TRIGGER
TRIGGER_CATALOG
TRIGGER_NAME
TRIGGER_SCHEMA
TRIM
TRUE
TRUNCATE
TRUSTED
TSEQUAL
TYPE
UESCAPE
UID
UNBOUNDED
UNCOMMITTED
UNDER
UNDO
UNENCRYPTED
UNION
UNIQUE
UNKNOWN
UNLISTEN
UNLOCK
UNNAMED
UNNEST
UNSIGNED
UNTIL
UPDATE
UPDATETEXT
UPPER
USAGE
USE
USER
USER_DEFINED_TYPE_CATALOG
USER_DEFINED_TYPE_CODE
USER_DEFINED_TYPE_NAME
USER_DEFINED_TYPE_SCHEMA
USING
UTC_DATE
UTC_TIME
UTC_TIMESTAMP
VACUUM
VALID
VALIDATE
VALIDATOR
VALUE
VALUES
VAR_POP
VAR_SAMP
VARBINARY
VARCHAR
VARCHAR2
VARCHARACTER
VARIABLE
VARIABLES
VARYING
VERBOSE
VIEW
VOLATILE
WAITFOR
WHEN
WHENEVER
WHERE
WHILE
WIDTH_BUCKET
WINDOW
WITH
WITHIN
WITHOUT
WORK
WRITE
WRITETEXT
X509
XOR
YEAR
YEAR_MONTH
ZEROFILL
ZONE
```

[simon]: https://www.simonholywell.com/?utm_source=sqlstyle.guide&utm_medium=link&utm_campaign=md-document
    "SimonHolywell.com"
[issue]: https://github.com/treffynnon/sqlstyle.guide/issues
    "SQL style guide issues on GitHub"
[fork]: https://github.com/treffynnon/sqlstyle.guide/fork
    "Fork SQL style guide on GitHub"
[pull]: https://github.com/treffynnon/sqlstyle.guide/pulls/
    "SQL style guide pull requests on GitHub"
[celko]: https://www.amazon.com/gp/product/0120887975/ref=as_li_ss_tl?ie=UTF8&linkCode=ll1&tag=treffynnon-20&linkId=9c88eac8cd420e979675c815771313d5
    "Joe Celko's SQL Programming Style (The Morgan Kaufmann Series in Data Management Systems)"
[celko-ru]: https://www.ozon.ru/context/detail/id/2628672
    "Стиль программирования Джо Селко на SQL"
[dl-md]: https://raw.githubusercontent.com/treffynnon/sqlstyle.guide/gh-pages/_includes/sqlstyle.guide.ru.md
    "Download the guide in Markdown format"
[iso-8601-ru]: https://ru.wikipedia.org/wiki/ISO_8601
    "Wikipedia: ISO 8601"
[c-style-comments-ru]: https://ru.wikipedia.org/wiki/%D0%A1%D0%B8_(%D1%8F%D0%B7%D1%8B%D0%BA_%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F)#.D0.9A.D0.BE.D0.BC.D0.BC.D0.B5.D0.BD.D1.82.D0.B0.D1.80.D0.B8.D0.B8
    "Wikipedia: Комментарии в C"
[hungarian-notation-ru]: https://ru.wikipedia.org/wiki/%D0%92%D0%B5%D0%BD%D0%B3%D0%B5%D1%80%D1%81%D0%BA%D0%B0%D1%8F_%D0%BD%D0%BE%D1%82%D0%B0%D1%86%D0%B8%D1%8F
    "Wikipedia: Венгерская нотация"
[sql-92-ru]: https://ru.wikipedia.org/wiki/SQL-92
    "Wikipedia: SQL-92"
[rivers]: https://practicaltypography.com/one-space-between-sentences.html
    "Practical Typography: one space between sentences"
[rivers-ru]: https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D1%80%D0%B8%D0%B4%D0%BE%D1%80_(%D1%82%D0%B8%D0%BF%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%BA%D0%B0)
    "Коридоры в типографике"
[reserved-keywords]: #reserved-keyword-reference
    "Reserved keyword reference"
[eav]: https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model
    "Wikipedia: Entity–attribute–value model"
[sqlstyleguide]: https://www.sqlstyle.guide
    "SQL style guide by Simon Holywell"
[licence-ru]: https://creativecommons.org/licenses/by-sa/4.0/deed.ru
    "Creative Commons «Атрибуция — На тех же условиях» 4.0 Всемирная"
