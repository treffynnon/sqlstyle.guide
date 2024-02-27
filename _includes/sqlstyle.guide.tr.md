# SQL Stil Rehberi

## Genel Bakış

Bu yönergeleri kullanabilirsiniz, [fork yapabilirsiniz][fork] veya kendiniz
yapabilirsiniz - buradaki asıl nokta, bir stil seçip ona bağlı kalmanızdır.
Değişiklik önerileriniz için veya hataları düzeltmek için lütfen GitHub'da
[issue][issue] veya [pull request][pull] açın.

Bu yönergeler, Joe Celko'nun [SQL Programming Style][celko] kitabını okuyan
ekipler için adaptasyonu kolaylaştırmak için bu kitap ile uyumlu olacak şekilde
düzenlenmiştir. Bu rehber, bazı alanlarda biraz daha katı ve bazı alanlarda
biraz daha rahattır. [Celko'nun kitabının][celko], her kuralın arkasında
düşünceli bir düzyazı olarak anekdotlar ve muhakeme içermesi kesinlikle daha
özlüdür.

Bu rehberi bir projenin kod tabanının bir parçası olarak [Markdown
formatında][dl-md] eklemek veya projedeki herkesin özgürce okuması için burada
referans vermek kolaydır - fiziksel bir kitapla bu çok daha zordur.

[Simon Holywell][simon] tarafından hazırlanan bu SQL stil rehberi [Creative Commons
Attribution-ShareAlike 4.0 International License][licence] lisansı ile lisanslanmıştır.
[https://www.sqlstyle.guide/][sqlstyleguide]'daki çalışmaya dayanarak.

## Genel

### Bunları Yap

* Uygun ve açıklayıcı isimler kullanın.
* Girintileri ve boşlukları güzelce kullanarak kodu daha okunabilir yapın.
* Tarih ve zaman bilgisini [ISO 8601][iso-8601] uygunluğunda depolayın
  (`YYYY-MM-DDTHH:MM:SS.SSSSS`).
* Taşınabilirlik için dağıtıma/versiyona özel fonksiyonlar yerine sadece
  standart SQL fonksiyonlarını kullanmaya çalışın.
* Gereksiz tırnak işareti veya başka türlü de türetilebilecek `WHERE`
  cümleciklerini kullanmayarak SQL kodunu kısa ve öz yapın.
* SQL koduna gerekli olduğu takdirde yorumlar yazın. Mümkünse C-style açılış `/*`
  ve kapanış `*/` ifadelerini, değilse `--` ile başlayarak ve satır sonuna bir
  new line (satır sonu) koyarak yapın.

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

### Bunlardan Kaçın

* camelCase—hızlı taranması için zor.
* Tanımlayıcı önekler ya da Hungarian gösterimi: `sp_` veya `tbl`.
* Çoğullar—mümkün olduğunda daha doğal ve genel bir terim kullanın.
  Örneğin `employees` yerine `staff` ya da `individuals` yerine `people`.
* Quoted identifiers—eğer bunu kullanmak zorundaysanız taşınabilirlik için
  SQL-92 çift tırnağa bağlı kalın. (Dağıtıma/versiyona bağlı olarak SQL
  sunucunuzu bu özelliği desteklemesi için ayar yapmanız gerekebilir).
* Nesne tabanlı tasarım prensiplerini SQL'e veya veritabanı yapılarına
  uygulamayın.

## Adlandırma Kuralları

### Genel

* Belirleyeceğiniz ismin eşsiz ve [önceden ayrılmış anahtar kelimelerden][reserved-keywords]
  biri olmadığına emin olun.
* Uzunluğunu maksimum 30 byte yapın—gerçekte eğer multi-byte karakter seti
  kullanmıyorsanız 30 karakter uzunluğundadır.
* İsimler harf ile başlamalı ve altçizgi ile bitmemelidir.
* İsimlerde sadece harfleri, sayıları ve altçizgiyi kullanın.
* Art arda birden fazla altçizgi kullanmayın—okuması zor olabilir.
* Eğer iki kelimenin arasına normalde boşluk koyuyorsanız altçizgi koyarak
  birleştirin. (first name `first_name` olur).
* Kısaltmalardan kaçının ve eğer kullanmak istiyorsanız genel olarak anlaşılır
  olduğuna emin olun.

```sql
SELECT first_name
  FROM staff;
```

### Tablolar

* Use a collective name or, less ideally, a plural form. For example (in order of
  preference) `staff` and `employees`.
* Tablo isimleri için `tbl` gibi, Hungarian gösterimi gibi veya diğer tanımlayıcı
  önekler eklemeyin.
* Tabloya sütünlarının biriyle aynı ismi vermeyin. Tam tersi için de geçerli.
* Mümkün olduğunda, iki tablo ile yeni bir ilişki tablosu oluştururken ikisinin
  ismini birleştirip o ismi vermeyin. `cars_mechanics` yerine `services` tercih et.

### Sütunlar

* Her zaman tekil isimler kullanın.
* Mümkünse birincil tanımlayıcı olarak `id` ismini kullanmaktan kaçının.
* Tablo ismiyle aynı isimli bir sütun oluşturmayın. Tam tersi için de geçerli.
* Özel isimler hariç her zaman küçük harfler kullanın.

### Takma isimler (Aliasing) ve bağlantılı ilişkiler

* Verilen ismin takma isim olduğu bir şekilde belli olmalı.
* Temel kural olarak ilişkinin ismi objenin ismindeki baş harfler olmalıdır.
* Eğer aynı isimde ilişki ismi varsa sonuna bir sayı ekle.
* Her zaman `AS` sözcüğünü ekle—belirgin olduğu için okumayı kolaylaştırır.
* Hesaplanmış veri için (`SUM()` veya `AVG()`) istediğiniz ismi verin.

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

### Saklı Prosedürler

* İsmi bir fill içermelidir.
* İsme `sp_` gibi veya diğer herhangi bir tanımlayıcı önek veya Hungarian
  gösterimi gibi önekler kullanmayın.

### Genel sonekler

Aşağıdaki sonekler, SQL kodundan sütun isimlerini kolay okunabilir ve
anlaşılabilir olduğunu sağlayan genel anlamlara sahiptir. Doğru soneki doğru
yerde kullanın.

* `_id`—birincil anahtar gibi eşsiz bir tanımlayıcı.
* `_status`—işaretleme değeri veya `publication_status` gibi durum belli etmek
  için bir değer.
* `_total`—bir grup değerlerin totali veya toplam değeri.
* `_num`—o sütunun bir çeşit sayı içerdiğini belirtir.
* `_name`—bir isim içerdiğini belirtir. `first_name` gibi.
* `_seq`—sıralı devam eden değerleri içerir.
* `_date`—bir şeyin tarihini tuttuğunu belirtir.
* `_tally`—bir şeyin miktarı.
* `_size`—bir şeyin boyutu. Dosya boyutu veya elbise sayısı gibi.
* `_addr`—kayıt için bir adres, `ip_addr` gibi fiziksel veya soyut olabilir.

## Sorgu sözdizimi

### Ayrılmış sözcükler

[Ayrılmış sözcükler][reserved-keywords] için her zaman büyük harfle yazın.
`SELECT` ve `WHERE` gibi.

Kısaltılmış anahtar sözcükleri kullanmaktan kaçınmak daha iyidir. Eğer uzun
versiyonu varsa onu kullanın (`ABS` yerine `ABSOLUTE` gibi).

ANSI SQL anahtar sözcükleri varken ve aynı işlevi yapıyorken veritabanı için
özel olan anahtar sözcükleri kullanmayın. Bu işlem kodunuzu daha portatif
yapar.

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### Beyaz boşluk

Konuzunu daha okunaklı yapmak için doğru boşluk kullanmak önemlidir. Fazladan
boşluk koymayın ya da doğal boşlukları silmeyin.

#### Boşluklar

Boşluklar kodu hizaya sokmak için kullanılmalıdır böylece ana anahtar kelimeler
aynı hizada biter. Bu kodu ortasından bir nehir gibi ayırır ve kodu okuyanın
gözü için okumasını kolaylaştırır ve anahtar sözcükleri implementasyondan ayırır.
Nehir gibi ayırmak [tipografide iyi bir şey değildir][rivers] fakat burada bize
yardımcı olur.

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

Sütun isimleri ve implementasyona özel detaylar sola yaslıyken `SELECT`, `FROM`,
vb. anahtar sözcükleri sağa yaslıdır.

Kapsamlı olmasa da her zaman boşluk içerir:

* eşitlik işaretinden önce ve sonra (`=`)
* virgüllerden sonra (`,`)
* Parantezle veya son virgül veya noktalı virgül yanında/içinde değil ise
  kesme işaretleri (`'`).

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### Satır aralığı

Her zaman new line (yeni satır) dikey boşluk kullan:
Always include newlines/vertical space:

* `AND` ya da `OR` dan önce
* sorguları birbirinden ayırarak daha okunaklı yapmak için noktalı virgüllerden
  sonra
* her anahtar kelime tanımından sonra
* birden fazla sütunu mantıksal gruplara ayırmak için virgülden sonra
* büyük parça kodların okunabilirliğini kolaylaştırması için kodu ilgili kısımlara
  ayırırken.

Bütün anahtar sözcükleri sağa yaslamak ve değerlerini sola yaslamak kodun ortasında
güzel bir boşluk oluşturur. Hem de sorgu tanımlamalarını üzerinde taramayı
kolaylaştırır.

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

### Girintiler

SQL kodunun kolay okunabilirliğininden emin olmak için girinti standartlarının
uygulanması önemlidir.

#### Joinler

Joinler nehir ayrımının diğer tarafında olmalıdır ve gerekli olduğunda yeni
satırda gruplandırılır.

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

#### Altsorgular

Altsorgular da nehir ayrımının sağına yaslanmalıdır ve diğer sorgular gibi aynı
şekilde hizalandırılmalıdır. Bazen yeni satırda açma parantezi ile aynı hizada
kapama parantezi koymak mantıklı olabilir—bu durum özellikle iç içe daha fazla
sorgu olduğunda doğrudur.

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

### Öncelikli biçimler

* Mümkün olduğunda, `AND` ile çoklu durumları birleştirmek yerine `BETWEEN`
  kullanın.
* Benzer şekilde çoklu durumları `OR` ile birleştirmek yerine `IN()` kullanın.
* Değer veritabanından çıkmadan önce yorumlanması gerekiyorsa `CASE` ifadesini
  kullanın. `CASE` ifadeleri daha karmaşık mantıksal yapıları oluşturmak için
  iç içe kullanılabilir.
* Mümkün olduğunda, `UNION` ifadesini geçici tablolar için kullanmaktan kaçının.
  Eğer şema, bu özelliklere olan bağımlılığı ortadan kaldırmak için optimize
  edilebilirse, büyük olasılıkla olmalıdır.

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

## Create sözdizimi

Şema bilgisi tanımlanırken, kodu insan tarafından okulabilir şekilde sürdürme de
önemlidir. Buna olanak tanımak için sütun tanımları sıralı ve yapılması mantıklı
olan yerde gruplandırıldığına emin olunmalıdır.

Sütun tanımlamalarını ile `CREATE` sözcüğü arasına dört (4) boşluk karakteri
kullanın.

### Veri tiplerinin seçimi

* Mümkünse dağıtım/versiyona özel veri tiplerini kullanmayın—bunlar taşınabilir
  değildir ve aynı dağıtımın eski sürümünde bile çalışmıyor olabilir.
* `REAL` veya `FLOAT` veri tiplerini sadece kayan nokta matematiği için
  önemliyse kullanın aksi takdirde her zaman `NUMERIC` ve `DECIMAL` tercih edin.
* Only use `REAL` or `FLOAT` types where it is strictly necessary for floating
  point mathematics otherwise prefer `NUMERIC` and `DECIMAL` at all times.
  Kayan nokta yuvarlama hataları can sıkıcı olabilir!

### Varsayılan değerlerin belirlenmesi

* Varsayılan değer sütun ile aynı veri tipinde olması gereklidir—eğer sütun
  `DECIMAL` olarak tanımlıysa varsayılan değer olarak `INTEGER` değer
  belirlemeyin.
* Varsayılan değerler veri tipi tanımlamalarına uygun olmalıdır ve `NOT NULL`
  ifadesinden önce gelmelidir.

### Kısıtlamalar ve anahtarlar

Kısıtlamalar ve alt kümeleri, anahtarları veritabanı tanımı için önemli
bileşenlerdir. Okunması kolaylıkla zorlaşabilir ve bunun sebebi standart
bir dizi yönergeye uyulması önemlidir.

#### Anahtar seçimi

Tanımdaki anahtarları oluşturacak sütun(lar)a karar vermek, performansı ve veri
bütünlüğünü etkileyeceği için dikkatlice düşünülmesi gereken bir etkinlikdir.

1. Anahtar bir dereceye kadar benzersiz olmalıdır.
2. Şema genelinde değer için veri türü açısından tutarlılğı ve gelecekte bunun
   değişmesinin daha düşük olasılıkla olması.
3. Değer, standart bir biçime (ISO tarafından yayınlanan gibi) göre
   doğrulanabilir mi? 2. maddeye uygunluğuna teşvik.
4. Gerektiğinde bileşik anahtarları kullanmaktan korkmadan anahtarı olabildiğince
   basit tutulması.

Bir veri tabanının tanımında gerçekleştirilmesi gereken gerekçeli ve düşünülmüş
bir dengeleme eylemidir. Gelecekte gereksinimler değişirse, bunları güncel tutmak
için tanımlarda değişiklikler yapmak mümkündür.

#### Kısıtlamaları tanımlama

Anahtarlara karar verildikten sonra, alan değeri doğrulaması ile birlikte
kısıtlamaları kullanarak bunları sistemde tanımlamak mümkündür.

##### Genel

* Tablolar eksiksiz ve kullanışlı olması için en az bir tane anahtara sahip
  olması gerekmektedir.
* Kısıtlamalara, veritabanı dağıtımının genellikle yeterince anlaşılır isimler
  verdiği `UNIQUE`, `PRIMARY KEY` ve `FOREIGN KEY` den farklı bir özel isim
  verilmelidir.

##### Düzen ve sıra

* `CREATE TABLE` ifadesinden hemen sonra birincil anahtarı belirleyin.
* Kısıtlamalar, karşılık geldikleri sütunun hemen altında tanımlanmalıdır.
  Kısıtlamayı, sütun adının sağına hizalanacak şekilde girinti koyun.
* Çok sütunlu bir kısıtlamaysa, her iki sütun tanımına mümkün olduğunca yakın
  koymayı düşünün ve bunun zor olduğu durumlarda son çare olarak bunları
  `CREATE TABLE` tanımının sonuna ekleyin.
* Tüm tablo için geçerli olan tablo düzeyinde bir kısıtlamaysa, sonunda da
  görünmelidir.
* `ON DELETE`, `ON UPDATE` den önce geldiğinde alfabetik sırayı kullanın.
* Bunu yapmak mantıklıysa, sorgunun her yönünü aynı karakter konumuna hizalayın.
  Örneğin, tüm `NOT NULL` tanımları aynı karakter konumunda başlayabilir.
  Bu zor ve hızlı değil, ancak kodun taranmasını ve okunmasını kesinlikle çok
  daha kolay hale getirir.

##### Doğrulama

* Formatın bilindiği yerde stringlerin bütünlüğünü sağlamak için `LIKE` ve
  `SIMILAR TO` kısıtlamalarını kullanın.
* Sayısal bir değerin nihai aralığı biliniyorsa, yanlış değerlerin veritabanına
  girmesini veya sütun tanımına sığmayacak kadar büyük verilerin bilinmeden
  bozulmasını önlemek için `CHECK()` aralığı olarak yazılmalıdır. En azından çoğu
  durumda değerin sıfırdan büyük olup olmadığını kontrol etmelidir.
* Hata ayıklamayı kolaylaştırmak için `CHECK()` kısıtlamaları ayrı yan tümcelerde
  tutulmalıdır.

##### Örnek

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

* Nesneye tabanlı tasarım ilkeleri, ilişkisel veritabanı tasarımlarına etkili
  bir şekilde dönüşmez; bu tuzaktan kaçının.
* Değeri bir sütuna ve birimleri başka bir sütuna yerleştirme. Sütun,
  uygulamada daha sonra sütunları yeniden birleştirme gereksinimini önlemek
  için birimleri aşikar hale getirmelidir. Sütuna geçerli verilerin eklendiğinden
  emin olmak için `CHECK()` kullanın.
* [Entity–Attribute–Value][eav] (EAV) tabloları—bu tür şemasız verileri işlemeye
  yönelik özel bir ürün kullanın.
* Çok uluslu bir kuruluşta zamana dayalı arşivleme veya konum gibi keyfi kaygılar
  nedeniyle tek bir tabloda olması gereken verileri birçok tabloya bölmeyin. Daha
  sonraki sorgular, yalnızca bir tabloyu sorgulamak yerine, `UNION` ile birden çok
  tabloda çalışmalıdır.

## Ekler

### Ayrılmış anahtar kelimelerin referansı

ANSI SQL (92, 99 and 2003), MySQL 3 to 5.x, PostgreSQL 8.1, MS SQL Server 2000, MS ODBC ve Oracle 10.2 nin ayrılmış anahtar kelimelerinin listesi.

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

### Sütun veri türleri

Bunlar, veritabanı motorları arasında maksimum uyumluluk için kullanılacak bazı önerilen sütun veri türleridir.

#### Karakter tipleri

* CHAR
* CLOB
* VARCHAR

#### Sayısal tipler

* Tam sayısal tipler
    * BIGINT
    * DECIMAL
    * DECFLOAT
    * INTEGER
    * NUMERIC
    * SMALLINT
* Yaklaşık sayısal tipler
    * DOUBLE PRECISION
    * FLOAT
    * REAL

#### Tarih-Saat tipleri

* DATE
* TIME
* TIMESTAMP

#### Binary tipleri

* BINARY
* BLOB
* VARBINARY

#### İlave türler

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
[dl-md]: https://raw.githubusercontent.com/treffynnon/sqlstyle.guide/gh-pages/_includes/sqlstyle.guide.tr.md
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
