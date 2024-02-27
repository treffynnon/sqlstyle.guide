# Panoramica

E' possibile usare queste linee guida, utilizzarle per una [biforcazione](https://github.com/treffynnon/sqlstyle.guide/fork) oppure comporre le proprie - la chiave qui è scegliere uno stile e mantenerlo. Per
suggerire modifiche o risoluzioni di bug per cortesia aprire un
[problema][issue] o una [richiesta di pull][pull] su GitHub.

Queste linee guida sono concepite per essere compatibili con quelle del libro
di Joe Celko [SQL Programming Style][celko] per facilitarne
l'adozione a chi abbia già letto il libro. Questa guida è in qualche area un
poco più intransigente mentre in altre è più permissiva. E' certamente più
succinta rispetto al [libro di Celko][celko], che contiene aneddoti e argomentazioni
dietro ogni regola come prosa riflessiva.

E' facile includere questa guida in [formato Markdown][dl-md] come parte di una base di
codice di un progetto oppure può essere referenziata qui affinchè chiunque nel
progetto possa leggerla liberamente—molto più difficile con un libro fisico.

SQL style guide di [Simon Holywell][simon] è autorizzata sotto la licenza
[Creative Commons Attribution-ShareAlike 4.0 International License][licence]. Basata su questo lavoro: https://www.sqlstyle.guide/

## Generale

### Fare

- Usare nome e identificativi consistenti e descrittivi.
- Fare un uso giudizioso degli spazi e indentazione per facilitare la lettura del codice.
- Conservare le informazioni relative a data e ora conformi con [ISO 8601][iso-8601] (`YYYY-MM-DDTHH:MM:SS.SSSSS`).
- Cercare di utilizzare funzioni SQL standard in luogo di quelle dello specifico fornitore per ragioni di portabilità.
- Mantenere il codice conciso ed evitare ridondanza di SQL—tipo l'utilizzo di parentesi o l'inserimento di elementi tra apici non necessari o clausole `WHERE` che potrebbero essere altrimenti derivate.
- Includere commenti nel codice SQL laddove necessario. Usare lo stile di commento C con `/*` in apertura e `*/` in chiusura dove possibile, altrimenti far precedere i commenti da `--` e finirli con un ritorno a capo.

```sql
SELECT file_hash  -- stored ssdeep hash
  FROM file_system
 WHERE file_name = '.vimrc';
```

### Evitare

- La [notazione a cammello][camelCase-it] (_camelCase_)—è difficile da scorrere velocemente.
- Prefissi descrittivi o notazione ungherese tipo `sp_` o `tbl`.
- Plurali—quando possibile usare invece il termine collettivo che più si addice. Ad esempio `personale` in luogo di `impiegati` o `persone` invece che `individui`
- Identificatori racchiusi tra virgolette—se si devono usare attenersi ai doppi apici SQL-92 per ragioni di portabilità (si potrebbe aver bisogno di configurare il proprio server SQL per supportarlo, dipende dal fornitore).
- Non si dovrebbero applicare principi di progettazione orientata agli oggetti a SQL o strutture di database.

## Convenzioni di denominazione

### Generali

- Assicurarsi che il nome sia univoco e non esista come [parola riservata][reserved-keywords].
- Mantenere la lunghezza ad un massimo di 30 byte—in pratica sono 30 caratteri a meno che non si utilizzi un insieme di caratteri a byte multipli.
- I nomi devono iniziare con una lettera e non possono finire con un trattino basso (_underscore_).
- Usare solo lettere, numeri e trattini bassi nei nomi.
- Evitare l'uso di trattini bassi multipli consecutivi—può essere difficoltoso leggerli.
- Usare trattini bassi dove naturalmente si dovrebbe includere una spazio nel nome (first name diventa `first_name`).
- Evitare abbreviazioni, se si devono usare assicurarsi che siano comunemente note.

```sql
SELECT first_name
  FROM staff;
```

### Tabelle

- Usare un nome collettivo o, meno idealmente, la forma plurale. Ad esempio (in ordine di preferenza) `personale` e `impiegati`.
- Non usare prefissi tipo `tab` o altri prefissi descrittivi di questo tipo o notazione ungherese.
- Non dare mai a una tabella lo stesso nome di una sua colonna e viceversa.
- Evitare dove possibile il concatenare il nome di due tabelle assieme per creare un nome da attribuire a una tabella di relazione. Invece che `macchine_meccanici` preferire `servizi`.

### Colonne

- Usare sempre la forma singolare.
- Dove possibile evitare l'uso del semplice `id` come identificatore primario per la tabella.
- Non dare mai a una colonna lo stesso nome della sua tabella e viceversa.
- Usare sempre il minuscolo a meno che possa avere senso il non farlo come per i nomi propri.

### Alias o correlazioni

- Dovrebbero essere collegate in qualche modo all'oggetto o espressione che stanno rappresentando.
- Come regola generale il nome della correlazione dovrebbe essere la prima lettera di ciascuna parola nel nome dell'oggetto
- Se esiste già una correlazione con lo stesso nome aggiungere in coda un numero.
- Includere sempre la parola chiave `AS`—facilita la lettura visto che esplicita.
- Per dati calcolati (`SUM()` o `AVG()`) usare il nome che si darebbe se fosse una colonna definita nello schema.

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

### Stored procedure

- Il nome deve contenere un verbo.
- Non usare il prefisso `sp_` o qualunque altro prefisso descrittivo o notazione ungherese.

### Suffissi uniformi

I suffissi seguenti hanno un significato universale e assicurano che le colonne possano essere lette e comprese facilmente dal codice SQL. Usare il suffisso corretto laddove appropriato.

- `_id`—un identificatore univoco tipo una colonna che è chiave primaria.
- `_status`—valore di segnalazione o qualche altro stato di qualunque tipo come `publication_status`.
- `_total`—il totale o la somma di una collezione di valori.
- `_num`—denota che il campo contiene un qualche tipo di numero.
- `_name`—denota un nome tipo `first_name`.
- `_seq`—contiene una sequenza di valori attigui.
- `_date`—denota una colonna che contiene la data di qualcosa.
- `_tally`—un conteggio.
- `_size`—la dimensione di qualcosa tipo la dimensione di un file o la taglia di un vestito.
- `_addr`—un indirizzo per il record che potrebbe essere fisico o intangibile tipo `ip_addr`.

## Sintassi delle query

### Parole riservate

Usare sempre il maiuscolo per le [parole riservate][reserved-keywords] come `SELECT` o `WHERE`

Meglio evitare le parole chiave abbreviate e usare quelle complete dove possibile (preferire `ABSOLUTE` ad `ABS`).

Non usare parole chiave specifiche del database dove già esiste una parola chiave ANSI SQL che svolge la stessa funzione. Questo aiuta a rendere il codice più portabile.

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### Caratteri di spaziatura

Per facilitare la lettura del codice è importante che venga usata la corretta combinazione di spaziatura. Non intasare il codice o rimuovere spazi propri del linguaggio naturale.

#### Spazi

Gli spazi dovrebbero essere usati per allineare il codice in modo che le parole chiave radice finiscano sempre nello stesso confine di carattere. Questo forma una sorta di fiume nel mezzo facilitando gli occhi del lettore nella scansione del codice e separa le parole chiave dal dettaglio di implementazione. questo [non è indicato in tipografia][rivers], ma qui è di aiuto.

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

Notare come `SELECT`, `FROM`, ecc. sono tutte allineate a destra mentre i nomi di colonna veri e propri e i dettagli specifici di implementazione sono allineati a sinistra.

Ancorchè non esaustivi includere sempre spazi:

- prima e dopo gli uguali (`=`)
- dopo le virgole (`,`)
- prima e dopo gli apostrofi (`'`) dove non siano tra parentesi o con una virgola o punto e virgola precedente.

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### Spaziatura di riga

Includere sempre ritorni a capo/spaziatura verticale:

- prima di `AND` oppure `OR`
- dopo punti e virgola per separare le query e facilitare la lettura
- dopo ogni definizione di parola chiave
- dopo una virgola quando si separano colonne multiple in gruppi logici
- per separare codice in sezioni correlate, il che aiuta la leggibilità di grandi porzioni di codice.

Mantenere tutte le parole chiave allineate a destra e i valori allineati a sinistra crea un divario uniforme nel mezzo della query. Rende anche più facile scorrere velocemente la definizione della query

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
       a.release_date, a.recording_date, a.production_date — grouped dates together
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

### Indentazione

Per assicurare leggibilità al codice SQL è importante che vengano seguiti standard di indentazione.

#### Join

Dovrebbero essere indentati dall'altra parte del fiume e raggruppati in una nuova riga dove necessario.

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

#### Sottoquery

Anche le sottoquery dovrebbero essere allineate dalla parte destra del fiume quindi redatte usando lo stesso stile di qualunque altra query. Talvolta avrà molto più senso avere le parentesi di chiusura su una nuova riga alla stessa posizione di carattere della sua controparte di apertura—questo è specificamente vero quando si hanno sottoquery annidate.

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

#### Formalismi preferiti

- Fare uso di `BETWEEN` dove possibile invece che combinare istruzioni multiple con `AND`.
- Allo stesso modo usare `IN()` in luogo di clausole `OR` multiple.
- Dove un valore necessiti di una interpretazione prima che esca dal database usare l'espressione `CASE`. Istruzioni `CASE` possono essere annidate formando strutture logiche più complesse.
- Evitare l'uso di clausole `UNION` e tabelle temporanee dove possibile. Se lo schema può essere ottimizzato per rimuovere la dipendenza verso queste pratiche allora lo si dovrebbe fare.

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

## Sintassi per CREATE

Quando si dichiarano le informazioni dello schema è anche importante mantenere il codice in modo che sia leggibile dall'umano. Per facilitare questo assicurarsi che le definizioni di colonne siano ordinate e raggruppate assieme dove fare questo ha un senso.

Indentare la definizione di colonna di quattro (4) spazi all'interno della definizione `CREATE`.

### Scegliere i tipi di dato

- Dove possibile non usare tipi di dato specifici di un fornitore—questi non sono portabili e potrebbero non essere disponibili in versioni più vecchie del software dello stesso fornitore.
- Usare solo tipi `REAL` o `FLOAT` dove è strettamente necessario per valori a virgola mobile, viceversa preferire sempre `NUMERIC` e `DECIMAL`. Gli errori di arrotondamento dei valori a virgola mobile sono una seccatura!

### Specificare valori predefiniti

- Il valore predefinito deve essere dello stesso tipo di quello della colonna—se una colonna è dichiarata come `DECIMAL` non fornire un valore predefinito di tipo `INTEGER`.
- I valori predefiniti devono seguire la dichiarazione del tipo di dato e venire prima di qualsiasi istruzione `NOT NULL`.

### Vincoli e chiavi

I vincoli e i loro sottoinsiemi, le chiavi, sono un componente molto importante di una qualunque definizione di un database. Possono velocemente diventare molto difficili da leggere e da ragionarci sopra quindi è importante che venga seguito un insieme di linee guida standard.

#### Scegliere le chiavi

Decidere la(e) colonna(e) che andranno a formare le chiavi in fase di definizione dovrebbe essere una attività gestita con cura visto che avrà ripercussioni sulle prestazioni e sull'integrità dei dati.

1. La chiave dovrebbe essere in un qualche modo univoca.
2. Deve assicurare consistenza in termini di tipo di dato per il valore attraverso lo schema e una minore probabilità che questa venga modificata in futuro.
3. Il valore può essere validato contro un formato standard (tipo uno pubblicato da ISO)?. Favorirebbe la conformità al punto 2.
4. Mantenere la chiave più semplice possibile mentre non deve spaventare l'utilizzo di chiavi composte dove necessario.

Si tratta di una attività ponderata di compromesso da eseguirsi alla definizione di un database. Dovessero evolversi i requisiti nel futuro è possibile cambiare le definizioni per mantenerle aggiornate.

#### Definire vincoli

Una volta che le chiavi sono determinate è possibile definirli nel sistema usando vincoli assieme a validazione del valore di campo.

##### Generale

- Le tabelle devono avere almeno una chiave per essere complete e utili.
- Ai vincoli si dovrebbe attribuire un nome personalizzato a parte `UNIQUE`, `PRIMARY KEY` e `FOREIGN KEY` dove il fornitore del database generalmente fornisce nomi sufficientemente intelleggibili automaticamente.

##### Disposizione e ordinamento

- Specificare la chiave primaria per prima appena dopo l'istruzione `CREATE TABLE`.
- I vincoli dovrebbero essere definiti direttamente sotto la colonna alla quale corrispondono.
  Indentare il vincolo in modo che sia allineato alla destra del nome della colonne.
- Se il vincolo è multi-colonna allora considerare di sistemarlo più vicino possibile a entrambe le definizioni della colonne e laddove questo sia difficoltoso includerli come ultima risorsa alla fine della definizione di `CREATE TABLE`
- Se esiste un vincolo a livello di tabella che si applica all'intera tabella dovrebbe apparire alla fine.
- Usare l'ordine alfabetico dove `ON DELETE` viene prima di `ON UPDATE`.
- Se ha senso, allineare ogni aspetto della query alla stessa posizione di carattere. Ad esempio tutte le definizioni `NOT NULL` potrebbero partire alla stessa posizione di carattere. Questo non è categorico ma rende certamente il codice più facile da scorrere e leggere.

##### Validazione

- Usare vincoli `LIKE` o `SIMILAR TO` per assicurare l'integrità di stringhe laddove il formato sia noto.
- Dove l'intervallo di un valore numerico sia definito e noto deve essere scritto come verifica di quell'intervallo con `CHECK()` per evitare che valori non corretti possano entrare nel database oppure che si verifichi un troncamento di dati troppo grandi rispetto alla definizione della colonna. Per lo meno dovrebbe essere verificato che il valore sia maggiore di zero nella maggior parte dei casi.
- I vincoli `CHECK()` dovrebbero essere mantenuti in clausole separate per facilitare il _debug_.

##### Esempio

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

### Progettazioni da evitare

- I principi di progettazione orientata agli oggetti non hanno efficace corrispondenza nei database relazionali—evitare questa trappola.
- Piazzare il valore in una colonna e le unità in un'altra. La colonna dovrebbe rendere le unità di misura auto-evidenti per evitare l'esigenza di combinare ancora le colonne successivamente nell'applicazione. Usare `CHECK()` per fare in modo che vengano inseriti dati validi nella colonna.
- Tabelle [EAV][eav]—usare un prodotto specialistico inteso per la gestione di questi dati privi di schema.
- Dividere dati che dovrebbero essere in una tabella in diverse tabelle causa preoccupazioni arbitrarie tipo archiviazioni temporizzate o localizzazioni in una organizzazione multinazionale. Si sarà costretti successivamente a comporre query con tabelle multiple con `UNION` invece che interrogare semplicemente una tabella.

## Appendice

### Consultazione parole riservate

Un elenco di parole riservate ANSI SQL (92, 99 e 2003), MySQL 3 fino a 5.x, PostgreSQL 8.1, MS SQL Server 2000, MS ODBC e Oracle 10.2.

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

### Tipi di dato di colonna

Ci sono alcuni tipi di dato di colonna consigliati per massimizzare la compatibilità tra motori di database.

#### Tipi carattere:

- CHAR
- CLOB
- VARCHAR

#### Tipi numerici:

- Tipi numerici esatti
  - BIGINT
  - DECIMAL
  - DECFLOAT
  - INTEGER
  - NUMERIC
  - SMALLINT
- Tipi numerici approssimati
  - DOUBLE PRECISION
  - FLOAT
  - REAL

#### Tipi data/ora:

- DATE
- TIME
- TIMESTAMP

#### Tipi binari:

- BINARY
- BLOB
- VARBINARY

#### Ulteriori tipi:

- BOOLEAN
- INTERVAL
- XML

[simon]: https://www.simonholywell.com/?utm_source=sqlstyle.guide&utm_medium=link&utm_campaign=md-document 'SimonHolywell.com'
[issue]: https://github.com/treffynnon/sqlstyle.guide/issues 'SQL style guide issues on GitHub'
[fork]: https://github.com/treffynnon/sqlstyle.guide/fork 'Fork SQL style guide on GitHub'
[pull]: https://github.com/treffynnon/sqlstyle.guide/pulls/ 'SQL style guide pull requests on GitHub'
[celko]: https://www.amazon.com/gp/product/0120887975/ref=as_li_ss_tl?ie=UTF8&linkCode=ll1&tag=treffynnon-20&linkId=9c88eac8cd420e979675c815771313d5 "Joe Celko's SQL Programming Style (The Morgan Kaufmann Series in Data Management Systems)"
[dl-md]: https://raw.githubusercontent.com/treffynnon/sqlstyle.guide/gh-pages/_includes/sqlstyle.guide.it.md 'Download the guide in Markdown format'
[iso-8601]: https://en.wikipedia.org/wiki/ISO_8601 'Wikipedia: ISO 8601'
[rivers]: https://practicaltypography.com/one-space-between-sentences.html 'Practical Typography: one space between sentences'
[reserved-keywords]: #reserved-keyword-reference 'Reserved keyword reference'
[eav]: https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model 'Wikipedia: Entity–attribute–value model'
[sqlstyleguide]: https://www.sqlstyle.guide/ 'SQL style guide by Simon Holywell'
[licence]: https://creativecommons.org/licenses/by-sa/4.0/ 'Creative Commons Attribution-ShareAlike 4.0 International License'
[camelCase-it]: https://www.wikiwand.com/it/Notazione_a_cammello
