const BLOG_DATE_FORMATTER = new Intl.DateTimeFormat('en', {
   month: 'long',
   day: 'numeric',
   year: 'numeric',
});

export function getBlogDateTimestamp(date: string) {
   const timestamp = Date.parse(date);

   return Number.isNaN(timestamp) ? null : timestamp;
}

export function formatBlogDate(date: string) {
   const timestamp = getBlogDateTimestamp(date);

   if (timestamp === null) {
      return null;
   }

   return BLOG_DATE_FORMATTER.format(new Date(timestamp));
}
