DELETE FROM announcements;

INSERT INTO announcements (title, body, posted_at)
VALUES (
  'Library Renovation Notice',
  'The university library will be closed for renovations from October 15 to November 5.',
  CURRENT_TIMESTAMP
);

INSERT INTO announcements (title, body, posted_at)
VALUES (
  'New Course Registration Portal',
  'A new portal for course registration is now live. Visit portal.university.edu to access it.',
  CURRENT_TIMESTAMP
);

INSERT INTO announcements (title, body, posted_at)
VALUES (
  'Power Outage Alert',
  'There will be a scheduled power outage in Block C on October 18 from 9 AM to 3 PM.',
  CURRENT_TIMESTAMP
);