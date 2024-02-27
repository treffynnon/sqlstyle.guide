# Посібник зі стиль-коду SQL

## Передмова
Ви можете використовувати цей посібник, [зробити його форк][fork] або створити власний на його основі.
Ціль - визначити, який стиль ваи підходить більше і дотримуватись його.
Щоб запропонувати зміни або виправити помилки, відкрийте [задачу][issue] або [запит на витяг][pull] на GitHub.

Ці рекомендації розроблені таким чином, щоб вони були сумісні з книгою Joe Celko's [SQL Programming Style][celko],
щоб її легше засвоїли команди, які вже прочитали цю книгу.
Цей посібник є дещо категоричний у деяких твердженнях, а в інших вільніший.
Він, безумовно, більш стислий, ніж [книга Celko][celko], яка містить анекдоти
та міркування за кожним правилом як продуману прозу.

Цей посібник легко включити у [форматі Markdown][dl-md] як частину кодової бази проекту або залишити посилання тут,
щоб усі, хто бере участь у проекті, могли вільно його читати, що набагато складніше зробити з фізичною книгою.

SQL посібник зі стиль-коду авторства [Simon Holywell][simon] під ліцензією [Creative Commons
Attribution-ShareAlike 4.0 International License][licence].
Базується на роботі [https://www.sqlstyle.guide/][sqlstyleguide].

## Загальне

### Гарний стиль

* Використовуйте послідовні та описові ідентифікатори та імена;
* Розумно використовуйте пробіли і відступи, щоб полегшити читання коду;
* Зберігайте інформацію про час і дату відповідно до [ISO 8601][iso-8601] (`YYYY-MM-DDTHH:MM:SS.SSSSS`);
* З міркувань портативності намагайтеся використовувати лише стандартні функції SQL замість функцій постачальника;
* Зробіть код стислим і позбавленим зайвого SQL, наприклад, непотрібних лапок або дужок або речень `WHERE`,
  які можна отримати інакше;
* Включіть коментарі в код SQL, де це необхідно. Використовуйте відкриваючий `/*` у стилі C і закриваючи `*/`,
  якщо це можливо, інакше перед коментарями ставте `--` і закінчуйте їх новим рядком.

```sql
SELECT file_hash  -- stored ssdeep hash
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

### Поганий стиль

* camelCase — важко швидко сканувати.
* Описові префікси або Угорська нотація, такі як `sp_` або `tbl`.
* Множина — замість цього використовуйте більш природний збірний термін, де це можливо.
  Наприклад, `staff` замість `employees` або `people` замість `individuals`.
* Ідентифікатори в лапках — якщо вам потрібно їх використовувати, то для переносимості дотримуйтеся подвійних лапок
  SQL-92 (можливо, вам доведеться налаштувати свій SQL-сервер для підтримки цього в залежності від постачальника).
* Принципи об'єктно-орієнтованого проектування не повинні застосовуватися до SQL або структур баз даних.

## Умови найменування

### Загальне

* Переконайтеся, що ім'я є унікальним і не являється [зарезервованим ключовим словом][reserved-keywords].
* Максимальна довжина становить 30 байт — на практиці це 30 символів,
  якщо ви не використовуєте багатобайтовий набір символів.
* Імена повинні починатися з літери і не можуть закінчуватися символом підкреслення.
* Використовуйте лише літери, цифри та підкреслення в іменах.
* Уникайте використання кількох послідовних символів підкреслення — їх важко прочитати.
* Використовуйте символи підкреслення там, де ви, природно, включили б пробіл в назву
  (наприклад ім’я буде `first_name`).
* Уникайте скорочень, і якщо вам потрібно їх використовувати, переконайтеся,
  що вони зрозумілі або широко використовувані.

```sql
SELECT first_name
  FROM staff;
```

### Таблиці

* Використовуйте збірну назву або, менш ідеально, форму множини. Наприклад (у порядку переваги) `staff` і `employees`.
* Не використовуйте префікс `tbl` або будь-який інший такий описовий префікс або Угорську нотацію.
* Ніколи не давайте таблиці таку саму назву, що й один із її стовпців, і навпаки.
* Уникайте, де це можливо, об’єднання двох імен таблиць разом, щоб створити назву таблиці зв’язків.
  Замість `cars_mechanics` віддають перевагу `services`.

### Стовпці

* Завжди використовуйте назву в однині.
* По можливості уникайте простого використання `id` як основного ідентифікатора для таблиці
  (або використовуйте конвенції прийняті спільнотою).
* Не додавайте стовпець з такою ж назвою, що й таблиця, і навпаки.
* Завжди використовуйте нижній регістр, за винятком тих випадків, коли це може мати сенс, наприклад, власні назви.

### Псевдонім або кореляції

* Повинні певним чином пов’язуватися з об’єктом або виразом, який вони створюють.
* Як правило, ім'я кореляції має бути першою літерою кожного слова в назві об'єкта.
* Якщо вже існує кореляція з такою ж назвою, додайте число.
* Завжди включайте ключове слово `AS` — полегшує читання, оскільки воно є явним.
* Для обчислюваних даних (`SUM()` або` AVG()`) використовуйте ім’я,
  яке ви б дали їм, якби цей стовпець був визначений у схемі.

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

### Збережені процедури

* Назва має містити дієслово.
* Не використовуйте префікс `sp_` або будь-який інший описовий префікс чи Угорську нотацію.

### Однорідні суфікси

Наступні суфікси мають універсальне значення, що забезпечує легке читання та розуміння стовпців із коду SQL.
Використовуйте правильний суфікс, де це доречно.

* `_id` — унікальний ідентифікатор, наприклад стовпець, який є первинним ключем;
* `_status` — значення прапорця або інший статус будь-якого типу, наприклад, `publication_status`;
* `_total` — загальна сума або сума набору значень;
* `_num` — позначає, що поле містить будь-який тип чисел;
* `_name` — позначає таке ім'я, як `first_name`;
* `_seq` — містить безперервну послідовність значень;
* `_date` — позначає стовпець, який містить дату;
* `_tally` — підрахунок;
* `_size` — розмір чогось, наприклад, розміру файлу або одягу;
* `_addr` — адреса для запису може бути фізичною або нематеріальною, наприклад, `ip_addr`;

## Синтаксис запиту

### Зарезервовані слова

Завжди використовуйте верхній регістр для [зарезервованих ключових слів][reserved-keywords], як-от `SELECT` і `WHERE`.

Найкраще уникати скорочених ключових слів і використовувати повні ключові слова,
якщо вони доступні (віддавайте перевагу `ABSOLUTE` замість `ABS`).

Не використовуйте ключові слова, специфічні для сервера баз даних,
якщо ключове слово ANSI SQL вже існує і виконує ту ж функцію.
Це допомагає зробити код більш переносимим.

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### Порожній простір

Для полегшення читання коду важливо використовувати правильне доповнення пробілів.
Не переповнюйте код і не видаляйте пробіли природної мови.

#### Пробіли

Для вибудовування коду потрібно використовувати пробіли,
щоб усі ключові слова кореня закінчувалися на одній межі символу.
Це утворює додатковий простір посередині, що дозволяє читачам легко переглядати код
і відокремлювати ключові слова від деталей реалізації.
Такі відступи [небажані в типографії][rivers], але тут корисні.

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

Зверніть увагу, що `SELECT`, `FROM` тощо вирівнюються по правому краю,
а фактичні назви стовпців та конкретні відомості щодо реалізації вирівнюються за лівим краєм.

Хоча цей список не вичерпний, завжди включайте пробіли:

* до і після знака "дорівнює" (`=`);
* після коми (`,`);
* до відкриваючого і після закриваючого апострофів (`` ` ``),
  за умови, що вони не в дужках, не з комою та не крапкою з комою;

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### Міжрядковий інтервал

Завжди включайте нові рядки/пробіл:

* перед `AND` або `OR`;
* після крапки з комою для відокремлення запитів для полегшення читання;
* після кожного визначення ключового слова;
* після коми при розділенні кількох стовпців на логічні групи;
* щоб розділити код на пов'язані розділи, що полегшує читання великих фрагментів коду;

Якщо всі ключові слова вирівняні по праву сторону, а значення по праву сторону -
у середині запиту створюється рівномірний простір, що також значно полегшує швидке читання та сканування запиту.

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

### Відступ

Щоб забезпечити читання SQL, важливо дотримуватися стандартів відступів.

#### Об'єднання

Об'єднання мають бути з додатковим відступом та згруповані за допомогою нового рядка, де це необхідно.

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

#### Підзапити

Підзапити також мають бути вирівняні по праву сторону з додатковим відступом,
а потім викладені у такому ж стилі, що й будь-який інший запит.
Іноді має сенс мати закриваючу дужку на новому рядку в тій самій позиції символу, що й його початковий партнер.
Це особливо зручно, якщо у вас є вкладені підзапити.

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

### Бажаний формалізм

* Використовуйте `BETWEEN`, де це можливо, замість того, щоб об'єднувати кілька операторів з `AND`.
* Аналогічно використовуйте `IN()` замість кількох пропозицій `OR`.
* Якщо значення потрібно інтерпретувати/перетворити перед тим, як воно стане частиною результату,
  використовуйте оператор `CASE`.
  Оператори `CASE` можуть бути вкладені для формування більш складних логічних структур.
* Уникайте використання оператора `UNION` і тимчасових таблиць, де це можливо.
  Якщо схему можна оптимізувати, щоб виключити залежність від цих функцій, то, швидше за все, так і буде.

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

## Синтаксис створення

При оголошенні структури схеми також важливо підтримувати зрозумілий для людини код.
Щоб полегшити це, переконайтеся, що визначення стовпців упорядковані та згруповані разом, де це має сенс.

Відступ у визначенні стовпців на чотири (4) пробіли у визначенні `CREATE`.

### Вибір типів даних

* Якщо можливо, не використовуйте типи даних специфічні для вашої СУБД —
  вони не є переносними і можуть бути недоступними в старіших версіях СУБД того самого постачальника.
* Використовуйте типи `REAL` або `FLOAT` лише там, де це необхідно для математики з плаваючою комою,
  інакше завжди віддавайте перевагу `NUMERIC` та `DECIMAL`.
  Помилки округлення з плаваючою комою є неприємністю!

### Визначення значень за замовчуванням

* Значення за замовчуванням має бути того самого типу, що й стовпець —
  якщо стовпець оголошено як `DECIMAL`, не надавайте значення за замовчуванням `INTEGER`.
* Оголошення значення за замовчуванням має знаходитись
  після оголошення типу даних і перед будь-яким оператором `NOT NULL`.

### Обмеження та ключі

Обмеження та їх підмножина, ключі, є дуже важливим компонентом будь-якого визначення бази даних.
Вони швидко можуть стати дуже складними для читання та роздумів,
тому важливо дотримуватися стандартного набору вказівок.

#### Вибір ключів

Вибір стовпців, які формуватимуть ключі у визначенні, має бути ретельно продуманим,
оскільки це вплине на продуктивність та цілісність даних.

1. До певної міри ключ повинен бути унікальним.
2. Узгодженість з точки зору типу даних для значеннь в схемі та менша ймовірність того, що це зміниться в майбутньому.
3. Чи можна перевіряти значення відповідно до стандартного формату (наприклад, опублікованого ISO)?
   Заохочення відповідності пункту 2.
4. Зберігайте ключ якомога простим, не боячись використовувати складні ключі, де це необхідно.

Це обгрунтований і зважений акт балансування, який необхідно виконати при визначенні бази даних.
Якщо вимоги зміняться в майбутньому, можна внести зміни до визначень, щоб підтримувати їх в актуальному стані.

#### Визначення обмежень

Після визначення ключів їх можна визначити в системі за допомогою обмежень разом із перевіркою значень полів.

##### Загальне

* Щоб таблиці були повними та корисними, вони повинні мати принаймні один ключ.
* Обмеженням слід присвоювати користувацькі назви, за винятком `UNIQUE`, `PRIMARY KEY` та `FOREIGN KEY`,
  яким постачальник бази даних, як правило, автоматично надає достатньо зрозумілі імена.

##### Макет і порядок

* Спочатку вкажіть первинний ключ відразу після оператора `CREATE TABLE`.
* Обмеження слід визначити безпосередньо під стовпцем, якому вони відповідають.
  Зробіть відступ обмеження, щоб воно вирівнялося праворуч від імені стовпця.
* Якщо це обмеження для кількох стовпців, подумайте про те,
  щоб розмістити його якомога ближче до визначень обох стовпців, а якщо це важко, в крайньому випадку,
  включіть їх у кінці визначення `CREATE TABLE`.
* Якщо це обмеження на рівні таблиці, яке застосовується до всієї таблиці, воно також має відображатися в кінці.
* Використовуйте алфавітний порядок, щоб `ON DELETE` розміщувалось перед `ON UPDATE`.
* Якщо це має сенс, вирівняйте кожен аспект запиту на одній позиції символу.
  Наприклад, усі визначення `NOT NULL` можуть починатися з однієї позиції символу.
  Це не важко і швидко, але, безумовно, значно полегшує сканування та читання коду.

##### Валідація

* Використовуйте обмеження `LIKE` і `SIMILAR TO`, щоб забезпечити цілісність рядків, формат яких відомий.
* Якщо відомий кінцевий діапазон числового значення, його потрібно записати як діапазон `CHECK()`,
  щоб запобігти введенню неправильних значень у базу даних або непомченого скорочення даних,
  занадто великих, щоб відповідати визначенню стовпця.
  Щонайменше, він повинен перевірити, що значення більше нуля в більшості випадків.
* Обмеження `CHECK()` слід зберігати в окремих пунктах, щоб полегшити налагодження.

##### Приклад

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

### Дизайни, яких слід уникати

* Не використовуйте принципи об'єктно-орієнтованого проектування - вони не оптимальні для реляційних баз даних .
* Не розміщуйте значення в одному стовпці та одиниці вимірювання в іншому.
  Стовпець має бути очевидними та самодокументованим, щоб запобігти потребі об’єднувати стовпці в програмі пізніше.
  Використовуйте `CHECK()`, щоб переконатися, що коректні дані вставлені в стовпець.
* Не використовуйте паттерн [Entity–Attribute–Value][eav] (EAV) — замість цього використовуйте спеціалізовані продукти,
  призначені для обробки таких даних без схем.
* Не розділяйте дані, які мають бути в одній таблиці, на багато таблиць через довільні проблеми,
  такі як архівування на основі часу або розташування в багатонаціональній організації.
  Пізніші доведеться працювати з кількома таблицями через `UNION`, замість простих запитів в одну таблицю.

## Додаток

### Посилання на зарезервовані ключові слова

Список зарезервованих ключових слів ANSI SQL (92, 99 і 2003), MySQL 3–5.x, PostgreSQL 8.1, MS SQL Server 2000, MS ODBC
та Oracle 10.2.

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

### Типи даних стовпців

Нижче наведено кілька запропонованих типів даних стовпців для максимальної сумісності між механізмами баз даних.

#### Символьні типи

* CHAR
* CLOB
* VARCHAR

#### Числові типи

* Точні числові типи
    * BIGINT
    * DECIMAL
    * DECFLOAT
    * INTEGER
    * NUMERIC
    * SMALLINT
* Приблизні числові типи
    * DOUBLE PRECISION
    * FLOAT
    * REAL

#### Типи дати і часу

* DATE
* TIME
* TIMESTAMP

#### Бінарні типи:

* BINARY
* BLOB
* VARBINARY

#### Додаткові типи

* BOOLEAN
* INTERVAL
* XML


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
[dl-md]: https://raw.githubusercontent.com/treffynnon/sqlstyle.guide/gh-pages/_includes/sqlstyle.guide.md
    "Download the guide in Markdown format"
[iso-8601]: https://en.wikipedia.org/wiki/ISO_8601
    "Wikipedia: ISO 8601"
[rivers]: https://practicaltypography.com/one-space-between-sentences.html
    "Practical Typography: one space between sentences"
[reserved-keywords]: #reserved-keyword-reference
    "Reserved keyword reference"
[eav]: https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model
    "Wikipedia: Entity–attribute–value model"
[sqlstyleguide]: https://www.sqlstyle.guide/
    "SQL style guide by Simon Holywell"
[licence]: https://creativecommons.org/licenses/by-sa/4.0/
    "Creative Commons Attribution-ShareAlike 4.0 International License"
