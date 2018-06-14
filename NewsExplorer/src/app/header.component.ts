import { Component, OnInit, Output, Injectable } from '@angular/core';
import { NewsApiService } from './services/news-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})

@Injectable()
export class HeaderComponent implements OnInit {
  @Output() articles: NewsAPI.Article[];
  @Output() sources: NewsAPI.Source[];

  searchText: "";

  @Output() selectedSource: SelectedSource;

  constructor(private newsApiService : NewsApiService) { }

  ngOnInit() {
    this.setDefaultNewsSource();
    this.getSources();
  }

  setDefaultNewsSource()
  {
    this.selectedSource = new SelectedSource();
  }

  onSearchInput()
  {
    this.getNewsArticles();
  }

  getSources() {
    this.newsApiService.getSources().subscribe
    (
      (response: NewsAPI.SourceResult) => {
        this.sources = response.sources;
      });
    }



    getNewsArticles() {
      if (this.searchText.length == 0)
      {
        this.searchText = "";
      }

     this.newsApiService.getNews({ page: 1, pageSize: 100, sortBy: 'popularity', q:this.searchText, sources:[this.selectedSource.id]}).subscribe(
       (response: NewsAPI.NewsResult) => {
         this.articles = response.articles;
         console.log(response.articles.length);
       });
    }

    onSelectNewsSource(newsSource : NewsAPI.Source): void {
      this.selectedSource = newsSource;
      this.getNewsArticles();
    }
  }

class SelectedSource {
  public name: string = "All Sources"
  public id: string = "0"
  }