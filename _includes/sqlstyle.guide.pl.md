# Podręcznik stylu SQL

## Wstęp

Możesz używać poniższego zestawu wytycznych, [sforkować je][fork] lub stworzyć
własne – najważniejsze jest abyś wybrał styl i się go trzymał. Jeśli chcesz
zasugerować zmiany lub poprawić błędy, utwórz na GitHubie [zgłoszenie][issue]
lub zrób [pull request][pull].

Wytyczne zostały zaprojektowane tak, aby były zgodne z podręcznikiem
[SQL Programming Style][celko] Joego Celko i były łatwe do przyswojenia
dla zespołów, które już przeczytały tę książkę. Poniższy przewodnik w niektórych
obszarach jest nieco bardziej stanowczy, a w innych nieco swobodniejszy.
Z pewnością jest bardziej zwięzły, podczas gdy [książka Celko][celko] każdą regułę okrasza
anegdotami i uzasadnieniem w formie przemyślanej wypowiedzi.

Poniższy podręcznik można łatwo umieścić w głównym repozytorium projektu poprzez pobranie go
w [formacie Markdown][dl-md] lub podając link bezpośrednio do tej strony.
Dzieki temu każda osoba biorąca udział w projekcie będzie mogła swobodnie przeczytać
umieszczone tutaj wytyczne – o wiele trudniej jest to osiągnąć przy pomocy fizycznej
papierowej książki.

Podręcznik stylu SQL [Simona Holywella][simon] jest wydany na licencji
[Creative Commons Uznanie autorstwa-Na tych samych warunkach 4.0
Międzynarodowe][licence]. Na podstawie pracy dostępnej pod adresem
[https://www.sqlstyle.guide/][sqlstyleguide].

## Ogólne wytyczne

### Zalecane

* Używaj spójnych oraz opisowych identyfikatorów i nazw.
* Rozsądnie wykorzystuj białe znaki i wcięcia, tak aby ułatwić czytanie kodu.
* Przechowuj informacje o czasie i dacie w formacie zgodnym z [ISO 8601][iso-8601]
  (`YYYY-MM-DDTHH:MM:SS.SSSSS`).
* Ze względu na przenośność kodu staraj się używać wyłącznie standardowych funkcji SQL
  zamiast funkcji specyficznych dla danego dostawcy silnika bazodanowego.
* Kod powinien być zwięzły i pozbawiony zbędnego kodu SQL, np. bez zbędnych cudzysłowów,
  nawiasów lub klauzul `WHERE`, które mogą być wyprowadzone w inny sposób.
* Dodawaj komentarze do kodu SQL tam, gdzie jest to konieczne. Używaj komentarzy w stylu C,
  otwierając `/*` i zamykając `*/` je tam, gdzie jest to możliwe; w przeciwnym razie poprzedzaj
  komentarze znakami `--` i kończ je nową linią.

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

### Niezalecane

* camelCase – trudno się go odczytuje przy szybkim przęglądaniu kodu.
* Przedrostki opisowe lub notacja węgierska, takie jak `sp_` lub `tbl`.
* Liczba mnoga – tam, gdzie jest to możliwe, używaj bardziej naturalnego określenia zbiorowego,
  np. `staff` zamiast `employees` lub `people` zamiast `individuals`.
* Identyfikatory otoczone cudzysłowem/apostrofem – jeśli musisz ich używać, to w celu zachowania
  przenośności kodu trzymaj się standardu SQL-92, czyli stosuj cudzysłów (w zależności od
  dostawcy silnika bazodanowego być może będziesz musiał dodatkowo skonfigurować swój serwer
  SQL).
* Zasady projektowania obiektowego nie powinny być stosowane do kodu SQL i struktur bazy danych.

## Konwencje nazywania

### Ogólne

* Upewnij się, że nazwa jest unikalna i nie istnieje jako
  [zastrzeżone słowo kluczowe][reserved-keywords].
* Nazwa powinna mieć rozmiar maksymalnie 30 bajtów – w praktyce jest to 30 znaków,
  chyba że używasz wielobajtowego zestawu znaków.
* Nazwy muszą zaczynać się od litery i nie mogą kończyć się podkreślnikiem.
* W nazwach należy używać tylko liter, cyfr i podkreślników.
* Unikaj stosowania wielu kolejnych podkreśleń – mogą być one trudne do odczytania.
* Używaj podkreśleń tam, gdzie normalnie umieściłbyś spację w nazwie (np. w języku angielskim
  "first name" staje się `first_name`).
* Unikaj skrótów, a jeśli musisz ich użyć, to upewnij się, że są one powszechnie zrozumiałe.

```sql
SELECT first_name
  FROM staff;
```

### Tabele

* Używaj nazwy zbiorowej lub, w najgorszym przypadku, formy liczby mnogiej. Na przykład
  (w kolejności preferencji) `staff` i `employees`.
* Nie używaj przedrostka `tbl` ani żadnego innego opisowego przedrostka lub notacji
  węgierskiej.
* Nigdy nie nadawaj tabeli tej samej nazwy co jedna z jej kolumn i vice versa.
* Jeśli to możliwe, to unikaj konkatenacji nazw dwóch tabel w celu utworzenia nazwy
  tabeli odzwierciedlającej związek między tymi tabelami. Zamiast `cars_mechanics`
  wybierz `services`.

### Kolumny

* Zawsze używaj nazwy w liczbie pojedynczej.
* Jeśli to możliwe, to unikaj używania `id` jako głównego identyfikatora tabeli.
* Nie dodawaj kolumny o tej samej nazwie co tabela i vice versa.
* Zawsze używaj małych liter, z wyjątkiem sytuacji, gdy nie ma sensu ich używać, np.
  w przypadku nazw własnych.

### Aliasy

* Nazwy powinny w jakiś sposób odnosić się do obiektu lub wyrażenia, które jest aliasowane.
* Ogólną zasadą jest, że nazwa aliasu powinna być pierwszą literą każdego słowa z nazwy obiektu.
* Jeśli istnieje już alias o tej samej nazwie, to dodaj do nazwy numer.
* Zawsze dołączaj słowo kluczowe `AS` – ułatwia to czytanie, ponieważ jawnie definiuje alias.
* Dla danych wyliczanych (`SUM()` lub `AVG()`) używaj nazwy, którą nadałbyś tej kolumnie,
  gdyby była zdefiniowana w schemacie.

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

### Procedury składowane

* Nazwa musi zawierać czasownik.
* Nie należy jej poprzedzać przedrostkiem `sp_` ani żadnym innym podobnym przedrostkiem
  opisowym lub notacją węgierską.

### Jednolite przyrostki

Poniższe przyrostki mają uniwersalne znaczenie, dzięki czemu można łatwo znaleźć kolumny
w kodzie SQL i zrozumieć ich przeznaczenie. Używaj właściwego przyrostka tam, gdzie jest
to stosowne.

* `_id` – unikalny identyfikator, np. kolumna będąca kluczem głównym.
* `_status` – wartość flagi lub inny status dowolnego typu, np. `publication_status`.
* `_total` – łączna wartość lub suma zbioru wartości.
* `_num` – oznacza, że pole zawiera dowolny rodzaj liczby.
* `_name` – oznacza nazwę, np. `first_name`.
* `_seq` – zawiera nieprzerwaną sekwencję wartości.
* `_date` – oznacza kolumnę, która zawiera datę jakiegoś zdarzenia.
* `_tally` – podliczenie.
* `_size` – rozmiar czegoś, np. rozmiar pliku lub ubrania.
* `_addr` – adres, który może być fizyczny lub niematerialny, np. `ip_addr`.

## Składnia zapytań

### Słowa zastrzeżone

Zawsze używaj dużych liter dla [zastrzeżonych słów kluczowych][reserved-keywords] takich jak
`SELECT` i `WHERE`.

Najlepiej jest unikać skróconych słów kluczowych i używać ich pełnych nazw, oczywiście o ile
są dostępne (preferuj `ABSOLUTE` zamiast `ABS`).

Jeśli w specyfikacji ANSI SQL istnieje słowo kluczowe realizujące żądaną operację,
to stosuj je zamiast słów kluczowych specyficznych dla danego silnika bazy danych. Dzięki temu
kod jest bardziej przenośny.

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### Białe znaki

Aby kod był łatwiejszy do odczytania, należy używać odpowiednich odstępów między
wyrażeniami. Nie zagęszczaj kodu ani nie usuwaj spacji, które występują w języku naturalnym.

#### Spacje

Spacje powinny być użyte do ułożenia kodu w taki sposób, aby główne słowa kluczowe kończyły
się na tej samej granicy znaków. Tworzy to pośrodku kodu tzw. rzekę, ułatwiając oku czytelnika
przeglądanie kodu i oddzielenie słów kluczowych od szczegółów implementacji. Rzeki zasadniczo
są [złe w typografii][rivers], ale tutaj okazują się pomocne.

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

Zauważ, że `SELECT`, `FROM` itp. są wyrównane do prawej, podczas gdy nazwy kolumn i szczegóły
specyficzne dla implementacji są wyrównane do lewej.

Choć nie jest to lista wyczerpująca, zawsze umieszczaj spacje:

* przed i po znaku równości (`=`),
* po przecinkach (`,`),
* wokół apostrofów (`'`), o ile nie są w nawiasach lub przed kończącym linię przecinkiem
  albo średnikiem.

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### Odstępy między wierszami

Zawsze dodawaj nowe linie/odstęp pionowy:

* przed `AND` lub `OR`,
* po średnikach, tak aby oddzielić zapytania w celu ich łatwiejszego czytania,
* po każdej definicji słowa kluczowego,
* po przecinku przy rozdzielaniu wielu kolumn na grupy logiczne,
* aby rozdzielić kod na powiązane sekcje, co zwiększa czytelności dużych fragmentów kodu.

Utrzymanie wszystkich słów kluczowych wyrównanych do prawej strony, a wartości wyrównanych
do lewej, tworzy jednolitą przerwę pośrodku zapytania. Ułatwia to również szybkie przeglądanie
definicji zapytania.

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

### Wcięcia

Aby zapewnić przejrzystość kodu SQL, należy przestrzegać standardów wcięć.

#### Złączenia

Złączenia powinny być wcięte do drugiej strony rzeki i w razie potrzeby zgrupowane z nową linią.

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

#### Podzapytania

Podzapytania również powinny być wyrównane do prawej strony rzeki, a następnie ułożone w tym
samym stylu, co każde inne zapytanie. Czasami można umieścić nawias zamykający w nowej linii,
na tej samej pozycji co towarzyszący mu nawias otwierający – ma to szczególne zastosowanie
w przypadku podzapytań zagnieżdżonych.

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

### Preferowane formalizmy

* Używaj `BETWEEN` tam, gdzie jest to możliwe, zamiast łączyć wiele wyrażeń przy pomocy `AND`.
* Podobnie używaj `IN()` zamiast wielu `OR`.
* Używaj wyrażeń `CASE` zamiast skomplikowanych predykatów z dużą liczbą nawiasów. Wyrażenia
  `CASE` mogą być zagnieżdżane w celu uzyskania bardziej złożonych struktur logicznych.
* Unikaj stosowania klauzul `UNION` i tabel tymczasowych, o ile to możliwe. Jeśli schemat może
  być zoptymalizowany tak, aby nie zależał od tych elementów SQL-a, to najprawdopodobniej
  powinien zostać zoptymalizowany.

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

## Składnia tworzenia obiektów

Podczas deklarowania informacji o schemacie ważne jest również zapewnienie czytelnego kodu.
Aby to uzyskać, upewnij się, że definicje kolumn są uporządkowane i pogrupowane razem
w tych miejscach, gdzie ma to sens.

W poleceniu `CREATE` w definicjach kolumn stosuj cztery (4) spacje.

### Wybór typów danych

* Jeśli to możliwe, nie używaj typów danych specyficznych dla dostawcy silnika
  bazodanowego – nie są one przenośne i mogą nie być dostępne w starszych wersjach
  oprogramowania tego samego dostawcy.
* Używaj typów `REAL` lub `FLOAT` tylko wtedy, gdy jest to absolutnie konieczne dla obliczeń
  zmiennoprzecinkowych; w przeciwnym razie zawsze preferuj typy `NUMERIC` i `DECIMAL`. Błędy
  zaokrągleń w typach zmiennoprzecinkowych są utrapieniem!

### Określanie wartości domyślnych

* Wartość domyślna musi być tego samego typu co kolumna – jeśli kolumna jest zadeklarowana jako
  `DECIMAL`, to nie należy podawać wartości domyślnej typu `INTEGER`.
* Wartości domyślne muszą następować po deklaracji typu danych i znajdować się przed każdą
  instrukcją `NOT NULL`.

### Ograniczenia i klucze

Ograniczenia i ich podzbiór, klucze, są bardzo ważnym elementem każdej definicji bazy danych.
Mogą one jednak szybko stać się bardzo trudne do odczytania i zrozumienia, dlatego ważne jest,
aby stosować się do standardowego zestawu wytycznych.

#### Wybór kluczy

Określenie kolumny lub kolumn, które będą stanowiły klucze w definicji tabeli, powinno być
starannie przemyślane, ponieważ będzie miało to wpływ na wydajność i integralność danych.

1. Klucz powinien być do pewnego stopnia unikalny.
2. Spójność pod względem typu danych dla wartości klucza w całym schemacie i małe
   prawdopodobieństwo, że w przyszłości się to zmieni.
3. Czy wartość klucza może być zweryfikowana względem standardowego formatu (np. takiego jak
   opublikowany przez ISO)? Zachęcanie do zgodności z punktem 2.
4. Utrzymanie klucza tak prostego, jak to tylko możliwe, ale nie bójmy się używać kluczy
   złożonych, gdy jest to konieczne.

Powyższe rozważania to uzasadnione i przemyślane działania, które należy wykonać podczas
definiowania bazy danych i mają za zadanie rozważyć wszystkie za i przeciw. Jeśli wymagania
będą w przyszłości się zmieniały, to możliwe jest wprowadzenie zmian w definicjach, tak aby
zachować ich aktualność.

#### Definiowanie ograniczeń

Po wybraniu kluczy, możliwe jest ich zdefiniowanie w systemie bazodanowym za pomocą ograniczeń
wraz z weryfikowaniem wartości pól.

##### Ogólne

* Tabele, aby były kompletne i użyteczne, muszą posiadać co najmniej jeden klucz.
* Ograniczenia powinny mieć własną nazwę, z wyjątkiem `UNIQUE`, `PRIMARY KEY` i `FOREIGN KEY`,
  w których dostawca silnika bazy danych zazwyczaj automatycznie generuje wystarczająco
  zrozumiałe nazwy.

##### Układ i kolejność

* Określ klucz główny jako pierwszy zaraz po instrukcji `CREATE TABLE`.
* Ograniczenia powinny być zdefiniowane bezpośrednio pod kolumną, której odpowiadają.
  Wyrównaj wcięciami ograniczenie tak, aby wyrównać do prawej strony nazwy kolumny.
* Jeśli ograniczenie dotyczy wielu kolumn, rozważ umieszczenie go jak najbliżej definicji obu
  kolumn, a jeśli jest to trudne, to w ostateczności umieść je na końcu definicji `CREATE TABLE`.
* Jeśli ograniczenie odnosi się do całej tabeli, to również powinno pojawić się na końcu
  definicji `CREATE TABLE`.
* Użyj kolejności alfabetycznej, tak aby `ON DELETE` było przed `ON UPDATE`.
* Jeśli ma to sens, to umieść każdy element zapytania na tej samej pozycji; np. wszystkie
  definicje `NOT NULL` mogą zaczynać się na tej samej wysokości tekstu. Nie jest to ani trudne, ani
  szybkie, ale z pewnością ułatwia przeglądanie i czytanie kodu.


##### Sprawdzanie poprawności

* Używaj ograniczeń `LIKE` i `SIMILAR TO` do zapewnienia integralność ciągów znaków, których format jest znany.
* Tam, gdzie znany jest zakres wartości liczbowych, musi być stosowane ograniczenie `CHECK()`;
  zapobiegnie to wprowadzaniu do bazy danych nieprawidłowych wartości lub niejawnemu obcięciu
  zbyt dużych wartości, które nie zmieściłyby się w definicji kolumny. Ograniczenie to powinno
  w większości przypadków przynajmniej sprawdzać czy wartość jest większa niż zero.
* Ograniczenia `CHECK()` powinny być przechowywane w oddzielnych klauzulach, tak aby ułatwić
  debugowanie.

##### Przykład

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

### Konstrukcje projektowe, których należy unikać

* Zasady projektowania obiektowego nie przekładają się efektywnie na projekty relacyjnych baz
  danych – unikaj tej pułapki.
* Umieszczanie wartości w jednej kolumnie, a jednostek w drugiej. Kolumna powinna czynić jednostki
  oczywistymi, dzięki czemu unikniemy wymogu ponownego łączenia kolumn w dalszej części
  aplikacji. Używaj `CHECK()` aby upewnić się, że do kolumny są wstawiane poprawne dane.
* Tabele typu [Encja-Atrybut-Wartość][eav] (ang. *Entity–Attribute–Value*, EAV) – zamiast tego
  użyj specjalistycznego produktu przeznaczonego do obsługi tego typu danych, które nie
  posiadają schematu.
* Rozdzielanie danych, które powinny znajdować się w jednej tabeli, na wiele tabel z powodu
  arbitralnych decyzji, np. z powodu archiwizacji według czasu lub lokalizacji geograficznej w
  międzynarodowej organizacji. Późniejsze zapytania muszą wtedy pracować na wielu tabelach przy
  pomocy `UNION`, zamiast po prostu odpytywać jedną tabelę.

## Dodatek

### Lista zastrzeżonych słów kluczowych

Poniżej znajduje się lista zastrzeżonych słów kluczowych ANSI SQL (92, 99 i 2003), MySQL od 3 do 5.x, PostgreSQL 8.1, MS SQL Server 2000, MS ODBC i Oracle 10.2.

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

### Typy danych

Poniżej znajdują się sugerowane typy danych, których należy używać w celu uzyskania
maksymalnej kompatybilności pomiędzy różnymi silnikami baz danych.

#### Typy znakowe

* `CHAR`
* `CLOB`
* `VARCHAR`

#### Typy numeryczne

* Dokładne
    * `BIGINT`
    * `DECIMAL`
    * `DECFLOAT`
    * `INTEGER`
    * `NUMERIC`
    * `SMALLINT`
* Przybliżone
    * `DOUBLE PRECISION`
    * `FLOAT`
    * `REAL`

#### Typy daty i czasu

* `DATE`
* `TIME`
* `TIMESTAMP`

#### Typy binarne

* `BINARY`
* `BLOB`
* `VARBINARY`

#### Typy dodatkowe

* `BOOLEAN`
* `INTERVAL`
* `XML`


[simon]: https://www.simonholywell.com/?utm_source=sqlstyle.guide&utm_medium=link&utm_campaign=md-document
    "SimonHolywell.com"
[issue]: https://github.com/treffynnon/sqlstyle.guide/issues
    "Zgłoszenia na GitHubie dotyczące Podręcznika stylu SQL"
[fork]: https://github.com/treffynnon/sqlstyle.guide/fork
    "Sforkuj na GitHubie Podręcznik stylu SQL"
[pull]: https://github.com/treffynnon/sqlstyle.guide/pulls/
    "Pull requesty na GitHubie dotyczące Podręcznika stylu SQL"
[celko]: https://www.amazon.com/gp/product/0120887975/ref=as_li_ss_tl?ie=UTF8&linkCode=ll1&tag=treffynnon-20&linkId=9c88eac8cd420e979675c815771313d5
    "Joe Celko's SQL Programming Style (The Morgan Kaufmann Series in Data Management Systems)"
[dl-md]: https://raw.githubusercontent.com/treffynnon/sqlstyle.guide/gh-pages/_includes/sqlstyle.guide.pl.md
    "Pobierz podręcznik w formacie Markdown"
[iso-8601]: https://pl.wikipedia.org/wiki/ISO_8601
    "Wikipedia: ISO 8601"
[rivers]: https://practicaltypography.com/one-space-between-sentences.html
    "Practical Typography: one space between sentences"
[reserved-keywords]: #lista-zastrzeżonych-słów-kluczowych
    "Lista zastrzeżonych słów kluczowych"
[eav]: https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model
    "Wikipedia: Entity–attribute–value model"
[sqlstyleguide]: https://www.sqlstyle.guide/
    "Podręcznik stylu SQL Simona Holywella"
[licence]: https://creativecommons.org/licenses/by-sa/4.0/deed.pl
    "Licencja Creative Commons Uznanie autorstwa-Na tych samych warunkach 4.0 Międzynarodowe"
