# SQL-Styleguide

## Überblick

Sie können diese Reihe von Richtlinien verwenden, [abspalten][fork] oder zu
Ihrem eigenen machen — der Kniff hier ist, dass Sie einen Stil wählen und dann
dabei bleiben. Um Änderungen vorzuschlagen oder Bugs zu beheben, öffnen Sie
bitte ein [Issue][issue] oder [Pull Request][pull] auf GitHub.

Diese Richtlinien sind entworfen worden, um mit Joe Celkos [SQL Programming
Style][celko] Buch kompatibel zu sein, um Adoption für Teams zu machen, die
dieses Buch schon gelesen haben. Dieser Guide ist ein wenig mehr
meinungsorientiert in einigen Bereichen und in anderen ein wenig mehr
entspannt. Es ist sicherlich prägnanter, wo [Celkos Buch][celko] Anekdoten und
Argumentationen hinter jeder Regel als nachdenkliche Prosa enthält.

Es ist einfach, diesen Leitfaden im [Markdown-Format][dl-md] als Teil der
Code‑Basis eines Projekts einzuschließen oder irgendjemanden auf dieses
Projekt zu verweisen, um frei zu lesen — viel härter mit einem physischen
Buch.

SQL Style Guide von [Simon Holywell][simon] ist unter einer [Creative Commons
Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International]
[licence-de] lizenziert. Basierend auf einer Arbeit auf
[https://www.sqlstyle.guide][sqlstyleguide].

## Allgemein

### Befolgen

* Verwenden Sie konsistente und beschreibende Bezeichner und Namen.
* Verwenden Sie den Leerraum und die Einrückung vernünftigerweise, um den Code
  lesbarer zu machen.
* Speichern Sie [ISO‑8601][iso-8601-de] konforme Zeit- und
  Datumsinformationen: `YYYY‑MM‑DDTHH:MM:SS.SSSSS`.
* Versuchen Sie, aus Gründen der Portabilität nur Standard‑SQL‑Funktionen
  anstelle von herstellerspezifischen Funktionen zu verwenden.
* Halten Sie den Code prägnant und ohne redundante SQL, wie z.B. unnötige
  Anführungszeichen oder Klammern oder `WHERE`‑Klauseln, die anderweitig
  abgeleitet werden können.
* Geben Sie ggf. Kommentare in SQL‑Code ein. Benutzen Sie die C‑ähnlichen
  öffenden `/*` und schließenden `*/` Kommentarzeichen wo möglich, sonst gehen
  Sie mit Kommentaren von `--` voraus und enden Sie mit einer neuen Zeile.

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

### Vermeiden

* camelCase. Es ist schwierig schnell zu scannen.
* Beschreibende Präfixe oder [ungarische Notation][ungarische-notation] wie
  `sp_` oder `tbl`.
* Plurale. Verwenden Sie stattdessen den natürlicheren Sammelbegriff. Zum
  Beispiel, `staff` anstelle von `employees`, oder `people` anstatt von
  `individuals`.
* Zitierte Bezeichner. Wenn Sie sie verwenden müssen, dann halten Sie sich an
  die doppelten SQL92‑Anführungszeichen für Portabilität. Möglicherweise
  müssen Sie Ihren SQL‑Server konfigurieren, um dieses abhängig vom
  Hersteller zu stützen.
* Objektorientierte Entwurfsmuster sollten auf SQL- oder Datenbankstrukturen
  nicht angewendet werden.

## Namenskonventionen

### Allgemein

* Stellen Sie sicher, dass der Name einmalig ist und nicht als [reservierte
  Schlüsselwörter][reserved-keywords] existiert.
* Halten Sie die Länge auf maximal 30 Bytes. In der Praxis entspricht das 30
  Zeichen, es sei denn, Sie verwenden einen Multi‑Byte‑Zeichensatz.
* Die Namen müssen mit einem Buchstaben beginnen und dürfen nicht mit einem
  Unterstrich enden.
* Verwenden Sie nur Buchstaben, Zahlen und Unterstriche in den Namen.
* Vermeiden Sie die Verwendung von mehreren aufeinanderfolgenden Unterstrichen
  — das kann schwer zu lesen sein.
* Verwenden Sie Unterstriche, wo Sie natürlich ein Leerzeichen im Namen
  eintragen: `first name` wird `first_name`.
* Vermeiden Sie Abkürzungen, und wenn Sie sie verwenden müssen, stellen Sie
  sicher, dass sie allgemein verstanden werden.

```sql
SELECT first_name
  FROM staff;
```

### Tabellen

* Verwenden Sie einen Sammelbegriff oder, aber weniger bevorzugt, eine
  Pluralform. Zum Beispiel (in absteigender Priorität) `staff` und
  `employees`.
* Fügen Sie nicht das `tbl` Präfix oder ein anderes solches beschreibendes
  Präfix. Verwenden Sie keine [ungarische Notation][ungarische-notation].
* Geben Sie niemals einer Tabelle denselben Namen wie einer ihrer Spalten und
  umgekehrt.
* Vermeiden Sie, wo möglich, zwei Tabellennamen zusammen zu verketten, um eine
  Beziehungstabelle zu nennen. Anstatt `cars_mechanics` verwenden Sie
  `services`.

### Spalten

* Verwenden Sie immer Namen im Singular.
* Vermeiden Sie, wo möglich, einfach `id` als Primärschlüssel für die Tabelle
  zu verwenden.
* Fügen Sie keine Spalte mit demselben Namen wie ihre Tabelle und umgekehrt.
* Verwenden Sie immer nur Kleinbuchstaben, es sei denn, es ist sinnvoll wie
  z.B. bei Eigennamen.

### Aliasing oder Korrelationen

* Aliasnamen sollen in gewisser Weise mit dem Objekt oder dem Ausdruck, das
  sie aliasieren, verbunden sein.
* Als Faustregel wird der Korrelationsname aus ersten Buchstaben jedes Namens
  des Objekts zusammengesetzt.
* Falls es schon eine Korrelation mit dem gleichen Namen gibt, fügen Sie eine
  Zahl hinzu.
* Immer schließen das `AS` Keyword ein. Das macht es lesbarer, da es eindeutig
  ist.
* Für berechnete Daten (`SUM()` oder `AVG()`) benutzen Sie den Namen, den Sie
  einer Spalte mit diesen Daten geben würden, falls solche Spalte im Schema
  definiert wäre.

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

### Gespeicherte Prozeduren

* Der Name muss ein Verb enthalten.
* Fügen Sie nicht das `sp_` Präfix oder ein anderes solches beschreibendes
  Präfix. Verwenden Sie keine [ungarische Notation][ungarische-notation].

### Einheitliche Suffixe

Die folgenden Suffixe haben eine universelle Bedeutung. Dabei wird
sichergestellt, dass die Spalten in SQL‑Code lesbar und verständlich
sind. Verwenden Sie ggf. das richtige Suffix.

* `_id` — ein eindeutiger Bezeichner wie eine Spalte, die ein Primärschlüssel
  ist.
* `_status` ein Flag oder ein anderer Status eines beliebigen Typs wie
  `publication_status`.
* `_total` — die Gesamtmenge oder Gesamtsumme einer Collection von Werten.
* `_num` — bezeichnet das Feld, dass jeglicher Art von Zahl enthält.
* `_name` — bezeichnet einen Namen wie `first_name`.
* `_seq` — enthält eine zusammenhängende Reihenfolge von Werten.
* `_date` — bezeichnet eine Spalte, die das Datum von etwas enthält.
* `_tally` — eine Zählung.
* `_size` — die Größe von etwas wie eine Dateigröße oder Konfektionsgröße.
* `_addr` — eine physikalische oder logische Adresse für den Datensatz wie
  `ip_addr`.

## Abfragesyntax

### Reservierte Wörter

Verwenden Sie immer Großbuchstaben für
[reservierte Schlüsselwörter][reserved-keywords] wie `SELECT` und `WHERE`.

Es ist am besten, die abgekürzten Schlüsselwörter zu vermeiden und die in
voller Länge zu verwenden, wo verfügbar (bevorzugen Sie `ABSOLUTE` zu `ABS`).

Verwenden Sie keine DBMS‑Hersteller‑spezifischen Schlüsselwörter,
wenn es ein ANSI‑SQL‑Schlüsselwort gibt, das die gleiche Funktion
ausführt. Das hilft den Code mehr portabel zu machen.

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### Weißraum

Um den Code lesbarer zu machen, ist es wichtig die Zeichenabstände richtig zu
verwenden. Verdichten Sie nicht den Code und entfernen Sie nicht die
Zeichenabstände, die natürliche Sprache enthält.

#### Leerzeichen

Leerzeichen sollten verwendet werden, um den Code so auszurichten, dass die
Hauptschlüsselwörter alle rechtsbündig ausgerichtet werden. Dies erstellt
Gießbäche in der Mitte, die es dem Leser leichter macht, den Code zu lesen und
die Schlüsselwörter von den Implementierungsdetails zu trennen.
[Gießbäche][gießbäche] sind [schlecht][rivers] in der Typografie,
aber hier sind sie hilfreich.

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

Bemerken Sie, dass `SELECT`, `FROM`, usw. alle rechtsbündig, während die
tatsächlichen Spaltennamen und spezifische Implementierungsdetails linksbündig
ausgerichtet sind.

Obwohl das nicht erschöpfend ist, schließen Sie immer Leerzeichen ein:

* vor und nach Gleichheitszeichen (=)
* nach Kommas (,)
* umgebende Apostrophe ('), wenn sie nicht in Klammern oder mit einem
  nachlaufenden Komma oder Semikolon sind.

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### Zeilenabstand

Schließen Sie immer Zeilenumbruch / vertikalen Raum ein:

* vor `AND` oder `OR`
* nach Semikolons, um Abfragen für leichteres Lesen zu trennen
* nach jeder Schlüsselwort‑Definition
* nach einem Komma, um mehrfachen Spalten in logische Gruppen zu trennen
* um den Code in verwandte Abschnitte zu trennen, was dazu beiträgt, großen
  Teilen des Codes lesbarer zu machen.

Wenn alle Schlüsselwörter rechtsbündig und Implementierungsdetails linksbündig
ausgerichtet sind, erstellt das ein Gießbach in der Mitte der Abfrage, der es
dem Leser leichter macht, die Abfrage schneller durchzusuchen.

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

### Vertiefung

Um sicherzustellen, dass SQL‑Abfrage lesbar ist, ist es wichtig, dass
Standards der Einrückung eingehalten werden.

#### Joins

Joins sollten auf die rechte Seite des Gießbaches eingerückt werden und mit
einer neuen Zeile gruppiert werden, wo nötig.

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

#### Unterabfragen

Unterabfragen sollten auch auf die rechte Seite des Gießbaches ausgerichtet
werden und dann mit dem gleichen Stil wie jede andere Abfrage geordnet werden.
Manchmal ist es sinnvoll, die abschließende Klammer auf einer neuen Zeile an
der gleichen Charakterposition,  genau unter der eröffnenden Klammer zu haben.
Das ist besonders wichtig, wenn Sie verschachtelte Unterabfragen verwenden.

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

### Bevorzugte Formalismen

* Wo es möglich ist, verwenden Sie `BETWEEN` anstatt mehrere Anweisungen mit
  `AND` zu verbinden.
* Verwenden Sie auch `IN()` anstelle von mehreren `OR`‑Klauseln.
* Wenn ein Wert interpretiert werden muss, bevor er die Datenbank verlässt,
  verwenden Sie die `CASE`‑Anweisung. `CASE`‑Anweisungen können
  verschachtelt werden, um komplexere logische Strukturen zu bilden.
* Vermeiden Sie `UNION`‑Klauseln und temporären Tabellen, soweit wie
  möglich. Wenn das Schema optimiert werden kann, um auf diese Funktionen
  nicht zu vertrauen, dann sollte es getan werden.

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

## `CREATE`-Syntax

Bei der Entwicklung von Datenschema ist es auch wichtig, den lesbaren Code zu
pflegen. Um dies zu erleichtern, stellen Sie sicher, dass die Spaltenerklärung
logisch geordnet und gruppiert werden, wo es sinnvoll ist, dies zu tun.

Rücken Sie die Spaltenerklärung mit vier (4) Leerzeichen innerhalb der
`CREATE`‑Anweisung ein.

### Datentypen

* Wo möglich, verwenden Sie keine herstellerspezifischen Datentypen, denn die
  sind nicht portabel und möglicherweise nicht in älteren   Versionen
  derselben Software verfügbar.
* Verwenden Sie `REAL`- oder `FLOAT`‑Typen, nur wenn es für die
  Gleitkommazahl unbedingt notwendig ist. Ansonsten verwenden Sie jederzeit
  `NUMERIC`- und `DECIMAL`‑Typen. Fließkomma‑Rundungsfehler sind
  ein Ärgernis.

### Standardwerten

* Der Vorschlagswert muss vom gleichen Typ sein, wie die Spalte - wenn eine
  Spalte als `DECIMAL` deklariert wird, setzen Sie keinen
  `INTEGER`‑Vorschlagswert ein.
* Standardwerte müssen der Datentypdeklaration folgen und vor jeder
  `NOT NULL`‑Anweisung kommen.

### Einschränkungen und Schlüssel

Einschränkungen und ihre Untermenge, Schlüssel, sind eine sehr wichtige
Komponente jeder Datenbankdefinition. Aber sie können schnell zu schwierig zu
lesen und zu begreifen werden. Deshalb ist es wichtig, dass eine Standardreihe
von Richtlinien gefolgt wird.

#### Schlüssel

Die Entscheidung über die Spalte(n), die die Schlüssel in der Definition
bilden werden, sollte sorgfältig durchgeführt werden, denn sie wird Leistung
und Datenintegrität beeinflussen.

1. Der Schlüssel sollte bis zu einem gewissen Grad eindeutig sein.
1. Konsistenz muss vorhanden sein - in Bezug auf den Datentyp für den Wert
   über das Schema und darauf, dass es in der Zukunft unwahrscheinlich
   verändern wird.
1. Kann der Wert gegen ein Standardformat validiert werden (wie z.B. ein ISO)?
   Erfüllung der Konformität zum Punkt 2.
1. Der Schlüssel sollte so einfach wie möglich sein. Aber man muss keine Angst
   davor haben, wo nötig, zusammengesetzte Schlüssel zu verwenden.

Diese gewissermaßen Konventionen sollten bei der Definition einer Datenbank
durchgeführt werden. Wenn die Anforderungen in Zukunft weiterentwickeln
werden, ist es möglich, Änderungen an den Definitionen vorzunehmen, um sie
aktuell zu halten.

#### Einschränkungen

Sobald die Schlüssel entschieden sind, ist es möglich, sie im System mit
Einschränkungen zusammen mit Feldwertvalidierung zu definieren.

##### Allgemein

* Die Tabellen müssen mindestens einen Schlüssel haben, um vollständig und
  nützlich zu sein.
* Man sollte benutzerdefinierten Namen alle Einschränkungen geben, mit
  Ausnahme von `UNIQUE`, `PRIMARY KEY` und `FOREIGN KEY`,    denn
  Datenbankhersteller liefert in der Regel automatisch ausreichend
  verständliche Namen.

##### Layout und Reihenfolge

* Geben Sie zuerst den Primärschlüssel direkt nach der
  `CREATE TABLE`‑Anweisung an.
* Einschränkungen sollten direkt unterhalb der Spalte definiert werden, der
  sie entsprechen. Rücken Sie die Einschränkung so ein, dass sie rechtsbündig
  vom Spaltennamen ausgerichtet werden.
* Wenn es sich um eine mehrspaltige Einschränkung handelt, dann sollten Sie es
  so nah wie möglich bei den beiden Spaltendefinitionen setzen. Aber wenn es
  zu schwierig ist, als letzten Ausweg, setzen Sie es am Ende der
  `CREATE TABLE`‑Definition.
* Wenn es eine tabellenebene Einschränkung ist, die für die gesamte Tabelle
  gilt, dann sollte es auch am Ende erscheinen.
* Verwenden Sie die alphabetische Reihenfolge, in der `ON DELETE` vor
  `ON UPDATE` kommt.
* Wenn es Sinn macht, dies zu tun, richten Sie jeden Aspekt der Abfrage auf
  die gleiche Zeichenposition aus. Zum Beispiel können alle
  `NOT NULL`‑Definitionen mit derselben Zeichenposition beginnen. Es macht
  den Code viel einfacher durchzusuchen und zu lesen.

##### Validierung

* Verwenden Sie `LIKE` und `SIMILAR TO` Einschränkungen, um die Integrität von
  Strings dort gewährleisten, deren Format bekannt ist.
* Wenn der endgültige Bereich eines numerischen Wertes bekannt ist, muss er
  als ein Bereich `CHECK()` geschrieben werden, um zu verhindern, dass falsche
  Werte in die Datenbank eingegeben werden oder Daten, die größer als die
  Spaltendefinition ist, leise reduziert wird. Im Geringsten sollte es prüfen,
  ob der Wert in den meisten Fällen größer als Null ist.
* `CHECK()` Einschränkungen sollten in separaten Klauseln gehalten werden, um
  das Debugging zu erleichtern.

##### Beispiel

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

### Zu vermeidende Entwürfe

* Objektorientierte Gestaltungsprinzipien werden nicht effektiv in relationale
  Datenbankentwürfe übersetzt - vermeiden Sie diese Fallstricke.
* Teilen Sie nicht die Werten und die Maßeinheiten in verschiedene Spalten
  auf. Die Spalten sollten die Maßeinheiten selbstverständlich machen, um die
  Anforderung zu vermeiden, Spalten später in der Anwendung zu kombinieren.
  Verwenden Sie `CHECK()`, um sicherzustellen, dass gültige Daten in die
  Spalte eingefügt werden.
* [EAV (Entity Attribute Value)][eav] Tabellen - Verwenden Sie stattdessen
  spezielle Produkte, die für die Verarbeitung solcher schemafreier Daten
  bestimmt sind.
* Teilen Sie nicht die Daten, die logisch zu einziger Tabelle gehören, in
  vielen verschidenen Tabellen auf, aus Gründen von beliebiger Bedenken, wie
  z. B. zeitbasierte Archivierung oder Standort in einer multinationalen
  Organisation. Spätere Abfragen müssen dann über mehrere Tabellen mit `UNION`
  arbeiten, anstatt einfach nur eine Tabelle abzufragen.

## Anhang

<span id="reserved-keyword-reference" />

### Reservierte Schlüsselwörter-Referenz

Eine Liste von ANSI SQL (92, 99 und 2003), MySQL 3 bis 5.x, PostgreSQL 8.1, MS
SQL Server 2000, MS ODBC und Oracle 10.2 reservierte Schlüsselwörter.

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
[dl-md]: https://raw.githubusercontent.com/treffynnon/sqlstyle.guide/gh-pages/_includes/sqlstyle.guide.md
    "Download the guide in Markdown format"
[iso-8601-de]: https://de.wikipedia.org/wiki/ISO_8601
    "Wikipedia: ISO 8601"
[ungarische-notation]: https://de.wikipedia.org/wiki/Ungarische_Notation
    "Ungarische Notation"
[gießbäche]: https://de.wikipedia.org/wiki/Gie%C3%9Fbach_(Typografie)
    "Gießbach in Typografie"
[rivers]: https://practicaltypography.com/one-space-between-sentences.html
    "Practical Typography: one space between sentences"
[reserved-keywords]: #reserved-keyword-reference
    "Reserved keyword reference"
[eav]: https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model
    "Wikipedia: Entity–attribute–value model"
[sqlstyleguide]: https://www.sqlstyle.guide
    "SQL style guide by Simon Holywell"
[licence-de]: https://creativecommons.org/licenses/by-sa/4.0/deed.de
    "Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International"
