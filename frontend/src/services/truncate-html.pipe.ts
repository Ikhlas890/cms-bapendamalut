// src/app/pipes/truncate-html.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateHtml'
})
export class TruncateHtmlPipe implements PipeTransform {
  transform(html: string, limit: number): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    
    if (text.length <= limit) return html;

    const truncatedText = text.substring(0, limit) + '...';

    return `<p>${truncatedText}</p>`;
  }
}
