# Bộ quy tắc viết SQL

## Tổng quan

Bạn có thể sử dụng bộ quy tắc này, [fork từ nhánh này][fork] hoặc tự tạo ra phiên bản của riêng mình - Điều quan trọng ở đây là sau khi chọn một bộ quy tắc thì phải tuân thủ theo chúng. Để đề xuất các thay đổi hoặc sửa lỗi, hãy tạo một [issue][issue] hoặc [pull request][pull] trên GitHub.

Những quy tắc này tương đồng với những gì được đề cập tới trong quyển [SQL Programming Style][celko] của Joe Celko để giúp cho những độc giả đã đọc quyển sách đó cảm thấy dễ dàng liên kết hơn. Bộ quy tắc này có phần cứng nhắc ở một vài điểm, nhưng cũng không quá chặt chẽ ở những phần còn lại. Nếu bạn đọc [quyển sách của Celko][celko] thì sẽ hiểu rõ hơn về ý tưởng đằng sau những quy tắc đó.

Bạn có thể dễ dàng đặt bộ quy tắc này ở [định dạng Markdown][dl-md] vào thẳng thư mục code của dự án hoặc chỉ đơn giản là đặt tham chiếu tới đây để nếu ai muốn thì có thể tìm đọc phiên bản sách giấy.

Bộ quy tắc viết câu lệnh SQL này được tạo ra bởi [Simon Holywell][simon] và được bảo vệ bằng giấy phép [Creative Commons Attribution-ShareAlike 4.0 International][licence].
Có tham khảo [https://www.sqlstyle.guide/][sqlstyleguide].

## Những quy tắc chung

### Nên làm

* Hãy đặt tên bảng/cột/biến dễ hiểu và có tính thống nhất
* Căn lề hoặc thêm khoảng trống phù hợp sẽ giúp code dễ đọc hơn.
* Nếu cần lưu trữ thông tin dạng DATETIME thì hãy tuân thủ quy chuẩn [ISO 8601][iso-8601] (`YYYY-MM-DDTHH:MM:SS.SSSSS`).
* Cố gắng chỉ sử dụng các hàm SQL tiêu chuẩn thay vì các hàm đặc thù của vendor, vì làm như vậy sẽ khiến đoạn code dễ dàng mang sang sử dụng ở dự án khác hơn.
* Cố viết code thật gọn, đừng viết thừa (tiêu biểu là các dấu ' và " hay các mệnh đề `WHERE` có thể kế thừa)
* Sử dụng comment khi cần. Bạn có thể sử dụng comment kiểu ngôn ngữ C (mở bằng `/*` và đóng bằng `*/`), hoặc comment cả dòng bằng `--`

```sql
SELECT file_hash  -- lưu lại ssdeep hash
  FROM file_system
 WHERE file_name = '.vimrc';
```
```sql
/* Sửa bản ghi sau khi đã thay đổi nội dung file */
UPDATE file_system
   SET file_modified_date = '1980-02-22 13:19:01.00000',
       file_size = 209732
 WHERE file_name = '.vimrc';
```

### Nên tránh

* Tránh cách đặt tên kiểu "lạc đà" (camelCase) - vì nó khiến tốc độ đọc chậm đi.
* Tránh cách đặt tên kiểu "ký pháp Hungary" (thêm các tiền tố thể hiện chức năng như `sp_` hoặc `tbl`)
* Tránh dùng danh từ không đếm được, trong khi có thể thay thế bằng từ đếm được. Ví dụ như dùng `staff` thay vì `employees`, dùng `people` thay vì `individuals`.
* Tránh đặt tên bảng/cột/biến cần dùng tới dấu ngoặc kép ". Nếu bạn buộc phải làm như thế, hãy tuân thủ phong cách SQL-92 để đoạn code tương thích tốt hơn (Thậm chí bạn sẽ có thể cần phải chỉnh sửa thiết lập của SQL server để hỗ trợ tính năng này)
* Tránh áp dụng các quy tắc thiết kế / lập trình Hướng đối tượng (OOP) vào câu lệnh SQL hoặc cấu trúc cơ sở dữ liệu.

## Quy tắc đặt tên

### Quy tắc chung

* Hãy đảm bảo tên không trùng lặp và tránh đặt tên trùng với [từ khóa][reserved-keywords].
* Giới hạn độ dài của tên ở mức tối đa 30 ký tự, trừ khi bạn dùng bộ ký tự multi-byte.
* Tên phải bắt đầu với một chữ cái và không nên kết thúc với dấu gạch chân.
* Chỉ sử dụng chữ cái, con số và dấu gạch chân khi đặt tên.
* Tránh dùng nhiều dấu gạch chân liên tiếp, vì điều đó sẽ khiến câu lệnh khó đọc hơn.
* Mẹo là chỗ nào có thể đặt dấu cách trong văn viết, thì hãy thay nó bằng dấu gạch chân (`first name` thành `first_name`).
* Tránh dùng từ viết tắt trừ khi đó là những từ viết tắt phổ biến và dễ hiểu.


```sql
SELECT first_name
  FROM staff;
```

### Đặt tên bảng

* Hãy dùng số nhiều, hoặc ít nhất là dạng số nhiều của danh từ không đếm được. Ví dụ `employees` thay cho `staff`.
* Đừng thêm tiền tố `tbl` hoặc bất kỳ tiền tố nào theo kiểu "ký pháp Hungary".
* Đừng bao giờ đặt tên bảng trùng với tên cột, và ngược lại.
* Nếu có thể, thì hãy tránh đặt tên của bảng có quan hệ với 2 bảng khác bằng cách nối tên của 2 bảng đó. Ví dụ `services` thay vì `cars_mechanics`.

### Đặt tên cột

* Luôn luôn dùng danh từ số ít.
* Bất kỳ khi nào có thể, hãy tránh dùng từ `id` để đặt tên cho khóa chính của bảng.
* Đừng đặt tên cột giống tên bảng, và ngược lại.
* Luôn luôn dùng chữ cái viết thường, trừ khi nó khiến việc đọc hiểu khó khăn hơn.

### Đặt tên alias / correlation

* Nên mô tả rõ về đối tượng / biểu thức đang được đặt alias.
* Nguyên tắc ngầm khi đặt tên correlation là sử dụng các chữ cái đầu tiên của mỗi từ.
* Nếu correlation bị trùng thì đánh số vào cuối tên.
* Luôn luôn sử dụng từ khóa `AS` để đảm bảo người đọc nhìn rõ alias/correlation thay vì nhầm với 1 cái tên dài.
* Với dữ liệu được tính gộp (như `SUM()` hay `AVG()`) thì tên alias sẽ chính là tên cột hiển thị ở bảng kết quả.


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

### Đặt tên procedure

* Tên của procedure phải có một động từ thể hiện hành động.
* Đừng thêm tiền tố `sp_` hoặc bất kỳ tiền tố nào khác theo kiểu "ký pháp Hungary".


### Một số hậu tố thường gặp

Các hậu tố dưới đây đã đủ phổ biến để ai đọc cũng có thể hiểu ngay ý nghĩa. Hãy cố gắng dùng hậu tố phù hợp.

* `_id` - cột được dùng làm khóa chính
* `_status` - cờ chỉ trạng thái, chẳng hạn `publication_status`.
* `_total` - tổng số các giá trị.
* `_num` - ám chỉ cột này chứa một dạng số nào đó.
* `_name` - gợi ý cột này chứa thông tin về tên.
* `_seq` - chứa 1 dãy các giá trị liên tiếp nhau.
* `_date` - ám chỉ cột này chứa thông tin về ngày tháng.
* `_tally` - số đếm.
* `_size` - kích thước của một vật gì đó như quần áo hoặc file.
* `_addr` - địa chỉ vật lý hoặc phi vật lý, chẳng hạn `ip_addr`.

## Quy tắc viết query

### Từ khóa

Luôn luôn viết các [từ khóa][reserved-keywords] bằng chữ cái in hoa, chẳng hạn `SELECT` hay `WHERE`.

Tốt nhất là tránh các từ khóa viết tắt, hãy sử dụng phiên bản đầy đủ. Ví dụ dùng `ABSOLUTE` thay vì `ABS`.

Đừng dùng những từ khóa đặc biệt chỉ tồn tại ở một số cơ sở dữ liệu đặc thù. Hãy cố gắng chỉ dùng những từ khóa theo tiêu chuẩn ANSI SQL. Làm như vậy sẽ khiến câu lệnh SQL dễ dàng được sử dụng ở nhiều dự án, nhiều server, nhiều môi trường khác nhau.

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### Khoảng trắng

Để làm câu lệnh dễ dọc hơn, hãy học cách sử dụng các khoảng trắng để căn lề. Đừng viết những câu lệnh dài lê thê mà không ngắt nghỉ.

#### Dấu cách

Dấu cách có thể sử dụng để căn lề sao cho những từ khóa quan trọng nhất thẳng hàng với nhau về bên phải. Điều này giúp tạo nên một đường thẳng vô hình chạy dọc câu lệnh, khiến người đọc lia mắt rất nhanh và tìm kiếm mệnh đề rất hiệu quả. Những đường thẳng đó gọi là [rivers][rivers], vốn là cấm kỵ trong thiết kế typography, nhưng rất hữu ích ở trường hợp này.

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

Chú ý các từ khóa `SELECT`, `FROM`, vân vân... đều được căn lề phải, trong khi tên cột và các chi tiết khác được căn lề trái.

Dù đây chưa phải là một bộ quy tắc đầy đủ, nhưng ít nhất thì hãy thêm dấu cách vào:
* trước và sau dấu bằng (`=`)
* sau dấu phẩy (`,`)
* trước và sau dấu ngoặc đơn (`'`) trừ khi đó là cuối dòng hoặc ngay trước dấu phẩy

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### Xuống dòng

Luôn luôn xuống dòng trong những trường hợp sau:

* trước từ khóa `AND` hoặc `OR`
* sau dấu chấm phẩy (`;`) để phân tách các query, sẽ dễ đọc hơn
* sau 1 mệnh đề
* sau dấu phẩy phân chia các nhóm cột
* hoặc đơn giản chỉ là để phân tách các phần con của một câu lệnh dài, sẽ dễ đọc hơn

Nếu có thể căn lề phải cho các từ khóa và căn lề trái cho các giá trị, thì các khoảng trống thẳng hàng (river) sẽ giúp người đọc lướt nhanh hơn và tìm mệnh đề dễ hơn.

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
       a.release_date, a.recording_date, a.production_date -- nhóm 3 cột "ngày" lại
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

### Thụt lề

Để đảm bảo câu lệnh SQL dễ đọc, một điều rất quan trọng là thống nhất được quy tắc thụt lề.

#### Phép nối bảng (JOIN)

Những mệnh đề liên quan tới phép nối bảng (như `ON`) nên được thụt lề cùng với `JOIN`. Các điều kiện `ON` tiếp theo nên tiếp tục được thụt lề sang phải thêm 1 cấp nữa.
Nếu có nhiều phép nối thì nên để trống 1 dòng giữa 2 phép nối cho rõ ràng hơn.

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

#### Query lồng nhau

Các câu query lồng nhau nên được thụt lề cùng cấp với từ khóa `SELECT` của query con. Đôi khi người ta còn chủ động đóng mở ngoặc cả query con để người đọc không bị lẫn với query cha.

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

### Một số quy tắc không chính thức

* Nếu được, hãy sử dụng `BETWEEN` thay vì dùng 2 mệnh đề so sánh lớn nhỏ nối với nhau bằng từ khóa `AND`
* Tương tự, hãy ưu tiên từ khóa `IN()` hơn, thay vì phải liệt kê nhiều mệnh đề `OR`
* Nếu phải xử lý giá trị nhận được thì hãy tận dụng `CASE`. Các câu lệnh `CASE` còn có thể lồng nhau để thực hiện các lệnh xử lý phức tạp.
* Hãy tránh sử dụng các mệnh đề `UNION` hay các bảng tạm, nếu được. Tốt nhất là hãy đảm bảo thiết kế schema của các bảng sẽ giúp ta query thẳng mà không cần thông qua `UNION` hay các bảng tạm.

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

## Quy tắc viết câu lệnh CREATE

Khi khai báo thông tin schema, điều quan trọng nhất là đảm bảo người đọc có thể hiểu được cấu trúc của bảng. Để làm được điều đó, hãy xếp các cột theo thứ tự và nhóm các cột liên quan lại với nhau.

Khi thụt lề trong câu lệnh `CREATE`, hãy dùng 4 dấu cách.

### Chọn kiểu dữ liệu

* Bất cứ khi nào có thể, hãy cố gắng chỉ dùng những kiểu dữ liệu tiêu chuẩn. Làm như vậy sẽ khiến cấu trúc bảng dễ dàng được sử dụng ở nhiều dự án, nhiều server, nhiều môi trường khác nhau.
* Chỉ sử dụng kiểu `REAL` hay `FLOAT` khi thực sự cần. Nếu không, hãy thay thế chúng bởi các kiểu `NUMERIC` và `DECIMAL`. Vì các kiểu dữ liệu số thực khi được làm tròn sẽ dẫn tới những lỗi bất ngờ và khó sửa.


### Cụ thể hóa giá trị mặc định

* Giá trị mặc định phải có chung kiểu dữ liệu với cột. Chẳng hạn nếu một cột có kiểu `DECIMAL` thì đừng dùng giá trị mặc định kiểu `INTEGER`.
* Các giá trị mặc định phải tuân thủ kiểu dữ liệu và xuất hiện trước từ khóa `NOT NULL`.


### Khóa và các ràng buộc

Các ràng buộc nói chung và tập con của chúng nói riêng, tức các khóa, là một thành phần cực kỳ quan trọng trong bất kỳ cơ sở dữ liệu nào. Chúng có thể trở nên rất khó hiểu do tính phức tạp của mình, vậy nên một bộ quy tắc để khai báo các ràng buộc là cần thiết để giúp chúng chuẩn hóa hơn.

#### Quy tắc chọn khóa

Việc quyết định (các) cột nào tạo nên khóa của bảng cần được cân nhắc kỹ lưỡng, vì nó sẽ ảnh hưởng tới tốc độ thực thi và tính toàn vẹn của dữ liệu.

1. Khóa nên là duy nhất ở một mức độ nào đó.
2. Giữ sự ổn định về mặt kiểu dữ liệu trong tất cả các bảng, và tránh khả năng thay đổi điều đó trong tương lai.
3. Cố gắng thiết kế sao cho giá trị của khóa có thể được validate theo 1 định dạng tiêu chuẩn chung (được quy định bởi ISO chẳng hạn). Khuyến khích áp dụng điều này tương ứng với các khóa ở điều 2.
4. Hãy giữ cho bộ khóa chính đơn giản hết mức có thể, nhưng cũng đừng sợ phải dùng khóa kết hợp nếu cần.

Dù một vài quy tắc có vẻ đối lập nhau, bạn cần cân bằng chúng một cách hợp lý. Nếu yêu cầu của dự án khác có phần đặc biệt, đừng ngần ngại thay đổi bộ quy tắc này cho phù hợp nhé.

#### Định nghĩa các ràng buộc

Một khi các khóa đã được khai báo, ta có thể bắt đầu sử dụng chúng trong các ràng buộc giữa các trường với nhau.

##### Quy tắc chung

* Bảng nào cũng nên có ít nhất 1 khóa để hoàn thiện và hữu ích khi sử dụng
* Các ràng buộc nên được đặt tên cho dễ hiểu, trừ những từ khóa có sẵn như `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`.
* Một vài cơ sở dữ liệu có khả năng tự đặt tên cho các ràng buộc như vậy, nhưng đừng phụ thuộc vào nó.

##### Thứ tự khai báo

* Đầu tiên hãy khai báo khóa chính ngay sau lệnh `CREATE TABLE`.
* Các ràng buộc nên được khai báo ngay phía dưới cột liên quan. Các ràng buộc nên được căn lề trái với kiểu dữ liệu của cột.
* Nếu đó là một ràng buộc giữa nhiều cột, thì hãy cố gắng đặt khai báo ràng buộc ở gần nhất có thể với các cột liên quan. Nếu không thể làm được điều đó thì bạn có thể đưa khai báo ràng buộc xuống dưới cùng.
* Nếu đó là một ràng buộc giữa các bảng, thì nó nên nằm ở phía dưới cùng.
* Nếu có nhiều ràng buộc, hãy xếp chúng theo thứ tự ABC, chẳng hạn `ON DELETE` trước rồi mới đến `ON UPDATE`.
* Khi cần, hãy cân nhắc căn lề các ràng buộc tương tự ở nhiều cột để dễ đối chiếu. Ví dụ yêu cầu `NOT NULL` có thể được đồng loạt căn lề trái thẳng hàng với nhau. Tuy mất công hơn một chút, nhưng đổi lại, ta sẽ đọc chúng nhanh hơn rất nhiều.

##### Validation

* Hãy sử dụng các ràng buộc `LIKE` và `SIMILAR TO` để đảm bảo tính toàn vẹn của các string, nếu không có định dạng cụ thể.
* Nếu dải giá trị của một trường dạng số đã được xác định, hãy kiểm tra bằng ràng buộc `CHECK()` để đảm bảo không bỏ sót giá trị sai vào cơ sở dữ liệu, hoặc âm thầm cắt bớt độ dài cho vừa với khả năng lưu trữ của cột đó. Ít nhất thì cũng nên kiểm tra xem giá trị đó có lớn hơn 0 không.
* Các ràng buộc `CHECK()` nên được viết rời nhau ra, để dễ debug về sau.

##### Ví dụ

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

### Nên tránh

* Tránh áp dụng các nguyên tắc thiết kế Hướng đối tượng (OOP) vào việc thiết kế cơ sở dữ liệu quan hệ, vì chúng không hiệu quả.
* Tránh để giá trị ở 1 cột riêng và đơn vị tính ở 1 cột khác. Nên sử dụng các đơn vị dễ hiểu, vì nó sẽ giúp việc kết hợp các cột sau này đơn giản hơn. Hãy sử dụng `CHECK()` để đảm bảo chỉ có dữ liệu hợp lệ mới được lưu.
* Tránh các bảng dạng [Entity-Attribute-Value][eav] (EAV). Đây là dạng dữ liệu không có schema cố định, nên sẽ có những sản phẩm được tạo ra với mục đích sử lý riêng những trường hợp đó.
* Tránh chia nhỏ dữ liệu ra nhiều bảng nếu có thể ở chung một bảng, để tránh những nguy cơ hỏng/mất/sai dữ liệu do yếu tố thời gian, vị trí đặt cơ sở dữ liệu. Chưa kể tới việc lúc cần dùng lại phải query từ nhiều bảng rồi dùng `UNION` để gộp lại. Query từ một bảng sẽ tiện hơn nhiều.


## Phụ lục

### Các từ khóa

Đây là list các từ khóa chuẩn ANSI SQL (92, 99 và 2003), MySQL 3 tới 5.x, PostgreSQL 8.1, MS SQL Server 2000, bất kỳ từ khóa nào của MS ODBC và Oracle 10.2

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

### Các kiểu dữ liệu cọt

Dưới đây là gợi ý các kiểu dữ liệu cột phổ biến, để tối đa hóa khả năng tương thích giữa nhiều cơ sở dữ liệu khác nhau.

#### Kiểu xây ký tự:

* CHAR
* CLOB
* VARCHAR

#### Kiểu số

* Số nguyên
    * BIGINT
    * DECIMAL
    * DECFLOAT
    * INTEGER
    * NUMERIC
    * SMALLINT
* Số thực
    * DOUBLE PRECISION
    * FLOAT
    * REAL

#### Kiểu DateTime

* DATE
* TIME
* TIMESTAMP

#### Kiểu nhị phân

* BINARY
* BLOB
* VARBINARY

#### Các kiểu dữ liệu khác

* BOOLEAN
* INTERVAL
* XML


[simon]: https://www.simonholywell.com/?utm_source=sqlstyle.guide&utm_medium=link&utm_campaign=md-document
    "SimonHolywell.com"
[issue]: https://github.com/treffynnon/sqlstyle.guide/issues
    "Các vấn đề về bộ quy tắc viết SQL trên GitHub"
[fork]: https://github.com/treffynnon/sqlstyle.guide/fork
    "Fork bộ quy tắc viết SQL từ GitHub"
[pull]: https://github.com/treffynnon/sqlstyle.guide/pulls/
    "Các Pull Request của bộ quy tắc viết SQL trên GitHub"
[celko]: https://www.amazon.com/gp/product/0120887975/ref=as_li_ss_tl?ie=UTF8&linkCode=ll1&tag=treffynnon-20&linkId=9c88eac8cd420e979675c815771313d5
    "Quyển sách SQL Programming Style của Joe Celko (Series The Morgan Kaufmann trong phần Data Management Systems)"
[dl-md]: https://raw.githubusercontent.com/treffynnon/sqlstyle.guide/gh-pages/_includes/sqlstyle.guide.md
    "Tải bộ quy tắc này xuống với định dạng Markdown"
[iso-8601]: https://en.wikipedia.org/wiki/ISO_8601
    "Wikipedia: ISO 8601"
[rivers]: https://practicaltypography.com/one-space-between-sentences.html
    "Ứng dụng Typography trong thực tế: dấu cách chen giữa các câu"
[reserved-keywords]: #reserved-keyword-reference
    "Tham khảo các từ khóa"
[eav]: https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model
    "Wikipedia: Mô hình Entity–attribute–value"
[sqlstyleguide]: https://www.sqlstyle.guide/
    "Bộ quy tắc viết SQL của Simon Holywell"
[licence]: https://creativecommons.org/licenses/by-sa/4.0/
    "Giấy phép Creative Commons Attribution-ShareAlike 4.0 International"
