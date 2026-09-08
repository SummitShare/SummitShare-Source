// Extract heading text only; this does not sanitize HTML for rendering.
export function stripHtmlTags(text: string): string {
   let previous: string;
   do {
      previous = text;
      text = text.replace(/<[^<>]*>/g, '');
   } while (text !== previous);
   return text.replace(/[<>]/g, '');
}
