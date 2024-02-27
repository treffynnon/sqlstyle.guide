# SQL 스타일 가이드

## Overview

여러분은 이 가이드라인들을 이용하거나, [fork][fork] 하거나, 여러분만의 가이드라인을 만들 수 
있습니다. 여기서 핵심은 일관된 스타일을 선택하고 그것을 고수하는 것입니다. 가이드라인의 변경을 
제안하거나 버그를 수정하려면 GitHub에서 [issue][issue] 또는 [pull request][pull]를 여십시오.

이 가이드라인들은 Joe Celko의 [SQL Programming Style][celko] 책 내용과 호환되어 이미 해당 
책을 읽은 팀들이 더 채택하기 쉽도록 설계되었습니다. 이 가이드는 일부분에서는 조금 주관적이며, 
일부분에서는 대중적입니다. 이 가이드는 각 규칙을 설정한 배경에 대한 일화와 추론을 글로 풀어낸 
[Celko의 책][celko]에 비해서는 확실히 간결합니다.

이 가이드를 [Markdown 형식][dl-md]으로 프로젝트 코드 베이스의 일부로 포함하거나, 프로젝트의 
모든 참여자가 자유롭게 읽을 수 있도록 이 글을 참조하는 것은 실제 책을 읽는 것보다 훨씬 더 쉽습니다.

[Simon Holywell][simon]의 SQL style guide는 [Creative Commons Attribution-ShareAlike
4.0 International License][licence]에 따라 사용이 허가되었습니다. 
[https://www.sqlstyle.guide/][sqlstyleguide]의 작업을 기반으로 합니다.

## General

### Do

* 일관적이고 기술적인(descriptive) 식별자와 이름을 사용하라.
* 가독성을 위해 공백과 들여쓰기를 신중하게 사용하라.
* [ISO 8601][iso-8601]를 따르는 시간 및 날짜 정보를 저장하라.
  (`YYYY-MM-DDTHH:MM:SS.SSSSS`)
* 이식성을 위해 벤더-특화된 함수 대신 표준 SQL 함수만을 사용하라.
* 불필요한 따옴표나 괄호, 다른 구문을 통해 파생될 수 있는 `WHERE`절과 같은 불필요한 SQL을 피하고
  간결하게 유지하라.
* 필요한 경우 SQL 코드에 주석을 포함하라. 가능한 경우 주석 앞에 C 스타일의 주석 열기(`/*`)와 
  주석 닫기(`*/`)를 사용하라. 가능하지 않은 경우 주석 앞에 `--`를 붙이고, 새로운 줄로 마무리하라.

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

### Avoid

* camelCase. — 빠르게 스캔하기 어렵다.
* 설명 접두사 또는 `sp_`, `tbl`과 같은 헝가리안 표기법.
* 복수. — 가능한 경우 더 자연스러운 집합 명사를 사용하라. 예를 들어, `employees` 대신 `staff`를,
  `individuals` 대신 `people`을 사용하라.
* Quoted identifiers — 사용해야 하는 경우, 이식성을 위해 SQL-92 큰 따옴표를 사용하라. (벤더에
  따라 이를 지원하기 위해 SQL 서버를 구성해야 할 수도 있다.)
* SQL이나 데이터베이스 구조에 객체지향 설계 원칙이 적용되어서는 안된다.

## Naming conventions

### General

* 이름이 고유하며, [예약어][reserved-keywords]가 아닌지 확인하라.
* 길이는 최대 30 bytes로 유지하라. — multi-byte 문자셋을 사용하지 않는 한 30자이다.
* 이름은 문자로 시작해야하며, 밑줄(_)로 끝나지 않는다.
* 이름에는 문자, 숫자, 밑줄만 사용하라.
* 여러 개의 연속된 밑줄의 사용을 피하라. — 가독성이 좋지 않을 수 있다.
* 이름에 자연스럽게 포함되는 공백에 밑줄을 사용하라. (first name은 `first_name`이 된다.)
* 약어를 피하라. 약어를 사용해야 한다면, 일반적으로 이해되는지 확인하라.

```sql
SELECT first_name
  FROM staff;
```

### Tables

* 집합명사를 사용하라. 어려운 경우 덜 이상적이지만 복수 형식을 사용하라. 
  예를 들어, (선호도 순서대로) `staff`, `employees` 이다.
* `tbl` 또는 그 외 다른 설명 접두사 또는 헝가리안 표기법을 접두사로 사용하지 말라.
* 테이블명을 해당 테이블을 구성하는 테이블 컬럼명과 동일하게 지정하지 말라.
* 가능한 경우, 두 개의 테이블 이름을 연결하여 관계 테이블의 이름을 만들지 말라. 
  (`cars_mechanics` 보다 `services`를 선호한다.)

### Columns

* 항상 단수명사를 사용하라.
* 가능한 경우, 단순히 `id`를 테이블의 기본 식별자로 사용하지 말라.
* 해당 테이블명과 동일한 이름의 컬럼을 추가하지 말라.
* 고유명사와 같은 경우가 아니라면, 항상 소문자를 사용하라.

### Aliasing or correlations

* 별칭을 붙이는 개체 또는 표현과 어떤 식으로든 관련있어야 한다.
* 일반적으로 correlation 이름은 개체 이름에 포함된 각 단어의 첫 글자가 되어야 한다.
* 이미 같은 이름의 correlation이 있는 경우, 번호를 붙인다.
* 항상 `AS` 키워드를 붙인다. — 명시적이므로 가독성이 좋다.
* 계산된 값(`SUM()` or `AVG()`)이 스키마에 정의된 컬럼일 경우 이름을 부여하라.

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

* 이름에 동사가 포함되어야만 한다.
* `sp_` 또는 기타 설명 접두사와 헝가리안 표기법을 사용하지 말라.

### Uniform suffixes

아래의 접미사들은 SQL 코드에서 컬럼을 쉽게 읽고 이해할 수 있도록 하는 보편적인 의미를 가지고 
있습니다. 적절한 곳에 올바른 접미사를 사용하십시오.

* `_id` — 기본키와 같은 고유 식별자.
* `_status` — flag 값 또는 기타 다른 유형의 상태값 (ex. `publication_status`).
* `_total` — 어떤 값들의 합계(sum) 또는 총합(total)
* `_num` — 필드에 어떤 종류의 숫자들이 포함되어 있음을 나타냅니다.
* `_name` — 이름을 나타냅니다. (ex. `first_name`)
* `_seq` — 연속적인 값의 시퀀스를 나타냅니다.
* `_date` — 날짜가 포함된 컬럼을 나타냅니다.
* `_tally` — 카운트.
* `_size` — 크기. (ex. file_size 또는 clothing의 크기)
* `_addr` — 물리적인 주소이거나 `ip_addr`와 같은 무형의 주소일 수 있습니다.

## Query syntax

### Reserved words 

`SELECT`, `WHERE`와 같은 [예약어][reserved-keywords]들은 항상 대문자를 사용하십시오.

축약된 키워드의 사용을 피하고, 가능한 경우 전체 길이의 키워드를 사용하는 것이 좋습니다. (`ABS` 보다
`ABSOLUTE`를 선호)

동일한 기능을 수행하는 ANSI SQL 키워드가 있는 경우 특정 데이터베이스 서버 특화된 키워드를 사용하지
마십시오. 이는 코드의 이식성을 높이는 데 도움이 될 것입니다.

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### White space

코드를 더욱 읽기 쉽게 하기 위해서 올바른 위치에 공백을 사용하는 것이 중요합니다. 코드를 복잡하게 
하거나 단어간 자연스러운 공백을 제거하지 마십시오.

#### Spaces

공백은 각 줄의 첫 키워드가 같은 문자 경계에서 끝날 수 있게 코드를 정렬하기 위해서 사용되어야 합니다.
이러한 중간에 강이 흐르는 것과 같은 형태는 독자들이 코드를 쉽게 스캔하고 구현 세부사항과 예약어를 
분리하여 읽을 수 있도록 도와줍니다. 이 같은 강(River)은 [타이핑할 때는 좋지 않지만][rivers], 
가독성 측면에서는 도움이 됩니다.

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

`SELECT`, `FROM` 등은 모두 우측 정렬되며, 컬럼명과 구현과 관련된 세부사항은 좌측 정렬되는 것에 
주목하십시오.

모든 경우에 해당되지는 않지만, 아래의 경우는 항상 공백을 사용합니다.

* 등호(`=`) 전, 후
* 쉼표(`,`) 뒤
* apostrophes(`'`) 전, 후 (괄호 안 또는 쉼표나 세미콜론이 뒤에 오는 경우는 제외)

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### Line spacing

다음의 경우는 항상 새로운 줄/수직 공백을 사용합니다.

* `AND` 또는 `OR` 전
* 세미콜론 뒤 (쿼리를 구분하여 가독성이 좋습니다.)
* 각 키워드 정의 후
* 쉼표 뒤 (여러 개의 컬럼을 논리적 그룹으로 구분할 때)
* 큰 코드 덩어리(large chunks of code)의 가독성을 향상시키기 위해 코드를 관련된 부분으로 분리할
  때

키워드를 우측 정렬, 값을 좌측 정렬하면 쿼리 중간에 일정한 간격이 생성됩니다. 이 또한 쿼리의 정의를
빠르게 스캔하기 더 쉽게 만들어줍니다.

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

SQL 코드를 가독성있게 하려면 아래의 들여쓰기 표준을 지키는 것이 중요합니다.

#### Joins

Join은 강(River)의 반대쪽으로 들여써야 하며, 필요한 경우 새로운 줄을 이용해 그룹화해야 합니다.

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

서브쿼리 또한 강(River)의 우측에 정렬되어야 하며, 다른 쿼리와 동일한 스타일을 따라 작성합니다. 
때때로 닫는 괄호를 새로운 줄의 여는 괄호의 문자 위치와 동일한 위치에 작성하는 것이 좋을 수도 
있습니다. — 이는 특히 중첩된 서브쿼리가 있는 경우에 더욱 그렇습니다.

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

### Preferred formalisms

* 가능한 경우, 여러 개의 `AND` 구문을 결합하기 보다는 `BETWEEN`을 사용하라.
* 비슷한 맥락으로, 여러 개의 `OR` 구문을 결합하기 보다는 `IN()`을 사용하라.
* 데이터베이스단에서 값을 해석해야하는 경우, `CASE` 구문을 사용하라. CASE 구문을 중첩하여 보다 
  복잡한 논리적 구조를 형성할 수 있다.
* 가능한 한 `UNION` 구문과 임시 테이블의 사용을 피하라. 스키마를 최적화함으로써 UNION, 임시 
  테이블의 기능을 대체할 수 있다면 그렇게 해야 할 것이다.

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

## Create syntax

스키마 정보를 선언할 때에도 사람이 읽기 좋은 코드를 유지하는 것은 중요합니다. 이를 가능하게 하기
위해서는 컬럼 정의 부분을 정렬하고 적절하게 그룹화해야 합니다. `CREATE` 구문 내에서 컬럼을 정의할
때에는 4개의 공백을 이용하여 들여쓰기 합니다.

### Choosing data types

* 가능한 경우, 벤더 특화된 데이터 타입을 사용하지 말라. — 이는 이식성이 좋지 않으며, 동일한 벤더의
  구 버전 소프트웨어에서 이용가능하지 않을 수도 있다.
* 엄격한 부동 소수점 연산이 필요한 경우에만 `REAL` 또는 `FLOAT` 타입을 사용하라. 그렇지 않은 경우
 항상 `NUMERIC` 또는 `DECIMAL` 타입을 선호하라. 부동 소수점 반올림 오류는 성가신 일이다!

### Specifying default values

* 기본값은 항상 컬럼의 데이터 타입과 동일해야 한다. — 만약 컬럼이 `DECIMAL`로 선언되어 있다면, 
  `INTEGER` 타입의 기본값을 설정하지 마라.
* 기본값은 데이터 타입 선언 뒤에 작성해야 하며, `NOT NULL` 문 앞에 작성되어야 합니다.

### Constraints and keys

제약조건과 제약조건의 부분집합, 키(key)들은 데이터베이스 정의에서 매우 중요한 구성요소입니다. 
이들은 읽고 추론하기 어려워질 수 있으므로 아래의 표준 가이드라인들을 지키는 것이 중요합니다.

#### Choosing keys

키가 될 컬럼을 결정하는 것은 성능과 데이터 무결성에 영향을 끼칠 수 있으므로 신중하게 고려되어야 
합니다.

1. 키는 어느 정도 고유해야 합니다.
2. 스키마 전체에 걸쳐서 데이터 유형 측면에서 일관성이 있으며, 미래에도 변경될 가능성이 작아야 합니다.
3. 표준 형식(ISO에서 발표한 형식)에 대해 값을 검증할 수 있어야 합니다. 2번 항목을 준수해야 합니다.
4. 키는 가능한 한 단순하게 유지하면서, 필요한 경우 복합키를 사용합니다.

이는 데이터베이스 정의에서 수행되어야 하는 합리적으로 깊게 고려된 균형있는 항목입니다. 미래에 
요구사항이 변경되는 경우, 이 항목들을 준수하면서 데이터베이스 정의를 변경할 수 있습니다.

#### Defining constraints

키로써 사용할 컬럼이 결정되면 필드 값 유효성 검사와 제약조건을 이용해 시스템 상에서 키를 정의할 수 
있습니다.

##### General

* 테이블에는 하나 이상의 키가 있어야 완전하고 유용합니다.
* 데이터베이스 벤더에서 일반적으로 충분히 이해할 수 있는 이름을 자동적으로 제공하는 `UNIQUE`, 
  `PRIMARY KEY`, `FOREIGN KEY`를 제외한 제약조건에는 사용자 지정 이름이 부여되어야 합니다.

##### Layout and order

* `CREATE TABLE` 구문 바로 뒤에는 기본키를 지정하십시오.
* 제약조건은 대응하는 컬럼 바로 아래에 정의되어야 합니다. 제약조건이 컬럼명 오른쪽에 정렬되도록 
  들여쓰십시오.
* 만약 다중 컬럼에 대한 제약조건인 경우, 가능한 한 두 컬럼의 정의 모두에 가깝게 배치하고 어려운 경우
  마지막 수단으로 `CREATE TABLE` 정의 끝에 작성하는 것을 고려하십시오.
* 테이블 전체에 적용되는 테이블 수준의 제약조건의 경우, 맨 끝에 정의되어야 합니다.
* 알파벳 순서로 작성하십시오. (`ON DELETE`가 `ON UPDATE` 앞에 와야 합니다.)
* 가능한 경우 쿼리의 각 요소를 동일한 문자 위치로 정렬하십시오. 예를 들어, 모든 `NOT NULL` 구문을
  동일한 문자 위치에서 시작하는 것입니다. 이는 어렵지도 않고 빠르지만, 코드를 훨씬 읽고 스캔하기 
  쉽게 만들어줍니다.

##### Validation

* `LIKE`와 `SIMILAR TO` 제약조건을 사용하여 형식이 정해진 문자열의 무결성을 보장합니다.
* 수치값의 최대 범위가 정해져 있는 경우, 잘못된 값이 데이터베이스에 입력되거나 컬럼 정의에 맞지 않는
  데이터가 자동으로 잘리는 것을 방지하기 위해 범위를 `CHECK()`로 작성해야 합니다. 대부분의 경우 
  최소한 값이 0 이상인지 확인해야 합니다.
* `CHECK()` 제약조건은 디버깅을 쉽게 하기 위해 별도의 구문에 작성해야 합니다.

##### Example

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

### Designs to avoid

* 객체지향 설계 원칙은 관계형 데이터베이스 설계로 효과적으로 변환될 수 없습니다. — 이러한 함정을 
  피하십시오.
* 한 컬럼에는 값을 다른 컬럼에는 단위를 저장하는 것. 추후 응용 프로그램에서 두 컬럼을 결합해야 
  하는 것을 방지하기 위해서 단위를 자명하게 지정해야 합니다. `CHECK()`를 이용하여 유효한 데이터가
  컬럼에 삽입되는지 확인해야 합니다.
* [Entity–Attribute–Value][eav] (EAV) 테이블 — 이러한 스키마없는 데이터를 다루기 위해서는 
  전문 제품을 사용하십시오.
* 시간에 따른 아카이빙 또는 다국적 조직 내 위치와 같은 고민 때문에 한 테이블에 있어야 하는 데이터를
  여러 테이블로 분할하는 것. 이는 이후에 단순히 하나의 테이블에 대해 쿼리하는 것이 아닌 `UNION`과
  함께 여러 테이블에 걸쳐 동작합니다.

## Appendix

### Reserved keyword reference

ANSI SQL (92, 99 and 2003), MySQL 3 to 5.x, PostgreSQL 8.1, MS SQL Server 2000, 
MS ODBC and Oracle 10.2의 예약어 목록입니다.

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

### Column data types

데이터베이스 엔진간의 최대 호환성을 위해 사용할 수 있는 몇 가지 권장되는 컬럼 데이터 유형입니다.

#### Character types:

* CHAR
* CLOB
* VARCHAR

#### Numeric types

* Exact numeric types
    * BIGINT
    * DECIMAL
    * DECFLOAT
    * INTEGER
    * NUMERIC
    * SMALLINT
* Approximate numeric types
    * DOUBLE PRECISION
    * FLOAT
    * REAL

#### Datetime types

* DATE
* TIME
* TIMESTAMP

#### Binary types:

* BINARY
* BLOB
* VARBINARY

#### Additional types

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
