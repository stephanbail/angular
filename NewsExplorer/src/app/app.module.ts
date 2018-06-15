import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { HttpClientModule } from '@angular/common/http';
import { NewsApiService } from './services/news-api.service';
import { FormsModule } from '@angular/forms';
import { FeedStoreService } from './services/feed-store.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [NewsApiService, FeedStoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }