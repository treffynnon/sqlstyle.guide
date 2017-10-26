# SQL style guide SQL樣式指南

這篇文檔翻譯自以[署名-相同方式共享 4.0 國際協議][licence-zh]發布的[http://www.sqlstyle.guide][sqlstyleguide]，譯文以原文同樣的協議發布。

## Overview 綜述

你可以直接使用這些指導方針，或者[fork][fork]後創建自己的版本——最重要的是選擇一套方針並嚴格遵守它。歡迎通過提交[issue][issue]或[pull request][pull]來提交建議或修覆bug。

為了讓閱讀了Joe Celko的《[SQL ProgrammingStyle][celko]》的團隊能更容易采用這套規則， 這套原則被設計成與該書的兼容的形式。該指南在某些領域嚴格一些，在另一些領域松懈一些。 當然該指南比Celko的書更簡潔一些，因為Celko的書包含了一些趣聞和每一條原則後的理由。

將該文檔的[Markdown format][dl-md]格式添加到項目代碼庫中或將該頁面的鏈接發送給所有項目的參與者要比傳閱實體書容易得多。

[Simon Holywell][simon]所著的《SQL樣式指南》以[署名-相同方式共享 4.0 國際協議][licence-zh]發布，改編自[http://www.sqlstyle.guide][sqlstyleguide]。

## General 一般原則

### Do 應該做的事情

* 使用一致的、敘述性的名稱。
* 靈活使用空格和縮進來增強可讀性。
* 存儲符合[ISO-8601][iso-8601]標準的日期格式(`YYYY-MM-DD HH:MM:SS.SSSSS`)。
* 最好使用標準SQL函數而不是特定供應商的函數以提高可移植性。
* 保證代碼簡潔明了並消除多余的SQL——比如非必要的引號或括號，或者可以推導出的多余`WHERE`語句。
* 必要時在SQL代碼中加入註釋。優先使用C語言式的以`/*`開始以`*/`結束的塊註釋，或使用以`--`開始的行註釋。

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

### Avoid 應避免的事情

* 駝峰命名法——它不適合快速掃描。
* 描述性的前綴或匈牙利命名法比如`sp_`或`tbl`。
* 覆數形式——盡量使用更自然的集合術語。比如，用“staff”替代“employees”，或用“people”替代“individuals”。
* 需要引用號的標識符——如果你必須使用這樣的標識符，最好堅持用SQL92的雙引號來提高可移植性。
* 面向對象編程的原則不該應用到結構化查詢語言或數據庫結構上。

## Naming conventions 命名慣例

### General 一般原則

* 保證名字獨一無二且不是[保留字][reserved-keywords]。
* 保證名字長度不超過30個字節。
* 名字要以字母開頭，不能以下劃線結尾。
* 只在名字中使用字母、數字和下劃線。
* 不要再名字中出現連續下劃線——這樣很難辨認。
* 在名字中需要空格的地方用下劃線代替。
* 盡量避免使用縮寫詞。使用時一定確定這個縮寫簡明易懂。

```sql
SELECT first_name
  FROM staff;
```

### Tables 表名

* 用集群名稱，或在不那麽理想的情況下，覆數形式。如`staff`和`employees`。
* 不要使用類似`tbl`或其他的描述性的前綴或匈牙利命名法。
* 表不應該同它的列同名，反之亦然。
* 盡量避免連接兩個表的名字作為關系表（relationship table）的名字。與其使用`cars_mechanics`做表名不如使用`services`。

### Columns 列名

* 總是使用單數形式。
* 避免直接使用`id`做表的主標識符。
* 避免列名同表名同名，反之亦然。
* 總是使用小寫字母，除非是特殊情況，如專有名詞。

### Aliasing or correlations 別名與關聯名

* 應該與它們別名的對象或與它們代表的表達式相關聯。
* 一般來說，關聯名應該是對象名的第一個字母。
* 如果已經有相同的關聯名了，那麽在關聯名後加一個數字。
* 總是加上`AS`關鍵字，因為這樣的顯示聲明易於閱讀。
* 為計算出的數據命名時，用一個將這條數據存在表裏時會使用的列名。

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

### Stored procedures 過程名

* 名字一定要包含動詞。
* 不要附加`sp_`或任何其他這樣的敘述性前綴或使用匈牙利表示法。

### Uniform suffix 統一的後綴

下列後綴有統一的意義，能保證SQL代碼更容易被理解。在合適的時候使用正確的後綴。

* `_id` 獨一無二的標識符，如主鍵。
* `_status` 標識值或任何表示狀態的值，比如`publication_status`。
* `_total` 總和或某些值的和。
* `_num` 表示該域包含數值。
* `_name` 表示名字。
* `_seq` 包含一系列數值。
* `_date` 表示該列包含日期。
* `_tally` 計數值。
* `_size` 大小，如文件大小或服裝大小。
* `_addr` 地址，有形的或無形的，如`ip_addr`

## Query syntax 查詢語句

### Reserved words 保留字

保留字總是大寫，如`SELECT`和`WHERE`。

最好使用保留字的全稱而不是簡寫，用`ABSOLUTE`而不用`ABS`。

當標準ANSI SQL關鍵字能完成相同的事情時，不要使用數據庫服務器相關的關鍵字，這樣能增強可移植性。

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### White space 空白字符

正確地使用空白字符對清晰的代碼十分重要。不要把代碼堆再一起或移除自然語言中的空格。

#### Spaces 空格

用空格使根關鍵字都結束在同一列上。在代碼中形成一個從上到下的“川流”，這樣幫助讀者快速掃描代碼並將關鍵字和實現細節分開。川流在排版時應該避免，但是對書寫SQL語句是有幫助的。

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
  GROUP BY b.species_name, b.observation_date)
```

註意`WHERE`和`FROM`等關鍵字，都右對齊，而真實的列名都左對齊。

註意下列情況總是加入空格：

* 在等號前後（`=`）
* 在逗號後（`,`）
* 單引號前後（`'`），除非單引號後面是括號、逗號或分號

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### Line spacing 換行

總是換行的情況：

* 在`AND`或`OR`前。
* 在分號後（分隔語句以提高可讀性）。
* 在每個關鍵詞定以後。
* 將多個列組成一個邏輯組時的逗號後。
* 將代碼分隔成相關聯的多個部分，幫助提高大段代碼的可讀性。

讓所有的關鍵字右對齊，讓所有的值左對齊，在查詢語句中間留出一個空隙。這樣能提高速讀代碼的速讀。


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

### Identation 縮進

為確保SQL的可讀性，一定要遵守下列規則。

### Joins Join語句

Join語句應該縮進到川流的另一側並在必要的時候添加一個換行。


```sql
SELECT r.last_name
  FROM riders AS r
       INNER JOIN bikes AS b
       ON r.bike_vin_num = b.vin_num
          AND b.engines > 2

       INNER JOIN crew AS c
       ON r.crew_chief_last_name = c.last_name
          AND c.chief = 'Y';
```

#### Subqueries 子查詢

子查詢應該在川流的右側對齊並使用其他查詢相同的樣式。有時候將右括號單獨置於一行並同與它配對的左括號對齊是有意義的——尤其是當存在嵌套子查詢的時候。

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

### Preferred formalisms 推薦的形式

* 盡量使用`BETWEEN`而不是多個`AND`語句。
* 同樣地，使用`IN()`而不是多個`OR`語句。
* 當數據輸出數據庫時需要處理時，使用`CASE`表達式。`CASE`語句能嵌套形成更覆雜的邏輯結構。
* 盡量避免`UNION`語句和臨時表。如果數據庫架構能夠不靠這些語句運行，那麽多數情況下它就不應該依靠這些語句。


```sql
SELECT CASE postcode
       WHEN 'BN1' THEN 'Brighton'
       WHEN 'EH1' THEN 'Edinburgh'
       END AS city
  FROM office_locations
 WHERE country = 'United Kingdom'
   AND opening_time BETWEEN 8 AND 9
   AND postcode IN ('EH1', 'BN1', 'NN1', 'KW1')
```

## Create syntax 創建語句

聲明模式信息時維護可讀代碼也很重要。所以列定義的順序和分組一定要有意義。

在`CREATE`定義中，每列要縮進4個空格。

### Choosing data types 選擇數據類型

* 盡量不使用供應商相關的數據類型——這些類型可不能能在老系統上使用。
* 只在真的需要浮點數運算的時候才使用`REAL`和`FLOAT`類型，否則使用`NUMERIC`和`DECIMAL`類型。浮點數舍入誤差是個麻煩。

### Specifying default values 指定默認類型

* 默認值一定與列的類型相同——如果一個列的類型是`DECIMAL`那麽就不要使用`INTEGER`類型作為默認值。
* 默認值要緊跟類型聲明並在`NOT NULL`聲明前。

### Constraints and keys 約束和鍵

約束和鍵是構成數據庫系統的重要組成部分。它們能很快地變得難以閱讀和理解，所以遵從指導方針是很重要的。

#### Choosing keys 選擇鍵

設計時應該謹慎選擇構成鍵的列，因為鍵既明顯影響著性能和數據完整性。

1. 鍵在某種程度上應該是獨一無二的。
2. 該值在不同表中的類型應該相同並且盡量不會更改。
3. 該值是否會無法通過某種標準格式（如ISO發布的標準）？如
4. 盡量讓鍵保持簡單，但在適當情況下不要害怕使用覆合鍵。

以上是定義數據庫時合乎邏輯的平衡做法。當需求變更時，鍵也應該根據情況更新。

#### Defining constraints 定義約束

確定鍵後，就可以用約束和字值段驗證來定義它們。

##### General 概述

* 表至少需要一個鍵來保證其完整性和可用性。
* 約束應該有名字，除了`UNIQUE`、`PRIMARY KEY`和`FOREIGN KEY`之外。

##### Layout and order 布局和順序

* 在`CREATE TABLE`語句後先定義主鍵。
* 約束的定義應該緊跟它相應的列的定義後。
* 如果該約束與多個列相關，那麽讓它盡量離與其相關的列距離越近越好。實在不行就講它放在表定義的最後。
* 如果是與整個表相關聯表級別的約束，那麽就將放在表的定義的最後。
* 按照字母順序安排定義，`ON DELETE`排在`ON UPDATE`前。
* 有道理的話，把所有相關的語句對齊。比如，把所有`NOT NULL`定義對齊到同一列。雖然這樣的做法有些慢，但是能提高可讀性。

##### Validation 校驗

* 用`LIKE`和`SIMILAR TO`約束來保證格式已知字符串的數據完整性。
* 當數字的值的範圍可以確定時，用`CHECK()`來防止錯誤的值進入數據庫或被錯誤地轉換。大部分情況下至少要確認值要大於零。
* `CHECK()`約束應該在單獨的語句中以便debug。

##### Example

```sql
CREATE TABLE staff (
    PRIMARY KEY (staff_num),
    staff_num      INT(5)       NOT NULL,
    first_name     VARCHAR(100) NOT NULL,
    pens_in_drawer INT(2)       NOT NULL,
                   CONSTRAINT pens_in_drawer_range
                   CHECK(pens_in_drawer >= 1 AND pens_in_drawer < 100)
);
```

### Design to avoid

* 面向對象設計思想並不適用於關系型數據庫——避免這個陷阱。
* 將值存入一列並將單位存在另一列。列的定義應該讓自己的單位不言自明以避免在應用內進行合並。使用`CHECK()`來保證數據庫中的數據是合法的。
* [EAV (Entity Attribute Value)][eav]表——用特殊的產品來處理無模式數據。
* 因為某些原因（如為了歸檔、為了劃分跨國公司的區域）將能合並在一起的表分開。這樣的設計導致以後必須使用`UNION`操作而不能直接查詢一個表。


## 附錄

### 保留字參考

下表包含了ANSI SQL (92, 99 和 2003)、MySQL 3到5.x、PostgreSQL 8.1、MS SQL Server 2000、MS ODBC和Oracle 10.2中的關鍵字。

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
[dl-md]: https://raw.githubusercontent.com/treffynnon/sqlstyle.guide/gh-pages/_includes/sqlstyle.guide.zh-TW.md
    "Download the guide in Markdown format"
[iso-8601]: https://en.wikipedia.org/wiki/ISO_8601
    "Wikipedia: ISO 8601"
[rivers]: http://practicaltypography.com/one-space-between-sentences.html
    "Practical Typography: one space between sentences"
[reserved-keywords]: #reserved-keyword-reference
    "Reserved keyword reference"
[eav]: https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model
    "Wikipedia: Entity–attribute–value model"
[sqlstyleguide]: http://www.sqlstyle.guide
    "SQL style guide by Simon Holywell"
[licence-zh]: https://creativecommons.org/licenses/by-sa/4.0/deed.zh_TW
    "姓名標示-相同方式分享 4.0 國際"
