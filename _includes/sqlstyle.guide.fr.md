# Guide de style SQL

## Vue d'ensemble

Vous pouvez utiliser ce guide tel quel, le [forker][fork] ou bien faire le vôtre — l'important est de choisir un style et de s'y tenir. Pour proposer des modifications ou corriger des bugs, ouvrez un [ticket][issue] ou une [pull request][pull] sur GitHub.

Les principes présentés ici sont prévus pour être compatibles avec le livre [SQL Programming
Style][celko] de Joe Celko afin de faciliter leur adoption par les équipes qui ont déjà lu cet ouvrage. Ce guide est un peu plus strict sur certains points, et plus permissif sur d'autres. Il est certainement plus succinct que [le livre de Celko][celko], qui contient des anecdotes et propose un raisonnement assez poussé pour chaque règle.

Il est aisé d'inclure ce guide au [format Markdown][dl-md] dans la base de code d'un projet, ou de l'y référencer pour que tout·e membre du projet puisse le lire librement, ce qui est bien plus dur à faire avec un livre physique.

Ce guide de style SQL par [Simon Holywell][simon] est proposé sous licence [Creative Commons
Attribution-Partage dans les Mêmes Conditions 4.0 International][licence].
Fondé sur un travail disponible sur [https://www.sqlstyle.guide/][sqlstyleguide].

## Généralités

### Bonnes pratiques

* Utilisez des identifiants et noms cohérents et descriptifs.
* Faites un usage judicieux de l'espace et de l'indentation afin de faciliter la lecture du code.
* Utilisez la norme [ISO 8601][iso-8601] pour les informations temporelles (`YYYY-MM-DDTHH:MM:SS.SSSSS`).
* Essayez de n'utiliser que des fonctions SQL standard au lieu des fonctions spécifiques à chaque SGBD pour des raisons de portabilité.
* Gardez le code court et évitez les redondances comme les parenthèses ou guillemets superflus, ou encore les clauses `WHERE` qui peuvent être dérivées.
* Commentez le code SQL lorsque c'est nécessaire. Utilisez le style de commentaires du langage C, en ouvrant avec `/*` et fermant avec `*/` là où c'est possible, autrement débutez les commentaires avec `--` et faites-les suivre par une nouvelle ligne.

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

### À éviter

* Le camelCase — c'est difficile à lire rapidement.
* Les préfixes descriptifs ou les notations hongroises comme `sp_` ou `tbl`.
* Les pluriels — à la place, utilisez le terme collectif le plus naturel quand c'est possible. Par exemple `staff` au lieu de `employees` ou `people` au lieu de `individuals`.
* Identifiants entre guillemets — si vous devez les utiliser, limitez-vous aux doubles guillemets SQL-92 pour la portabilité (selon le SGBD, vous aurez peut-être besoin de configurer votre serveur SQL pour qu'il soit compatible).
* Les principes du design orienté objet ne devraient pas être appliqués au SQL ou aux structures de bases de données.

## Conventions de nommage

### Généralités

* Assurez-vous que le nom est unique et ne soit pas un [mot-clef réservé][reserved-keywords].
* N'utilisez pas plus de 30 bytes — en pratique cela correspond à 30 caractères, à moins que vous utilisiez un jeu de caractères multi-bytes.
* Les noms doivent commencer avec une lettre et ne doivent pas se terminer par un tiret bas (`_`).
* N'utilisez que des lettres, des chiffres et des tirets bas dans les noms.
* Évitez l'utilisation de plusieurs tirets bas consécutifs — cela peut être difficile à lire.
* Utilisez des tirets bas là où vous utiliseriez un espace dans le nom (nom de famille devient `nom_de_famille`).
* Évitez les abréviations, et si vous devez en utiliser assurez-vous qu'elles soient communément comprises.

```sql
SELECT first_name
  FROM staff;
```

### Tables

* Utilisez un nom collectif ou, moins idéalement, un pluriel. Par exemple (par ordre de préférence) `staff` et `employees`.
* Ne préfixez pas leurs noms avec `tbl`, tout autre préfixe descriptif ou une notation hongroise.
* Ne donnez jamais à une table le même nom qu'une de ses colonnes, et inversement.
* Évitez lorsque c'est possible de concaténer deux noms de table pour créer le nom d'une table d'association. Préférez `services` à `cars_mechanics`.

### Colonnes

* Utilisez toujours un nom singulier.
* Évitez lorsque c'est possible d'utiliser `id` comme identifiant primaire de la table.
* N'ajoutez pas de colonne qui porte le même nom que la table, et inversement.
* Utilisez toujours les minuscules sauf lorsque cela a du sens, comme dans les noms propres.

### Alias ou corrélations

* Ils devraient avoir un lien avec l'objet ou l'expression dont ils sont l'alias.
* En règle générale, le nom d'une corrélation devrait être composé de la première lettre de chaque mot du nom de l'objet.
* S'il y a déjà une corrélation avec le même nom, alors faire suivre d'un chiffre.
* Inclure systématiquement le mot-clef `AS` facilite la lecture des alias en les rendant explicites.
* Pour les données calculées (`SUM()` ou `AVG()`), utilisez le nom que vous donneriez si c'était une colonne du schéma.

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

### Procédures stockées

* Le nom doit contenir un verbe.
* Ne préfixez pas leurs noms avec `sp_`, tout autre préfixe descriptif ou une notation hongroise.

### Suffixes uniformes

Les suffixes suivants ont un sens universel qui permet que les colonnes puissent être lues et comprises facilement dans du code SQL. Utilisez le suffixe approprié à la situation.

* `_id` — un identifiant unique comme une colonne qui est une clef primaire.
* `_status` — valeur de signalement ou statut de n'importe quel type, comme `publication_status`.
  `publication_status`.
* `_total` — le total ou la somme d'un ensemble de valeurs.
* `_num` — indique que le champ contient un nombre.
* `_name` — signifie que c'est un nom, par exemple `first_name`.
* `_seq` — contient une suite continue de valeurs.
* `_date` — indique que la colonne contient la date de quelque chose.
* `_tally` — un décompte.
* `_size` — la taille de quelque chose, par exemple d'un fichier ou d'un vêtement.
* `_addr` — une adresse de l'enregistrement, pourrait être physique ou virtuelle, par exemple `ip_addr`.

## Syntaxe des requêtes

### Mots réservés

Utilisez toujours les majuscules pour les [mots réservés][reserved-keywords] comme `SELECT` ou `WHERE`.

Il est préférable d'éviter les abréviations de mots-clefs et d'utiliser les versions complètes lorsque disponibles (préférez `ABSOLUTE` à `ABS`).

N'utilisez pas de mot-clef spécifique à un SGBD si un mot-clef SQL ANSI ayant la même fonction existe déjà. Cela aide à rendre le code plus portable.

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### Caractères d'espacement

Pour rendre le code plus facilement lisible, il est important d'utiliser les espaces à bon escient. Ne surchargez pas le code et ne retirez pas les espaces du langage naturel.

#### Espaces

Les espaces devraient être utilisés pour aligner le code afin que les mots-clefs racine finissent tous sur la même limite de caractères. Ceci forme une rivière au milieu facilitant le survol rapide du code et la séparation des mots-clefs et des détails de l'implémentation. Les rivières sont [mauvaises en typographie][rivers], mais aidantes ici.

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
Remarquez que `SELECT`, `FROM`, etc. sont tous alignés à droite alors que les noms de colonne et les détails de l'implémentation sont alignés à gauche.

Incluez des espaces aux endroits suivants (liste non exhaustive) :

* autour des signes d'égalité (` = `)
* après les virgules (`, `)
* autour des apostrophes (` ' `) à part si elles sont dans des parenthèses ou suivies d'une virgule ou d'un point-virgule.

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### Espacement des lignes

Passez toujours à la ligne :

* avant `AND` ou `OR`
* après les points-virgules pour faciliter la lecture en séparant les requêtes
* après chaque définition de mot-clef
* après une virgule quand elle sépare plusieurs colonnes en groupes logiques
* pour séparer le code en sections corrélées, ce qui améliore la lisibilité de grandes portions de code.

Garder tous les mots-clefs alignés à droite et les valeurs alignées à gauche crée un trou uniforme au milieu de la requête. Cela facilite beaucoup le survol rapide de la définition de la requête.

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

### Indentation

Pour s'assurer que le SQL soit lisible, il est important que les standards d'indentation suivants soient respectés.

#### Jointures

Les jointures devraient être indentées de l'autre côté de la rivière et groupées avec une nouvelle ligne quand nécessaire.

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

#### Sous-requêtes

Les sous-requêtes devraient aussi être alignées à droite de la rivière et ensuite déployées selon le même style que n'importe quelle autre requête. Parfois il sera logique d'avoir la parenthèse fermante sur une nouvelle ligne, à la même position de caractère que l'ouvrante — ceci est particulièrement vrai s'il y a des sous-requêtes imbriquées.

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

### Formalismes préférés

* Utilisez `BETWEEN` lorsque c'est possible au lieu de multiples déclarations avec `AND`.
* De la même manière utilisez `IN()` au lieu de multiples clauses `OR`.
* Là où une valeur doit être interprétée avant de quitter la base de données, utilisez l'expression `CASE`. Les expressions `CASE` peuvent être imbriquées pour former des structures logiques plus complexes.
* Évitez l'usage de clauses `UNION` et de tables temporaires lorsque c'est possible. Si le schéma peut être optimisé pour ne plus dépendre de ces fonctionnalités, alors il devrait sûrement l'être.

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

## Syntaxe de `CREATE`

Quand on déclare les informations d'un schéma, il est aussi important de maintenir un code lisible par des humain·es. Pour faciliter ceci, assurez-vous que les définitions de colonnes sont ordonnées et rassemblées là où cela a du sens de le faire.

Indentez les définitions de colonnes par quatre (4) espaces dans la définition `CREATE`.

### Choisir des types de données

* Lorsque c'est possible n'utilisez pas de types de données spécifiques à un SGBD — ceux-ci ne sont pas portables et pourraient ne pas être disponibles dans des versions plus anciennes du même SGBD.
* N'utilisez les types `REAL` ou `FLOAT` que lorsque c'est strictement nécessaire pour des nombres à virgule flottante, autrement préférez toujours `NUMERIC` et `DECIMAL`. Les erreurs d'arrondis de nombres à virgule flottante sont une nuisance !

### Spécifier des valeurs par défaut

* La valeur par défaut doit être du même type que la colonne — si la colonne est déclarée comme `DECIMAL` ne déclarez pas une valeur par défaut comme `INTEGER`.
* Les valeurs par défaut doivent venir après la déclaration des types de données et avant toute expression `NOT NULL`.

### Contraintes et clefs

Les contraintes et leur sous-ensemble, les clefs, sont un élément très important de toute définition de base de données. Elles peuvent vite devenir très difficiles à lire et à comprendre, alors il est important qu'un standard de pratiques soit respecté.

#### Choisir des clefs

Décider quelle(s) colonne(s) seront les clefs dans la définition devrait être une étape très réfléchie car elle aura des conséquences sur les performances et l'intégrité des données.

1. La clef devrait toujours être unique dans une certaine mesure.
2. Il faut garantir la cohérence en termes de type de données pour la valeur dans l'ensemble du schéma, et une probabilité faible que ce type change à l'avenir.
3. Est-ce que la valeur peut être validée par un format standard (comme un publié par ISO) ? Cela encourage la conformité avec le point 2.
4. Garder la clef aussi simple que possible tout en n'ayant pas peur d'utiliser des clefs composées lorsque nécessaire.

Il s'agit d'un acte d'équilibrage raisonné et réfléchi à effectuer lors de la définition d'une base de données. Il est toujours possible d'apporter des changements aux définitions pour les garder à jour si les besoins évoluent à l'avenir.

#### Définir des contraintes

Une fois que les clefs sont décidées, il est possible de les définir dans le système en utilisant des contraintes ainsi que la validation des valeurs des champs.

##### Généralités

* Les tables doivent avoir au moins une clef pour être complètes et utiles.
* Les contraintes devraient avoir un nom personnalisé, à part pour `UNIQUE`, `PRIMARY KEY` et `FOREIGN KEY` pour lesquelles le SGBD fournit en général automatiquement des noms suffisamment intelligibles.

##### Disposition et ordre

* Spécifiez la clef primaire juste après l'expression `CREATE TABLE`.
* Les contraintes devraient être définies directement sous la colonne à laquelle elles correspondent. Indentez la contrainte afin qu'elle s'aligne à la droite du nom de la colonne.
* Si c'est une contrainte multi-colonnes alors essayez de la placer aussi proche que possible des deux définitions de colonnes, et en dernier recours à la fin de la définition `CREATE TABLE`.
* Si c'est une contrainte de table qui s'appliquer à l'entièreté de la table, alors elle devrait aussi apparaître à la fin.
* Utilisez l'ordre alphabétique : `ON DELETE` vient avant `ON UPDATE`.
* Si cela a du sens, alignez chaque aspect de la requête sur la même position de caractère. Par exemple toutes les définitions `NOT NULL` pourraient débuter à la même position de caractère. Ce n'est ni difficile, ni rapide, mais cela rend le code bien plus facile à analyser et lire.

##### Validation

* Utilisez les contraintes `LIKE` et `SIMILAR TO`  pour assurer l'intégrité des chaînes de caractères dont le format est inconnu.
* Quand la plage maximum d'une valeur numérique est connue, elle doit être écrite comme un `CHECK()` de plage pour empêcher des valeurs incorrectes d'être insérées dans la base de données ou la troncature silencieuse d'une donnée trop grande par rapport à la définition de la colonne. Au minimum, elle devrait vérifier que la valeur est supérieure à zéro dans la plupart des cas.
* Les contraintes `CHECK()` devraient être gardées dans des clauses séparées pour faciliter le débugage.

##### Exemple

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

### Designs à éviter

* Les principes du design orienté objet ne se transposent pas aux designs de bases de données relationnelles — évitez cette erreur.
* Placer la valeur dans une colonne et les unités dans une autre colonne. La colonne devrait rendre les unités évidentes pour prévenir le besoin d'associer des colonnes après-coup dans l'application. Utilisez `CHECK()` pour assurer qu'une donnée valide soit insérée dans la colonne.
* Les tables [Entité-Attribut-Valeur][eav] — utilisez un produit spécialisé pour gérer de tels schémas.
* Séparer des données qui devraient être dans une table parmi plusieurs tables à cause de préoccupations arbitraires comme un archivage temporel ou la localisation dans une organisation internationale. Plus tard les requêtes doivent fonctionner à travers de multiples tables avec `UNION` plutôt que simplement interroger une table.

## Annexe

### Référence des mots-clefs réservés

Une liste des mots-clefs réservés de ANSI SQL (92, 99 et 2003), MySQL 3 à 5.x, PostgreSQL 8.1, MS SQL Server 2000, MS ODBC et Oracle 10.2.

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

### Types de données des colonnes

Voici quelques types de données de colonnes suggérés pour une compatibilité maximale entre SGBD.

#### Types de chaînes de caractères

* CHAR
* CLOB
* VARCHAR

#### Types numériques

* Types numériques exacts
    * BIGINT
    * DECIMAL
    * DECFLOAT
    * INTEGER
    * NUMERIC
    * SMALLINT
* Types numériques approximatifs
    * DOUBLE PRECISION
    * FLOAT
    * REAL

#### Types temporels

* DATE
* TIME
* TIMESTAMP

#### Types binaires

* BINARY
* BLOB
* VARBINARY

#### Types additionnels

* BOOLEAN
* INTERVAL
* XML


[simon]: https://www.simonholywell.com/?utm_source=sqlstyle.guide&utm_medium=link&utm_campaign=md-document
    "SimonHolywell.com"
[issue]: https://github.com/treffynnon/sqlstyle.guide/issues
    "Tickets du SQL style guide sur GitHub"
[fork]: https://github.com/treffynnon/sqlstyle.guide/fork
    "Forker SQL style guide sur GitHub"
[pull]: https://github.com/treffynnon/sqlstyle.guide/pulls/
    "Pull requests de SQL style guide sur GitHub"
[celko]: https://www.amazon.com/gp/product/0120887975/ref=as_li_ss_tl?ie=UTF8&linkCode=ll1&tag=treffynnon-20&linkId=9c88eac8cd420e979675c815771313d5
    "SQL Programming Style (The Morgan Kaufmann Series in Data Management Systems) de Joe Celko"
[dl-md]: https://raw.githubusercontent.com/treffynnon/sqlstyle.guide/gh-pages/_includes/sqlstyle.guide.md
    "Télécharger le guide au format Markdown"
[iso-8601]: https://en.wikipedia.org/wiki/ISO_8601
    "Wikipédia : ISO 8601"
[rivers]: https://practicaltypography.com/one-space-between-sentences.html
    "Typography pratique : un espace entre les phrases"
[reserved-keywords]: #reserved-keyword-reference
    "Référence des mots-clefs réservés"
[eav]: https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model
    "Wikipédia : Entity–attribute–value model"
[sqlstyleguide]: https://www.sqlstyle.guide/
    "SQL style guide par Simon Holywell"
[licence]: https://creativecommons.org/licenses/by-sa/4.0/deed.fr
    "Creative Commons Attribution - Partage dans les Mêmes Conditions 4.0 International"
