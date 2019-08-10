import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SearchService } from "../../shared/search.service";
import { UserCard } from "src/app/models/userCard.model";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.sass"]
})
export class SearchComponent implements OnInit {
  constructor(private route: ActivatedRoute, private service: SearchService) {}

  resSearch: UserCard[];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.service
        .search(params.q)
        .subscribe((res: UserCard[]) => (this.resSearch = res));
    });
  }
}
