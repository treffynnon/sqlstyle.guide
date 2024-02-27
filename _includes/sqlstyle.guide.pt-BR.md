# Guia de estilo SQL

## Visão geral

Você pode utilizar estas diretrizes, [fazer um fork][fork] ou criar
suas próprias - a chave aqui é escolher um estilo e seguir. Para sugerir
alterações ou correções de bugs, por favor abra uma [issue][issue] ou faça um
[pull request][pull] no GitHub.

Estas diretrizes foram desenhadas em conformidade com o livro
[SQL Programming Style][celko] de Joe Celko, para serem adotadas mais facilmente
por equipes que já leram o livro. Em relação ao livro, este guia é um pouco mais
opinativo em algumas áreas e mais tranquilo em outras. Certamente é
mais sucinto que [o livro de Celko][celko], que contém anedotas e raciocínios por
trás de cada regra.

É fácil incluir esse guia no [formato Markdown][dl-md] como parte do código
base de um projeto, ou fazer uma referência a esta página para que qualquer um
no projeto possa ler livremente.

O Guia De Estilo SQL por [Simon Holywell][simon] é licenciado sob a
[Creative Commons Attribution-ShareAlike 4.0 International License][licence].
Baseado no trabalho em [https://www.sqlstyle.guide][sqlstyleguide].

## Geral

### Faça

* Utilize identificadores e nomes consistentes e descritivos.
* Tenha critério ao utilizar espaços em branco e indentação para melhorar
  a legibilidade do código.
* Armazene informações de data e hora compatíveis com [ISO-8601][iso-8601]
  (`YYYY-MM-DDTHH:MM:SS.SSSSS`).
* Por questões de portabilidade, tente utilizar apenas funções SQL padrão no lugar
  de funções específicas de servidores SQL de fornecedores.
* Mantenha o código sucinto e desprovido de SQL redundante—como adição de aspas
  e parênteses desnecessários, ou cláusulas WHERE que podem ser derivadas.
* Inclua comentários no código SQL quando necessário. Utilize o estilo C abrindo
  com `/*` e fechando com `*/` onde possível. Onde não for, preceda os
  comentários com `--` e termine com uma nova linha.

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

### Evite

* camelCase—difícil de se analisar rapidamente.
* Prefixos descritivos ou notação húngara como `sp_` ou `tbl`.
* Plurais—utilize termos coletivos onde possível. Por exemplo,
  `pessoal` ao invés de `funcionários` ou `pessoa` no lugar de `indivíduos`.
* Identificadores entre aspas—caso necessário, utilize as aspas duplas SQL92
  por questões de portabilidade (dependendo do fornecedor, pode ser necessário
  configurar seu servidor SQL para ativar o suporte).
* Princípios de design orientado a objetos não devem ser aplicados ao SQL ou
  a estrutura de bancos de dados.

## Convenções de nomenclatura

### Geral

* Tenha certeza que o nome é único e não é uma [palavra-chave reservada][reserved-keywords].
* Mantenha o tamanho máximo em 30 bytes—na prática isso são
  30 caracteres, a não ser que esteja utilizando um conjunto de
  caracteres multi-byte.
* Nomes devem começar com uma letra e não devem terminar com underscore.
* Utilize apenas letras, números e underscores em nomes.
* Evite o uso de múltiplos underscores consecutivos—eles podem ser difíceis de
se ler.
* Utilize underscores onde você normalmente incluiria um espaço
  (primeiro nome se torna `primeiro_nome`).
* Evite abreviações. Se precisar utilizá-las, tenha certeza de que serão
  amplamente compreendidas.

```sql
SELECT first_name
  FROM staff;
```

### Tabelas

* Utilize um nome coletivo ou menos idealmente, plurais. Por exemplo,
  (em ordem de preferência) `pessoal` e `empregados`.
* Não utilize prefixos com `tbl` ou qualquer outro prefixo descritivo ou notação
  húngara.
* Nunca dê a uma tabela o mesmo nome de uma das suas colunas e vice versa.
* Evite quando possível concatenar dois nomes de tabelas para criar o nome de
  uma tabela de relacionamento. No lugar de `mecanicos_de_carro`,
  prefira `servicos`.

### Colunas

* Sempre utilize nomes no singular.
* Quando possível, evite usar apenas `id` como identificador primário da tabela.
* Não adicione uma coluna como o mesmo nome da tabela e vice versa.
* Sempre utilize caixa baixa, exceto onde capitalização fizer sentido (como
  em nomes próprios).

### Aliasing ou correlações

* Deve se relacionar de alguma forma com o objeto ou expressão em que o aliasing
  está sendo aplicado.
* Como regra geral, o nome da correlação deve ser a primeira letra de cada palavra
  do nome do objeto.
* Se já existe uma correlação com o mesmo nome, acrescente um número.
* Sempre inclua a palavra-chave `AS`—isso torna o aliasing explícito e mais fácil de ler.
* Para dados computados (`SUM()` ou `AVG()`), utilize o nome que você daria se
  fosse uma coluna definida no schema.

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

### Stored procedures

* O nome deve conter um verbo.
* Não adicione `sp_` ou qualquer outro prefixo descritivo ou
  notação húngara.

### Sufixos uniformes

Os sufixos seguintes tem sentido universal, garantindo que as colunas possam ser
lidas e compreendidas facilmente no código SQL. Utilize os sufixos corretos
onde for apropriado.

* `_id`—um identificador único, como uma coluna que é a chave primária.
* `_status`—flag value ou outro status de qualquer tipo, como `publication_status`.
* `_total`—o total ou a soma de uma coleção de valores.
* `_num`—indica que o campo contém qualquer tipo de número.
* `_name`—significa um nome, como `first_name`.
* `_seq`—contém uma sequência contígua de valores.
* `_date`—indica uma coluna que contém a data de alguma coisa.
* `_tally`—uma contagem.
* `_size`—o tamanho de algo, como o tamanho de um arquivo ou de uma roupa.
* `_addr`—um endereço. Pode ser físico ou intangível, como por exemplo `ip_addr`.

## Sintaxe de Queries

### Palavras reservadas

Sempre utilize caixa alta para [palavras-chave reservadas][reserved-keywords],
como `SELECT` e `WHERE`.

É melhor evitar palavras-chave abreviadas; utilize suas variações por extenso
(use `ABSOLUTE` ao invés de `ABS`).

Não utilize palavras-chave de um fornecedor específico de banco de dados. Onde for
possível, utilize palavras-chave reservadas ANSI SQL que tenham a mesma função.
Isso ajuda na portabilidade do código.

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### Espaços em branco

Para tornar o código mais fácil de ler, é importante o uso correto do espaçamento.
Não insira código ou remova espaços em linguagem natural.

#### Espaços

Espaços devem ser utilizados para alinhar o código, de forma que as palavras-chave
fiquem sempre no mesmo limite. Isso forma um rio tipográfico, tornando fácil visualizar
o código e separar as palavras-chave dos detalhes de implementação.
Rios são [ruins na tipografia][rivers], mas úteis aqui.

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

Note que o `SELECT`, `FROM`, etc. estão todos alinhados à direita, enquanto
os nomes das colunas em si e os detalhes de implementação estão alinhados à
esquerda.

Sempre inclua espaços:

* antes e depois do símbolo igual (`=`)
* depois de vírgulas (`,`)
* ao redor de apóstrofes (`'`) caso não estejam entre parênteses ou com uma vírgula
  ou ponto e vírgula.

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### Espaçamento de linhas

Sempre inclua novas linhas/espaço vertical:

* antes de `AND` ou `OR`
* depois de vírgulas, separando as queries para facilitar a leitura
* depois de cada definição de palavras-chave
* depois de um ponto, quando separando múltiplas colunas em grupos lógicos
* para separar código em seções relacionadas, o que ajuda na legibilidade de
  grandes pedaços de código.

Manter todas as palavras-chave alinhadas à direita e os valores alinhados
à esquerda cria uma lacuna no meio da query. Isso torna a análise da definição
da query mais fácil e rápida.

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

### Indentação

Para garantir que o SQL seja legível, é importante que padrões de indentação
sejam seguidos.

#### Joins

Joins devem ser indentados do outro lado do rio tipográfico e agrupados
com uma nova linha quando necessário.

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

#### Subqueries

Subqueries também devem ser alinhadas à direita do rio e seguir o mesmo estilo
de qualquer outra query. As vezes faz sentido ter o parêntese de fechamento em
uma nova linha na mesma posição que o parêntese de abertura foi definido—isso é
especialmente importante onde você tem subqueries aninhadas.

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

* Faça uso de `BETWEEN` onde possível, ao invés de combinar múltiplos `AND`.
* De forma similar, utilize `IN()` ao invés de múltiplas cláusulas `OR`.
* Onde um valor precisa ser interpretado antes de ser retornado pelo banco de
  dados, use a expressão `CASE`. Cláusulas `CASE` podem ser aninhadas para formar
  estruturas lógicas mais complexas.
* Evite o uso de cláusulas  `UNION` e tabelas temporárias quando possível. Se
  o schema pode ser otimizado removendo a dependência desses recursos, é melhor
  otimizar.

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

## Sintaxe Create

Enquanto declarando informação do schema, é importante manter um código humanamente
legível. Para garantir isso, assegure-se de que as definições das colunas estejam
ordenadas e agrupadas onde fizer sentido.

Indente definições de coluna com quatro (4) espaços dentro da definição `CREATE`.

### Escolhendo tipos de dados

* Onde possível, não utilize tipos de dados específicos de fornecedores de banco
  de dados—esses formatos geralmente não são portáteis e podem estar indisponíveis
  em versões antigas do banco de dados do mesmo fornecedor.
* Utilize os tipos `REAL` ou `FLOAT` apenas onde o uso de pontos flutuantes for
  estritamente necessário, do contrário prefira sempre `NUMERIC` e `DECIMAL`.
  Erros de ponto flutuante são um transtorno!

### Especificando valores padrão

* O valor padrão deve ser do mesmo tipo da coluna—se uma coluna foi declarada
  como `DECIMAL`, não force um `INTEGER` como valor padrão.
* Valores padrão devem seguir a mesma declaração do tipo de dados e vir antes
  de qualquer `NOT NULL`.

### Constraints e keys

Constraints e keys são componentes muito importantes na definição de qualquer
banco de dados. Elas podem se tornar difíceis de ler e desenvolver raciocínios,
por isso é importante também seguir um conjunto de diretrizes.

#### Escolhendo keys

Deve-se decidir cuidadosamente na definição a(s) coluna(s) que serão keys,
já que afetará o desempenho e a integridade dos dados.

1. A key deve ser única em algum nível.
2. O tipo de dado para o valor deve ser consistente através do schema e ter
   baixa probabilidade de ser alterado no futuro.
3. O valor pode ser validado em relação a um formato padrão (como os publicados
   pela ISO)? Incentiva-se a conformidade com o ponto 2.
4. Mantenha a key o mais simples possível, não tenha medo de utilizar keys compostas
   se necessário.

Trata-se de um ato de equilíbrio a ser feito na definição de um banco de dados.
Se os requisitos evoluírem no futuro, será possível fazer alterações nas
definições para mantê-las atualizadas.

#### Definindo constraints

Uma vez que as keys foram decididas, é possível defini-las no sistema
utilizando constraints juntamente com validação do valor do campo.

##### Geral

* Tabelas precisam ter pelo menos uma key para serem completas e utilizáveis.
* Constraints devem ter um nome personalizado exceto por `UNIQUE`, `PRIMARY KEY`
  e `FOREIGN KEY`, onde o fornecedor do banco de dados comumente gera nomes
  inteligíveis automaticamente.

##### Layout e ordenação

* Especifique a primary key primeiro, logo após a declaração `CREATE TABLE`.
* Constraints devem ser definidas diretamente abaixo da coluna correspondente.
  Indente a constraint alinhando à direita do nome da coluna.
* Se é uma constraint que se refere a múltiplas colunas, considere colocá-la
  o mais próximo possível à definição das colunas. Se for complicado fazer isso,
  como último recurso as inclua no fim da declaração `CREATE TABLE`.
* Se for uma constraint que se aplica a toda a tabela, ela também deve aparecer
  no fim.
* Utilize ordem alfabética, onde `ON DELETE` vem antes de `ON UPDATE`.
* Se fizer sentido, alinhe cada aspecto da query na mesma posição de caracteres.
  Por exemplo, todas as definições `NOT NULL` podem começar verticalmente alinhadas.
  Pode dar trabalho, mas torna o código muito mais fácil de se examinar e ler.

##### Validação

* Utilize as constraints `LIKE` e `SIMILAR TO` para garantir a integridade de
  strings que tenham formato conhecido.
* Onde a extensão final de um valor numérico é conhecida, deve-se utilizar
  `CHECK()` para evitar que valores incorretos sejam inseridos no banco de dados,
  ou que o truncamento silencioso dos dados seja muito grande para caber no tamanho
  definido na coluna. No mínimo, deve-se verificar na maioria dos casos se o valor
  é maior que zero.
* Constraints `CHECK()` devem ser mantidas em cláusulas separadas para facilitar
  o debugging.

##### Exemplo

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

### Designs a se evitar

* Princípios de design orientado a objetos não se traduzem efetivamente ao design
  de bancos de dados relacionais—evite essa armadilha.
* Colocar o valor em uma coluna e suas unidades em outra coluna. A coluna deve
  tornar as unidades evidentes para evitar a necessidade de se combinar colunas
  novamente mais tarde na aplicação. Utilize `CHECK()` para garantir que dados
  válidos sejam inseridos na coluna.
* Tabelas [EAV (Entity Attribute Value)][eav]—utilize um produto especializado
  em para manipular esses dados sem schema.
* Divisão de dados que devem estar em uma tabela em muitas, por questões
  arbitrárias como arquivamento baseado em tempo ou localização em uma organização
  multinacional. Assim, consultas posteriores deverão trabalhar com múltiplas tabelas
  utilizando `UNION` ao invés consultar apenas uma única tabela.

## Apêndice

### Referência de palavras-chave reservadas

Uma lista de palavras-chave reservadas. ANSI SQL (92, 99 and 2003),
MySQL 3 até 5.x, PostgreSQL 8.1, MS SQL Server 2000, MS ODBC e Oracle 10.2.

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
[dl-md]: https://raw.githubusercontent.com/treffynnon/sqlstyle.guide/gh-pages/_includes/sqlstyle.guide.pt-BR.md
    "Download the guide in Markdown format"
[iso-8601]: https://en.wikipedia.org/wiki/ISO_8601
    "Wikipedia: ISO 8601"
[rivers]: https://practicaltypography.com/one-space-between-sentences.html
    "Practical Typography: one space between sentences"
[reserved-keywords]: #reserved-keyword-reference
    "Reserved keyword reference"
[eav]: https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model
    "Wikipedia: Entity–attribute–value model"
[sqlstyleguide]: https://www.sqlstyle.guide
    "SQL style guide by Simon Holywell"
[licence]: https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR
    "Creative Commons Attribution-ShareAlike 4.0 International License"
