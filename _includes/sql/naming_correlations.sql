SELECT first_name AS fn
  FROM staff AS s1
  JOIN students AS s2
    ON s2.mentor_id = s1.staff_num;

SELECT SUM(s.monitor_tally) AS monitor_total
  FROM staff AS s;