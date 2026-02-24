# دليل أسلوب كتابة لغة الاستعلام البنائية (SQL)

## نظرة عامة (Overview)

يمكنك استخدام هذه المجموعة من الإرشادات عبر [التفريغ][fork] أو وضع إرشاداتك الخاصة؛ المهم هو أن تختار أسلوبًا معينًا وتلتزم به. لاقتراح تعديلات أو إصلاح الأخطاء، فيرجى إنشاء [مشكلة][issue] أو [طلب سحب][pull] على جيتهاب.

تم تجهيز هذه الإرشادات لتتماشى مع كتاب جو سيلكو [SQL Programming Style][celko]، بحيث يسهل على الفرق التي قرأت الكتاب بالفعل اعتمادها. هذا الدليل أكثر صرامة في بعض الجوانب وأكثر مرونة في البعض الآخر. الدليل بالتأكيد أكثر إيجازًا من [كتاب سيلكو][celko] الذي يحوي أمثلة توضيحية وشرحًا منطقيًا لكل قاعدة بأسلوب أدبي متقن.

من السهل إضافة هذا الدليل كجزء من قاعدة بيانات المشروع [بصيغة مارك داون][dl-md] أو الإشارة إليه هنا ليقرأه أي شخص مشارك في المشروع بحرية؛ الأمر أصعب بكثير مع نسخة كتاب ورقية.

يخضع دليل أسلوب كتابة لغة الاستعلام البنائية الذي أنشأه [سايمون هوليويل][simon] لترخيص [رخصة المشاع الإبداعي- نَسْبُ الـمُصنَّف، الترخيص بالمثل 4.0 دولي][licence].
وهو مبني على العمل المنشور في الرابط [https://www.sqlstyle.guide/][sqlstyleguide].

## إرشادات عامة (General)

### افعل (Do)

- استخدم مُعرِّفات وأسماء وصفية ومتسقة.
- اجعل الكود أكثر قابلية للقراءة باستخدام المسافات البادئة والمسافات بشكل منظم.
- خزِّن معلومات التاريخ والوقت وفقًا لمعيار [ISO 8601][آيزو-8601] (`YYYY-MM-DDTHH:MM:SS.SSSSS`)، حيث YYYY يمثل السنة، وMM يمثل الشهر، وDD يمثل اليوم، وT فاصل يشير إلى بداية عنصر الوقت، وhh يمثل الساعات (بتنسيق 24 ساعة)، وmm يمثل الدقائق، وss يمثل الثواني، وsss يمثل أجزاء الثواني.
- لأسباب تتعلق بالنقل، حاول استخدام دوال لغة الاستعلام البنائية القياسية فقط عوضًا عن الدوال الخاصة بالتوزيعات/الإصدارات.
- أبقِ الكود موجزًا وخاليًا من التكرارات كعلامات التنصيص غير المهمة أو الأقواس أو عبارات `أين` (`WHERE`) التي يمكن استنتاجها بطرق أخرى.
- أضف تعليقات إلى كود لغة الاستعلام البنائية عند الضرورة. استخدم `*/` كفاتحة و`/*` كخاتمة على نمط لغة C، وإلا فابدأ بـ `--` وأضف سطرًا جديدًا بعد نهاية التعليق.

```sql
SELECT file_hash  -- stored ssdeep hash
  FROM file_system
 WHERE file_name = '.vimrc';
```

```sql
/* تحديث سجل الملف بعد الكتابة عليه */
UPDATE file_system
   SET file_modified_date = '1980-02-22 13:19:01.00000',
       file_size = 209732
 WHERE file_name = '.vimrc';
```

### تجنب (Avoid)

- استخدام نمط camelCase (الكلمة الأولى بأحرف صغيرة وكل كلمة تليها تبدأ بحرف كبير) – من الصعب قراءته بسرعة.
- استخدام البادئات الوصفية أو الترميز الهنغاري مثل `sp_` أو `tbl`.
- الجمع – استخدم أسماء الجمع كلما أمكن ذلك، مثلًا `staff` بدلاً من `employees` أو `people` بدلاً من `individuals`.
- المعرفات بين علامتي تنصيص – إذا كنت ستحب استخدامها فالتزم بعلامات التنصيص المزدوجة SQL-92 لأجل النقل (قد تحتاج إلى تهيئة خادم لغة الاستعلام البنائية الخاص بك لدعم هذه الميزة، وهو يعتمد على نوع التوزيعة/الإصدار لديك).
- لا ينبغي تطبيق مبادئ التصميم كائني التوجه على لغة الاستعلام البنائية أو هياكل قواعد البيانات.

## قواعد التسمية (Naming conventions)

### إرشادات عامة (General)

- تأكد أن الاسم فريد وغير موجود في [reserved keyword][الكلمات المحجوزة].
- حدد طول الاسم بحد أقصى 30 بايت - عمليًا يمثل ذلك 30 حرفًا؛ ما لم تكن تستخدم مجموعة أحرف متعددة البايتات.
- يجب أن تبدأ الأسماء بحرف ولا يمكن أن تنتهي بشرطة سفلية.
- استخدم فقط الحروف والأرقام والشرطة السفلية في الأسماء.
- تجنب استخدام عدد من الشرطات السفلية بشكل متتالٍ، فقد يصعب قراءتها.
- استخدم الشرطة السفلية أينما تضع مسافة بشكل طبيعي في الاسم (first name يصبح `first_name`).
- تجنب الاختصارات، وإذا كنت ترغب في استخدامها فتأكد أنها مفهومة على نطاق واسع.

```sql
SELECT first_name
  FROM staff;
```

### الجداول (Tables)

- استخدم اسمًا شاملاً، و في حال أقل مثالية، صيغة الجمع. على سبيل المثال (مرتبة حسب الأفضلية): `staff` و`employees`.
- لا تستعمل البادئة `tbl` أو أي نوع من البادئات الوصفية أو الترميز الهنغاري.
- لا تعطي جدولًا نفس اسم أحد أعمدته مطلقًا والعكس كذلك.
- تجنب متى ما استطعت دمج اسمي الجدولين معًا لإنشاء اسم جدول العلاقة. عوضًا عن `cars_mechanics`، يفضل استعمال `services`.

### الأعمدة (Columns)

- دائمًا استخدم الاسم مفردًا.
- متى ما كان ممكنًا، تجنب استعمال `id` كالمعرّف الأساسي للجدول.
- لا تضف عمودًا يحمل نفس اسم الجدول والعكس كذلك.
- استخدم الحروف الصغيرة دومًا؛ عدا عندما يكون من المنطقي عدم استخدامها مثل حالة الاسم المعرّف.

### الأسماء المستعارة أو الارتباطات (Aliasing or correlations)

- الاسم المستعار يجب أن يرتبط بشكل ما بالكائن أو التعبير الذي يمثله.
- قاعدة عامة: اسم العلاقة يجب أن يكون الحرف الأول من كل كلمة من اسم الكائن.
- إذا كان هناك علاقة/رابطة موجودة بنفس الاسم، فألحق رقمًا.
- دائمًا أدرج الكلمة المفتاحية `AS`، فهي تسهل القراءة؛ لأنها بارزة.
- بالنسبة للبيانات المحسوبة (`SUM()` أو `AVG()`)، استخدم الاسم الذي قد تعطيه لها في حال كانت عمودًا معرفًا في المخطط.

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

### الإجراءات المخزنة (Stored procedures)

- يجب أن يشمل الاسم فعلاً.
- لا تستخدم البادئة `sp_` أو أي بادئة وصفية أخرى ولا الترميز الهنغاري.

### اللواحق الموحدة (Uniform suffixes)

اللواحق التالية لها معنى موحد يضمن أن الجداول يمكن قراءتها وفهمها بسهولة من كود لغة الاستعلام البنائية. استخدم اللاحقة الصحيحة في الموضع المناسب.

- `_id`—معرّف مميز، مثل عمود هو المفتاح الأساسي.
- `_status`—قيمة العلم أو قيمة للإشارة إلى الحالة أيًا كان نوعها مثل `publication_status`.
- `_total`—الإجمالي أو مجموع مجموعة من القيم.
- `_num`—يشير إلى حقل يحتوي على قيمة رقمية.
- `_name`—يشير إلى اسم مثل `first_name`.
- `_seq`—يحتوي على مجموعة متسلسلة من القيم.
- `_date`—يشير إلى عمود يحتوي على تاريخ شيء ما.
- `_tally`—عدد.
- `_size`—حجم/قياس شيء ما، مثل حجم الملف أو الملابس.
- `_addr`—عنوان للسجل وقد يكون عنوانًا فيزيائيًا أو معنويًا مثل `ip_addr`.

## صياغة الاستعلامات (Query syntax)

### الكلمات المحجوزة (Reserved words)

استخدم دومًا الحروف الكبيرة عند كتابة [reserved keywords] (الكلمات المحجوزة) مثل `SELECT` و `WHERE`.

يفضل تجنب استخدام الكلمات المختصرة. استخدم النسخة المطولة متى ما كان ممكنًا (يفضل كتابة `ABSOLUTE` على `ABS`).

لا تستخدم كلمات خاصة بخادم قاعدة البيانات عند وجود كلمات بالفعل في لغة الاستعلام المنظمة للمعايير الوطنية الأمريكية (ANSI SQL) تؤدي نفس الوظيفة. هذا يساعد على جعل الكود محمولًا أكثر.

```sql
SELECT model_num
  FROM phones AS p
 WHERE p.release_date > '2014-09-30';
```

### المسافات البيضاء (White Space)

من المهم أن يتم استخدام المسافات المناسبة؛ لجعل قراءة الكود أسهل. لا تكدس الكود ولا تزل مسافات اللغة الطبيعية.

#### المسافات (Spaces)

يفضل استخدام المسافات لمحاذاة الكود، بحيث تنتهي جميع الكلمات المفتاحية الرئيسية عند نفس الحد. هذا يشكل خطًا من الفراغات في منتصف الكود (نهر)؛ ما يسهل على عين القارئ مسح الكود بسهولة والتمييز بين الكلمات المفتاحية وتفاصيل التنفيذ. الأنهار تعتبر غير مرغوبة في الكتابة، ولكنها مفيدة في هذه الحالة.

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

لاحظ أن كلمات `SELECT` و`FROM` وغيرها كلها مزاحة لليمين، بينما أسماء الأعمدة وتفاصيل التنفيذ جميعها مزاحة لليسار.

على الرغم من أن القائمة ليست شاملة، تأكد من إضافة المسافات :

- قبل وبعد إشارة التساوي (`=`)
- بعد الفواصل (`,`)
- حول علامات التنصيص المفردة (`'`) إذا لم تكن داخل أقواس، أو إذا كانت متبوعة بفاصلة أو فاصلة منقوطة.

```sql
SELECT a.title, a.release_date, a.recording_date
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

#### المسافات بين الأسطر (Line spacing)

دومًا أدرج مسافة عمودية/سطر جديد عند ما يلي :

- قبل `AND` أو `OR`
- بعد الفاصلة المنقوطة؛ لفصل الاستعلامات وتسهيل القراءة.
- بعد تعريف كل كلمة مفتاحية
- بعد الفاصلة، عند فصل عدة أعمدة إلى مجموعات منطقية
- لفصل الكود إلى أقسام مترابطة؛ ما يسهل قراءة قطع كبيرة من الكود.

إن محاذاة الكلمات المفتاحية لليمين والقيم لليسار تخلق فراغًا منتظمًا وسط الاستعلام. كما أنه يسهل عملية تصفح الاستعلام وقراءة تعريفاته.

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
       a.release_date, a.recording_date, a.production_date -- تم تجميع التواريخ معًا
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';
```

### الإزاحة / المسافة البادئة (Indentation)

يجب الالتزام بقواعد الإزاحة القياسية؛ لضمان سهولة قراءة كود لغة الاستعلام البنائية.

#### عمليات الربط (Joins)

يجب تنسيق عبارات الربط بحيث تكتب على الضفة اليمنى من النهر (أي بعد المسافة التي تفصل الكلمات المفتاحية الرئيسية عن تفاصيل التنفيذ)، مع فصلها في أسطر جديدة عند الحاجة.

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

يستثنى من ذلك استخدام كلمة `JOIN` وحدها، إذ تكتب على الضفة اليسرى من النهر بمحاذاة الكلمات المفتاحية الرئيسية.

```sql
SELECT r.last_name
  FROM riders AS r
  JOIN bikes AS b
    ON r.bike_vin_num = b.vin_num
```

#### الاستعلامات الفرعية (Subqueries)

الاستعلامات الفرعية يجب أن تحاذي كذلك الجهة اليمنى من النهر، وتنسيقها يكون بأسلوب أي استعلام عادي. أحيانًا يكون من المنطقي وضع قوس الإغلاق في سطر جديد بمحاذاة قوس الابتداء، خاصة عند وجود استعلامات فرعية متداخلة.

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

### الصيغ المفضّلة (Preferred formalisms)

- استخدام `BETWEEN` متى ما أمكن عوضًا عن دمج عدد من الجمل باستخدام `AND`.
- بالمثل استخدم `IN()` عوضًا عن عدد من جمل `OR`.
- استخدم `CASE` عندما توجد قيمة تحتاج إلى تفسير قبل أن يتم إخراجها من قاعدة البيانات. يمكن استخدام عدد من عبارات `CASE` بشكل متداخل لبناء هيكلية أكثر منطقية وتعقيدًا.
- تجنب استخدام `UNION` والجداول المؤقتة قدر استطاعتك. إذا كان بالإمكان تحسين المخطط لإزالة الاعتماد عليها، فيجب القيام بذلك.

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

## صيغة الإنشاء (Create syntax)

عند تعريف بيانات المخطط من المهم المحافظة على كود سهل القراءة. لتسهيل ذلك تأكد من أن تعريفات الجداول مرتبة ومجمعة معًا أينما يكون من المنطقي القيام بذلك.

يجب إزاحة تعريفات الأعمدة بمقدار أربع (٤) مسافات داخل تعريف `CREATE`.

### اختيار نوع البيانات (Choosing data types)

- أينما أمكن تجنب استخدام أنواع بيانات خاصة بمزود معين، فهي غير قابلة للنقل وقد لا تكون متاحة في الإصدارات القديمة من نفس المزود.
- استخدم نوعي `REAL` أو `FLOAT` فقط للضرورة القصوى لإجراء العمليات الحسابية ذات الفاصلة العائمة، وإلا يفضل استخدام `NUMERIC` و`DECIMAL` دومًا. أخطاء التقريب في العمليات الحسابية ذات الفاصلة العائمة مزعجة!

### تحديد القيم الافتراضية (Specifying default values)

- يجب أن تكون القيمة الافتراضية من نفس نوع بيانات العمود، فإذا كان نوع بيانات العمود هو `DECIMAL` فلا تجعل القيمة الافتراضية من نوع `INTEGER`.
- يجب أن تأتي القيمة الافتراضية بعد تعريف أنواع البيانات وقبل عبارة `NOT NULL`.

### القيود والمفاتيح (Constraints and keys)

تعد القيود ومجموعاتها الفرعية -المفاتيح- عنصرًا مهمًا في تعريف أي قاعدة بيانات. يمكن بسهولة أن تصبح صعبة القراءة والفهم؛ لذا من المهم الالتزام بقواعد أسلوب الكتابة.

#### اختيار المفاتيح (Choosing keys)

يجب التفكير بعناية عند تحديد العمود/الأعمدة التي ستشكل المفاتيح في التعريف؛ لأن ذلك سيؤثر على الأداء وسلامة البيانات.

1. يجب أن يكون المفتاح فريدًا بدرجة ما.
2. الحفاظ على اتساق نوع البيانات عبر المخطط، وأن يكون أقل عرضة للتغيير مستقبلاً.
3. هل يمكن التحقق من صحة القيمة وفق معيار قياسي (مثل المعايير التي نشرتها منظمة آيزو)؟ تشجيع للالتزام بالنقطة رقم 2.
4. الحفاظ على المفتاح بسيطًا قدر الإمكان مع عدم التردد في استخدام المفاتيح المركبة حيث يجب.

يتطلب تعريف قاعدة البيانات موازنة دقيقة ومدروسة. إذا تطورت المتطلبات مستقبلاً، فمن الممكن التعديل على التعريفات لمواكبة التحديثات.

#### تعريف القيود (Defining constraints)

بعد تحديد المفاتيح يمكن تعريفها في النظام باستخدام القيود بالإضافة إلى قيود التحقق من القيم.

##### إرشادات عامة (General)

- يجب أن تحوي الجداول مفتاحًا واحدًا على الأقل لتُعتبر مكتملة ومفيدة.
- يجب إعطاء القيود أسماء مخصصة باستثناء `UNIQUE` و`PRIMARY KEY` و`FOREIGN KEY`، إذ غالبًا يوفر نظام إدارة قاعدة البيانات أسماء مفهومة بشكل تلقائي.

##### الترتيب والتنسيق (Layout and order)

- حدد المفتاح الأساسي أولاً بعد عبارة `CREATE TABLE`.
- يجب تعريف القيود مباشرة أسفل العمود المرتبطة به، مع محاذاتها يمين اسم العمود.
- إذا كان القيد يشمل عدة أعمدة، فضعه -قدر الإمكان- أقرب لكلا تعريفي العمودين. وإذا تعذّر ذلك، فأدرجه في نهاية تعريف `CREATE TABLE`.
- إذا كان القيد على مستوى الجدول (أي سيُطبَّق على كل الجدول) فيجب كتابته في نهاية التعريف كذلك.
- استخدم الترتيب الأبجدي، فـ `ON DELETE` تُكتب قبل `ON UPDATE`.
- أينما كان مناسبًا، فقم بمحاذاة كل جزء من الاستعلام إلى نفس الموضع. على سبيل المثال، تعريفات `NOT NULL` قد تبدأ من نفس الموضع. هذا ليس شرطًا أساسيًا، ولكنه بالتأكيد يجعل مسح وقراءة الكود أسهل.

##### التحقق (Validation)

- استخدم قيود `LIKE` و `SIMILAR TO` ؛للتحقق من صحة النصوص عندما يكون تنسيقها معروفًا.
- حيثما نطاق القيم الرقمية معروف،فيجب تحديد هذا النطاق باستخدام `CHECK()`،وذلك لمنع إدخال قيم غير صحيحة إلى قاعدة البيانات، أو منع اقتطاع القيم الكبيرة تلقائيًا إذا تجاوزت سعة العمود. وعلى الأقل، في معظم الحالات، ينبغي التحقق من أن القيمة أكبر من صفر.
- لتسهيل عملية إصلاح الأخطاء، يجب استخدام قيود `CHECK()` في عبارات منفصلة.

##### مثال (Example)

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

### تصمايم ينصح بتجنبها (Designs to avoid)

- لا تُترجم مبادئ التصميم كائني التوجه بفعالية إلى تصاميم قواعد البيانات العلائقية ، فتجنب هذا المأزق.
- تجنّب وضع القيمة في عمود والوحدة في عمود آخر. ينبغي أن يكون اسم العمود معبّرًا عن الوحدة بشكل واضح، بحيث لا تكون هناك حاجة إلى دمج الأعمدة مرة أخرى في التطبيق لاحقًا. كما ينبغي استخدام قيد `CHECK()` للتحقق من صحة القيم المُدخلة.
- جداول [الكيان - الخاصية - القيمة][eav] (EAV) – استخدم منتج مخصص للتعامل مع مثل هذا النوع من البيانات غير المهيكلة.  
  \*تقسيم البيانات التي يجب أن تكون في جدول واحد إلى جداول متعددة لأسباب تعسفية مثل الأرشفة الزمنية أو الموقع الجغرافي في مؤسسة متعددة الجنسيات. لاحقًا يجب أن تعمل الاستعلامات عبر جداول متعددة باستخدام `UNION` بدلًا من استعلام بسيط على جدول واحد فقط.

## ملحق (Appendix)

### مرجع الكلمات المحجوزة (Reserved keyword reference)

قائمة من الكلمات المحجوزة من لغة الاستعلام المنظمة للمعايير الوطنية الأمريكية ANSI SQL (92, 99 and 2003)، وMySQL 3 إلى 5.x، وPostgreSQL 8.1، وMS SQL Server 2000، وMS ODBC، وOracle 10.2.

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

### أنواع بيانات الأعمدة (Column data types)

هذه بعض أنواع البيانات المقترحة للأعمدة لضمان أقصى قدر من التوافق بين محركات قواعد البيانات المختلفة.

#### أنواع الأحرف (Character types)

- حرف ثابت الطول (CHAR)
- كائن نصي كبير (CLOB)
- حرف متغير الطول (VARCHAR)

#### الأنواع العددية (Numeric types)

- الأنواع العددية الدقيقة (Exact numeric types)
  - عدد صحيح كبير (BIGINT)
  - عدد عشري (DECIMAL)
  - عدد عشري عائم (DECFLOAT)
  - عدد صحيح (INTEGER)
  - عدد رقمي (NUMERIC)
  - عدد صحيح صغير (SMALLINT)
- الأنواع العددية التقريبية (Approximate numeric types)
  - عدد مزدوج الدقة (DOUBLE PRECISION)
  - عدد عائم (FLOAT)
  - عدد حقيقي (REAL)

#### أنواع التاريخ والوقت (Datetime types)

- التاريخ (DATE)
- الوقت (TIME)
- الطابع زمني (TIMESTAMP)

#### الأنواع الثنائية (Binary types)

- ثنائي (BINARY)
- كائن ثنائي كبير (BLOB)
- ثنائي متغير الطول (VARBINARY)

#### أنواع إضافية (Additional types)

- منطقي (BOOLEAN)
- فترة زمنية (INTERVAL)
- لغة الترميز الموسعة (XML)

[simon]: https://www.simonholywell.com/?utm_source=sqlstyle.guide&utm_medium=link&utm_campaign=md-document "SimonHolywell.com"
[issue]: https://github.com/treffynnon/sqlstyle.guide/issues "SQL style guide issues on GitHub"
[fork]: https://github.com/treffynnon/sqlstyle.guide/fork "Fork SQL style guide on GitHub"
[pull]: https://github.com/treffynnon/sqlstyle.guide/pulls/ "SQL style guide pull requests on GitHub"
[celko]: https://www.amazon.com/gp/product/0120887975/ref=as_li_ss_tl?ie=UTF8&linkCode=ll1&tag=treffynnon-20&linkId=9c88eac8cd420e979675c815771313d5 "Joe Celko's SQL Programming Style (The Morgan Kaufmann Series in Data Management Systems)"
[dl-md]: https://raw.githubusercontent.com/treffynnon/sqlstyle.guide/gh-pages/_includes/sqlstyle.guide.md "Download the guide in Markdown format"
[iso-8601]: https://en.wikipedia.org/wiki/ISO_8601 "Wikipedia: ISO 8601"
[rivers]: https://practicaltypography.com/one-space-between-sentences.html "Practical Typography: one space between sentences"
[reserved-keywords]: #reserved-keyword-reference "Reserved keyword reference"
[eav]: https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model "Wikipedia: Entity–attribute–value model"
[sqlstyleguide]: https://www.sqlstyle.guide/ "SQL style guide by Simon Holywell"
[licence]: https://creativecommons.org/licenses/by-sa/4.0/ "Creative Commons Attribution-ShareAlike 4.0 International License"
