# SQL style guide

## Overview

This document is a work in progress to generate a SQL query style guide for use in our department

## General

### Do

* Use consistent and descriptive identifiers and names.
* Make judicious use of white space and indentation to make code easier to read.
* Store [ISO-8601][iso-8601] compliant time and date information
  (`YYYY-MM-DD HH:MM:SS.SSSSS`).
* Try to use only standard SQL functions instead of vendor specific functions for
  reasons of portability.
* Keep code succinct and devoid of redundant SQL—such as unnecessary quoting or
  parentheses or `WHERE` clauses that can otherwise be derived.
* Include comments in SQL code where necessary. Use the C style opening `/*` and
  closing `*/` where possible otherwise precede comments with `--` and finish
  them with a new line.

```sql
SELECT 
    file_hash  -- stored ssdeep hash
FROM 
    file_system
WHERE 
    file_name = '.vimrc';
```
```sql
/* Updating the file record after writing to the file */
UPDATE 
    file_system
SET
    file_modified_date = '1980-02-22 13:19:01.00000',
    file_size = 209732
WHERE 
    file_name = '.vimrc';
```

### Avoid

* Object oriented design principles should not be applied to SQL or database
  structures.

## Naming conventions

### All Naming Conventions
* See Confluence documentation for [Ives Database Design Guide][design-guide] when creating new tables or altering existing tables for the complete naming conventions to be used.

### Aliasing or correlations

#### Aliasing Column Names
* Avoid unnecessary aliases at all times
* Must always alias `COUNT(*)` columns
* Must always alias computed data (`SUM()` or `AVG()` or `IF()`). Use the name you would give it were it a column defined in the schema.
* Must always include the `AS` keyword, which makes it easier to read since it is explicit.
* Should relate in some way to the object or expression they are aliasing.

#### Aliasing Table Names
* All Tables must be aliased when using more than one in a JOIN
* Table aliases will be made up of the first letter of every word in the table name unless
  * unless the alias is a reseverd word ie. `FROM INTERNATIONAL_FILINGS AS IF` will cause an error in SQL
    * in this case us an abbreviated name for the table ie. `FROM INTERNATIONAL_FILINGS AS IFILINGS`
  * if the aliases for two tables will be the same, or the same table is used more than once, append a number in order of apperance in the query
* When a query contains multiple databases the first letter of the database, in lower case will be prepended to the table alias ie. `FROM international.ENTITY_MAP AS iEM INNER JOIN secdocs.COMPANY AS sC`

```sql
SELECT 
    COUNT(*) as student_staff_count
FROM 
    STAFF AS S1
      INNER JOIN 
    STUDENTS AS S2
      ON S2.mentor_id = S1.staff_num;
```
```sql
SELECT 
    SUM(s.monitor_tally) AS monitor_total
FROM 
    STAFF AS S
GROUP BY
    S.staff_department_fkey;
```

### Uniform suffixes

The following suffixes have a universal meaning ensuring the columns can be read
and understood easily from SQL code. Use the correct suffix where appropriate.

* `_key`—a unique identifier such as a column that is a primary key.
* `_status`—flag value or some other status of any type such as `publication_status`.
* `_total`—the total or sum of a collection of values.
* `_num`—denotes the field contains any kind of number.
* `_name`—signifies a name such as `first_name`.
* `_date`—denotes a column that contains the date of something.
* `_count`—a count.

## Query syntax

### Reserved words

Always use uppercase for the [reserved keywords][reserved-keywords] like `SELECT`, `WHERE` or `IF`.

Data manipulation statements should have every clause keyword on a line of its own unless performing extremely simple statements.  Examples of the clause keywords are `SELECT`, `DELETE`, `UPDATE`, `FROM`, `WHERE`, `HAVING`, `GROUP BY`, `ORDER BY`, `LIMIT`.  An example of a simple single line statements `SELECT COUNT(*) as student_count FROM STUDENTS WHERE graduated = 0;`

### White space

To make the code easier to read it is important that the correct compliment of
spacing is used. Do not crowd code or remove natural language spaces.

#### Spaces

Spaces should never be used to line up the code so that the root keywords all end on the same character boundary. 
* Indentations of 4 spaces are the standard that is utilized throughout the codebase.  
* All `(` and `)` must be placed on a line of there own unless only operating on two or less items

```sql
(
    SELECT 
        species_name,
        AVG(height) AS average_height, 
        AVG(diameter) AS average_diameter
    FROM 
        FLORA
    WHERE 
        species_name = 'Banksia'
        OR 
        species_name = 'Sheoak'
        OR 
        species_name = 'Wattle'
    GROUP BY 
        species_name, 
        observation_date
)

    UNION ALL

(
    SELECT 
        species_name,
        AVG(height) AS average_height, 
        AVG(diameter) AS average_diameter
    FROM 
        BOTANIC_GARDEN_FLORA
    WHERE 
        species_name = 'Banksia'
        OR 
        species_name = 'Sheoak'
        OR 
        species_name = 'Wattle'
    GROUP BY 
        species_name, 
        observation_date
)
```
Although not exhaustive always include spaces:

* before and after equals (`=`)
* after commas (`,`)
* surrounding apostrophes (`'`) where not within parentheses or with a trailing
  comma or semicolon.

```sql
SELECT
    title,
    release_date,
    recording_date
FROM
    ALBUMS
WHERE
    title = 'Charcoal Lane'
    OR 
    title = 'The New Danger';
```

#### Line spacing

Always include newlines/vertical space:

* after semicolons to separate queries for easier reading
* after each `VALUE` group in an `INSERT` statement
* to separate code into related sections, which helps to ease the readability of large chunks of code.

Always on their own line:
* Data manipulation statements should have every clause keyword on a line of its own unless performing extremely simple statements.  Examples of the clause keywords are `SELECT`, `DELETE`, `UPDATE`, `FROM`, `WHERE`, `HAVING`, `GROUP BY`, `ORDER BY`, `LIMIT`.  An example of a simple single line statements `SELECT COUNT(*) as student_count FROM STUDENTS WHERE graduated = 0;`
* Every field being selected, updated, grouped on or limted by in the query should be on their own line. Unless involved in a functional operation such as an `IF()`, `CASE`, `COALESCE()` ... etc. which require additional fields to function 
* `AND` and `OR` should appear on their own lines


```sql
INSERT INTO albums (title, release_date, recording_date)
VALUES ('Charcoal Lane', '1990-01-01 01:01:01.00000', '1990-01-01 01:01:01.00000'),
       ('The New Danger', '2008-01-01 01:01:01.00000', '1990-01-01 01:01:01.00000');
```

```sql
UPDATE 
    ALBUMS
SET 
    release_date = '1990-01-01 01:01:01.00000',
    producer_name = NULL
WHERE
    title = 'The New Danger';
```

```sql
SELECT 
    title,
    release_date, 
    recording_date, 
    production_date
FROM 
    ALBUMS
WHERE 
    title = 'Charcoal Lane'
    OR 
    title = 'The New Danger';
```

### Indentation

To ensure that SQL is readable it is important that standards of indentation
are followed.

#### Clause Keywords
* Should be at the top level with the least indentation of anything else contained in their statement.
* These words should be on a line alone

#### Joins

* Natural Joins are not allowed ... ever
* A Join type must be indicated `LEFT OUTER`, `RIGHT OUTER`, `INNER`
* Joins should be indented one indent under their tables or sub-queries
* ON clauses should be indented to be left justified with the JOINs
* Multiple ON clauses should be indented to be vertically aligned with the ON and JOIN keywords

```sql
SELECT 
    R.last_name
FROM 
    RIDERS AS R
        INNER JOIN 
    BIKES AS B
        ON R.bike_vin_num = B.vin_num
           AND 
           B.engines > 2
        INNER JOIN 
    CREW AS C
        ON R.crew_chief_last_name = C.last_name
           AND 
           C.chief = 'Y';
```

#### Subqueries

Subqueries should be aligned with the indentation level that their non-subquery counterpart would reside.  Subqueries should begin with a line containing only an opening `(` then the next line being indented 1 indent deeper.  The subquery should end with a closing `)` and the alias for that subquery if appropriate.  Try and include a commend line to describe the subquery

```sql
SELECT 
    r.last_name,
    (
        SELECT
            MAX(YEAR(championship_date))
        FROM
            champions AS c
        WHERE
            c.last_name = r.last_name
            AND
            c.confirmed = 'Y'
     ) AS last_championship_year
FROM 
    riders AS r
WHERE 
    r.last_name IN
        (
            SELECT 
                c.last_name
            FROM 
                champions AS c
            WHERE 
                YEAR(championship_date) > '2008'
                AND 
                c.confirmed = 'Y'
        );
```

### Preferred formalisms

* Make use of `BETWEEN` where possible instead of combining multiple statements
  with `AND`.
* Similarly use `IN()` instead of multiple `OR` clauses.
* Where a value needs to be interpreted before leaving the database use the `CASE`
  expression. `CASE` statements can be nested to form more complex logical structures.
* Avoid the use of `UNION` clauses and temporary tables where possible. If the schema can be optimised to remove the reliance on these features then it most likely should be.

```sql
SELECT 
    CASE postcode
       WHEN 'BN1' THEN 'Brighton'
       WHEN 'EH1' THEN 'Edinburgh'
    END AS city
FROM 
    OFFICE_LOCATIONS
WHERE 
    country = 'United Kingdom'
    AND 
    opening_time BETWEEN 8 AND 9
    AND 
    postcode IN ('EH1', 'BN1', 'NN1', 'KW1')
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
[licence]: http://creativecommons.org/licenses/by-sa/4.0/
    "Creative Commons Attribution-ShareAlike 4.0 International License"
[design-guide]: https://auditanalytics.atlassian.net/wiki/spaces/WEBDEV/pages/25198598/Database+Design
	"Ives Database Design Guide"