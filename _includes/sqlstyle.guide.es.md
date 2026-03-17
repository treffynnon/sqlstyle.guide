# Guía de estilo SQL

## Descripción general

Puedes utilizar este conjunto de pautas, [bifurcarlos][fork] o crea las tuyas propias. 
La clave es elegir un estilo y ceñirte a él. Para sugerir cambios 
o corregir errores, abre un [issue][issue] o una [pull request][pull] en GitHub.

Estas pautas están diseñadas para ser compatibles con las de Joe Celko. [SQL Programming
Style][celko] libro para facilitar la adopción a los equipos que ya lo han 
leído. Esta guía es un poco más concisa en algunas áreas y en otras un poco más relajada. 
Sin duda, es más concisa en [Celko's book][celko] contiene anécdotas y razonamientos detrás 
de cada regla como prosa reflexiva.

Es fácil incluir esta guía en [Markdown format][dl-md] como parte del código base 
de un proyecto o referenciarlo aquí para que cualquier persona en el proyecto lo 
lea libremente (es mucho más difícil con un libro físico).

Guía de estilo SQL por [Simon Holywell][simon] cuenta con una licencia [Creative Commons
Attribution-ShareAlike 4.0 International License][licence].
Basado en un trabajo en [https://www.sqlstyle.guide/][sqlstyleguide].

## General

### Hacer

* Utilice identificadores y nombres consistentes y descriptivos.
* Utilice con cuidado los espacios en blanco y la sangría para facilitar la lectura del código.
* Almacenar [ISO 8601][iso-8601] información de fecha y hora compatible
  (`YYYY-MM-DDTHH:MM:SS.SSSSS`).
* Intente utilizar únicamente funciones SQL estándar en lugar de funciones específicas del proveedor
  por razones de portabilidad.
* Mantenga el código conciso y sin SQL redundante, como comillas o paréntesis innecesarios.
  Cláusulas `WHERE` que de otro modo podrían derivarse.
* Incluya comentarios en el código SQL cuando sea necesario. Use el estilo de apertura C `/*`
  y finalizado `*/` Siempre que sea posible, de lo contrario, anteponga los comentarios
  con `--` y terminarlos con una nueva línea.

```sql
SELECT file_hash  -- stored deep hash
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

### Evitar

* camelCase — Es difícil comprenderlo rápidamente.
* Prefijos descriptivos o notación húngara como `sp_` o `tbl`.
* Plurales — En cualquier caso, utilice el término colectivo más natural siempre
  que sea posible. Por ejemplo `staff` en lugar de `employees` o `people`
  en lugar de `individuals`.
* Identificadores entre comillas — Si debe usarlas, utilice las comillas dobles
  de SQL-92 para mayor portabilidad (es posible que deba configurar su servidor SQL
  para que sea compatible, dependiendo del proveedor).
* Los principios de diseño orientado a objetos no deben aplicarse a SQL ni a
  las estructuras de bases de datos.

## Convenciones de nomenclatura

### General

* Asegúrese de que el nombre sea único y no exista como
  [palabra reservada][referencia-de-palabras-clave-reservadas].
* Mantenga la longitud máxima en 30 bytes; en la práctica, esto equivale a 30 caracteres,
  a menos que utilice un conjunto de caracteres multibyte.
* Los nombres deben comenzar con una letra y no pueden terminar con un guion bajo.
* Utilice solo letras, números y guiones bajos en los nombres.
* Evite el uso de varios guiones bajos consecutivos, ya que pueden ser difíciles de leer.
* Utilice guiones bajos donde, naturalmente, incluiría un espacio en el nombre (first name se
  convierte en `first_name`).
* Evite las abreviaturas y, si tiene que usarlas, asegúrese de que sean de fácil comprensión.

```sql
SELECT first_name
  FROM staff;
```

### Tablas

* Usa un nombre colectivo o, en su defecto, una forma plural. Por ejemplo (en orden de
  preferencia) `staff` y `employees`.
* No utilices prefijos como `tbl` ni ningún otro prefijo descriptivo o notación húngara.
* Nunca le des a una tabla el mismo nombre que una de sus columnas, y viceversa.
* Evita, cuando sea posible, concatenar los nombres de dos tablas para crear el nombre
  de una tabla de relación. En lugar de `cars_mechanics`, prefiere `services`.

### Columnas

* Usa siempre nombres en singular.
* Siempre que sea posible, evita usar simplemente `id` como identificador principal de la tabla.
* No añadas una columna con el mismo nombre que su tabla, y viceversa.
* Usa siempre minúsculas, excepto cuando tenga sentido no hacerlo, como en nombres propios.

### Alias o correlaciones

* Deben tener alguna relación con el objeto o expresión al que están dando alias.
* Como regla general, el nombre del alias debe ser la primera letra de cada palabra en el
  nombre del objeto.
* Si ya existe una correlación con el mismo nombre, añade un número al final.
* Incluye siempre la palabra clave `AS` — facilita la lectura al ser explícito.
* Para datos calculados (`SUM()` o `AVG()`), usa el nombre que le darías si fuera una
  columna definida en el esquema.

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

### Procedimientos almacenados

* El nombre debe contener un verbo.
* No utilices prefijos como `sp_` ni ningún otro prefijo descriptivo o notación húngara.

### Sufijos uniformes

Los siguientes sufijos tienen un significado universal, lo que garantiza que las 
columnas puedan ser leídas y comprendidas fácilmente desde el código SQL. Usa el 
sufijo correcto cuando sea apropiado.

* `_id`— un identificador único, como una columna que es clave primaria.
* `_status`— valor de bandera o algún otro estado de cualquier tipo, como `publication_status`.
* `_total`— el total o suma de una colección de valores.
* `_num`— indica que el campo contiene algún tipo de número.
* `_name`— significa un nombre, como `first_name`.
* `_seq`— contiene una secuencia continua de valores.
* `_date`— indica una columna que contiene la fecha de algo.
* `_tally`— un conteo.
* `_size`— el tamaño de algo, como el tamaño de un archivo o una prenda de ropa.
* `_addr`— una dirección para el registro, que puede ser física o intangible,
  como `ip_addr`.

## Sintaxis de consultas

### Palabras reservadas

Siempre usa mayúsculas para las [palabras clave reservadas][referencia-de-palabras-clave-reservadas], 
como `SELECT` y `WHERE`.

Es mejor evitar las palabras clave abreviadas y usar las completas cuando estén
disponibles (preferiblemente `ABSOLUTE` en lugar de `ABS`). 

No utilice palabras clave específicas del servidor de base de datos donde ya 
exista una palabra clave ANSI SQL que realice la misma función. Esto facilita 
la portabilidad del código.

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### Espacios en blanco
Para facilitar la lectura del código, es importante usar el complemento 
correcto de espaciado. No amontone el código ni elimine los espacios en blanco. 

#### Espacios 
Los espacios deben usarse para alinear el código de modo que las palabras clave 
raíz terminen en el mismo límite de caracteres. Esto forma un río en el centro, 
lo que facilita al lector examinar el código y separar las palabras clave de 
los detalles de implementación. Los ríos son malos en tipografía, pero 
útiles en este caso.

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

Tenga en cuenta que `SELECT`, `FROM`, etc. están alineados a la derecha, mientras 
que los nombres de las columnas y los detalles específicos de la implementación 
están alineados a la izquierda. 

Aunque no es exhaustivo, incluya siempre espacios: 

* antes y después del signo igual (`=`)
* después de las comas (`,`)
* entre apóstrofes (`'`) cuando no estén entre paréntesis ni con una coma
  o punto y coma al final.

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### Interlineado

Incluya siempre nuevas líneas/espacios verticales:

* antes de `AND` o `OR`
* después de punto y coma para separar las consultas y facilitar su lectura.
* Después de cada definición de palabra clave. * Después de una coma al separar
  varias columnas en grupos lógicos.
* Para separar el código en secciones relacionadas, lo que facilita la lectura de
  grandes fragmentos de código.

Mantener todas las palabras clave alineadas a la derecha y los valores a la izquierda 
crea un espacio uniforme en el centro de la consulta. También facilita la lectura 
rápida de la definición de la consulta.

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

### Indentación

Para garantizar que SQL sea legible, es importante que se respeten los estándares de 
sangría.

#### Joins

Las uniones deben sangrarse hacia el otro lado del río y agruparse con una nueva 
línea cuando sea necesario.

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

La excepción a esto es cuando se usa solo la palabra clave `JOIN` donde debería 
estar antes del río.

```sql
SELECT r.last_name
  FROM riders AS r
  JOIN bikes AS b
    ON r.bike_vin_num = b.vin_num
```

#### Subqueries

Las subconsultas también deben alinearse a la derecha del río y luego diseñarse con 
el mismo estilo que cualquier otra consulta. A veces, conviene que el paréntesis de 
cierre de una nueva línea esté en la misma posición que el paréntesis de apertura; 
esto es especialmente cierto cuando se tienen subconsultas anidadas.

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

### Formalismos preferidos

* Utiliza `BETWEEN` siempre que sea posible en lugar de combinar múltiples
  sentencias con `AND`.
* De manera similar, usa `IN()` en lugar de múltiples cláusulas `OR`.
* Cuando un valor necesita ser interpretado antes de salir de la base de
  datos, usa la expresión `CASE`. Las sentencias `CASE` pueden anidarse para
  formar estructuras lógicas más complejas.
* Evita el uso de cláusulas `UNION` y tablas temporales siempre que sea
  posible. Si el esquema puede optimizarse para eliminar la dependencia de estas
  características, entonces probablemente debería hacerse.

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

## Crear sintaxis

Al declarar información de esquema también es importante mantener el código
legible para humanos. Para facilitar esto, asegúrate de que las definiciones de
columnas estén ordenadas y agrupadas de manera lógica.

Indenta las definiciones de columnas con cuatro (4) espacios dentro de la definición `CREATE`.

### Elegir tipos de datos

* Siempre que sea posible, no uses tipos de datos específicos del proveedor: estos
  no son portátiles y pueden no estar disponibles en versiones antiguas del mismo software
  del proveedor.
* Solo usa tipos `REAL` o `FLOAT` cuando sea estrictamente necesario para matemáticas de
  punto flotante; de lo contrario, prefiere `NUMERIC` y `DECIMAL` en todo momento.
  ¡Los errores de redondeo de punto flotante son una molestia!

### Especificar valores por defecto

* El valor por defecto debe ser del mismo tipo que la columna; si una columna se
  declara como `DECIMAL`, no proporciones un valor por defecto `INTEGER`.
* Los valores por defecto deben seguir la declaración del tipo de datos y preceder a
  cualquier declaración `NOT NULL`.

### Restricciones y claves

Las restricciones y su subconjunto, las claves, son un componente muy importante
de cualquier definición de base de datos. Sin embargo, pueden volverse difíciles
de leer y razonar, por lo que es importante seguir un conjunto estándar de pautas.

#### Elegir claves

Decidir qué columna(s) formarán las claves en la definición debe ser una actividad 
cuidadosamente considerada, ya que afectará el rendimiento y la integridad de los datos.

1. La clave debe ser única en algún grado.
2. Consistencia en términos del tipo de datos del valor a lo largo del esquema y
   una menor probabilidad de que esto cambie en el futuro.
3. ¿Puede el valor validarse contra un formato estándar (como uno publicado por ISO)? Fomenta
   la conformidad con el punto 2.
4. Mantener la clave lo más simple posible, sin temor a usar claves compuestas cuando
   sea necesario.

Es un acto de equilibrio razonado y considerado que debe realizarse en la definición
de una base de datos. Si los requisitos evolucionan en el futuro, es posible hacer
cambios a las definiciones para mantenerlas actualizadas.

#### Definir restricciones

Una vez decididas las claves, es posible definirlas en el sistema usando
restricciones junto con validación de valores de campos.

##### General

* Las tablas deben tener al menos una clave para ser completas y útiles.
* Las restricciones deben tener un nombre personalizado, excepto en los casos de `UNIQUE`,
  `PRIMARY KEY` y `FOREIGN KEY`, donde el proveedor de la base de datos generalmente
  proporcionará nombres suficientemente inteligibles de forma automática.

##### Diseño y orden

* Especifica la clave primaria primero, justo después de la sentencia `CREATE TABLE`.
* Las restricciones deben definirse directamente debajo de la columna a la que corresponden.
  Indenta la restricción de manera que se alinee a la derecha del nombre de la columna.
* Si se trata de una restricción de múltiples columnas, considera colocarla lo más cerca
  posible de ambas definiciones de columna, y si esto es difícil, como último recurso
  inclúyela al final de la definición `CREATE TABLE`.
* Si se trata de una restricción a nivel de tabla que aplica a toda la tabla, también
  debe aparecer al final.
* Usa orden alfabético donde `ON DELETE` aparece antes que `ON UPDATE`.
* Si tiene sentido hacerlo, alinea cada aspecto de la consulta en la misma posición de
  carácter. Por ejemplo, todas las definiciones `NOT NULL` podrían comenzar en la misma
  posición de carácter. Esto no es una regla estricta, pero ciertamente hace que el
  código sea mucho más fácil de escanear y leer.

##### Validación

* Utilice las restricciones `LIKE` y `SIMILAR TO` para garantizar la integridad de las
  cadenas cuyo formato se conoce.
* Cuando se conoce el rango máximo de un valor numérico, debe escribirse como un rango
  `CHECK()` para evitar la entrada de valores incorrectos en la base de datos o el
  truncamiento silencioso de datos demasiado grandes para la definición de la columna.
  Como mínimo, debería comprobar que el valor sea mayor que cero en la mayoría de los casos.
* Las restricciones `CHECK()` deben mantenerse en cláusulas separadas para facilitar la depuración.

##### Ejemplo

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

### Diseños a evitar

* Los principios de diseño orientados a objetos no se trasladan eficazmente a los
  diseños de bases de datos relacionales; evite este problema.
* Colocar el valor en una columna y las unidades en otra. La columna debe hacer que
  las unidades sean evidentes para evitar tener que combinar columnas posteriormente
  en la aplicación. Use `CHECK()` para garantizar que se inserten datos válidos en
  la columna.
* Tablas [Entidad–Atributo–Valor][eav] (EAV): utilice un producto especializado para
  gestionar este tipo de datos sin esquema.
* Dividir los datos que deberían estar en una tabla en varias tablas debido a consideraciones
  arbitrarias, como el archivado basado en el tiempo o la ubicación en una organización
  multinacional. Las consultas posteriores deben funcionar en varias tablas con `UNION`,
  en lugar de consultar solo una.


## Apéndice

### Referencia de palabras clave reservadas

Una lista de palabras clave reservadas de ANSI SQL (92, 99 y 2003), MySQL 3 a 5.x, 
PostgreSQL 8.1, MS SQL Server 2000, MS ODBC y Oracle 10.2.

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

### Tipos de datos de columna

Estos son algunos tipos de datos de columna sugeridos para utilizar para lograr la máxima compatibilidad 
entre motores de bases de datos.

#### Tipos Character:

* CHAR
* CLOB
* VARCHAR

#### Tipos Numéricos:

* Tipos numéricos exactos
    * BIGINT
    * DECIMAL
    * DECFLOAT
    * INTEGER
    * NUMERIC
    * SMALLINT
* Tipos numéricos aproximados
    * DOUBLE PRECISION
    * FLOAT
    * REAL

#### Tipos de Fechas:

* DATE
* TIME
* TIMESTAMP

#### Tipos Binarios:

* BINARY
* BLOB
* VARBINARY

#### Tipos Adicionales

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
[referencia-de-palabras-clave-reservadas]: #referencia-de-palabras-clave-reservadas
    "Referencia de palabras clave reservadas"
[eav]: https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model
    "Wikipedia: Entity–attribute–value model"
[sqlstyleguide]: https://www.sqlstyle.guide/
    "SQL style guide by Simon Holywell"
[licence]: https://creativecommons.org/licenses/by-sa/4.0/
    "Creative Commons Attribution-ShareAlike 4.0 International License"
