import { Component, OnInit, Output, Injectable } from '@angular/core';
import { NewsApiService } from './services/news-api.service';
import { FeedStoreService } from './services/feed-store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})

@Injectable()
export class HeaderComponent implements OnInit {
  @Output() articles: NewsAPI.Article[];
  @Output() sources: NewsAPI.Source[];
  @Output() selectedFeed: SelectedFeed;

  isValidForFilterPersistence: boolean;
  searchText: string = "";
  selectedSource: SelectedSource;
  newsFeeds: NewsFeed[];

  constructor(private newsApiService: NewsApiService, private feedService: FeedStoreService) { }

  ngOnInit() {
    this.setDefaultValues();
    this.getSources();
  }

  setDefaultValues() {
    this.getPersistedFeeds();
    this.selectedSource = new SelectedSource();
    this.selectedFeed = new SelectedFeed();
  }

  getPersistedFeeds() {
    this.feedService.newsFeeds.subscribe(
      (response: NewsFeed[]) => {
        this.newsFeeds = (response);
      }
    );
  }

  onSelectPersistedFeed(filter: NewsFeed) {
    this.searchText = filter.filters.q;

    if (filter.filters != null && filter.filters.sources != null) {
      this.selectedSource.id = filter.filters.sources[0];
    }
  }

  onDeletePersistedFeed(filter: NewsFeed) {
    this.feedService.remove(filter.id);
    this.newsFeeds = this.newsFeeds.filter(remNewsFilter => remNewsFilter !== filter);
  }

  validateFilterPersistence() {
    if (this.searchText == null && this.selectedSource.id == "0") {
      this.isValidForFilterPersistence = false;
    }
    else {
      this.isValidForFilterPersistence = true;
    }
  }

  onSearchInput() {
    this.validateFilterPersistence();
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
    if (this.searchText == null) {
      this.searchText = "";
    }

    this.newsApiService.getNews({ page: 1, pageSize: 20, sortBy: 'popularity', q: this.searchText, sources: [this.selectedSource.id] }).subscribe(
      (response: NewsAPI.NewsResult) => {
        this.articles = response.articles;
      });
  }

  saveFeed() {
    if (this.searchText == null && this.selectedSource.id == "0") {
      alert("Please insert a search text or select a news source");
      return;
    }

    let selectedNewsFeedFilter = new SelectedNewsFeedFilter();
    selectedNewsFeedFilter.q = this.searchText;
    selectedNewsFeedFilter.sources = [];

    selectedNewsFeedFilter.sources.push(this.selectedSource.id);

    this.feedService.create({ name: "My Feed", filters: selectedNewsFeedFilter }).subscribe(
      (response: NewsFeed) => {
        this.newsFeeds.push(response);
        console.log(response);
      }
    );
  }

  onSelectNewsSource(newsSource: NewsAPI.Source): void {
    this.selectedSource = newsSource;
    this.validateFilterPersistence();
    this.getNewsArticles();
  }
}

class SelectedSource implements NewsAPI.Source {
  public name: string = "All Sources"
  public id: string = "0"
}


class SelectedFeed implements NewsFeed {
  public id: string = "0"
  public name: string = "Select source"
  public filters: NewsFeedFilter
}

class SelectedNewsFeedFilter implements NewsFeedFilter {
  public q: string
  public sources: string[]
}