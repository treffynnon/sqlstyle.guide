-- No
SELECT a.release_date,a.title
FROM albums AS a
WHERE a.title='Charcoal Lane'OR
      a.title='The New Danger';


-- Yes
SELECT a.release_date,
       a.title
  FROM albums AS a
 WHERE a.title = 'Charcoal Lane'
    OR a.title = 'The New Danger';