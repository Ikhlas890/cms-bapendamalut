import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TruncateHtmlPipe } from 'src/services/truncate-html.pipe';
import { StrukturOrganisasiService, Data } from 'src/services/stuktur-organisasi.service';

@Component({
  selector: 'app-hierarki-detail',
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './hierarki-detail.html',
  styleUrl: './hierarki-detail.scss'
})
export class HierarkiDetail implements OnInit {
 struktur?: Data;

  statusOptions = [
    { label: 'Aktif', value: '1' },
    { label: 'Tidak Aktif', value: '0' }
  ];

   getStatusLabel(value: string): string {
    const found = this.statusOptions.find(opt => opt.value === value);
    return found ? found.label : '-';
  }

  getFormattedText(text: string) {
  return text ? text.replace(/\n/g, '<br>') : '';
}


  constructor(
    private route: ActivatedRoute,
    private strukturService: StrukturOrganisasiService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.strukturService.getDataById(id).subscribe(data => {
      this.struktur = data;
    });
  }
}
