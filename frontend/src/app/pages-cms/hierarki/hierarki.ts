import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { StrukturOrganisasiService, Data } from 'src/services/stuktur-organisasi.service';
import { TreeNode } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { OrgChart } from 'd3-org-chart';

interface OrgChartNode {
  data: {
    id: number;
    name: string;
    title?: string;
    foto?: string;
  };
  depth: number;
  parent?: OrgChartNode;
  children?: OrgChartNode[];
}

@Component({
  selector: 'app-hierarki',
  standalone: true,
  imports: [CommonModule, OrganizationChartModule, RouterModule],
  templateUrl: './hierarki.html',
  styleUrls: ['./hierarki.scss']
})
export class Hierarki implements OnInit, AfterViewInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  dataTree: TreeNode[] = [];
  loading = true;

  constructor(private strukturService: StrukturOrganisasiService, private router: Router) { }

  ngOnInit() {
    this.strukturService.getData().subscribe({
      next: (data) => {
        this.dataTree = this.buildTree(data);
        this.loading = false;

        // Tunggu chart render dulu, baru scroll ke tengah
        setTimeout(() => this.centerChart(), 300);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    // cadangan jika data sudah ada lebih dulu
    setTimeout(() => this.centerChart(), 500);
  }

  private buildTree(data: Data[]): TreeNode[] {
    const lookup: { [key: number]: TreeNode } = {};
    const roots: TreeNode[] = [];

    data.forEach(item => {
      lookup[item.id] = {
        label: item.nama_jabatan,
        data: item,
        expanded: true,
        type: 'person',
        styleClass: 'p-person',
        children: []
      };
    });

    data.forEach(item => {
      if (item.parent_id) lookup[item.parent_id]?.children?.push(lookup[item.id]);
      else roots.push(lookup[item.id]);
    });

    return roots;
  }

  private centerChart() {
    const el = this.chartContainer?.nativeElement;
    if (el) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
  }

    // 👇 Event klik node
  onNodeSelect(event: any) {
    const nodeData = event.node.data as Data;
    if (nodeData && nodeData.id) {
      this.router.navigate(['/pages/hierarki', nodeData.id]);
    }
  }

  // @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  // private chart: any;
  // private chartData: any[] = [];

  // constructor(private strukturService: StrukturOrganisasiService) { }

  // ngOnInit(): void {
  //   this.strukturService.getData().subscribe((res: Data[]) => {
  //     // Mapping data sesuai format d3-org-chart
  //     this.chartData = res.map(d => ({
  //       id: d.id,
  //       parentId: d.parent_id,
  //       name: d.nama_jabatan,      // teks utama
  //       title: d.nama_pegawai,     // teks bawah
  //       foto: d.foto || 'assets/default.png' // default foto jika null
  //     }));

  //     // Pastikan root node berada di depan (opsional tapi aman)
  //     this.chartData.sort((a, b) => (a.parentId === null ? -1 : 1));

  //     console.log('Mapped Data:', this.chartData);
  //     this.renderChart();
  //   });
  // }

  // renderChart() {
  //   if (!this.chartContainer?.nativeElement) return;
  //   if (!this.chartData || this.chartData.length === 0) return;

  //   this.chart = new OrgChart()
  //     .container(this.chartContainer.nativeElement)
  //     .data(this.chartData)
  //     .nodeWidth(() => 250)
  //     .nodeHeight(() => 120)
  //     .childrenMargin(() => 40)
  //     .compact(false)
  //     .nodeContent((d: OrgChartNode) => {
  //       return `
  //     <div style="padding:10px; text-align:center;">
  //       <img src="${d.data.foto}" alt="foto" style="width:50px;height:50px;border-radius:50%;object-fit:cover;margin-bottom:5px;" />
  //       <div style="font-weight:bold;">${d.data.name}</div>
  //       <div style="font-size:0.85em;color:#555;">${d.data.title}</div>
  //     </div>
  //   `;
  //     })
  //     .onNodeClick((d: OrgChartNode) => {
  //       console.log('Clicked node id:', d.data.id);

  //       // Ambil detail node via service
  //       this.strukturService.getDataById(d.data.id).subscribe(res => {
  //         console.log('Detail node:', res);
  //         // Bisa tampilkan modal atau navigasi
  //       });
  //     })
  //     .render();

  //   // Fit otomatis setelah render
  //   setTimeout(() => {
  //     this.chart.fit();
  //   }, 500);
  // }
}
